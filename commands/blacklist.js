const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  async execute(interaction, db) {
    const enableBlacklist = interaction.options.getBoolean('enable');

    // Check if the user is an administrator
    if (interaction.member.permissions.has(PermissionsBitField.StageModerator)) {
      try {
        // Assuming there's a 'guildSettings' collection in the database
        await db.collection('guildSettings').updateOne(
          { guildId: interaction.guild.id },
          { $set: { blacklistWordsEnabled: enableBlacklist } },
          { upsert: true }
        );

        const status = enableBlacklist ? 'enabled' : 'disabled';
        const embed = new EmbedBuilder()
          .setTitle(`Blacklist Words ${status}`)
          .setDescription(`Blacklist words feature has been ${status} for this server.`)
          .setColor('Green');

        await interaction.reply({ embeds: [embed] });
      } catch (error) {
        console.error('Error updating database:', error);
        await interaction.reply('An error occurred while updating the database.');
      }
    } else {
      const embed = new EmbedBuilder()
        .setTitle('Permission Denied')
        .setDescription('You do not have the necessary permissions to modify the blacklist words setting.')
        .setColor('Red');

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },

  data: new SlashCommandBuilder()
    .setName('blacklist')
    .setDescription('Enables or disables the blacklist words feature for the server.')
    .addBooleanOption(option =>
      option.setName('enable')
        .setDescription('Enable or disable the blacklist words feature.')
        .setRequired(true)
    ),
};
