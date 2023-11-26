const { EmbedBuilder } = require('discord.js');

function containsLink(content) {
    // Use a regular expression to check if the message contains a URL
    const urlRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/;
    return urlRegex.test(content);
}

module.exports = {
    protSpam: async (db, message) => {
        const cooldownTime = 5000; // 5 seconds cooldown (adjust as needed)
        const userCooldownKey = `${message.guild.id}-${message.author.id}`;

        // Fetch user cooldown from the database
        const userCooldownData = await db.collection('userCooldowns').findOne({ key: userCooldownKey });
        const userCooldown = userCooldownData ? userCooldownData.timestamp : 0;

        if (Date.now() - userCooldown > cooldownTime) {
            // Allow the message
            try {
                // Update user cooldown in the database
                await db.collection('userCooldowns').updateOne(
                    { key: userCooldownKey },
                    { $set: { timestamp: Date.now() } },
                    { upsert: true }
                );
            } catch (error) {
                console.error('Error updating user cooldown in the database:', error);
            }
        } else {
            // Delete the spam message
            try {
                await message.delete();

                // Send a report to the specified channel
                const reportChannelId = guildData.reportChannelId;
                if (reportChannelId) {
                    const reportEmbed = new EmbedBuilder()
                        .setTitle('Spam Filtering Report')
                        .setDescription(`Message deleted from <@${message.author.id}> in ${message.guild.name} for spamming.`)
                        .setColor('Red')
                        .setTimestamp();

                    const reportChannel = message.guild.channels.cache.get(reportChannelId);
                    if (reportChannel) {
                        await reportChannel.send({ embeds: [reportEmbed] });
                    }
                }
            } catch (error) {
                console.error('Error deleting spam message:', error);
            }
        }
    },
    delBlack: async (db, message, guildData, badwordsRegExp) => {
        try {
            const word = message.content.toLowerCase().match(badwordsRegExp)[0];
            await message.delete();
            console.log(`Deleted message from ${message.author.tag} in ${message.guild.name} due to word filtering.`);

            // Send a report to the specified channel
            const reportChannelId = guildData.reportChannelId;
            if (reportChannelId) {
                const reportEmbed = new EmbedBuilder()
                    .setTitle('Blacklist Words Report')
                    .setDescription(`Message deleted from <@${message.author.id}> in ${message.guild.name} for containing the word: ${word}`)
                    .setColor('Red')
                    .setTimestamp();

                const reportChannel = message.guild.channels.cache.get(reportChannelId);
                if (reportChannel) {
                    await reportChannel.send({ embeds: [reportEmbed] });
                }
            }
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    },
    linkFltr: async (db, message, guildData) => {
        try {
            await message.delete();
            console.log(`Deleted message from ${message.author.tag} in ${message.guild.name} due to link filtering.`);

            // Send a report to the specified channel
            const reportChannelId = guildData.reportChannelId;
            if (reportChannelId) {
                const reportEmbed = new EmbedBuilder()
                    .setTitle('Link Filtering Report')
                    .setDescription(`Message deleted from <@${message.author.id}> in ${message.guild.name} for containing an unauthorized link.`)
                    .setColor('Red')
                    .setTimestamp();

                const reportChannel = message.guild.channels.cache.get(reportChannelId);
                if (reportChannel) {
                    await reportChannel.send({ embeds: [reportEmbed] });
                }
            }
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    }
}