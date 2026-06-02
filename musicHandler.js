const {
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    AudioPlayerStatus,
    VoiceConnectionStatus,
    entersState,
    StreamType
} = require('@discordjs/voice');

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Store queues for each guild
const queues = new Map();

class MusicHandler {
    static getQueue(guildId) {
        return queues.get(guildId);
    }

    static createQueue(guildId, textChannel, voiceChannel) {
        const queue = {
            textChannel,
            voiceChannel,
            connection: null,
            player: createAudioPlayer(),
            songs: [],
            volume: 50,
            playing: true,
            loop: false,
        };

        queues.set(guildId, queue);

        queue.player.on(AudioPlayerStatus.Idle, () => {
            console.log('[AudioPlayer] Idle state reached.');
            this.skip(guildId);
        });

        queue.player.on(AudioPlayerStatus.Playing, () => {
            console.log('[AudioPlayer] Started playing!');
        });

        queue.player.on('error', error => {
            console.error(`[AudioPlayer Error] ${error.message}`);
            this.skip(guildId);
        });

        return queue;
    }

    static async play(guildId, song) {
        const queue = queues.get(guildId);
        if (!queue) return;

        if (!song) {
            if (queue.connection) queue.connection.destroy();
            queues.delete(guildId);
            return;
        }

        try {
            console.log(`[MusicHandler] Playing via yt-dlp: ${song.title}`);

            // Path to local yt-dlp binary
            const ytDlpPath = path.join(__dirname, 'yt-dlp');

            if (!fs.existsSync(ytDlpPath)) {
                throw new Error('yt-dlp binary not found! Place it next to musicHandler.js');
            }

            // Spawn yt-dlp process
            const process = spawn(ytDlpPath, [
                song.url,
                '-o', '-',
                '-f', 'bestaudio',
                '--no-playlist',
                '--quiet',
                '--buffer-size', '16K'
            ]);

            process.on('error', err => {
                console.error('[yt-dlp Spawn Error]', err);
            });

            const stream = process.stdout;

            if (!stream) throw new Error('Could not initialize yt-dlp stream.');

            const resource = createAudioResource(stream, {
                inputType: StreamType.Arbitrary,
                inlineVolume: true,
                silencePaddingFrames: 15
            });

            resource.volume.setVolume(queue.volume / 100);
            queue.player.play(resource);
            queue.connection.subscribe(queue.player);

            if (queue.textChannel) {
                const { EmbedBuilder } = require('discord.js');
                const embed = new EmbedBuilder()
                .setColor('#10B981')
                .setTitle('🎶 Now Playing')
                .setDescription(`[${song.title}](${song.url})`)
                .setThumbnail(song.thumbnail || null)
                .addFields(
                    { name: 'Duration', value: String(song.durationRaw || '00:00'), inline: true },
                           { name: 'Requested by', value: String(song.requestedBy?.tag || 'Unknown'), inline: true }
                )
                .setFooter({ text: 'Source: yt-dlp (Linux)' })
                .setTimestamp();

                queue.textChannel.send({ embeds: [embed] });
            }

        } catch (error) {
            console.error('[MusicHandler Final Error Output]', error);
            if (queue.textChannel) {
                queue.textChannel.send(`❌ Error playing **${song.title}**!\n\`${error?.message || 'Unexpected streaming error'}\``);
            }
            this.skip(guildId);
        }
    }

    static skip(guildId) {
        const queue = queues.get(guildId);
        if (!queue) return;

        if (queue.loop && queue.songs.length > 0) {
            this.play(guildId, queue.songs[0]);
        } else {
            queue.songs.shift();
            if (queue.songs.length === 0) {
                this.stop(guildId);
            } else {
                this.play(guildId, queue.songs[0]);
            }
        }
    }

    static stop(guildId) {
        const queue = queues.get(guildId);
        if (!queue) return;

        queue.songs = [];
        if (queue.player) queue.player.stop();
        if (queue.connection) {
            if (queue.connection.state.status !== VoiceConnectionStatus.Destroyed) {
                queue.connection.destroy();
            }
        }
        queues.delete(guildId);
    }

    static async joinVoice(interaction, voiceChannel) {
        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        connection.on(VoiceConnectionStatus.Disconnected, async () => {
            try {
                await Promise.race([
                    entersState(connection, VoiceConnectionStatus.Signalling, 5000),
                                   entersState(connection, VoiceConnectionStatus.Connecting, 5000),
                ]);
            } catch (error) {
                this.stop(voiceChannel.guild.id);
            }
        });

        return connection;
    }
}

module.exports = MusicHandler;
