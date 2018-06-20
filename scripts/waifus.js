var exports = module.exports = {};

const discord = require('discord.js');
const fs = require('fs');
const u = require('./currency.js');
const common = process.env.COMMON_URL;
const url = common+process.env.URL1;
const url2 = common+process.env.URL2;
const url3 = common+process.env.URL3;

var taken = {}; //{"3405989": {pic: x.jpg, rolls: 10}, ..}
var opt = [];
var opt2 = [];
var opt3 = [];
load(); 

console.log("Waifus: loading.");

exports.waifu = function(message) {
    return waifu(message);
}

exports.show = function(message) {
    return show(message);
}

exports.save = function() {
    return save();
}

function waifu(message) {
    if (!message.channel.nsfw) {
        return "Please only use '$waifu' in nsfw rooms!";
    } else if (!u.deductcurrency(message.author.id.toString(), 5)) {
        return message.author.username+" does not have enough "+u.currency()+" to roll a new waifu!";
    } else {
        let choice = random(opt);
        taken[message.author.id.toString()] = choice;
        for (let x=0;x<opt.length;x++) {
            if (opt[x] == choice) opt.splice(x,1);
        }
        save();

        const embed = new discord.RichEmbed()
        .setColor('#FF0000')
        .setFooter(message.author.username+" has rolled this waifu!", message.author.avatarURL)
        .setImage("attachment://image.png");

        return {embed, files: [{ attachment: choice, name: 'image.png' }]};
    }
}

function show(message) {
    if (!message.channel.name.startsWith("nsfw-")) {
        return "Please only use '$show waifu' in nsfw rooms!";
    }
    else if (!taken[message.author.id.toString()])
        return message.author.username+" has not claimed a waifu yet. Use '$waifu'.";
    else {
        const embed = new discord.RichEmbed()
        .setColor('#FF0000')
        .setFooter(message.author.username+"'s waifu", message.author.avatarURL)
        .setImage("attachment://image.png");

        return {embed, files: [{ attachment: taken[message.author.id.toString()], name: 'image.png' }]};
    }
}

function save() {
    fs.writeFileSync('scripts/waifus/data.txt', JSON.stringify(taken));
}

function load() {
    let n = fs.readFileSync('scripts/waifus/data.txt', 'latin1');
    if (n.length!=0) {
        taken = JSON.parse(n);
    }

    fs.readdirSync(url).forEach(file => {
        if (!file.includes("nsfw") && !pictaken(file)) opt.push(url+file);
    });
    fs.readdirSync(url2).forEach(file => {
        if (!file.includes("nsfw") && !pictaken(file)) opt.push(url2+file);
    });
    fs.readdirSync(url3).forEach(file => {
        if (!file.includes("nsfw") && !pictaken(file)) opt.push(url3+file);
    });
}

function pictaken(file) {
    let array = Object.keys(taken);
    for (let i=0;i<array.length;i++) {
        if (taken[array[i]] == file) return true;
    }
    return false;
}

function random(arr) {
    return arr[Math.floor(Math.random() * ((arr.length-1)))];
}