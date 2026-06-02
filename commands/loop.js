const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MusicHandler = require('../musicHandler.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Toggles looping of the current song'),

    async execute(interaction) {
        const queue = MusicHandler.getQueue(interaction.guildId);

        if (!queue || queue.songs.length === 0) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                    .setColor('#EF4444')
                    .setDescription('❌ **There is no song playing to loop!**')
                ],
                ephemeral: true
            });
        }

        if (interaction.member.voice.channelId !== queue.voiceChannel.id) {
            return interaction.reply({
                content: '❌ You must be in the same voice channel as the bot to toggle loop!',
                ephemeral: true
            });
        }

        // Toggle loop
        queue.loop = !queue.loop;

        const embed = new EmbedBuilder()
        .setColor(queue.loop ? '#10B981' : '#EF4444')
        .setTitle('🔁 Loop Mode')
        .setDescription(
            queue.loop
            ? '🔂 **Loop is now ENABLED!**\nThe current song will repeat.'
            : '➡️ **Loop is now DISABLED!**\nThe queue will continue normally.'
        )
        .setTimestamp();

        return interaction.reply({ embeds: [embed] });
    },
};
