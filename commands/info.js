module.exports.run = (client, message, args) => {
  var discord = require('discord.js');
  let embed = new discord.MessageEmbed()
  .setTitle(" Server Information ")
  .setThumbnail(message.guild.iconURL())
  .addFields(
    {name: "Server Name:", value: `\`${message.guild.name}\``, inline: true},
    {name: "Server Owner:", value: `${message.guild.owner} : privacy`, inline: true},
    {name: "Server Created:", value: `${message.guild.createdAt}`},
    {name: "Emoji count:", value: `${message.guild.emojis.cache.size}`, inline: true},
    {name: "Member count:", value: `${message.guild.memberCount}`, inline: true},
    {name: "Region:", value: `${message.guild.region} : unavailable`, inline: true}
  )
  .setColor("#FFFF66")
  .setFooter("Requested by " + message.author.tag)
  .setTimestamp()
  message.channel.send({ embeds: [embed] });
}
