const common = require('./../common.js');
const bank = require('./../bank.js')

module.exports = {
    help: 'Send money to another user',
    usage: 'send <@user> <money>',
    process: async function (msg, command) {
        let Loading = await msg.channel.send(common.embedMessage(color.link, `📦 Loading...`, 'Hang Tight!'));
        let Bank = new bank(config.data.dataFile)
        let userTag = msg.mentions.users.first();
        let amount = command[2];
        let name = command[1];

        if (!Bank.user.inDb(msg.author.tag)) {
            Bank.user.init(msg.author.tag);
            Bank.save();
            await Loading.edit(common.embedMessage(color.main, '💰', `Your bank account has been created!`));
            await this.process(msg, command);
            return;
        }
        if (typeof userTag === 'undefined') {
            if (name.startsWith('<@&')) await Loading.edit(common.embedMessage(color.red, '🛑 Error', `That user may be a Bot!`));
            else await Loading.edit(common.embedMessage(color.red, '🛑 Error', `\`${name}\` is not a valid User...\nMake sure said user is in this server`));
            return;
        }
        if (!common.isNumeric(amount)) {
            await Loading.edit(common.embedMessage(color.red, '🛑 Error', `Uhhh \`${amount}\` is not a number...\nYou may need to check [this](https://en.wikipedia.org/wiki/Number) out`));
            return;
        }
        if (amount <= 0) {
            await Loading.edit(common.embedMessage(color.red, '🛑 Error', `You *cant* send \`${amount}\`${config.bank.currency}`));
            return;
        }
        if (!Bank.user.inDb(userTag.tag)) {
            await Loading.edit(common.embedMessage(color.red, '🛑 Error', `The user \`${userTag.tag}\` is not registered...`));
            return;
        }
        if (Bank.balance.get(msg.author.tag) < parseInt(amount)) {
            await Loading.edit(common.embedMessage(color.red, '🛑 Error', `💰💰 Lol you only have \`${Bank.balance.get(msg.author.tag)}\`${config.bank.currency}`));
            return;
        }

        let sendAmount = Math.round(parseFloat(amount) * 10) / 10;
        let money = [msg.author.tag, userTag.tag, sendAmount];
        Bank.balance.add(msg.author.tag, -sendAmount);
        Bank.history.add(msg.author.tag, 'Sent money', money)
        Bank.balance.add(userTag.tag, sendAmount);
        Bank.history.add(userTag.tag, 'Receive money', money)
        Bank.save();
        await Loading.edit(common.embedMessage(color.main, '✅ Success', `This transaction has gone through successfully!!!\n\`${sendAmount}\`${config.bank.currency} ➜ \`${userTag.tag}\``));
    }
}