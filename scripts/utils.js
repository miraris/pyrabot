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

exports.botup = function() {
    return botup();
}

exports.bothelp = function() {
    return help();
}

exports.prettynumber = function(n) {
    return prettyNumber(n);
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
    if (message.author.id==process.env.OWNER_ID) {
        let text = message.content.replace("$secret-eval ","");
        return eval(text);
    }
    else return "You're not "+process.env.OWNER+".";
}

function help() {
    const embed = new discord.RichEmbed()
    .setAuthor("~~ You used the $help command ~~", "https://cdn.discordapp.com/avatars/456934877841981462/5a880bec4e424aab34fcf6f62cc8a363.png?size=128")
    .setColor("#FF0000")
    .setTitle("Here's what I can do for now:")
    .addField("$talk / $words","Related to responses based on what I've learned from others.")
    .addField("$waifu / $show waifu","Claim a random waifu and show her to everyone. $waifu costs 5"+u.currency())
    .addField("$money / $gamble / $gift / $top","Money related stuff. You earn it from chatting. Spamming won't help!")
    .addField("$time","How long I've been up for.");

    return {embed};
}

function botup() {
    let time = new Date().getTime()-loaded;
    let h = Math.floor(time/(1000*60*60));
    let m = Math.floor(time/(1000*60))%60;
    let s = Math.floor(time/(1000))%60;
    let r = "I've been up for";
    if (h>0) r += " "+h+" hour";
    if (h>1) r += "s";
    if (m>0) r += " "+m+" minute";
    if (m>1) r += "s";
    if (s>0) r += " "+s+" second";
    if (s>1) r += "s";
    return r+".";
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


