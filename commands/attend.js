const fs = require('fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('attend')
        .setDescription('Mark your attendance for today'),

    async execute(interaction) {
        const { user, guildId } = interaction;
        const userId = user.id;

        // Read the attendance file
        const attendanceFile = `attendance_${guildId}.json`;
        let attendanceData = {};
        try { 
            const data = fs.readFileSync(attendanceFile, 'utf8');
            attendanceData = JSON.parse(data);
        } catch (err) {
            console.error('Error reading attendance file:', err);
        }

        // Check if the user already marked attendance for today
        const today = new Date().toLocaleDateString();
        if (attendanceData[userId] && attendanceData[userId].date === today) {
            await interaction.reply('You have already marked your attendance for today.');
            return;
        }

        // Mark attendance for the user
        attendanceData[userId] = { date: today };

        // Write the updated attendance data to the file
        fs.writeFile(attendanceFile, JSON.stringify(attendanceData), 'utf8', (err) => {
            if (err) {
                console.error('Error writing attendance file:', err);
                return;
            }
            console.log('Attendance marked for', user.username);
        });

        await interaction.reply('Attendance marked successfully for today!');
    },
};
