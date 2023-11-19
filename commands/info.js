const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Displays server information'),

  async execute(interaction) {
    const embed = new MessageEmbed()
      .setTitle('Server Information')
      .setThumbnail(interaction.guild.iconURL())
      .addFields(
        { name: 'Server Name:', value: `\`${interaction.guild.name}\``, inline: true },
        { name: 'Server Owner:', value: `${interaction.guild.owner} : privacy`, inline: true },
        { name: 'Server Created:', value: `${interaction.guild.createdAt}` },
        { name: 'Emoji count:', value: `${interaction.guild.emojis.cache.size}`, inline: true },
        { name: 'Member count:', value: `${interaction.guild.memberCount}`, inline: true },
        { name: 'Region:', value: `${interaction.guild.region} : unavailable`, inline: true }
      )
      .setColor('#FFFF66')
      .setFooter('Requested by ' + interaction.user.tag)
      .setTimestamp();

    try {
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error sending server information:', error);
      await interaction.reply('There was an error while fetching server information.');
    }
  },
};
