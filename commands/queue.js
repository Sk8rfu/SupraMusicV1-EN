const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const MusicHandler = require('../musicHandler.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Shows the current music queue'),

    async execute(interaction) {
        const queue = MusicHandler.getQueue(interaction.guildId);

        if (!queue || queue.songs.length === 0) {
            const errorEmbed = new EmbedBuilder()
                .setColor('#EF4444')
                .setDescription('❌ **The music queue is currently empty!**');
            return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
        }

        const currentSong = queue.songs[0];
        const queueList = queue.songs.slice(1, 11).map((song, i) => {
            return `**${i + 1}.** [${song.title}](${song.url}) - \`${song.durationRaw}\``;
        }).join('\n');

        const embed = new EmbedBuilder()
            .setColor('#3B82F6')
            .setAuthor({ name: '🎼 Server Music Queue', iconURL: interaction.guild.iconURL() })
            .setTitle('Current Queue')
            .addFields(
                { name: '▶️ Playing Now', value: `[${currentSong.title}](${currentSong.url})` },
                { name: '📂 Up Next', value: queueList || 'No more songs in queue' }
            )
            .setFooter({ text: `Total Songs: ${queue.songs.length} | Loop: ${queue.loop ? 'ON' : 'OFF'}`, iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        if (queue.songs.length > 11) {
            embed.addFields({ name: '...', value: `and **${queue.songs.length - 11}** more songs.`, inline: false });
        }

        return interaction.reply({ embeds: [embed] });
    },
};
