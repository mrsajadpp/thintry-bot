module.exports.run = (client, message, args) => {
  var discord = require('discord.js');
  let embed = new discord.MessageEmbed()
    .setTitle("🌱Help for crawler")
    .addFields(
        { name: 'Prefix', value: '[:] is the prefix.' }, 
        { name: 'Screenshot', value: '[:screen <website url>] to get your link(website) screenshot.' },
        { name: 'Generate qr code', value: '[:qr <url or value>] type this and send generate your own qr code.' },
        { name: 'Report bug', value: '[:rp <bug>] and send your server.' }, 
        { name: "Server information", value: "[:info] send your server see information's." },
        { name: 'Donate', value: '[:donate] to donate help developer.' },
        { name: 'Costomise qr code', value: '[:donacode] take crawler bot premium.' },
        { name: 'Feedback', value: '<@895652387782549574>.' }
    )
    .setFooter('Commands for crawler.')
    .setTimestamp()
    .setColor("RANDOM")
    message.channel.send({ embeds : [embed] });
    //message.author.send({ embeds : [embed] });
    return;
}
