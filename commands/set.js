module.exports.run = (client, message, args, data) => {
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
