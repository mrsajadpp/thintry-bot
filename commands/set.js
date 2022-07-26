module.exports.run = (client, message, args, data) => {
   const msg = message.content.split('/set ')[1];
        data.push({
          channel : msg
       });
   setTimeout(function () => {
        var ch = message.guild.channels.cache.get(msg);
        ch.send('Succesfully added this channel');
       },1000);
}
