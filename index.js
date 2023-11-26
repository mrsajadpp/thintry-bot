require("dotenv").config();
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents, Collection, GatewayIntentBits, PermissionsBitField, ActivityType } = require('discord.js'); // Include Collection from discord.js
const { EmbedBuilder } = require('discord.js');
const { connectToDatabase } = require('./database/db');
const express = require('express');
const app = express();
const mdl = require("./modules/module");

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.GuildEmojisAndStickers] });
client.commands = new Collection(); // Create a new collection for commands

let commands = [];
let guildIds = []; // Renamed from guild_id for better readability

let db;
let activytyStatus = false;

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
  client.user.setPresence({
    activities: [{ name: `${client.guilds.cache.size} servers.`, type: ActivityType.Watching }],
    status: 'online',
  });
  client.guilds.cache.forEach(guild => {
    guildIds.push(guild.id);
  });

  app.listen(80, () => {
    console.log("🚀Web server started on port 80!");
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

    client.user.setPresence({
      activities: [{ name: `${client.guilds.cache.size} servers.`, type: ActivityType.Watching }],
      status: 'online',
    });
  } catch (error) {
    console.error('Error registering application (/) commands in new guild:', error);
  }
});

setInterval(() => {
  if (activytyStatus) {
    client.user.setPresence({
      activities: [{ name: `/help`, type: ActivityType.Watching }],
      status: 'online',
    });
    activytyStatus = false;
  } else {
    client.user.setPresence({
      activities: [{ name: `${client.guilds.cache.size} servers.`, type: ActivityType.Watching }],
      status: 'online',
    });
    activytyStatus = true;
  }
}, 5000);


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

// Assuming you have a cooldowns Map
const cooldowns = new Map();

client.on('messageCreate', async (message) => {
  client.user.setPresence({
    activities: [{ name: `${client.guilds.cache.size} servers.`, type: ActivityType.Watching }],
    status: 'online',
  });
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
      mdl.linkFltr(db, message, guildData);
    }

    // Check for word filtering
    if (blacklistWordsEnabled) {
      var badwordsRegExp = require('badwords/regexp');
      if (message.content.toLowerCase().match(badwordsRegExp)) {
        // Delete the message if it contains a filtered word
        mdl.delBlack(db, message, guildData, badwordsRegExp);
      }
    }

    // Check for spam messages
    if (antiSpamEnabled) {
      mdl.protSpam(db, message, guildData);
    }
  }
});

function containsLink(content) {
  // Use a regular expression to check if the message contains a URL
  const urlRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/;
  return urlRegex.test(content);
}

app.get('/', (req, res) => {
  res.send("www.thintry.com");
})


process.on("unhandledRejection", error => console.error("Promise rejection:", error));

client.login(process.env.TOKEN); // Replace YOUR_BOT_TOKEN with your bot's token
