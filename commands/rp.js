const { SlashCommandBuilder } = require('@discordjs/builders');
const nodemailer = require('nodemailer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rp')
    .setDescription('Report bugs.')
    .addStringOption(option =>
      option.setName('bug')
        .setDescription('Enter bug details')
        .setRequired(true)
    ),

  async execute(interaction) {
    const recipientEmail = 'hello@thintry.com'; // Replace with the recipient's email
    const bugReport = interaction.options.getString('bug');

    if (!bugReport) {
      await interaction.reply('Please provide a bug report.');
      return;
    }

    await interaction.deferReply(); // Acknowledge that the bot has received the interaction

    const interactingUser = interaction.user;
    const userTag = interactingUser.tag;
    const userID = interactingUser.id;

    // Construct bug report content with user information
    const completeBugReport = `Bug Report:\n\nBug: ${bugReport}\n\nUser Information:\n` +
      `User Tag: ${userTag}\nUser ID: ${userID}`;

    // Configure nodemailer with Gmail SMTP settings
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'noreply.thintry@gmail.com', // Replace with your Gmail address
        pass: 'bajn akut obyo lpbz', // Replace with your Gmail password or an app-specific password
      },
    });

    const mailOptions = {
      from: 'Thintry <noreply@thintry.com>',
      to: recipientEmail,
      subject: 'Bug Report',
      text: completeBugReport,
    };

    try {
      await transporter.sendMail(mailOptions);
      await interaction.editReply('Bug report has been successfully sent.');
    } catch (error) {
      console.error('Error sending bug report:', error);
      await interaction.editReply('There was an error while sending the bug report.');
    }
  },
};
