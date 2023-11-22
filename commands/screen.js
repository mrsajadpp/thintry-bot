const { SlashCommandBuilder } = require('@discordjs/builders');
const puppeteer = require('puppeteer');
const { AttachmentBuilder } = require('discord.js');
const { createCanvas, loadImage } = require('canvas');
var URL = require('url').URL;

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
    let url = interaction.options.getString('url');

    if (!url) {
      await interaction.reply('Please provide a valid URL.');
      return;
    }

    // Check if the URL starts with either http:// or https://
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      // If it doesn't, assume http:// and append it to the URL
      const formattedURL = `https://${url}`;
      try {
        new URL(formattedURL);
        url = formattedURL; // Update the URL to the corrected version
      } catch (error) {
        await interaction.reply('Please provide a valid URL.');
        return;
      }
    }

    await interaction.deferReply(); // Acknowledge that the bot has received the interaction

    try {
      const browser = await puppeteer.launch({
        headless: "new",
        executablePath: '/usr/bin/google-chrome', // Replace with your Chrome executable path
      });
      const page = await browser.newPage();

      await page.setViewport({ width: 1920, height: 1080 });

      await page.goto(url);
      const screenshot = await page.screenshot();

      // Load the watermark logo
      const logo = await loadImage('https://i.postimg.cc/hPrNGx38/PAPERWTR.png'); // Replace with the path to your logo image

      // Create a canvas and draw the screenshot and logo onto it
      const canvas = createCanvas(1920, 1080);
      const ctx = canvas.getContext('2d');

      // Draw the screenshot
      ctx.drawImage(await loadImage(screenshot), 0, 0, 1920, 1080);

      // Draw the logo as a watermark (centered along y-axis, left-aligned along x-axis)
      const logoX = canvas.width - 700; // Adjust the x-coordinate as needed
      const logoY = (canvas.height - 60) / 2; // Centered along the y-axis

      ctx.drawImage(logo, logoX, logoY, 150, 60);

      // Convert the canvas to a Buffer
      const canvasBuffer = canvas.toBuffer('image/png');

      await browser.close();

      const attachment = new AttachmentBuilder(canvasBuffer, 'screenshot_with_watermark.png');
      await interaction.editReply({ files: [attachment] });
    } catch (error) {
      console.error('Error taking screenshot:', error);
      await interaction.editReply('There was an error while taking the screenshot.');
    }
  },
};
