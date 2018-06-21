require('dotenv').config();

const p = '$';
const botid = process.env.BOT_ID;
const botperms = process.env.BOT_PERMS;
const bottoken = process.env.BOT_TOKEN;

console.log('Loading modules...');
const discord = require('discord.js');
const s = require('./scripts/sentences.js');
const u = require('./scripts/utils.js');
const w = require('./scripts/waifus.js');
const c = require('./scripts/currency.js');
const g = require('./scripts/gambler.js');

const bot = new discord.Client();

bot.login(bottoken);

bot.on('ready', () => {
  bot.user.setPresence({game: {name: "Cinnamon roll bot"}, status: "dnd"});
  console.log('Bot is up.');
})

bot.on('message', (message) => {

    if (message.author.id.toString() === botid) return;

    let cmd = message.content.toLowerCase();

    s.learn(cmd);
    c.gencurrency(message);
    w.update(message);

    //cmds with args
    if (cmd.startsWith(p+"gamble")) message.channel.send(g.gamble(message));
    else if (cmd.startsWith(p+"name waifu")) message.channel.send(w.name(message));
    else if (cmd.startsWith(p+"buy waifu")) message.channel.send(w.buy(message));
    else if (cmd.startsWith(p+"gift")) message.channel.send(c.gift(message));
    else if (cmd.startsWith(p+"secret-eval")) message.channel.send(u.myeval(message));

    //cmds without args
    else {
        switch (cmd) {
            case p+"intro": 
                message.channel.send("Hi.");
                break;
            case p+"talk":
                message.channel.send(s.reply());
                break;
            case p+"words":
                message.channel.send(s.wordcount());
                break;
            case p+"time":
                message.channel.send(u.botup());
                break;
            case p+"waifu":
                message.channel.send(w.waifu(message));
                break;
            case p+"show waifu":
                message.channel.send(w.show(message));
                break;
            case p+"sleep with waifu":
                message.channel.send(w.sleep(message));
                break;
            case p+"pet waifu":
                message.channel.send(w.cuddle(message));
                break;
            case p+"hug waifu":
                message.channel.send(w.cuddle(message));
                break;
            case p+"kiss waifu":
                message.channel.send(w.cuddle(message));
                break;
            case p+"shop waifu":
                message.channel.send(w.shop(message));
                break;
            case p+"waifu help":
                message.channel.send(w.help(message));
                break;
            case p+"money":
                message.channel.send(c.mycurrency(message));
                break;
            case p+"top":
                message.channel.send(c.top(message));
                break;
            case p+"help":
                message.channel.send(u.bothelp());
                break;
            case p+"secret-save":
                message.channel.send(u.save(message));
                break;
            case p+"inv":
                message.channel.send("https://discordapp.com/oauth2/authorize?client_id="+botid+"&scope=bot&permissions="+botperms);
                break;
        }

    }

});