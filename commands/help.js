const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  async execute(interaction) {
    console.log(`Received interaction: ${interaction.id}`);
    const embed = new MessageEmbed()
      .setTitle('🌱 Help for Thintry Bot')
      .setDescription('Here are the available commands to use with Thintry Bot.')
      .addFields(
        { name: 'Prefix', value: 'Use `[/]` as the prefix.' }, 
        { name: 'Screenshot', value: 'Use `[/screen <website url>]` to capture a screenshot of a website link.' },
        { name: 'Generate QR Code', value: 'Use `[/qr <url or value>]` to create your own QR code.' },
        { name: 'Report Bug', value: 'Use `[/rp <bug>]` to report a bug to the server.' }, 
        { name: 'Server Information', value: 'Use `[/info]` to view server information.' },
        { name: 'Feedback', value: 'Contact us at hello@thintry.com for feedback.' }
      )
      .setFooter('Visit www.thintry.com for more information.')
      .setTimestamp()
      .setColor('RANDOM');

    await interaction.reply({ embeds: [embed] });
  },

  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays help for the bot commands.'),
};
