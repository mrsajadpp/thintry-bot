
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
    if (!command) { 
      message.reply({ content: "That command doesn't exist!"});
    } else if (message.content.startsWith(prefix+'send')) {
      for (var l = 0; l < data.length; l++) {
         var mes = message.content.split('/ ')[1];
         var chl = message.guild.channels.cache.get(data[l].channel);
         chl.send(`@everyone New announcement from developer's : ${mes}`);
      }
    } else if (message.content.startsWith(prefix+'set')) {
       const msg = message.content.split('/ ')[1];
        data.push({
        channel : msg
       });
       for (var i = 0; i < data.length; i++) {
      if (msg == data[i].channel) {
        var ch = message.guild.channels.cache.get(data[i].channel);
        ch.send('Succesfully added this channel');
      }
     }
    }
    command.run(client, message, args, data);
  }
});
process.on("unhandledRejection", error => console.error("Promise rejection:", error));
listen();
client.login(process.env.TOKEN);
