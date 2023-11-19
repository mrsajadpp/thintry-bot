const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('calculator')
        .setDescription('Perform basic arithmetic calculations')
        .addNumberOption(option =>
            option.setName('number1')
                .setDescription('Enter the first number')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('operator')
                .setDescription('Enter the operator (+, -, *, /)')
                .setRequired(true)
        )
        .addNumberOption(option =>
            option.setName('number2')
                .setDescription('Enter the second number')
                .setRequired(true)
        ),

    async execute(interaction) {
        const number1 = interaction.options.getNumber('number1');
        const operator = interaction.options.getString('operator');
        const number2 = interaction.options.getNumber('number2');

        let result;
        switch (operator) {
            case '+':
                result = number1 + number2;
                break;
            case '-':
                result = number1 - number2;
                break;
            case '*':
                result = number1 * number2;
                break;
            case '/':
                result = number2 !== 0 ? number1 / number2 : 'Cannot divide by zero';
                break;
            default:
                result = 'Invalid operator';
                break;
        }

        await interaction.reply(`Result: ${result}`);
    },
};
