
var fs = require('fs');
var path = require('path');
var request = require('request'); 
var discord = require('discord.js');
var client = new discord.Client({ intents : ["GUILDS", "GUILD_MESSAGES"] });
var listen = require('./server.js');
var data = require('./data/data.js');
var prefix = '/';
client.commands = new discord.Collection();
var commands = fs.readdirSync("./commands").filter(file => file.endsWith('.js'));
for(file of commands){
  const commandName = file.split(".")[0];
  const command = require(`./commands/${commandName}`);
  client.commands.set(commandName, command);
} 
//Bot online
client.on('ready', () => {
  console.log(`${client.user.username} is ready!`);
     client.user.setActivity("/help", {
        type: "WATCHING"
  });
});

//Message
client.on('messageCreate', message => {
  client.user.setActivity("/help", {
        type: "WATCHING"
  });
  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift();
    const command = client.commands.get(commandName);
    if(!command) return message.reply({ content: "That command doesn't exist!"});
    command.run(client, message, args, data)
  }
});
process.on("unhandledRejection", error => console.error("Promise rejection:", error));
listen();
client.login(process.env.TOKEN);
