const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  async execute(interaction) {
    const location = interaction.options.getString('location');

    if (!location) {
      await interaction.reply('Please provide a location.');
      return;
    }

    try {
      const weatherData = await axios.get(`https://api.tomorrow.io/v4/timelines?location=${location}&fields=temperature,humidity,weatherCode&units=metric&timesteps=current&apikey=${process.env.WEATHER_API}`);

      // Extract weather information from the response data
      const temperature = weatherData.data.data.timelines[0].intervals[0].values.temperature;
      const humidity = weatherData.data.data.timelines[0].intervals[0].values.humidity;
      const weatherCode = weatherData.data.data.timelines[0].intervals[0].values.weatherCode;

      // Determine color based on temperature
      let color = 'Blue';
      if (temperature > 30) {
        color = 'Red';
      } else if (temperature > 20) {
        color = 'Orange';
      } else if (temperature > 10) {
        color = 'Yellow';
      }

      // Determine weather type image based on weather code
      let weatherImage = '';
      switch (weatherCode) {
        case 200:
        case 201:
        case 202:
          weatherImage = 'https://i.postimg.cc/Y0Qtv9mc/thunderstorms.png';
          break;
        case 500:
        case 501:
        case 502:
          weatherImage = 'https://i.postimg.cc/J4c1msLZ/rain.png';
          break;
        case 800:
          weatherImage = 'https://i.postimg.cc/rpzcSgtN/partly-cloudy.png';
          break;
        default:
          weatherImage = 'https://i.postimg.cc/RhxBxBpg/cloudy.png';
          break;
      }

      // Create and send embed with image
      const embed = new EmbedBuilder()
        .setTitle(`Weather Information for ${location}`)
        .addField('Temperature', `${temperature}°C`, true)
        .addField('Humidity', `${humidity}%`, true)
        .setColor(color)
        .setThumbnail(weatherImage); // Directly use the URL here

      await interaction.reply({ embeds: [embed] });
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
 