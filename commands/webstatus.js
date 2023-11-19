const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
var URL = require('url').URL;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('webstatus')
    .setDescription('Check if a website or API is up or down')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('Enter the URL to check')
        .setRequired(true)
    ),

  async execute(interaction) {
    const websiteURL = interaction.options.getString('url');

    // Check if the URL starts with either http:// or https://
    if (!websiteURL.startsWith('http://') && !websiteURL.startsWith('https://')) {
      // If it doesn't, assume http:// and append it to the URL
      const formattedURL = `https://${websiteURL}`;
      try {
        new URL(formattedURL);
        websiteURL = formattedURL; // Update the URL to the corrected version
      } catch (error) {
        await interaction.reply('Please provide a valid URL.');
        return;
      }
    }

    try {
      const response = await axios.get(websiteURL);
      if (response.status === 200) {
        const embed = new MessageEmbed()
          .setColor('#00FF00')
          .setTitle(`Website Status: UP`)
          .setDescription(`The website ${websiteURL} is UP!`);

        await interaction.reply({ embeds: [embed] });
      } else {
        const embed = new MessageEmbed()
          .setColor('#FF0000')
          .setTitle(`Website Status: DOWN`)
          .setDescription(`The website ${websiteURL} is DOWN!`);

        await interaction.reply({ embeds: [embed] });
        await interaction.user.send(`Alert: The website ${websiteURL} is DOWN!`);
      }
    } catch (error) {
      console.error('Error checking website status:', error);
      const embed = new MessageEmbed()
        .setColor('#FF0000')
        .setTitle(`Website Status: DOWN`)
        .setDescription(`The website ${websiteURL} is DOWN!`);

      await interaction.reply({ embeds: [embed] });
      await interaction.user.send(`Alert: The website ${websiteURL} is DOWN!`);
    }
  },
};
