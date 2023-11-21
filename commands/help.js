const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
  async execute(interaction) {
    const commands = getCommands();
    
    const embed = new MessageEmbed()
      .setTitle('🛡️ Auto-Moderation Features')
      .setDescription(`Explore the powerful auto-moderation features crafted by ${interaction.client.user.username}. these functionalities are designed to elevate your Discord server experience.`)
      .setFooter(`Please note that these features are specific to ${interaction.client.user.username}. Check the bot documentation for the most up-to-date information and customization options.`)
      .setTimestamp()
      .setColor('ORANGE');

      commands.forEach(command => {
        embed.addField(`/${command.data.name}`, command.data.description || 'No description available');
      });

    await interaction.reply({ embeds: [embed] });
  },

  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays information about auto-moderation features.'),
};

function getCommands() {
  const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
  const commands = [];

  for (const file of commandFiles) {
    const command = require(`./${file}`);
    commands.push(command);
  }

  return commands;
}
