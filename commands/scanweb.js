const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const puppeteer = require('puppeteer');
var URL = require('url').URL;

module.exports = {
  async execute(interaction) {
    let websiteURL = interaction.options.getString('website');

    if (!websiteURL) {
      await interaction.reply('Please provide a website URL.');
      return;
    }

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

    await interaction.deferReply();

    try {
      const browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome', // Replace with your Chrome executable path
      });
      const page = await browser.newPage();

      await page.goto(websiteURL, { waitUntil: 'domcontentloaded' });

      // Extracting important readable content
      const content = await page.evaluate(() => {
        const title = document.title;
        const paragraphText = Array.from(document.querySelectorAll('p'))
          .map(p => p.textContent.trim())
          .filter(text => text.length > 0)
          .join('\n\n');

        return { title, paragraphText };
      });

      // Get the favicon URL if it exists
      let faviconHref = '';
      const faviconElement = await page.$('link[rel="icon"]');
      if (faviconElement) {
        faviconHref = await page.evaluate(el => el.href, faviconElement);
      }

      // Get the Apple touch icon URL if it exists
      let appleTouchIconHref = '';
      const appleTouchIconElement = await page.$('link[rel="apple-touch-icon"]');
      if (appleTouchIconElement) {
        appleTouchIconHref = await page.evaluate(el => el.href, appleTouchIconElement);
      }

      await browser.close();

      const embed = new MessageEmbed()
        .setTitle(`Content from ${content.title}`)
        .setDescription(content.paragraphText || 'No content found')
        .setThumbnail(appleTouchIconHref || faviconHref || '')
        .setColor('#00FF00')
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error scanning website:', error);
      await interaction.editReply('There was an error while scanning the website.');
    }
  },

  data: new SlashCommandBuilder()
    .setName('scanweb')
    .setDescription('Extracts important readable content from a website')
    .addStringOption(option =>
      option.setName('website')
        .setDescription('Enter the website URL')
        .setRequired(true)
    ),
};
