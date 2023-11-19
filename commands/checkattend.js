const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('checkattend')
        .setDescription('Check attendance'),

    async execute(interaction) {
        const { user, guildId, member } = interaction;
        const userId = user.id;
        const isAdmin = member.permissions.has(Permissions.FLAGS.ADMINISTRATOR);

        // Read the attendance file
        const attendanceFile = `attendance_${guildId}.json`;
        let attendanceData = {};
        try {
            const data = fs.readFileSync(attendanceFile, 'utf8');
            attendanceData = JSON.parse(data);
        } catch (err) {
            console.error('Error reading attendance file:', err);
            await interaction.reply('There was an error while checking attendance.');
            return;
        }

        if (isAdmin) {
            const embed = new MessageEmbed()
                .setTitle('Attendance Data')
                .setDescription('Attendance records for today:');

            Object.entries(attendanceData).forEach(([key, value]) => {
                const member = interaction.guild.members.cache.get(key);
                const username = member?.user.username || 'Unknown User';
                const avatarURL = member?.user.displayAvatarURL({ dynamic: true }) || null;
                const attendanceStatus = value.date || 'Not marked';

                embed.addField(username, attendanceStatus);
                if (avatarURL) embed.setThumbnail(avatarURL);
            });

            await interaction.reply({ embeds: [embed] });
        } else {
            if (attendanceData[userId]) {
                const status = `Your attendance for today: ${attendanceData[userId].date || 'Not marked'}`;
                const avatarURL = user.displayAvatarURL({ dynamic: true });

                const embed = new MessageEmbed()
                    .setDescription(status)
                    .setThumbnail(avatarURL);

                await interaction.reply({ embeds: [embed] });
            } else {
                await interaction.reply('You have not marked your attendance yet.');
            }
        }
    },
};
