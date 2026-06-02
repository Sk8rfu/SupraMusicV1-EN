const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MusicHandler = require('../musicHandler.js');
const { AudioPlayerStatus } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the current music'),

    async execute(interaction) {
        const queue = MusicHandler.getQueue(interaction.guildId);

        if (!queue) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#EF4444')
                .setDescription('❌ **There is no music playing to pause!**');
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        if (interaction.member.voice.channelId !== queue.voiceChannel.id) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#EF4444')
                .setDescription('❌ **You must be in the same voice channel as the bot to pause music!**');
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        if (queue.player.state.status === AudioPlayerStatus.Paused) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#F59E0B')
                .setDescription('⚠️ **The music is already paused!**');
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        queue.player.pause();

        const embed = new EmbedBuilder()
            .setColor('#F59E0B')
            .setTitle('⏸️ Music Paused')
            .setDescription(`Streaming has been paused by **${interaction.user.username}**.`)
            .setFooter({ text: 'Use /resume to continue' })
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    },
};
