const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Generate invite link.'),

  async execute(interaction) {
    await interaction.deferReply(); // Acknowledge that the bot has received the interaction

    try {
      // Create an invite link to the server
      const inviteLink = await interaction.channel.createInvite({ maxAge: 86400, maxUses: 1, unique: true });
      await interaction.user.send(`You've been invited to ${interaction.guild.name}! Here's the invite link: ${inviteLink}`);
      await interaction.editReply('Invite sent successfully to your direct messages.');
    } catch (error) {
      console.error('Error sending invite:', error);
      await interaction.editReply('There was an error while sending the invite.');
    }
  },
}; 
