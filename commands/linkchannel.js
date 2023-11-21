const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    async execute(interaction, db) {
        const channelOption = interaction.options.getChannel('channel');

        // Check if the user is an administrator
        if (interaction.member.permissions.has('ADMINISTRATOR')) {
            try {
                // Assuming there's a 'guildSettings' collection in the database
                const guildSettings = await db.collection('guildSettings').findOne({ guildId: interaction.guild.id });

                if (channelOption) {
                    const updateFields = { $set: { linkChannel: channelOption.id } };

                    if (guildSettings && guildSettings.linkChannel) {
                        // If a link channel is already set, update the existing entry
                        await db.collection('guildSettings').updateOne(
                            { guildId: interaction.guild.id },
                            updateFields
                        );
                    } else {
                        // If no link channel is set, create a new entry
                        await db.collection('guildSettings').updateOne(
                            { guildId: interaction.guild.id },
                            updateFields,
                            { upsert: true }
                        );
                    }

                    const embed = new MessageEmbed()
                        .setTitle('Link Channel Set')
                        .setDescription(`Automoderation reports will now be sent to ${channelOption}.`)
                        .setColor('GREEN');

                    await interaction.reply({ embeds: [embed] });
                } else {
                    const embed = new MessageEmbed()
                        .setTitle('Invalid Channel')
                        .setDescription('Please provide a valid channel to set as the automoderation report channel.')
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
                .setDescription('You do not have the necessary permissions to set the automoderation report channel.')
                .setColor('RED');

            await interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },

    data: new SlashCommandBuilder()
        .setName('linkchannel')
        .setDescription('Set up a designated channel for sharing links.')
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel where everyone can share links.')
                .setRequired(true)
        ),
};
