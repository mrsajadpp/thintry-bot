module.exports.run = (client, message, args) => {
  for (var l = 0; l < data.length; l++) {
      var mes = message.content.split('- ')[1];
      var chl = message.guild.channels.cache.get(data[l].channel);
      chl.send(`@everyone ${mes}`);
    }
}
