const { SlashCommandBuilder } = require('@discordjs/builders');
const puppeteer = require('puppeteer');
const { MessageAttachment } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('screen')
    .setDescription('Take a screenshot of a webpage')
    .addStringOption(option =>
      option.setName('url')
        .setDescription('Enter a URL')
        .setRequired(true)
    ),

  async execute(interaction) {
    const url = interaction.options.getString('url');

    if (!url) {
      await interaction.reply('Please provide a valid URL.');
      return;
    }

    await interaction.deferReply(); // Acknowledge that the bot has received the interaction

    try {
      const browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome', // Replace with your Chrome executable path
      });
      const page = await browser.newPage();

      await page.setViewport({ width: 1920, height: 1080 });

      await page.goto(url);
      const screenshot = await page.screenshot();

      await browser.close();

      const attachment = new MessageAttachment(screenshot, 'screenshot.png');
      await interaction.editReply({ files: [attachment] });
    } catch (error) {
      console.error('Error taking screenshot:', error);
      await interaction.editReply('There was an error while taking the screenshot.');
    }
  },
};
