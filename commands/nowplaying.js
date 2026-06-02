const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MusicHandler = require('../musicHandler.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('Shows the song that is currently playing'),

    async execute(interaction) {
        const queue = MusicHandler.getQueue(interaction.guildId);

        if (!queue || queue.songs.length === 0) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor('#EF4444')
                    .setDescription('❌ **There is no song currently playing!**')
                ],
                ephemeral: true
            });
        }

        if (interaction.member.voice.channelId !== queue.voiceChannel.id) {
            return interaction.reply({
                content: '❌ You must be in the same voice channel as the bot to view the current song!',
                ephemeral: true
            });
        }

        const song = queue.songs[0];

        const embed = new EmbedBuilder()
        .setColor('#3B82F6')
        .setTitle('🎶 Now Playing')
        .setDescription(`**[${song.title}](${song.url})**`)
        .addFields(
            { name: '⏱ Duration', value: song.durationRaw || 'Unknown', inline: true },
            { name: '🔁 Loop', value: queue.loop ? 'ON' : 'OFF', inline: true }
        )
        .setThumbnail(song.thumbnail || null)
        .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    },
};
