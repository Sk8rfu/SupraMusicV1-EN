const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MusicHandler = require('../musicHandler.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stops the music and leaves the voice channel'),

    async execute(interaction) {
        const queue = MusicHandler.getQueue(interaction.guildId);

        if (!queue) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#EF4444')
                .setDescription('❌ **There is no music playing to stop!**');
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        if (interaction.member.voice.channelId !== queue.voiceChannel.id) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#EF4444')
                .setDescription('❌ **You must be in the same voice channel as the bot to stop music!**');
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        MusicHandler.stop(interaction.guildId);

        const embed = new EmbedBuilder()
            .setColor('#EF4444')
            .setTitle('⏹️ Session Terminated')
            .setDescription(`**${interaction.user.username}** has stopped the music and cleared the queue.`)
            .setFooter({ text: 'Voice connection closed' })
            .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    },
};
