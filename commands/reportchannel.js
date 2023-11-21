const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  async execute(interaction, db) {
    const reportChannelOption = interaction.options.getChannel('channel');

    // Check if the user is an administrator
    if (interaction.member.permissions.has('ADMINISTRATOR')) {
      try {
        // Assuming there's a 'guildSettings' collection in the database
        const guildSettings = await db.collection('guildSettings').findOne({ guildId: interaction.guild.id });

        if (reportChannelOption) {
          const updateFields = { $set: { reportChannelId: reportChannelOption.id } };

          if (guildSettings && guildSettings.reportChannelId) {
            // If a report channel is already set, update the existing entry
            await db.collection('guildSettings').updateOne(
              { guildId: interaction.guild.id },
              updateFields
            );
          } else {
            // If no report channel is set, create a new entry
            await db.collection('guildSettings').updateOne(
              { guildId: interaction.guild.id },
              updateFields,
              { upsert: true }
            );
          }

          const embed = new MessageEmbed()
            .setTitle('Report Channel Set')
            .setDescription(`Bad words deletion reports will now be sent to ${reportChannelOption}.`)
            .setColor('GREEN');

          await interaction.reply({ embeds: [embed] });
        } else {
          const embed = new MessageEmbed()
            .setTitle('Invalid Report Channel')
            .setDescription('Please provide a valid channel to set as the report channel.')
            .setColor('RED');

          await interaction.reply({ embeds: [embed], ephemeral: true });
        }
      } catch (error) {
        console.error('Error updating database:', error);
        await interaction.reply('An error occurred while updating the database.');
      }
    } else {
      const embed = new MessageEmbed()
        .setTitle('Permission Denied')
        .setDescription('You do not have the necessary permissions to set the report channel.')
        .setColor('RED');

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },

  data: new SlashCommandBuilder()
    .setName('reportchannel')
    .setDescription('Sets the channel to send automoderation reports to.')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to send automoderation reports to.')
        .setRequired(true)
    ),
};
