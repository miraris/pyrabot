var exports = module.exports = {};

const discord = require('discord.js');
const u = require('./currency.js');
const s = require('./sentences.js');
const w = require('./waifus.js');
var loaded = new Date().getTime();

console.log("Utils: loading.");

exports.myeval = function(message) {
    return myeval(message);
}

exports.save = function(message) {
    return globalsave(message);
}

exports.capitalize = function(str) {
    return capitalize(str);
}

exports.botup = function() {
    return botup();
}

exports.bothelp = function() {
    return help();
}

exports.servers = function(message) {
    return servers(message);
}

exports.scan = function(message) {
    return scan(message);
}

exports.prettynumber = function(n) {
    return prettyNumber(n);
}

exports.timediffstring = function(newest, oldest) {
    return timedifftostring(newest, oldest);
}

function scan(message) {
        return "Done!";
}

function servers(message) {
    if (message.author.id==process.env.OWNER_ID) {
        let list = message.client.guilds.keyArray();
        let x = "";
        for (let i=0;i<list.length;i++) {
            let guild = message.client.guilds.find("id", list[i]);
            x += guild.name;
            x += " ("+guild.owner.user.username+")";
            if (i!=list.length-1) x+="; ";
        }

        return x;
    }
    else return "You're not "+process.env.OWNER+".";
}

function globalsave(message) {
    if (message.author.id==process.env.OWNER_ID) {
        s.save();
        w.save();
        u.save();
        return "Done!";
    }
    else return "You're not "+process.env.OWNER+".";
}

function myeval(message) {
    try {
        if (message.author.id==process.env.OWNER_ID) {
            let text = message.content.replace("$secret-eval ","");
            return eval(text);
        }
        else return "You're not "+process.env.OWNER+".";
    } catch (e) {
        console.log("Utils#myeval: Error -> "+e);
        return "An error occured.";
    }
}

function help() {
    const embed = new discord.RichEmbed()
    .setAuthor("~~ You used the $help command ~~", "https://cdn.discordapp.com/avatars/456934877841981462/5a880bec4e424aab34fcf6f62cc8a363.png?size=128")
    .setColor("#FF0000")
    .setTitle("Here's what I can do for now:")
    .addField("$talk / $words","Related to responses based on what I've learned from others.")
    .addField("$waifu help","Use this to learn more about waifus.")
    .addField("$money / $gamble / $gift / $top","Money related stuff. You earn it from chatting. Spamming won't help!")
    .addField("$time","How long I've been up for.");

    return {embed};
}

function timedifftostring(newest, oldest) {
    let time = newest-oldest;
    let h = Math.floor(time/(1000*60*60));
    let m = Math.floor(time/(1000*60))%60;
    let s = Math.floor(time/(1000))%60;
    let r = "";
    if (h>0) r += " "+h+" hour";
    if (h>1) r += "s";
    if (m>0) r += " "+m+" minute";
    if (m>1) r += "s";
    if (s>0) r += " "+s+" second";
    if (s>1) r += "s";
    return r;
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function botup() {
    return "I've been up for"+timedifftostring(new Date().getTime(), loaded)+".";
}

function prettyNumber(n) {
    let s = n.toString();
    let final = "";
    for (let i=0;i<s.length;i++) {
        final += s[i];
        if (i%3===(s.length-1)%3 && i!=s.length-1) final += ".";
    }
    return final;
}


