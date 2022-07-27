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
  function sendAlert(typed) {
    if (message.content && message.author.id == '895652387782549574') {
      for (var l = 0; l < data.length; l++) {
         var mes = typed.split('/send ')[1];
         var chl = client.channels.cache.get(data[l]);
            chl.send(`@everyone New announcement from developer's : ${mes}`);
      }
    } else {
      message.reply("You don't have permission to send announcement!");
    }
  } 
  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift();
    const command = client.commands.get(commandName);
    if (message.content.startsWith('/send')) {
      sendAlert(message.content);
    }
    if(!command) return message.reply({ content: "That command doesn't exist!"});
    command.run(client, message, args, data, sendAlert)
  }
});
process.on("unhandledRejection", error => console.error("Promise rejection:", error));
listen();
client.login(process.env.TOKEN);
