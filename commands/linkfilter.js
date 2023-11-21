const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    async execute(interaction, db) {
        const enableLinkFilter = interaction.options.getBoolean('enable');

        // Check if the user is an administrator
        if (interaction.member.permissions.has('ADMINISTRATOR')) {
            try {
                // Assuming there's a 'guildSettings' collection in the database
                await db.collection('guildSettings').updateOne(
                    { guildId: interaction.guild.id },
                    { $set: { linkFilterEnabled: enableLinkFilter } },
                    { upsert: true }
                );

                const status = enableLinkFilter ? 'enabled' : 'disabled';
                const embed = new MessageEmbed()
                    .setTitle(`Link Filtering ${status}`)
                    .setDescription(`Link filtering feature has been ${status} for this server.`)
                    .setColor('GREEN');

                await interaction.reply({ embeds: [embed] });
            } catch (error) {
                console.error('Error updating database:', error);
                await interaction.reply('An error occurred while updating the database.');
            }
        } else {
            const embed = new MessageEmbed()
                .setTitle('Permission Denied')
                .setDescription('You do not have the necessary permissions to modify the link filtering setting.')
                .setColor('RED');

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },

    data: new SlashCommandBuilder()
        .setName('linkfilter')
        .setDescription('Enables or disables the link filtering feature for the server.')
        .addBooleanOption(option =>
            option.setName('enable')
                .setDescription('Enable or disable the link filtering feature.')
                .setRequired(true)
        ),
};
