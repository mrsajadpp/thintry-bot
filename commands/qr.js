const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const { MessageAttachment } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('qr')
    .setDescription('Generate a QR code for a URL')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Enter a URL or Query')
        .setRequired(true)
    ),

  async execute(interaction) {
    const link = interaction.options.getString('query');

    if (!link) {
      await interaction.reply('Please enter a value.');
      return;
    }

    await interaction.deferReply(); // Acknowledge that the bot has received the interaction

    const qrUrl = `http://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(link)}`;

    try {
      const response = await fetch(qrUrl);
      const arrayBuffer = await response.arrayBuffer();
      const qrBuffer = await Buffer.from(arrayBuffer);

      const qrAttachment = new MessageAttachment(qrBuffer, 'qr-code.png');

      await interaction.editReply({ files: [qrAttachment] });
    } catch (error) {
      console.error('Error fetching QR code:', error);
      await interaction.editReply('There was an error while generating the QR code.');
    }
  },
};
