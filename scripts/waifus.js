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

exports.top = function(message) {
    return top(message);
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

function resolvenameF(message) {
    if (taken[message.author.id.toString()].name !== "-")
        return taken[message.author.id.toString()].name;
    else
        return "Your waifu";
}

function resolvenamef(message) {
    if (taken[message.author.id.toString()].name !== "-")
        return taken[message.author.id.toString()].name;
    else
        return "your waifu";
}

function resolvenametop(id, name) {
    if (taken[id].name !== "-")
        return name+"'s "+taken[id].name;
    else
        return name+"'s waifu";
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
    .addField("$sleep with waifu","Sleep with your waifu for 2h. Can't do other activities while asleep!")
	.addField("$pet waifu / $hug waifu / $kiss waifu","Show your waifu some love. 15 min cooldown!")
	.addField("$buy waifu","Buy items for your waifu. Feeding your waifu has a 1h cooldown!")
    .addField("$shop waifu","Check what you can buy for your waifu.")
    .addField("$top waifus","Waifu leaderboard!");

    return {embed};
}

function top(message) {
    let keys = Object.keys(taken);
    let array = [];
    for (let i=0;i<keys.length;i++) {
        let total = Math.floor(taken[keys[i]].health/20) + 
                    Math.floor(taken[keys[i]].wealth/20) + 
                    Math.floor(taken[keys[i]].happy/20) + 
                    Math.floor(taken[keys[i]].love/20);
        array.push({id: keys[i], amt: total});
    }
    if (array.length==0) {
        return "But there was nobody...";
    } else {
        array = array.sort(function(a,b) {
            return b.amt - a.amt;
        });

        const embed = new discord.RichEmbed()
        .setAuthor("~~ The best waifus! ~~", "https://cdn.discordapp.com/avatars/456934877841981462/5a880bec4e424aab34fcf6f62cc8a363.png?size=128")
        .setColor("#FF0000")
        .setTitle("Here are the most beloved waifus:");

        let index = 1;

        for (let i=0;i<array.length;i++) {
            if (i==10) break;
            let member = message.guild.members.find("id", array[i].id.toString())
            if (member!=null) {
                let name = member.user.username;
                embed.addField(index+" - "+resolvenametop(array[i].id, name),array[i].amt+"/20 ★", true);
                index++;
            }
        }
        
        return {embed};
    }
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

    if (now-taken[message.author.id.toString()].lastsleep>=8*60*60*1000) { //havent slept for 8+ hours, every 30 min lower stats
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

    if (now-taken[message.author.id.toString()].lastcuddled>=1*60*60*1000) { //havent cuddled for 1+ hour, every 30 min lower stats
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

    if (now-taken[message.author.id.toString()].lastsleep<2*60*60*1000) {
        let end = taken[message.author.id.toString()].lastsleep+2*60*60*1000;
        return sleepingtext(message)+" (wait"+ut.timediffstring(end,now)+")";
    }

    taken[message.author.id.toString()].health += 10;
    taken[message.author.id.toString()].happy += 5;
    taken[message.author.id.toString()].love += 3;
    taken[message.author.id.toString()].lastsleep = now;
    return sleeptext(message);
}

function cuddle(message) { //pet hug kiss
    if (!taken[message.author.id.toString()])
        return message.author.username+" has not claimed a waifu yet. Use '$waifu'.";

    let now = new Date().getTime();

    if (now-taken[message.author.id.toString()].lastcuddled<15*60*1000) {
        let end = taken[message.author.id.toString()].lastcuddled+15*60*1000;
        return clingytext(message)+" (wait"+ut.timediffstring(end,now)+")";
    }

    if (now-taken[message.author.id.toString()].lastsleep<2*60*60*1000) {
        let end = taken[message.author.id.toString()].lastsleep+2*60*60*1000;
        return sleepingtext(message)+" (wait"+ut.timediffstring(end,now)+")";
    }

    switch (message.content) {
        case "$pet waifu":
            taken[message.author.id.toString()].happy += 1;
            taken[message.author.id.toString()].love += 0.2;
            taken[message.author.id.toString()].lastcuddled = now;
            return pettext(message);
        case "$hug waifu":
            taken[message.author.id.toString()].happy += 1.5;
            taken[message.author.id.toString()].love += 0.3;
            taken[message.author.id.toString()].lastcuddled = now;
            return hugtext(message);
        case "$kiss waifu":
            taken[message.author.id.toString()].happy += 2;
            taken[message.author.id.toString()].love += 0.4;
            taken[message.author.id.toString()].lastcuddled = now;
            return kisstext(message);
    }
}

function buy(message) { //$buy waifu
    if (!taken[message.author.id.toString()])
        return message.author.username+" has not claimed a waifu yet. Use '$waifu'.";

	let now = new Date().getTime();
	
    if (now-taken[message.author.id.toString()].lastsleep<2*60*60*1000) {
        let end = taken[message.author.id.toString()].lastsleep+2*60*60*1000;
        return sleepingtext(message)+" (wait"+ut.timediffstring(end,now)+")";
    }

    if (!message.content.includes("$buy waifu "))
        return message.author.username+", usage is '$buy waifu item'. Use '$shop waifu' to see all the options.";
        
    let text = message.content.replace("$buy waifu ","");

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
            if (now-taken[message.author.id.toString()].lastfed<1*60*60*1000) {
                let end = taken[message.author.id.toString()].lastfed+1*60*60*1000;
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
            if (now-taken[message.author.id.toString()].lastfed<1*60*60*1000) {
                let end = taken[message.author.id.toString()].lastfed+1*60*60*1000;
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
            if (now-taken[message.author.id.toString()].lastfed<1*60*60*1000) {
                let end = taken[message.author.id.toString()].lastfed+1*60*60*1000;
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

            let now = new Date().getTime(); 

            let status;

            if (now-taken[message.author.id.toString()].lastsleep<2*60*60*1000)
                status = "Sleeping...";
            else if (now-taken[message.author.id.toString()].lastfed>=3*60*60*1000)
                status = "Very hungry";
            else if (now-taken[message.author.id.toString()].lastcuddled>=1*60*60*1000)
                status = "In need of affection";
            else if (now-taken[message.author.id.toString()].lastsleep>=8*60*60*1000)
                status = "Extremely tired";
            else if (now-taken[message.author.id.toString()].lastcuddled<15*60*1000)
                status = "Feeling loved";
            else if (now-taken[message.author.id.toString()].lastfed<1*60*60*1000)
                status = "Belly full";
            else if (taken[message.author.id.toString()].health<40)
                status = "Feeling unwell";
            else if (taken[message.author.id.toString()].wealth<40)
                status = "Embarassed to be so poor";
            else if (taken[message.author.id.toString()].love<40)
                status = "Cold and empty";
            else if (taken[message.author.id.toString()].happy<40)
                status = "Very unhappy";
            else
                status = "Doing hobbies";

            const embed = new discord.RichEmbed()
            .setColor('#FF0000')
            .setFooter(message.author.username+"'s waifu", message.author.avatarURL)
            .setImage("attachment://image.png")
            .addField("Name", n)
            .addField("Health ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ Happy", he+" ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ "+ha)
            .addField("Love ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ Wealth", l+" ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ "+w)
            .addField("Status",status);      
    
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

function kisstext(message) {
    let a = ["You give "+resolvenamef(message)+" a little peck on the cheek. She seems content with it.",
            "You kiss "+resolvenamef(message)+" right on the cheek out of nowhere. She blushes a little.",
            resolvenameF(message)+" is being her usual self, doesn't that deserve a kiss? It looks like she appreciates the thought.",
            "You lean in to french kiss "+resolvenamef(message)+", but you decide against it since you're in public, turning it into a quick kiss on the lips. "];

    return random(a);
}

function hugtext(message) {
    let a = ["You come and hug "+resolvenamef(message)+" from behind. She's a bit surprised, but appreciative nonetheless.",
            "You catch "+resolvenamef(message)+" relaxing and sit down next to her, soon enough pulling her into a hug. She's having a good time!",
            resolvenameF(message)+" edges close to you, and you acknowledge her presence with a good old tight hug. Looks like that's what she wanted.",
            "Oof! You're surprised by a sudden push. "+resolvenameF(message)+" jumped at you to get a hug on her own terms. She looks more relaxed now."];

    return random(a);
}

function pettext(message) {
    let a = ["You gently caress "+resolvenamef(message)+"'s scalp. She hides her face a little, but it's obvious to see she likes it.",
            "You run your hand through "+resolvenamef(message)+"'s hair and fix it a little bit. She looks even prettier now!",
            "You pat "+resolvenamef(message)+"'s head delicately, trying to not ruffle her beautiful hair.",
            "You decide to tease "+resolvenamef(message)+" by playing a little with her ear, but that's mean, so you make up for it with a little headpat to appease her."];

    return random(a);
}

function sleeptext(message) {
    let a = ["You head to bed and "+resolvenamef(message)+" follows up to keep you company and cuddle up all night. See you later!",
            resolvenameF(message)+" drags herself into bed for some refreshing rest, she'll be back later. Sleep tight, "+resolvenamef(message)+"!",
            resolvenameF(message)+" grabs your hand and asks to go sleep with you, how can you say no to that face? Rest well!",
            resolvenameF(message)+" crashes on your bed, just waiting for you to join her before she starts sleeping. Don't make her wait!"];

    return random(a); 
}

function clingytext(message) {
    let a = ["It looks like "+resolvenamef(message)+" doesn't feel like a public display of affection right now. Give her some space.",
            "Mmh... "+resolvenamef(message)+" seems busy. It looks like trying to be affectionate is just going to disturb her. Leave her be for now.",
            "You lean in to cuddle "+resolvenamef(message)+" a little, but she pushes you away gently. Guess she's not up for that right now.",
            "You go up to "+resolvenamef(message)+" but she softly voices to you she thinks you're being too clingy. Maybe you shouldn't be too push."];

    return random(a); 
}

function sleepingtext(message) {
    let a = ["Sssshh... "+resolvenamef(message)+" looks really cute when she sleeps. Let's not disturb her.",
            "It looks like "+resolvenamef(message)+" is having a good dream. Let's back away quietly.",
            resolvenameF(message)+" is still resting, looking really comfortable. Come back later!",
            resolvenameF(message)+"'s eyes flutter, she twitches a little, whispers a word, but she's sound asleep nonetheless. Let her sleep some more."];

    return random(a);     
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
