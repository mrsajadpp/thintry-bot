const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('count')
    .setDescription('Replies the tottal servers!'),

  async execute(interaction) {
    await interaction.reply(`Watching ${interaction.client.guilds.cache.size} server's.`);
  },
};
