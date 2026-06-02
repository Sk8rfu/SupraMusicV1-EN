const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MusicHandler = require('../musicHandler.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song'),

    async execute(interaction) {
        const queue = MusicHandler.getQueue(interaction.guildId);

        if (!queue || queue.songs.length === 0) {
            return interaction.reply({ content: '❌ There is no music playing to skip!', ephemeral: true });
        }

        if (interaction.member.voice.channelId !== queue.voiceChannel.id) {
            return interaction.reply({ content: '❌ You must be in the same voice channel as the bot to skip music!', ephemeral: true });
        }

        MusicHandler.skip(interaction.guildId);

        const embed = new EmbedBuilder()
            .setColor('#F59E0B')
            .setDescription('⏭️ **Song skipped!**');

        return interaction.reply({ embeds: [embed] });
    },
};
