const fs = require('fs');
const Discord = require('discord.js');
const common = require('./common.js');

global.allCommands = [];
global.client = new Discord.Client();
global.client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

console.log('🌟 \033[92mStarting!\033[0m')
for (const file of commandFiles) {
    console.log('🔃 \033[32mLoading File: \033[36m' + file + '\033[0m')
    const command = require(`./commands/${file}`);
    const cmdName = file.split('.js')[0];
    allCommands.push(cmdName);
    client.commands.set(cmdName, command);
}

client.on('ready', () => {
    console.log("🪓\033[32mLogged in as \033[36m" + client.user.tag + "\033[0m");
    client.user.setActivity(config.bot.activity).then(() => {
    });
});

client.on("message", async (msg) => {
    console.log('📜 \033[32m' + `${msg.author.tag}: ${msg.content}` + '\033[0m')
    let command = msg.content.replace(commandPrefix, '').split(' ');

    if (!msg.content.startsWith(commandPrefix)) return;
    if (!client.commands.has(command[0].toLowerCase())) {
        let suggestion = common.findBestMatch(command[0], allCommands).bestMatch;
        let text = `Unknown Command\nDid You Mean: **${commandPrefix}${(suggestion.rating !== 0) ? suggestion.target : 'help'}**? (${Math.round(suggestion.rating * 100)}%)\nUse \`${commandPrefix}help\` for all commands`;
        msg.channel.send(common.embedMessage(color.red, 'Error', text));
        return;
    }
    if (disabledCommands.includes(command[0])) {
        msg.channel.send(common.embedMessage(color.help, 'Command Disabled by Admin', ''));
        return;
    }

    try {
        await client.commands.get(command[0].toLowerCase()).process(msg, command);
    } catch (e) {
        msg.channel.send(common.embedMessage(color.red, 'Error', 'Please report this Bug to **Sigma#8214**\n\`' + e + '\`'));
    }
});

common.loadConfig('config/config.json');