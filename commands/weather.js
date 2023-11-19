const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');

const TOMORROW_IO_API_KEY = '7SEzRUj7qGcMaMhRpL0p9SA5jsK8i222';

module.exports = {
  async execute(interaction) {
    const location = interaction.options.getString('location');

    if (!location) {
      await interaction.reply('Please provide a location.');
      return; 
    }

    try {
      const weatherData = await axios.get(`https://api.tomorrow.io/v4/timelines?location=${location}&fields=temperature&units=metric&timesteps=current&apikey=${TOMORROW_IO_API_KEY}`);

      // Extract weather information from the response data
      const temperature = weatherData.data.data.timelines[0].intervals[0].values.temperature;

      await interaction.reply(`Current temperature in ${location}: ${temperature}°C`);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      await interaction.reply('There was an error fetching weather information.');
    }
  },

  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Fetches weather information for a specific location')
    .addStringOption(option =>
      option.setName('location')
        .setDescription('Enter the location')
        .setRequired(true)
    ),
};
