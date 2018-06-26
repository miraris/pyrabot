const discord = require('discord.js');
const u = require('./currency');
const s = require('./sentences');
const w = require('./waifus');
const h = require('./helpers');
const r = require('./roles');
const p = process.env.COMMAND;
const loaded = new Date().getTime();

console.log("Utils: loading.");

const scan = (message) => {
    return "Hi";
};

const servers = (message) => {
    if (h.fromOwner(message)) {
        let list = message.client.guilds.keyArray();
        let x = "";
        for (let i = 0; i < list.length; i++) {
            const guild = message.client.guilds.find("id", list[i]);

            x += guild.name;
            x += " ("+guild.owner.user.username+")";
            if (i !==list.length-1) x+="; ";
        }

        return x;
    }
    return `You're not ${process.env.OWNER}.`;
};

const globalsave = (message) => {
    if (h.fromOwner(message)) {
        s.save();
        w.save();
        u.save();
        r.save();
        return "Done!";
    }
    return `You're not ${process.env.OWNER}.`;
};

const myeval = (message) => {
    try {
        if (h.fromOwner(message)) {
            const text = message.content.replace("$secret-eval ","");
            return eval(text);
        }
        return `You're not ${process.env.OWNER}.`;
    } catch (e) {
        console.log("Utils#myeval: Error -> "+e);
        return "An error occured.";
    }
};

const help = () => {
    const embed = new discord.RichEmbed()
        .setAuthor("~~ You used the "+p+"help command ~~", "https://cdn.discordapp.com/avatars/456934877841981462/5a880bec4e424aab34fcf6f62cc8a363.png?size=128")
        .setColor("#FF0000")
        .setTitle("Here's what I can do for now:")
        .addField(p+"talk / "+p+"words","Related to responses based on what I've learned from others.")
        .addField(p+"waifu help","Use this to learn more about waifus.")
        .addField(p+"add role / "+p+"role / "+p+"remove role","Tell me which roles I can assign to users. Users can then get them from me.")
        .addField(p+"money / "+p+"gamble / "+p+"gift / "+p+"top","Money related stuff. You earn it from chatting. Spamming won't help!")
        .addField(p+"time","How long I've been up for.");

    return { embed };
};

const botup = () => {
    return `I've been up for ${h.timeDiffToString(new Date().getTime(), loaded)}.`;
};

module.exports = {
    myeval,
    save: globalsave,
    botup,
    bothelp: help,
    servers,
    scan
};