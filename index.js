require("dotenv").config();
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents, Collection } = require('discord.js'); // Include Collection from discord.js

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS] });
client.commands = new Collection(); // Create a new collection for commands

let commands = [];
let guildIds = []; // Renamed from guild_id for better readability

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
    await command.execute(interaction);
  } catch (error) {
    console.error('Error executing command:', error);
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
  }
});

process.on("unhandledRejection", error => console.error("Promise rejection:", error));

client.login(process.env.TOKEN); // Replace YOUR_BOT_TOKEN with your bot's token
