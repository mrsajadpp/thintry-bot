require("dotenv").config();
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents, Collection, GatewayIntentBits, PermissionsBitField } = require('discord.js'); // Include Collection from discord.js
const { connectToDatabase } = require('./database/db');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.GuildEmojisAndStickers] });
client.commands = new Collection(); // Create a new collection for commands

let commands = [];
let guildIds = []; // Renamed from guild_id for better readability

let db;

(async () => {
  db = await connectToDatabase('paper');
})();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
  const commandName = file.split(".")[0];
  client.commands.set(commandName, command); // Set commands in the collection
}

client.once('ready', async () => {
  console.log(`${client.user.username} is ready!`);
  client.user.setActivity("/help", {
    type: "WATCHING"
  });
  console.log('Guilds:');
  client.guilds.cache.forEach(guild => {
    guildIds.push(guild.id);
    console.log(`${guild.name} - ${guild.id}`);
  });

  try {
    console.log('Started refreshing application (/) commands.');
    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

    for (const id of guildIds) {
      await rest.put(
        Routes.applicationGuildCommands(client.user.id, id), // Replace YOUR_CLIENT_ID with your bot's client ID
        { body: commands },
      );
    }

    console.log('Successfully registered application (/) commands.');
  } catch (error) {
    console.error('Error registering application (/) commands:', error);
  }
});

client.on('guildCreate', async guild => {
  try {
    const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

    await rest.put(
      Routes.applicationGuildCommands(client.user.id, guild.id), // Replace YOUR_CLIENT_ID with your bot's client ID
      { body: commands },
    );
  } catch (error) {
    console.error('Error registering application (/) commands in new guild:', error);
  }
});


client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;
  try {
    await command.execute(interaction, db);
  } catch (error) {
    console.error('Error executing command:', error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

const { EmbedBuilder } = require('discord.js');

// Assuming you have a cooldowns Map
const cooldowns = new Map();

client.on('messageCreate', async (message) => {
  // Check if the guild has auto-moderation features enabled
  const guildData = await db.collection('guildSettings').findOne({ guildId: message.guild.id });

  if (guildData) {
    const isAdmin = message.member.permissions.has(PermissionsBitField.StageModerator);
    const linkFilterEnabled = guildData.linkFilterEnabled;
    const blacklistWordsEnabled = guildData.blacklistWordsEnabled;
    const antiSpamEnabled = guildData.antiSpamEnabled;
    const linkChannelId = guildData.linkChannel; // Assuming you have a 'linkChannel' property in guildSettings

    // Check for link filtering
    if (linkFilterEnabled && !isAdmin && containsLink(message.content) && linkChannelId !== message.channelId) {
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

    // Check for word filtering
    if (blacklistWordsEnabled) {
      var badwordsRegExp = require('badwords/regexp');


      if (message.content.toLowerCase().match(badwordsRegExp)) {
        // Delete the message if it contains a filtered word
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
      }
    }

    // Check for spam messages
    if (antiSpamEnabled && !isAdmin) {
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
    }
  }
});


function containsLink(content) {
  // Use a regular expression to check if the message contains a URL
  const urlRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/;
  return urlRegex.test(content);
}


process.on("unhandledRejection", error => console.error("Promise rejection:", error));

client.login(process.env.TOKEN); // Replace YOUR_BOT_TOKEN with your bot's token
