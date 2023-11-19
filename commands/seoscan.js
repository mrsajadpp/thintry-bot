const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('seoscan')
    .setDescription('Scan a website for SEO metrics')
    .addStringOption(option =>
      option.setName('website')
        .setDescription('Enter the website URL')
        .setRequired(true)
    ),

  async execute(interaction) {
    const websiteURL = interaction.options.getString('website');

    if (!websiteURL) {
      await interaction.reply('Please provide a website URL.');
      return;
    }

    await interaction.deferReply();

    try {
      const response = await axios.get(`https://api.allorigins.win/raw?url=${websiteURL}`);
      const { data } = response;

      // Extract SEO metrics (example: extracting title, meta description, etc.)
      const title = data.match(/<title>(.*?)<\/title>/i)?.[1] || 'No title found';
      const metaDescription = data.match(/<meta name="description" content="(.*?)"\s*\/?>/i)?.[1] || 'No meta description found';
      const metaKeywords = data.match(/<meta name="keywords" content="(.*?)"\s*\/?>/i)?.[1] || 'No meta keywords found';
      // Add more SEO metrics extraction as needed

      const embed = new MessageEmbed()
        .setTitle(`SEO Analysis for ${websiteURL}`)
        .addField('Title', title)
        .addField('Meta Description', metaDescription)
        .addField('Meta Keywords', metaKeywords)
        // Add more fields for other SEO metrics
        .setColor('#3498db')
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error scanning SEO:', error);
      await interaction.editReply('There was an error while scanning SEO metrics for the website.');
    }
  },
};
