var exports = module.exports = {};

const discord = require('discord.js');
const fs = require('fs');
const u = require('./currency.js');
const ut = require('./utils.js');
const common = process.env.COMMON_URL;
const url = common+process.env.URL1;
const url2 = common+process.env.URL2;
const url3 = common+process.env.URL3;

var taken = {}; //{"3405989": "example/url/pic.jpg"}, ..}
var opt = [];
var opt2 = [];
var opt3 = [];
load();
var lastsave = new Date().getTime(); 
var lastsleeppunishment = new Date().getTime(); 
var lastcuddledpunishment = new Date().getTime(); 
var lastfedpunishment = new Date().getTime(); 
var lastwealthpunishment = new Date().getTime(); 

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

exports.name = function(message) {
    return name(message);
}

exports.buy = function(message) {
    return buy(message);
}

exports.cuddle = function(message) {
    return cuddle(message);
}

exports.sleep = function(message) {
    return sleep(message);
}

exports.update = function(message) {
    return update(message);
}

exports.help = function() {
    return help();
}

exports.shop = function() {
    return buyembed();
}

function numtoscale(n) {
    return Math.floor(n/20)+"/5";
}

function resolvename(message) {
    if (taken[message.author.id.toString()].name !== "-")
        return taken[message.author.id.toString()].name;
    else
        return message.author.username+"'s waifu";
}

function buyembed() {
    const embed = new discord.RichEmbed()
    .setAuthor("~~ Waifu item shop ~~", "https://cdn.discordapp.com/avatars/456934877841981462/5a880bec4e424aab34fcf6f62cc8a363.png?size=128")
    .setColor("#FF0000")
    .setTitle("Here are the options:")
    .addField("book","25 "+u.currency(), true)
    .addField("movie","75 "+u.currency(), true)
    .addField("dress","150 "+u.currency(), true)
    .addField("jewels","180 "+u.currency(), true)
    .addField("veggies","15 "+u.currency(), true)
    .addField("fish","35 "+u.currency(), true)
    .addField("meat","40 "+u.currency(), true)
    .addField("chocolate","20 "+u.currency(), true)
    .addField("flowers","45 "+u.currency(), true);

    return {embed};
}

function help() {
    const embed = new discord.RichEmbed()
    .setAuthor("~~ You used the $waifu help command ~~", "https://cdn.discordapp.com/avatars/456934877841981462/5a880bec4e424aab34fcf6f62cc8a363.png?size=128")
    .setColor("#FF0000")
    .setTitle("Here's how it all works:")
    .addField("$waifu","Claim a random waifu for 5"+u.currency()+". Rerolling will make you lose all your progress!")
    .addField("$show waifu","Shows your waifu and her stats.")
    .addField("$name waifu","Give your waifu a name!")
    .addField("$sleep with waifu","Sleep with your waifu for 6h. Can't do other activities while asleep!")
	.addField("$pet waifu / $hug waifu / $kiss waifu","Show your waifu some love. 30 min cooldown!")
	.addField("$buy waifu","Buy items for your waifu. Feeding your waifu has a 3h cooldown!")
    .addField("$shop waifu","Check what you can buy for your waifu.");

    return {embed};
}

function update(message) {
    if (!taken[message.author.id.toString()]) return;

    let now = new Date().getTime();

    if (taken[message.author.id.toString()].happy<0) taken[message.author.id.toString()].happy=0;
    else if (taken[message.author.id.toString()].happy>100) taken[message.author.id.toString()].happy=100;

    if (taken[message.author.id.toString()].love<0) taken[message.author.id.toString()].love=0;
    else if (taken[message.author.id.toString()].love>100) taken[message.author.id.toString()].love=100;

    if (taken[message.author.id.toString()].wealth<0) taken[message.author.id.toString()].wealth=0;
    else if (taken[message.author.id.toString()].wealth>100) taken[message.author.id.toString()].wealth=100;

    if (taken[message.author.id.toString()].health<0) taken[message.author.id.toString()].health=0;
    else if (taken[message.author.id.toString()].health>100) taken[message.author.id.toString()].health=100;

    if (now-taken[message.author.id.toString()].lastsleep>=16*60*60*1000) { //havent slept for 16+ hours, every 30 min lower stats
        if (now-lastsleeppunishment>=30*60*1000) {
            taken[message.author.id.toString()].happy -= 1;
            taken[message.author.id.toString()].love -= 0.4;
            taken[message.author.id.toString()].health -= 0.4;
            lastsleeppunishment = now;
        }
    }

    if (now-taken[message.author.id.toString()].lastfed>=3*60*60*1000) { //havent eaten for 3+ hours, every 30 min lower stats
        if (now-lastfedpunishment>=30*60*1000) {
            taken[message.author.id.toString()].happy -= 0.25;
            taken[message.author.id.toString()].love -= 0.3;
            taken[message.author.id.toString()].health -= 0.4;
            lastfedpunishment = now;
        }
    }

    if (now-taken[message.author.id.toString()].lastcuddled>=1*60*60*1000) { //havent cuddled for 1+ hours, every 30 min lower stats
        if (now-lastcuddledpunishment>=30*60*1000) {
            taken[message.author.id.toString()].happy -= 0.25;
            taken[message.author.id.toString()].love -= 0.2;
            lastcuddledpunishment = now;
        }
    }

    if (now-lastwealthpunishment>=30*60*1000) { //lose wealth every 30 min
        taken[message.author.id.toString()].wealth -= 1;
        lastwealthpunishment = now;
    }

    if (now-lastsave>=5*60*1000) { //every 5 min
        save();
        lastsave = now;
    }
}

function name(message) { //$name waifu
    if (!taken[message.author.id.toString()])
        return message.author.username+" has not claimed a waifu yet. Use '$waifu'.";

    if (!message.content.includes("$name waifu "))
        return message.author.username+", usage is '$name waifu Name'.";

    let text = message.content.replace("$name waifu ","");

    if (text === "-") 
        return message.author.username+", you can't name your waifu that!";

    if (taken[message.author.id.toString()].name === "-" && text !== "-") {
        taken[message.author.id.toString()].name = text;
        taken[message.author.id.toString()].happy += 5;
        taken[message.author.id.toString()].love += 3;
    } else {
        taken[message.author.id.toString()].name = text;
    }
    return message.author.username+"'s waifu is now "+text+"!";
}

function sleep(message) { //$sleep with waifu
    if (!taken[message.author.id.toString()])
        return message.author.username+" has not claimed a waifu yet. Use '$waifu'.";

    let now = new Date().getTime();

    if (now-taken[message.author.id.toString()].lastsleep<6*60*60*1000) {
        let end = taken[message.author.id.toString()].lastsleep+6*60*60*1000;
        return resolvename(message)+" will still be asleep for"+ut.timediffstring(end,now)+"!";
    }

    taken[message.author.id.toString()].health += 10;
    taken[message.author.id.toString()].happy += 5;
    taken[message.author.id.toString()].love += 3;
    taken[message.author.id.toString()].lastsleep = now;
    return resolvename(message)+" is super happy to nap with "+message.author.username+"!";
}

function cuddle(message) { //pet hug kiss
    if (!taken[message.author.id.toString()])
        return message.author.username+" has not claimed a waifu yet. Use '$waifu'.";

    let now = new Date().getTime();

    if (now-taken[message.author.id.toString()].lastcuddled<1*60*60*1000) {
        let end = taken[message.author.id.toString()].lastcuddled+1*60*60*1000;
        return resolvename(message)+" thinks you're being too clingy! (wait"+ut.timediffstring(end,now)+")";
    }

    if (now-taken[message.author.id.toString()].lastsleep<6*60*60*1000) {
        let end = taken[message.author.id.toString()].lastsleep+6*60*60*1000;
        return resolvename(message)+" will still be asleep for"+ut.timediffstring(end,now)+"!";
    }

    switch (message.content) {
        case "$pet waifu":
            taken[message.author.id.toString()].happy += 1;
            taken[message.author.id.toString()].love += 0.2;
            taken[message.author.id.toString()].lastcuddled = now;
            return resolvename(message)+" likes being pet by "+message.author.username+"!";
        case "$hug waifu":
            taken[message.author.id.toString()].happy += 1.5;
            taken[message.author.id.toString()].love += 0.3;
            taken[message.author.id.toString()].lastcuddled = now;
            return resolvename(message)+" likes being hugged by "+message.author.username+"!";
        case "$kiss waifu":
            taken[message.author.id.toString()].happy += 2;
            taken[message.author.id.toString()].love += 0.4;
            taken[message.author.id.toString()].lastcuddled = now;
            return resolvename(message)+" likes being kissed by "+message.author.username+"!";
    }
}

function buy(message) { //$buy waifu
    if (!taken[message.author.id.toString()])
        return message.author.username+" has not claimed a waifu yet. Use '$waifu'.";

    if (new Date().getTime()-taken[message.author.id.toString()].lastsleep<6*60*60*1000) {
        let end = taken[message.author.id.toString()].lastsleep+6*60*60*1000;
        return resolvename(message)+" will still be asleep for"+ut.timediffstring(end,now)+"!";
    }

    if (!message.content.includes("$buy waifu "))
        return message.author.username+", usage is '$buy waifu item'. Use '$shop waifu' to see all the options.";
        
    let text = message.content.replace("$buy waifu ","");
    let now = new Date().getTime();

    switch (text) {
        case "book":
            if (!u.deductcurrency(message.author.id.toString(), 25)) {
                return message.author.username+" does not have enough "+u.currency();
            } else {
                taken[message.author.id.toString()].happy += 2;
                taken[message.author.id.toString()].love += 1;
                return resolvename(message)+" appreciates "+message.author.username+"'s book!";
            }
        case "movie":
            if (!u.deductcurrency(message.author.id.toString(), 75)) {
                return message.author.username+" does not have enough "+u.currency();
            } else {
                taken[message.author.id.toString()].happy += 3;
                taken[message.author.id.toString()].love += 1;
                return resolvename(message)+" appreciates "+message.author.username+"'s movie!";
            }
        case "dress":
            if (!u.deductcurrency(message.author.id.toString(), 150)) {
                return message.author.username+" does not have enough "+u.currency();
            } else {
                taken[message.author.id.toString()].happy += 4;
                taken[message.author.id.toString()].wealth += 5;
                taken[message.author.id.toString()].love += 2;
                return resolvename(message)+" feels great wearing "+message.author.username+"'s gift!";
            }
        case "jewels":
            if (!u.deductcurrency(message.author.id.toString(), 180)) {
                return message.author.username+" does not have enough "+u.currency();
            } else {
                taken[message.author.id.toString()].happy += 4;
                taken[message.author.id.toString()].wealth += 6;
                taken[message.author.id.toString()].love += 2;
                return resolvename(message)+" feels great wearing "+message.author.username+"'s gift!";
            }
        case "veggies":
            if (now-taken[message.author.id.toString()].lastfed<3*60*60*1000) {
                let end = taken[message.author.id.toString()].lastfed+3*60*60*1000;
                return resolvename(message)+" isn't hungry yet! (wait"+ut.timediffstring(end,now)+")";
            }
            else if (!u.deductcurrency(message.author.id.toString(), 15)) {
                return message.author.username+" does not have enough "+u.currency();
            } else {
                taken[message.author.id.toString()].health += 4;
                taken[message.author.id.toString()].love += 1;
                taken[message.author.id.toString()].lastfed = now;
                return resolvename(message)+" enjoys a healthy diet proposed by "+message.author.username+"!";
            }
        case "fish":
            if (now-taken[message.author.id.toString()].lastfed<3*60*60*1000) {
                let end = taken[message.author.id.toString()].lastfed+3*60*60*1000;
                return resolvename(message)+" isn't hungry yet! (wait"+ut.timediffstring(end,now)+")";
            }
            else if (!u.deductcurrency(message.author.id.toString(), 35)) {
                return message.author.username+" does not have enough "+u.currency();
            } else {
                taken[message.author.id.toString()].health += 3;
                taken[message.author.id.toString()].happy += 1;
                taken[message.author.id.toString()].love += 1;
                taken[message.author.id.toString()].lastfed = now;
                return resolvename(message)+" likes the fish dish made by "+message.author.username+"!";
            }
        case "meat":
            if (now-taken[message.author.id.toString()].lastfed<3*60*60*1000) {
                let end = taken[message.author.id.toString()].lastfed+3*60*60*1000;
                return resolvename(message)+" isn't hungry yet! (wait"+ut.timediffstring(end,now)+")";
            }
            else if (!u.deductcurrency(message.author.id.toString(), 40)) {
                return message.author.username+" does not have enough "+u.currency();
            } else {
                taken[message.author.id.toString()].health += 2;
                taken[message.author.id.toString()].happy += 2;
                taken[message.author.id.toString()].love += 1;
                taken[message.author.id.toString()].lastfed = now;
                return resolvename(message)+" loves the meat dish cooked by "+message.author.username+"!";
            }
        case "chocolate":
            if (!u.deductcurrency(message.author.id.toString(), 20)) {
                return message.author.username+" does not have enough "+u.currency();
            } else {
                taken[message.author.id.toString()].health -= 1;
                taken[message.author.id.toString()].happy += 4;
                taken[message.author.id.toString()].love += 1;
                return resolvename(message)+" happily eats "+message.author.username+"'s chocolate box!";
            }
        case "flowers":
            if (!u.deductcurrency(message.author.id.toString(), 45)) {
                return message.author.username+" does not have enough "+u.currency();
            } else {
                taken[message.author.id.toString()].happy += 2;
                taken[message.author.id.toString()].love += 2;
                return resolvename(message)+" loves "+message.author.username+"'s flowers!";
            }
        default:
            return message.author.username+", the shop doesn't have that. Use '$shop waifu'.";
    
    }
    
}

function show(message) {
        if (!message.channel.nsfw) {
            return "Please only use '$show waifu' in nsfw rooms!";
        }
        else if (!taken[message.author.id.toString()])
            return message.author.username+" has not claimed a waifu yet. Use '$waifu'.";
        else {

            let n = taken[message.author.id.toString()].name;
            let he = numtoscale(taken[message.author.id.toString()].health);
            let ha = numtoscale(taken[message.author.id.toString()].happy);
            let l = numtoscale(taken[message.author.id.toString()].love);
            let w = numtoscale(taken[message.author.id.toString()].wealth);

            const embed = new discord.RichEmbed()
            .setColor('#FF0000')
            .setFooter(message.author.username+"'s waifu", message.author.avatarURL)
            .setImage("attachment://image.png")
            .addField("Name", n)
            .addField("Health ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ Happy", he+" ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ "+ha)
            .addField("Love ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ Wealth", l+" ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ "+w);      
    
            let link;
            if (taken[message.author.id.toString()].folder == "url1") {
                link = url+taken[message.author.id.toString()].pic;
            } else if (taken[message.author.id.toString()].folder == "url2") {
                link = url2+taken[message.author.id.toString()].pic;
            } else {
                link = url3+taken[message.author.id.toString()].pic;
            }
    
            return {embed, files: [{ attachment: link, name: 'image.png' }]};
        }
}

function waifu(message) {
    if (!message.channel.nsfw) {
        return "Please only use '$waifu' in nsfw rooms!";
    } else if (!u.deductcurrency(message.author.id.toString(), 5)) {
        return message.author.username+" does not have enough "+u.currency()+" to roll a new waifu!";
    } else {
        let choice = random(opt);

        if (choice.includes(url)) 
            taken[message.author.id.toString()] = newwaifu("url1", choice.replace(url,""));
        else if (choice.includes(url2)) 
            taken[message.author.id.toString()] = newwaifu("url2", choice.replace(url2,""));
        else
            taken[message.author.id.toString()] = newwaifu("url3", choice.replace(url3,""));

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

function newwaifu(folder,pic) {
    return {folder: folder, pic: pic, name: "-", health: 60, love: 60, happy: 60, wealth: 60, lastsleep: 1, lastcuddled: 1, lastfed: 1};
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
