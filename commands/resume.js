const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MusicHandler = require('../musicHandler.js');
const { AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resumes the paused music'),

    async execute(interaction) {
        const queue = MusicHandler.getQueue(interaction.guildId);

        if (!queue) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#EF4444')
                .setDescription('❌ **There is no music in the queue to resume!**');
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        if (interaction.member.voice.channelId !== queue.voiceChannel.id) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#EF4444')
                .setDescription('❌ **You must be in the same voice channel as the bot to resume music!**');
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        if (queue.player.state.status !== AudioPlayerStatus.Paused) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#F59E0B')
                .setDescription('⚠️ **The music is not paused!**');
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        queue.player.unpause();

        const embed = new EmbedBuilder()
            .setColor('#10B981')
            .setTitle('▶️ Music Resumed')
            .setDescription(`Streaming has been resumed by **${interaction.user.username}**.`)
            .setFooter({ text: 'Enjoy the music!' })
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    },
};
