const common = require('./../common.js');
const bank = require('./../bank.js')
const fs = require("fs");

module.exports = {
    "help": 'Send money to another user',
    "usage": 'send <@user> <money>',
    process: async function (msg, command) {
        let Loading = await msg.channel.send(common.embedMessage(color.link, `📦 Loading...`, 'Hang Tight!'));
        let data = JSON.parse(fs.readFileSync(config.data.dataFile).toString());
        let userTag = msg.mentions.users.first();
        let ammount = command[2];
        let name = command[1];

        if (!bank.isUserInDb(config.data.dataFile, msg.author.tag)) {
            bank.initUser(config.data.dataFile, msg.author.tag);
            await Loading.edit(common.embedMessage(color.main, '💰', `Your bank account has been created!`));
            await this.process(msg, command);
            return;
        }
        if (typeof userTag === 'undefined') {
            if (name.startsWith('<@&')) await Loading.edit(common.embedMessage(color.red, '🛑 Error', `That user may be a Bot!`));
            else await Loading.edit(common.embedMessage(color.red, '🛑 Error', `\`${name}\` is not a valid User...\nMake sure said user is in this server`));
            return;
        }
        if (!common.isNumeric(ammount)) {
            await Loading.edit(common.embedMessage(color.red, '🛑 Error', `Uhhh \`${ammount}\` is not a number...\nYou may need to check [this](https://en.wikipedia.org/wiki/Number) out`));
            return;
        }
        if (!bank.isUserInDb(config.data.dataFile, userTag.tag)) {
            await Loading.edit(common.embedMessage(color.red, '🛑 Error', `The user \`${userTag.tag}\` is not registered...`));
            return;
        }
        if (data[msg.author.tag].money < parseInt(ammount)) {
            await Loading.edit(common.embedMessage(color.red, '🛑 Error', `💰💰 Lol you only have \`${data[msg.author.tag].money}\`${config.bank.currency}`));
            return;
        }

        let sendAmount = Math.round(parseFloat(ammount) * 10) / 10;
        data[msg.author.tag].money -= sendAmount;
        data[userTag.tag].money += sendAmount;
        fs.writeFileSync(config.data.dataFile, JSON.stringify(data));
        await Loading.edit(common.embedMessage(color.main, '✅ Success', `This transaction has gone through successfully!!!\n\`${sendAmount}\`${config.bank.currency} ➜ \`${userTag.tag}\``));
    }
}