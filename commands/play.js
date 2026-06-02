const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MusicHandler = require('../musicHandler.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays a song from YouTube')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('The song name or URL')
                .setRequired(true)),

    async execute(interaction) {
        const query = interaction.options.getString('query');
        const voiceChannel = interaction.member.voice.channel;
        

        if (!voiceChannel) {
            return interaction.reply({ content: '❌ You need to be in a voice channel to play music!', ephemeral: true });
        }

        const permissions = voiceChannel.permissionsFor(interaction.client.user);
        if (!permissions.has('Connect') || !permissions.has('Speak')) {
            return interaction.reply({ content: '❌ I need the permissions to join and speak in your voice channel!', ephemeral: true });
        }

        await interaction.deferReply();

        try {
            let songInfo;
            
            const play = require('play-dl');
            
            if (query.includes('spotify.com')) {
                const spdl = require('spotify-url-info')(require('isomorphic-fetch'));
                const data = await spdl.getDetails(query);
                const track = data.preview;
                const searchTerm = `${track.title} ${track.artist}`;
                
                const searchResults = await play.search(searchTerm, { limit: 1 });
                const video = searchResults[0];
                if (!video) return interaction.editReply('❌ Could not find this Spotify track.').catch(() => {});

                songInfo = {
                    title: track.title,
                    url: video.url,
                    thumbnail: track.image,
                    durationRaw: video.durationRaw || '00:00',
                    requestedBy: interaction.user,
                    source: 'youtube'
                };
            } else if (play.yt_validate(query) === 'video') {
                const videoData = await play.video_info(query);
                songInfo = {
                    title: videoData.video_details.title,
                    url: videoData.video_details.url,
                    thumbnail: videoData.video_details.thumbnails[0]?.url || '',
                    durationRaw: videoData.video_details.durationRaw || '00:00',
                    requestedBy: interaction.user,
                    source: 'youtube'
                };
            } else {
                const searchResults = await play.search(query, { limit: 1 });
                if (!searchResults || searchResults.length === 0) return interaction.editReply('❌ No results found.').catch(() => {});
                
                const video = searchResults[0];
                songInfo = {
                    title: video.title,
                    url: video.url,
                    thumbnail: video.thumbnails[0]?.url || '',
                    durationRaw: video.durationRaw || '00:00',
                    requestedBy: interaction.user,
                    source: 'youtube'
                };
            }

            if (!songInfo.url) {
                return interaction.editReply('❌ Could not retrieve a valid URL for this song.');
            }

            let queue = MusicHandler.getQueue(interaction.guildId);

            if (!queue) {
                queue = MusicHandler.createQueue(interaction.guildId, interaction.channel, voiceChannel);
                queue.songs.push(songInfo);

                try {
                    queue.connection = await MusicHandler.joinVoice(interaction, voiceChannel);
                    MusicHandler.play(interaction.guildId, queue.songs[0]);
                    
                    const embed = new EmbedBuilder()
                        .setColor('#10B981')
                        .setTitle('➕ Added to Queue')
                        .setDescription(`**[${songInfo.title}](${songInfo.url})** has been added to the queue.`)
                        .setThumbnail(songInfo.thumbnail)
                        .setFooter({ text: `Requested by ${interaction.user.tag}` });

                    await interaction.editReply({ embeds: [embed] }).catch(() => {});
                } catch (error) {
                    console.error(error);
                    MusicHandler.stop(interaction.guildId);
                    return interaction.editReply('❌ Could not join the voice channel.').catch(() => {});
                }
            } else {
                queue.songs.push(songInfo);
                const embed = new EmbedBuilder()
                    .setColor('#3B82F6')
                    .setTitle('➕ Added to Queue')
                    .setDescription(`**[${songInfo.title}](${songInfo.url})** has been added to the queue at position **#${queue.songs.length - 1}**.`)
                    .setThumbnail(songInfo.thumbnail)
                    .setFooter({ text: `Requested by ${interaction.user.tag}` });

                return interaction.editReply({ embeds: [embed] }).catch(() => {});
            }

        } catch (error) {
            console.error(error);
            interaction.editReply('❌ An error occurred while trying to play the song.').catch(() => {});
        }
    },
};
