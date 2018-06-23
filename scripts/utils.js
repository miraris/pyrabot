const discord = require('discord.js');
const u = require('./currency.js');
const s = require('./sentences.js');
const w = require('./waifus.js');
var loaded = new Date().getTime();

console.log("Utils: loading.");

/**
 * Checks whether the message is from the bot owner
 *
 * @param {object} message 
 * @returns {boolean}
 */
const fromOwner = (message) => {
    return (message.author.id === process.env.OWNER_ID);
}

const scan = (message) => {
    return fromOwner(message) ? "Not implemented yet" : `You're not ${process.env.OWNER}.`;
}

const servers = (message) => {
    if (fromOwner(message)) {
        let list = message.client.guilds.keyArray();
        let x = "";
        for (let i = 0; i < list.length; i++) {
            const guild = message.client.guilds.find("id", list[i]);

            x += guild.name;
            x += " ("+guild.owner.user.username+")";
            if (i!=list.length-1) x+="; ";
        }

        return x;
    }
    return `You're not ${process.env.OWNER}.`;
}

const globalsave = (message) => {
    if (fromOwner(message)) {
        s.save();
        w.save();
        u.save();
        return "Done!";
    }
    return `You're not ${process.env.OWNER}.`;
}

const myeval = (message) => {
    try {
        if (fromOwner(message)) {
            const text = message.content.replace("$secret-eval ","");
            return eval(text);
        }
        return `You're not ${process.env.OWNER}.`;
    } catch (e) {
        console.log("Utils#myeval: Error -> "+e);
        return "An error occured.";
    }
}

const help = _ => {
    const embed = new discord.RichEmbed()
    .setAuthor("~~ You used the $help command ~~", "https://cdn.discordapp.com/avatars/456934877841981462/5a880bec4e424aab34fcf6f62cc8a363.png?size=128")
    .setColor("#FF0000")
    .setTitle("Here's what I can do for now:")
    .addField("$talk / $words","Related to responses based on what I've learned from others.")
    .addField("$waifu help","Use this to learn more about waifus.")
    .addField("$money / $gamble / $gift / $top","Money related stuff. You earn it from chatting. Spamming won't help!")
    .addField("$time","How long I've been up for.");

    return { embed };
}

const timedifftostring = (newest, oldest) => {
    const time = newest-oldest;
    const h = Math.floor(time/(1000*60*60));
    const m = Math.floor(time/(1000*60))%60;
    const s = Math.floor(time/(1000))%60;
    let r = "";
    const pluralizeTime = (time, noun, suffix = 's') =>
    `${time} ${noun}${time !== 1 ? suffix : ''}`;

    r += (h>0) ? pluralizeTime(h, "hour") : '';
    r += (m>0) ? pluralizeTime(m, "minute") : '';
    r += (s>0) ? pluralizeTime(s, "second") : '';

    return r;
}

const botup = _ => {
    return `I've been up for ${timedifftostring(new Date().getTime(), loaded)}.`;
}

const prettyNumber = (n) => {
    const s = n.toString();
    let final = "";
    for (let i=0;i<s.length;i++) {
        final += s[i];
        if (i%3===(s.length-1)%3 && i!=s.length-1) final += ".";
    }
    return final;
}

module.exports = {
    myeval,
    save: globalsave,
    botup,
    bothelp: help,
    servers,
    scan,
    prettynumber: prettyNumber,
    timediffstring: timedifftostring
}
