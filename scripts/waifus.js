var exports = module.exports = {};

const discord = require("discord.js");
const fs = require("fs");
const u = require("./currency");
const h = require("./helpers");
const p = process.env.COMMAND;
const common = process.env.COMMON_URL;
const url = common+process.env.URL1;
const url2 = common+process.env.URL2;
const url3 = common+process.env.URL3;

var taken = {};
var opt = [];
var opt2 = [];
var opt3 = [];
load();

var lastsave = new Date().getTime(); 
var lastsleeppunishment = new Date().getTime(); 
var lastcuddledpunishment = new Date().getTime(); 
var lastfedpunishment = new Date().getTime(); 
var lastwealthpunishment = new Date().getTime(); 

const sleepduration = 2*60*60*1000;
const sleeppenalty = 8*60*60*1000;
const foodpenalty = 3*60*60*1000;
const cuddlepenalty = 60*60*1000;
const jogcooldown = 60*60*1000;
const foodcooldown = 1*60*60*1000;
const cuddlecooldown = 15*60*1000;
const traitcooldown = 3*60*1000;

console.log("Waifus: loading.");

const numtoscale = (n) => Math.floor(n/20)+"/5";

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
        .addField("flowers","45 "+u.currency(), true)
        .addField("energy drink","50 "+u.currency(), true)
        .addField("game","100 "+u.currency(), true)
        .addField("phone","400 "+u.currency(), true)
        .addField("crown","100 "+u.currency(), true)
        .addField("sketch pad","200 "+u.currency(), true)
        .addField("plush","50 "+u.currency(), true)

    return {embed};
}

function help() {
    const embed = new discord.RichEmbed()
        .setAuthor("~~ You used the "+p+"waifu help command ~~", "https://cdn.discordapp.com/avatars/456934877841981462/5a880bec4e424aab34fcf6f62cc8a363.png?size=128")
        .setColor("#FF0000")
        .setTitle("Here's how it all works:")
        .addField(p+"waifu","Claim a random waifu for 5"+u.currency()+". Rerolling will make you lose all your progress!")
        .addField(p+"show waifu / "+p+"quick show waifu","Shows your waifu and her stats.")
        .addField(p+"name waifu","Give your waifu a name!")
        .addField(p+"waifu game / "+p+"do","Play a game with your waifu!")
        .addField(p+"class waifu","Assign your waifu a class! Requires a minimum of 18 ★.")
        .addField(p+"sleep with waifu / "+p+"sleep waifu","Sleep with your waifu for 2h. Can't do other activities while asleep!")
        .addField(p+"jog with waifu / "+p+"jog waifu","Do some exercise with your waifu. 1h cooldown!")
        .addField(p+"pet waifu / "+p+"hug waifu / "+p+"kiss waifu","Show your waifu some love. 15 min cooldown!")
        .addField(p+"buy waifu","Buy items for your waifu. Feeding your waifu has a 1h cooldown!")
        .addField(p+"trait waifu","Pick a trait for your waifu. Traits affect stat changes.")
        .addField(p+"shop waifu","Check what you can buy for your waifu.")
        .addField(p+"top waifus","Waifu leaderboard!");

    return {embed};
}

function top(message) {
    let keys = Object.keys(taken);
    let array = [];
    for (let i=0;i<keys.length;i++) {
        let total = Math.floor(taken[keys[i]].health/20) + 
                    Math.floor(taken[keys[i]].wealth/20) + 
                    Math.floor(taken[keys[i]].happy/20) + 
                    Math.floor(taken[keys[i]].smart/20) + 
                    Math.floor(taken[keys[i]].fit/20) + 
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
            if (index==10) break;
            let member = message.guild.members.find("id", array[i].id.toString())
            if (member!=null) {
                let name = member.user.username;
                embed.addField(index+" - "+resolvenametop(array[i].id, name),array[i].amt+"/30 ★", true);
                index++;
            }
        }
        
        return {embed};
    }
}

function update(message) {
    if (!taken[message.author.id.toString()]) return;

    let now = new Date().getTime();

    applytrait(message.author.id.toString());

    if (taken[message.author.id.toString()].happy<0) taken[message.author.id.toString()].happy=0;
    else if (taken[message.author.id.toString()].happy>105) taken[message.author.id.toString()].happy=105;

    if (taken[message.author.id.toString()].love<0) taken[message.author.id.toString()].love=0;
    else if (taken[message.author.id.toString()].love>105) taken[message.author.id.toString()].love=105;

    if (taken[message.author.id.toString()].wealth<0) taken[message.author.id.toString()].wealth=0;
    else if (taken[message.author.id.toString()].wealth>105) taken[message.author.id.toString()].wealth=105;

    if (taken[message.author.id.toString()].health<0) taken[message.author.id.toString()].health=0;
    else if (taken[message.author.id.toString()].health>105) taken[message.author.id.toString()].health=105;

    if (taken[message.author.id.toString()].fit<0) taken[message.author.id.toString()].fit=0;
    else if (taken[message.author.id.toString()].fit>105) taken[message.author.id.toString()].fit=105;

    if (taken[message.author.id.toString()].smart<0) taken[message.author.id.toString()].smart=0;
    else if (taken[message.author.id.toString()].smart>105) taken[message.author.id.toString()].smart=105;

    if (now-taken[message.author.id.toString()].lastsleep>=sleeppenalty) { //havent slept for 8+ hours, every 30 min lower stats
        if (now-lastsleeppunishment>=30*60*1000) {
            taken[message.author.id.toString()].happy -= 1;
            taken[message.author.id.toString()].love -= 0.4;
            taken[message.author.id.toString()].health -= 0.4;
            lastsleeppunishment = now;
        }
    }

    if (now-taken[message.author.id.toString()].lastfed>=foodpenalty) { //havent eaten for 3+ hours, every 30 min lower stats
        if (now-lastfedpunishment>=30*60*1000) {
            taken[message.author.id.toString()].happy -= 0.25;
            taken[message.author.id.toString()].love -= 0.3;
            taken[message.author.id.toString()].health -= 0.4;
            lastfedpunishment = now;
        }
    }

    if (now-taken[message.author.id.toString()].lastcuddled>=cuddlepenalty) { //havent cuddled for 1+ hour, every 30 min lower stats
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
        return message.author.username+" has not claimed a waifu yet. Use '"+p+"waifu'.";

    if (!message.content.includes(p+"name waifu "))
        return message.author.username+", usage is '"+p+"name waifu Name'.";

    let text = message.content.replace(p+"name waifu ","");

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

function applytrait(id) {
    let now = new Date().getTime();

    if (now-taken[id].lasttraitchange<traitcooldown) return;

    switch (taken[id].trait) {
    case "Calm":
        taken[id].health += 0.1;
        taken[id].happy += 0.1;
        taken[id].fit -= 0.1;
        break;
    case "Loyal":
        taken[id].love *= 1.005;
        taken[id].happy *= 1.005;
        taken[id].smart -= 0.1;
        taken[id].health -= 0.2;
        break;
    case "Curious":
        taken[id].smart += 0.15;
        taken[id].happy += 0.1;
        taken[id].wealth -= 0.1;
        break;
    case "Valiant":
        taken[id].smart += 0.1;
        taken[id].fit += 0.1;
        taken[id].happy -= 0.05;
        taken[id].love -= 0.05;
        break;
    case "Serious":
        taken[id].smart += 0.2;
        taken[id].happy -= 0.05;
        taken[id].love -= 0.05;
        break;
    case "Leader":
        taken[id].smart += 0.15;
        taken[id].fit += 0.05;
        taken[id].love -= 0.05;
        break;
    case "Wild":
        taken[id].fit += 0.1;
        taken[id].happy += 0.1;
        taken[id].love += 0.05;
        taken[id].health -= 0.1;
        break;
    case "Playful":
        taken[id].fit += 0.1;
        taken[id].happy += 0.15;
        taken[id].love += 0.05;
        taken[id].health -= 0.05;
        taken[id].wealth -= 0.15;    
        break;
    case "Careful":
        taken[id].happy -= 0.1;
        taken[id].health += 0.1;
        taken[id].wealth += 0.1;    
        break;
    case "Evil":
        taken[id].happy -= 0.2;
        taken[id].wealth += 0.4;    
        break;   
    case "Doting":
        taken[id].happy -= 0.2;
        taken[id].love += 0.4;    
        break;  
    case "Charming":
        taken[id].fit += 0.2;
        taken[id].smart += 0.2;
        taken[id].love -= 0.2;
        break; 
    case "Vengeful":
        taken[id].happy -= 0.2;
        taken[id].love -= 0.2;
        taken[id].health -= 0.1;
        taken[id].wealth += 0.5;
        taken[id].smart += 0.4;
        break;  
    case "Volatile":
        taken[id].fit += 0.4;
        taken[id].love -= 0.1;
        taken[id].health -= 0.1;
        break;  
    case "Determined":
        taken[id].fit += 0.2;
        taken[id].love += 0.2;
        taken[id].health -= 0.2;
        break;  
    }

    taken[id].lasttraitchange = now;
}

/**
 * Get tier for a waifu class
 *
 * @param {string} cl
 * @returns {string} tier
 */
function getClassTier(cl) {
    switch (cl) {
        case "Worldshaper": return "(Tier S)";
        case "Soul Devourer": return "(Tier S)";
        case "Ethereal": return "(Tier S)";
        case "Prodigy": return "(Tier B+)";
        case "Goddess": return "(Tier A)";
        case "Demoness": return "(Tier A)";
        case "Myth": return "(Tier A)";
        case "Angel": return "(Tier B+)";
        case "Dark Angel": return "(Tier B+)";
        case "Assassin": return "(Tier B)";
        case "Yandere": return "(Tier B)";
        case "Reaper": return "(Tier B)";
        case "Succubus": return "(Tier B)";
        case "Magical Girl": return "(Tier B)";
        case "Cursed Girl": return "(Tier B)";
        case "Scientist": return "(Tier C+)";
        case "Mage": return "(Tier C+)";
        case "Necromancer": return "(Tier C+)";
        case "Cheerleader": return "(Tier C+)";
        case "Warrior": return "(Tier B)";
        case "Knight": return "(Tier B)";
        case "Athlete": return "(Tier C+)";
        case "Dreamer": return "(Tier C+)";
        case "Cupid": return "(Tier C+)";
        case "Eternal": return "(Tier C+)";
        case "Queen": return "(Tier C+)";
        case "Alchemist": return "(Tier C+)";
        case "Commander": return "(Tier C+)";
        case "Mercenary": return "(Tier C+)";
        case "Adventurer": return "(Tier C)";
        case "Pet": return "(Tier C)";
        default: return "(?)";
    }
}

/**
 * Get list of available classes for waifu
 *
 * @param {object} id
 * @returns {string[]} string array
 */
function getClassChoices(id) {
    let o = taken[id];
    let res = [];

    if (o.health>=90 && o.wealth>=90 && o.love>=90 && o.happy>=90 && o.smart>=50 && o.fit>=50) 
        res.push("Prodigy");

    if (o.health>=100 && o.wealth>=100 && o.love>=100 && o.happy>=100 && o.smart>=80 && o.fit>=80
        && (o.trait=="Calm" || o.trait=="Loyal" || o.trait=="Playful" || o.trait=="Charming"
            || o.trait=="Determined"))
        res.push("Goddess");
    
    if (o.health>=100 && o.wealth>=100 && o.love>=100 && o.happy>=100 && o.smart>=80 && o.fit>=80
        && (o.trait=="Evil" || o.trait=="Serious" || o.trait=="Leader" || o.trait=="Wild"
            || o.trait=="Vengeful"))
        res.push("Demoness");
    
    if (o.health>=100 && o.wealth>=100 && o.love>=100 && o.happy>=100 && o.smart>=80 && o.fit>=80
		&& (o.trait=="Curious" || o.trait=="Valiant" || o.trait=="Careful" || o.trait=="Doting"
			|| o.trait=="Charming" || o.trait=="None" || o.trait=="Volatile"))
        res.push("Myth");

    if (o.fit>=40 && o.love>=80 && (o.trait=="Calm" || o.trait=="Valiant" || o.trait=="Charming"))
        res.push("Angel");

    if (o.fit>=40 && o.love>=80 && (o.trait=="Evil" || o.trait=="Serious" || o.trait=="Vengeful"))
        res.push("Dark Angel");

    if (o.fit>=50 && o.health>=85 && (o.trait=="Calm" || o.trait=="Serious" || o.trait=="Careful"))
        res.push("Assassin");

    if (o.fit>=50 && o.health>=85 && 
        (o.trait=="Doting" || o.trait=="Charming" || o.trait=="Playful" || o.trait=="Loyal"
            || o.trait=="Vengeful" || o.trait=="Volatile"))
        res.push("Yandere");

    if (o.fit>=50 && o.health>=85 && o.smart>=50 && 
        (o.trait=="Calm" || o.trait=="Serious" || o.trait=="Evil" || o.trait=="Vengeful"))
        res.push("Reaper");

    if (o.love>=90 && o.happy>=85 && o.smart>=50 && o.fit>=50 &&
        (o.trait=="Charming" || o.trait=="Wild" || o.trait=="Playful" || o.trait=="Evil"
            || o.trait=="Volatile"))
        res.push("Succubus");

    if (o.love>=90 && o.happy>=90 && 
        (o.trait=="Loyal" || o.trait=="Curious" || o.trait=="Valiant" || o.trait=="None"
            || o.trait=="Determined"))
        res.push("Magical Girl");
    
    if (o.love>=90 && o.smart>=60 && 
        (o.trait=="Careful" || o.trait=="Serious" || o.trait=="Evil" || o.trait=="None"
            || o.trait=="Volatile"))
        res.push("Cursed Girl");    

    if (o.wealth>=90 && o.smart>=40 && 
        (o.trait=="Curious" || o.trait=="Serious" || o.trait=="Wild" || o.trait=="None"
            || o.trait=="Determined"))
        res.push("Scientist");    

    if (o.wealth>=80 && o.smart>=30 && o.fit>=30 &&
        o.trait!="Wild" && o.trait!="Serious" && o.trait!="Evil")
        res.push("Mage");  

    if (o.wealth>=80 && o.smart>=30 && o.fit>=30 &&
        (o.trait=="Wild" || o.trait=="Serious" || o.trait=="Evil"))
        res.push("Necromancer");  

    if (o.happy>=100 &&
        (o.trait=="Loyal" || o.trait=="Wild" || o.trait=="Playful" || o.trait=="None" 
            || o.trait=="Determined"))
        res.push("Cheerleader"); 

    if (o.health>=85 && o.fit>=40)
        res.push("Warrior");
    
    if (o.health>=90 && o.fit>=45 &&
        (o.trait=="Valiant" || o.trait=="Wild" || o.trait=="Loyal" || o.trait=="Determined"))
        res.push("Knight");
        
    if (o.fit>=80)
        res.push("Athlete");
        
    if (o.love>=100)
        res.push("Dreamer");
    
    if (o.love>=90 &&
        (o.trait=="Charming" || o.trait=="Doting" || o.trait=="Wild" || o.trait=="Playful"))
        res.push("Cupid");
        
    if (o.health>=100)
        res.push("Eternal");
        
    if (o.wealth>=100 &&
        (o.trait=="Leader" || o.trait=="Serious" || o.trait=="Calm" || o.trait=="Vengeful"))
        res.push("Queen");
        
    if (o.smart>=80 &&
        (o.trait=="Curious" || o.trait=="Wild" || o.trait=="Playful" || o.trait=="Evil"))
        res.push("Alchemist"); 

    if (o.fit>=45 && o.health>=90 &&
        (o.trait=="Serious" || o.trait=="Leader" || o.trait=="Determined"))
        res.push("Commander"); 

    if (o.health>=90 && o.fit>=45 &&
        (o.trait=="Calm" || o.trait=="Careful" || o.trait=="Evil" || o.trait=="Vengeful"))
        res.push("Mercenary"); 

    if (o.fit>=60 && o.happy>=85 &&
        (o.trait=="Valiant" || o.trait=="Curious" || o.trait=="None" || o.trait=="Volatile"))
        res.push("Adventurer"); 

    res.push("Pet");

    return res;
}

/**
 * Builds class options embed ($class waifu)
 *
 * @param {string[]} options
 * @param {object} message
 * @returns {object} embed
 */
function classesembed(options, message) {
    const embed = new discord.RichEmbed()
    .setAuthor("~~ Class options ~~", "https://cdn.discordapp.com/avatars/456934877841981462/5a880bec4e424aab34fcf6f62cc8a363.png?size=128")
    .setColor("#FF0000")
    .setFooter(message.author.username+"'s waifu", message.author.avatarURL)
    .setTitle("Here are the available classes for "+resolvenamef(message)+":");
    let str = "";
    for (let i=0;i<options.length;i++) {
        str += "• "+options[i]+" "+"\n";
    }
    embed.addField("­",str, true);

    return {embed};
}

/**
 * Waifu class command ($class waifu)
 *
 * @param {object} message
 * @returns {string} string
 */
function classes(message) {
    const uid = message.author.id.toString();

    if (!taken[uid]) return `${message.author.username} has not claimed a waifu yet. Use '"+p+"waifu'.`;

    let options = getClassChoices(uid);

    let total = Math.floor(taken[uid].health/20) + 
        Math.floor(taken[uid].wealth/20) + 
            Math.floor(taken[uid].happy/20) + 
                Math.floor(taken[uid].smart/20) + 
                    Math.floor(taken[uid].fit/20) + 
                        Math.floor(taken[uid].love/20);

    if (total<18) return message.author.username+", "+resolvenamef(message)+" requires at least 18 ★ to be assigned a class (currently at "+total+" ★).";

    if (!message.content.includes(p+"class waifu ")) return classesembed(options, message);

    const text = message.content.replace(p+"class waifu ", "").toLowerCase();
    
    for (let x=0;x<options.length;x++) {
        if (options[x].toLowerCase()===text) {
            taken[uid].cl = options[x];
            return message.author.username+", "+resolvenamef(message)+"'s class is now "+options[x]+"!";
        }
    }

    return classesembed(options, message);
}

/**
 * Builds trait options embed ($trait waifu)
 *
 * @param {string[]} options
 * @param {object} message
 * @returns {object} embed
 */
function traitsembed(traits) {
    const embed = new discord.RichEmbed()
    .setAuthor("~~ Trait options ~~", "https://cdn.discordapp.com/avatars/456934877841981462/5a880bec4e424aab34fcf6f62cc8a363.png?size=128")
    .setColor("#FF0000")
    .setTitle("Here are all the available traits:");
    let str = "";
    let str2 = "";
    for (let i=0;i<traits.length;i++) {
        if (i<traits.length/2) str += "• "+h.capitalize(traits[i])+" "+"\n";
        else str2 += "• "+h.capitalize(traits[i])+" "+"\n";
    }
    embed.addField("­",str, true);
    embed.addField("­",str2, true);

    return {embed};
}

/**
 * Waifu trait command ($trait waifu)
 *
 * @param {object} message
 * @returns {string}
 */
function trait(message) {
    if (!taken[message.author.id.toString()]) return `${message.author.username} has not claimed a waifu yet. Use '"+p+"waifu'.`;

    const traits = ["calm", "loyal", "curious", "valiant", "serious", "leader", "wild", "playful", 
            "careful", "evil", "doting", "charming", "volatile", "vengeful", "determined", "none"];

    if (!message.content.includes(p+"trait waifu ")) return traitsembed(traits);

    const text = message.content.replace(p+"trait waifu ", "").toLowerCase();

    if (traits.includes(text)) {
        taken[message.author.id.toString()].trait = h.capitalize(text);
        let res = `${resolvename(message)} now has the trait ${h.capitalize(text)}.`;
        if (taken[message.author.id.toString()].cl!="-") {
            taken[message.author.id.toString()].cl = "-";
            res += " Her class has been reset.";
        }
        return res;
    }

    return traitsembed(traits);
}

function jog(message) { //$jog with waifu
    if (!taken[message.author.id.toString()])
        return message.author.username+" has not claimed a waifu yet. Use '"+p+"waifu'.";

    let now = new Date().getTime();

    if (now-taken[message.author.id.toString()].lastsleep<sleepduration) {
        let end = taken[message.author.id.toString()].lastsleep+sleepduration;
        return sleepingText(message)+" (wait " +h.timeDiffToString(end,now)+")";
    }

    if (now-taken[message.author.id.toString()].lastjog<jogcooldown) {
        let end = taken[message.author.id.toString()].lastjog+jogcooldown;
        return jogCooldownText(message)+" (wait " +h.timeDiffToString(end,now)+")";
    }

    taken[message.author.id.toString()].health += 5;
    taken[message.author.id.toString()].happy -= 1;
    taken[message.author.id.toString()].love += 1;
    taken[message.author.id.toString()].fit += 3;
    taken[message.author.id.toString()].lastjog = now;
    return jogText(message);
}

function sleep(message) { //$sleep with waifu
    if (!taken[message.author.id.toString()])
        return message.author.username+" has not claimed a waifu yet. Use '"+p+"waifu'.";

    let now = new Date().getTime();

    if (now-taken[message.author.id.toString()].lastsleep<sleepduration) {
        let end = taken[message.author.id.toString()].lastsleep+sleepduration;
        return sleepingText(message)+" (wait " +h.timeDiffToString(end,now)+")";
    }

    taken[message.author.id.toString()].health += 10;
    taken[message.author.id.toString()].happy += 5;
    taken[message.author.id.toString()].love += 3;
    taken[message.author.id.toString()].lastsleep = now;
    return sleepText(message);
}

function cuddle(message) { //pet hug kiss
    if (!taken[message.author.id.toString()])
        return message.author.username+" has not claimed a waifu yet. Use '"+p+"waifu'.";

    let now = new Date().getTime();

    if (now-taken[message.author.id.toString()].lastsleep<sleepduration) {
        let end = taken[message.author.id.toString()].lastsleep+sleepduration;
        return sleepingText(message)+" (wait " +h.timeDiffToString(end,now)+")";
    }

    if (now-taken[message.author.id.toString()].lastcuddled<cuddlecooldown) {
        let end = taken[message.author.id.toString()].lastcuddled+cuddlecooldown;
        return clingyText(message)+" (wait " +h.timeDiffToString(end,now)+")";
    }

    switch (message.content) {
    case p+"pet waifu":
        taken[message.author.id.toString()].happy += 1;
        taken[message.author.id.toString()].love += 0.2;
        taken[message.author.id.toString()].lastcuddled = now;
        return petText(message);
    case p+"hug waifu":
        taken[message.author.id.toString()].happy += 1.5;
        taken[message.author.id.toString()].love += 0.3;
        taken[message.author.id.toString()].lastcuddled = now;
        return hugText(message);
    case p+"kiss waifu":
        taken[message.author.id.toString()].happy += 2;
        taken[message.author.id.toString()].love += 0.4;
        taken[message.author.id.toString()].lastcuddled = now;
        return kissText(message);
    }
}

function buy(message) { //$buy waifu
    if (!taken[message.author.id.toString()])
        return message.author.username+" has not claimed a waifu yet. Use '"+p+"waifu'.";

    const now = new Date().getTime();
	
    if (now-taken[message.author.id.toString()].lastsleep<sleepduration) {
        let end = taken[message.author.id.toString()].lastsleep+sleepduration;
        return sleepingText(message)+" (wait " +h.timeDiffToString(end,now)+")";
    }

    if (!message.content.includes(p+"buy waifu "))
        return message.author.username+", usage is '"+p+"buy waifu item'. Use '"+p+"shop waifu' to see all the options.";
        
    let text = message.content.replace(p+"buy waifu ","");

    switch (text) {
    case "book":
        if (!u.deductcurrency(message.author.id.toString(), 25)) {
            return `${message.author.username} does not have enough ${u.currency()}`;
        }
        taken[message.author.id.toString()].happy += 2;
        taken[message.author.id.toString()].love += 1;
        taken[message.author.id.toString()].smart += 2.5;

        return bookText(message);
    case "movie":
        if (!u.deductcurrency(message.author.id.toString(), 75)) {
            return `${message.author.username} does not have enough ${u.currency()}`;
        }
        taken[message.author.id.toString()].happy += 3;
        taken[message.author.id.toString()].love += 1;
        taken[message.author.id.toString()].smart += 1.5;

        return movieText(message);
    case "dress":
        if (!u.deductcurrency(message.author.id.toString(), 150)) {
            return `${message.author.username} does not have enough ${u.currency()}`;
        }

        taken[message.author.id.toString()].happy += 4;
        taken[message.author.id.toString()].wealth += 5;
        taken[message.author.id.toString()].love += 2;

        return dressText(message);
    case "jewels":
        if (!u.deductcurrency(message.author.id.toString(), 180)) {
            return `${message.author.username} does not have enough ${u.currency()}`;
        }

        taken[message.author.id.toString()].happy += 4;
        taken[message.author.id.toString()].wealth += 6;
        taken[message.author.id.toString()].love += 2;

        return jewelsText(message);
    case "veggies":
        if (now-taken[message.author.id.toString()].lastfed<foodcooldown) {
            let end = taken[message.author.id.toString()].lastfed+foodcooldown;
            return notHungryText(message)+" (wait " +h.timeDiffToString(end,now)+")";
        }
        else if (!u.deductcurrency(message.author.id.toString(), 15)) {
            return `${message.author.username} does not have enough ${u.currency()}`;
        }

        taken[message.author.id.toString()].health += 4;
        taken[message.author.id.toString()].fit += 2.5;
        taken[message.author.id.toString()].love += 1;
        taken[message.author.id.toString()].lastfed = now;

        return veggiesText(message);
    case "fish":
        if (now-taken[message.author.id.toString()].lastfed<foodcooldown) {
            let end = taken[message.author.id.toString()].lastfed+foodcooldown;
            return notHungryText(message)+" (wait " +h.timeDiffToString(end,now)+")";
        }
        else if (!u.deductcurrency(message.author.id.toString(), 35)) {
            return `${message.author.username} does not have enough ${u.currency()}`;
        }
        taken[message.author.id.toString()].health += 3;
        taken[message.author.id.toString()].happy += 1;
        taken[message.author.id.toString()].fit += 1.5;
        taken[message.author.id.toString()].love += 1;
        taken[message.author.id.toString()].lastfed = now;

        return fishText(message);
    case "meat":
        if (now-taken[message.author.id.toString()].lastfed<foodcooldown) {
            let end = taken[message.author.id.toString()].lastfed+foodcooldown;
            return notHungryText(message)+" (wait " +h.timeDiffToString(end,now)+")";
        }
        else if (!u.deductcurrency(message.author.id.toString(), 40)) {
            return `${message.author.username} does not have enough ${u.currency()}`;
        }

        taken[message.author.id.toString()].health += 2;
        taken[message.author.id.toString()].happy += 2;
        taken[message.author.id.toString()].fit += 0.5;
        taken[message.author.id.toString()].love += 1;
        taken[message.author.id.toString()].lastfed = now;

        return meatText(message);
    case "chocolate":
        if (!u.deductcurrency(message.author.id.toString(), 20)) {
            return `${message.author.username} does not have enough ${u.currency()}`;
        }
        taken[message.author.id.toString()].health -= 1;
        taken[message.author.id.toString()].happy += 4;
        taken[message.author.id.toString()].fit -= 1.5;
        taken[message.author.id.toString()].love += 1.5;

        return chocolateText(message);
    case "flowers":
        if (!u.deductcurrency(message.author.id.toString(), 45)) {
            return `${message.author.username} does not have enough ${u.currency()}`;
        }

        taken[message.author.id.toString()].happy += 2;
        taken[message.author.id.toString()].love += 2;

        return flowersText(message);
    case "energy drink":
        if (!u.deductcurrency(message.author.id.toString(), 50)) {
            return `${message.author.username} does not have enough ${u.currency()}`;
        }
        taken[message.author.id.toString()].health -= 1;
        taken[message.author.id.toString()].fit += 2;
        taken[message.author.id.toString()].love += 0.5;

        return drinkText(message);
    case "game":
        if (!u.deductcurrency(message.author.id.toString(), 100)) {
            return `${message.author.username} does not have enough ${u.currency()}`;
        }
        taken[message.author.id.toString()].happy += 3;
        taken[message.author.id.toString()].smart += 2;
        taken[message.author.id.toString()].love += 0.8;
        taken[message.author.id.toString()].fit -= 0.5;

        return gameText(message);
    case "phone":
        if (!u.deductcurrency(message.author.id.toString(), 400)) {
            return `${message.author.username} does not have enough ${u.currency()}`;
        }

        taken[message.author.id.toString()].happy += 6;
        taken[message.author.id.toString()].wealth += 5;
        taken[message.author.id.toString()].smart += 4;
        taken[message.author.id.toString()].love += 3;
        taken[message.author.id.toString()].fit += 0.5;

        return phoneText(message);
    case "crown":
        if (!u.deductcurrency(message.author.id.toString(), 100)) {
            return `${message.author.username} does not have enough ${u.currency()}`;
        }

        taken[message.author.id.toString()].happy += 3.5;
        taken[message.author.id.toString()].wealth += 4;
        taken[message.author.id.toString()].love += 1.5;

        return resolvenameF(message)+" feels like a queen wearing "+message.author.username+"'s gift!";
    case "sketch pad":
        if (!u.deductcurrency(message.author.id.toString(), 200)) {
            return `${message.author.username} does not have enough ${u.currency()}`;
        }

        taken[message.author.id.toString()].happy += 1;
        taken[message.author.id.toString()].wealth += 2;
        taken[message.author.id.toString()].love += 0.5;
        taken[message.author.id.toString()].smart += 3;

        return resolvenameF(message)+"'s creativity comes to life as she happily draws away on her sketch pad.";
    case "plush":
        if (!u.deductcurrency(message.author.id.toString(), 50)) {
            return `${message.author.username} does not have enough ${u.currency()}`;
        }

        taken[message.author.id.toString()].happy += 2.5;
        taken[message.author.id.toString()].love += 1;

        return resolvenameF(message)+" loves the fluffy doll "+message.author.username+" bought for her. She hugs it warmly.";  
    default:
        return message.author.username+", the shop doesn't have that. Use '"+p+"shop waifu'.";

    }
    
}

const show = async (message) => {
    let uid = message.author.id.toString();

    if (!message.channel.nsfw) {
        message.channel.send("Please only use '"+p+"show waifu' in nsfw rooms!");
    }
    else if (!taken[uid])
        message.channel.send(message.author.username+" has not claimed a waifu yet. Use '"+p+"waifu'.");
    else {

        let obj = taken[uid];

        message.channel.send(message.author.username+", loading... 0% :hourglass:").then(
            newm => {

                let n = obj.name;
                let t = obj.trait;
                let c = obj.cl;
                let lvl = "Lv. "+level(uid);
                let he = numtoscale(obj.health);
                let ha = numtoscale(obj.happy);
                let l = numtoscale(obj.love);
                let w = numtoscale(obj.wealth);
                let s = numtoscale(obj.smart);
                let f = numtoscale(obj.fit);

                let now = new Date().getTime(); 

                let status;

                newm.edit(message.author.username+", loading... 25% :hourglass:");

                if (now-obj.lastsleep<sleepduration)
                    status = "Sleeping...";
                else if (now-obj.lastfed>=foodpenalty)
                    status = "Very hungry";
                else if (now-obj.lastcuddled>=cuddlepenalty)
                    status = "In need of affection";
                else if (now-obj.lastsleep>=sleeppenalty)
                    status = "Extremely tired";
                else if (now-obj.lastcuddled<cuddlecooldown)
                    status = "Feeling loved";
                else if (now-obj.lastfed<foodcooldown)
                    status = "Belly full";
                else if (obj.health<40)
                    status = "Feeling unwell";
                else if (obj.wealth<40)
                    status = "Embarassed to be so poor";
                else if (obj.love<40)
                    status = "Cold and empty";
                else if (obj.happy<40)
                    status = "Very unhappy";
                else
                    status = "Doing hobbies";

                newm.edit(message.author.username+", loading... 50% :hourglass:");

                const embed = new discord.RichEmbed()
                    .setColor("#FF0000")
                    .setFooter(message.author.username+"'s waifu", message.author.avatarURL)
                    .setImage("attachment://image.png")
                    .addField("Name", n)
                    .addField("Class", c)
                    .addField("Health ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ Happy ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ Smart ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ Trait", he+" ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ "+ha+" ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­"+s+" ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­"+t)
                    .addField("Love ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ Wealth ­ ­ ­ ­ ­ ­ ­ ­ ­ ­Fitness ­ ­ ­ ­ ­ ­ ­ ­ ­ ­Skill", l+" ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ "+w+" ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­  ­­"+f+" ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­  ­­"+lvl)
                    .addField("Status",status);      

                let link;
                if (obj.folder == "url1") {
                    link = url+obj.pic;
                } else if (obj.folder == "url2") {
                    link = url2+obj.pic;
                } else {
                    link = url3+obj.pic;
                }

                newm.edit(message.author.username+", loading... 75% :hourglass:");

                message.channel.send({embed, files: [{ attachment: link, name: "image.png" }]}).then(
                    finalm => {
                        let makethissync = finalm.author.username; //ensure that the other msg is deleted only after image is uploaded
                        newm.delete();
                    }
                );

            });
    }
};

function quickshow(message) {
    let uid = message.author.id.toString();

    if (!taken[uid])
        message.channel.send(message.author.username+" has not claimed a waifu yet. Use '"+p+"waifu'.");
    else {

        let obj = taken[uid];

        let n = obj.name;
        let t = obj.trait;
        let c = obj.cl;
        let lvl = "Lv. "+level(uid);
        let he = numtoscale(obj.health);
        let ha = numtoscale(obj.happy);
        let l = numtoscale(obj.love);
        let w = numtoscale(obj.wealth);
        let s = numtoscale(obj.smart);
        let f = numtoscale(obj.fit);

        let now = new Date().getTime(); 

        let status;

        if (now-obj.lastsleep<sleepduration)
            status = "Sleeping...";
        else if (now-obj.lastfed>=foodpenalty)
            status = "Very hungry";
        else if (now-obj.lastcuddled>=cuddlepenalty)
            status = "In need of affection";
        else if (now-obj.lastsleep>=sleeppenalty)
            status = "Extremely tired";
        else if (now-obj.lastcuddled<cuddlecooldown)
            status = "Feeling loved";
        else if (now-obj.lastfed<foodcooldown)
            status = "Belly full";
        else if (obj.health<40)
            status = "Feeling unwell";
        else if (obj.wealth<40)
            status = "Embarassed to be so poor";
        else if (obj.love<40)
            status = "Cold and empty";
        else if (obj.happy<40)
            status = "Very unhappy";
        else
            status = "Doing hobbies";

        const embed = new discord.RichEmbed()
        .setColor('#FF0000')
        .setFooter(message.author.username+"'s waifu", message.author.avatarURL)
        .addField("Name", n)
        .addField("Class", c)
        .addField("Health ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ Happy ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ Smart ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ Trait", he+" ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ "+ha+" ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­"+s+" ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­"+t)
        .addField("Love ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ Wealth ­ ­ ­ ­ ­ ­ ­ ­ ­ ­Fitness ­ ­ ­ ­ ­ ­ ­ ­ ­ ­Skill", l+" ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ "+w+" ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­  ­­"+f+" ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­ ­  ­­"+lvl)
        .addField("Status",status);      

        message.channel.send({embed});
    }
}

function waifu(message) {
    let uid = message.author.id.toString();

    if (!message.channel.nsfw) {
        return "Please only use '"+p+"waifu' in nsfw rooms!";
    } else if (!u.deductcurrency(uid, 5)) {
        return message.author.username+" does not have enough "+u.currency()+" to roll a new waifu!";
    } else {

        if (taken[uid]) {
            let total = taken[uid].health + 
                    taken[uid].wealth + 
                    taken[uid].happy + 
                    taken[uid].smart + 
                    taken[uid].fit + 
                    taken[uid].love;
            
            if (total>280 || taken[uid].name !== "-") {
                u.addcurrency(uid, 5);
                return message.author.username+", are you sure? You'll lose all your progress. Type '"+p+"reroll waifu' if that is your choice.";
            }
        }

        let choice = h.random(opt);

        if (choice.includes(url)) 
            taken[uid] = newwaifu("url1", choice.replace(url,""));
        else if (choice.includes(url2)) 
            taken[uid] = newwaifu("url2", choice.replace(url2,""));
        else
            taken[uid] = newwaifu("url3", choice.replace(url3,""));

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

function rerollwaifu(message) {
    let uid = message.author.id.toString();

    if (!message.channel.nsfw) {
        return "Please only use '"+p+"reroll waifu' in nsfw rooms!";
    } else if (!u.deductcurrency(uid, 5)) {
        return message.author.username+" does not have enough "+u.currency()+" to roll a new waifu!";
    } else {
        let choice = h.random(opt);

        if (choice.includes(url)) 
            taken[uid] = newwaifu("url1", choice.replace(url,""));
        else if (choice.includes(url2)) 
            taken[uid] = newwaifu("url2", choice.replace(url2,""));
        else
            taken[uid] = newwaifu("url3", choice.replace(url3,""));

        for (let x=0;x<opt.length;x++) {
            if (opt[x] == choice) opt.splice(x,1);
        }
        save();

        const embed = new discord.RichEmbed()
            .setColor("#FF0000")
            .setFooter(message.author.username+" has rolled this waifu!", message.author.avatarURL)
            .setImage("attachment://image.png");

        return {embed, files: [{ attachment: choice, name: "image.png" }]};
    }
}

function kissText(message) {
    const a = [
        `You give ${resolvenamef(message)} a little peck on the cheek. She seems content with it.`,
        `You kiss ${resolvenamef(message)} right on the cheek out of nowhere. She blushes a little.`,
        `${resolvenameF(message)} is being her usual self, doesn't that deserve a kiss? It looks like she appreciates the thought.`,
        `You lean in to french kiss ${resolvenamef(message)}, but you decide against it since you're in public, turning it into a quick kiss on the lips.`
    ];

    return h.random(a);
}

function hugText(message) {
    const a = [
        `You come and hug ${resolvenamef(message)} from behind. She's a bit surprised, but appreciative nonetheless.`,
        `You catch ${resolvenamef(message)} relaxing and sit down next to her, soon enough pulling her into a hug. She's having a good time!`,
        `${resolvenameF(message)} edges close to you, and you acknowledge her presence with a good old tight hug. Looks like that's what she wanted.`,
        `Oof! You're surprised by a sudden push. ${resolvenameF(message)} jumped at you to get a hug on her own terms. She looks more relaxed now.`
    ];

    return h.random(a);
}

function petText(message) {
    const a = [
        "You gently caress "+resolvenamef(message)+"'s scalp. She hides her face a little, but it's obvious to see she likes it.",
        "You run your hand through "+resolvenamef(message)+"'s hair and fix it a little bit. She looks even prettier now!",
        "You pat "+resolvenamef(message)+"'s head delicately, trying to not ruffle her beautiful hair.",
        "You decide to tease "+resolvenamef(message)+" by playing a little with her ear, but that's mean, so you make up for it with a little headpat to appease her."
    ];

    return h.random(a);
}

function sleepText(message) {
    const a = [
        "You head to bed and "+resolvenamef(message)+" follows up to keep you company and cuddle up all night. See you later!",
        resolvenameF(message)+" drags herself into bed for some refreshing rest, she'll be back later. Sleep tight, "+resolvenamef(message)+"!",
        resolvenameF(message)+" grabs your hand and asks to go sleep with you, how can you say no to that face? Rest well!",
        resolvenameF(message)+" crashes on your bed, just waiting for you to join her before she starts sleeping. Don't make her wait!"
    ];

    return h.random(a); 
}

function clingyText(message) {
    const a = [
        "It looks like "+resolvenamef(message)+" doesn't feel like a public display of affection right now. Give her some space.",
        "Mmh... "+resolvenamef(message)+" seems busy. It looks like trying to be affectionate is just going to disturb her. Leave her be for now.",
        "You lean in to cuddle "+resolvenamef(message)+" a little, but she pushes you away gently. Guess she's not up for that right now.",
        "You go up to "+resolvenamef(message)+" but she softly voices to you she thinks you're being too clingy. Maybe you shouldn't be too push."
    ];

    return h.random(a); 
}

function sleepingText(message) {
    const a = [
        "Sssshh... "+resolvenamef(message)+" looks really cute when she sleeps. Let's not disturb her.",
        "It looks like "+resolvenamef(message)+" is having a good dream. Let's back away quietly.",
        resolvenameF(message)+" is still resting, looking really comfortable. Come back later!",
        resolvenameF(message)+"'s eyes flutter, she twitches a little, whispers a word, but she's sound asleep nonetheless. Let her sleep some more."
    ];

    return h.random(a);     
}

function jogText(message) {
    const a = [
        "The weather is clear and it's not too hot outside. You and "+resolvenamef(message)+" put on sports clothes and go exercise together.",
        "You don't really feel like going outside, to be honest, but "+resolvenamef(message)+" is just too cute in her sports outfit. So, might as well join her, no?",
        resolvenameF(message)+" grabs you by the arm and hands you a pair of sneakers. Looks like she wants go jogging.. shouldn't be a bad time if it's with "+resolvenamef(message)+".",
        "You notice some good weather outside and decide that "+resolvenamef(message)+" could use some exercise. It'll be fun!"
    ];

    return h.random(a);    
}

function jogCooldownText(message) {
    const a = [
        resolvenameF(message)+" has her face buried in the sofa and doesn't look like she wants to move anytime soon. ",
        resolvenameF(message)+" is busy showering after working up a sweat, let's give her some time before working out again.",
        "You approach "+resolvenamef(message)+" to suggest more jogging, but you back out of it when you notice she's massaging her legs after the effort. Not right now.",
        resolvenameF(message)+" crashed on on the sofa the second she got her sports shoes off. She's definitely not up for another round."
    ];

    return h.random(a);    
}

function bookText(message) {
    const a = [
        "As you pass by, you notice a book that appears to be about "+resolvenamef(message)+"'s lastest hobby and decide to pick it up. Judging by her smile, you did the right choice.",
        "Wandering in a nearby bookshop with "+resolvenamef(message)+", she seems interested in a random book off a shelf. You grab it and buy it for her, getting a kiss as thanks.",
        "Noticing "+resolvenamef(message)+"'s stacks of unread books is getting smaller, you go out and buy another one, discreetly dropping it on the pile while she's absent. She doesn't waste time and opens it right away as she finds it, delighted.",
        "Finding a copy of one of your favorite books at the store, you decide to introduce "+resolvenamef(message)+" to your favorite series. Looks like it was a good choice."
    ];

    return h.random(a);    
}

function movieText(message) {
    const a = [
        "Looking for something to do with "+resolvenamef(message)+", you decide to rent a movie off Internet. After a complicated choice, you're ready to kill some time in an enjoyable way.",
        "You bought popcorn, you bought snacks, and now you're just missing a movie. Letting "+resolvenamef(message)+" choose it, even if the movie is subpar you're sure to have a good time!",
        "For a change, you decide to watch a cult classic with "+resolvenamef(message)+". You both end the afternoon now knowing why everybody likes that movie.",
        "Looking for something to do, you pick up a movie none of you heard from. Turns out, it's some insanely stupid b-series. On the plus side, "+resolvenamef(message)+" laughed a lot as you riffed on it, so it wasn't too bad."
    ];

    return h.random(a); 
}

function dressText(message) {
    const a = [
        "Thinking "+resolvenamef(message)+"'s wardrobe needs to be refreshed a bit, you go and pick up a dress for her. You remembered her sizes right and it fits her great!",
        "You decide to pick up a new style of dress for "+resolvenamef(message)+", hoping it will suit her. Maybe that's not what she'd have went for, but she's more than happy to have variety.",
        "Walking along, you spy a cute dress you think will probably fit "+resolvenamef(message)+". And you're right, she looks stunning in it. You should do that more often.",
        "The weather changed a bit and you think it might be time to adapt "+resolvenamef(message)+"'s wardrobe for the current temperature. Coming back with new clothes, she seems more comfortable now."
    ];

    return h.random(a); 
}

function jewelsText(message) {
    const a = [
        "Passing by a jeweler, you notice a cute little ring with a stone you think "+resolvenamef(message)+" will love. Once on her finger, it's obvious you did a correct choice.",
        "You decide to pick up a necklace for "+resolvenamef(message)+", choosing one with a pretty gemstone hanging from it. It compliments her eyes really well.",
        "A splendid bracelet is on sale, and it looks like a perfect gift for "+resolvenamef(message)+". Classy but not too showy, she looks wealthier just by having it.",
        "You help "+resolvenamef(message)+" put on her new pair of earrings, being careful not to pinch her earlobes. The sheen from the plating makes her look positively beaming."
    ];

    return h.random(a); 
}

function veggiesText(message) {
    const a = [
        "Today on the menu is a vegetarian meal, a stir fry made of carrots, onions and soybean sprouts with sesame seeds and a copious amount of soy sauce, served with rice. "+resolvenameF(message)+" has nothing but compliments to say about that tasty dish.",
        "Out of inspiration, you decide to cook some simple pasta with a lovingly heated up tomato sauce, given a better kick thanks to some herbs and spices. Seeing "+resolvenamef(message)+"'s face, she still appreciates simplicity.",
        "You cooked some spinach and polenta for "+resolvenamef(message)+". Healty meals are always a good idea, and she's not one to disagree with that. Maybe you'll get ice cream or something for dessert..",
        "To change things, you decide to do a salade with lettuce, shredded carrot, shredded beetroot, and a tahini sauce. "+resolvenameF(message)+" greatly appreciates that kind of refreshing meal."
    ];

    return h.random(a); 
}

function fishText(message) {
    const a = [
        resolvenameF(message)+" having a refined palate, you got her some sushi. Her face when she accidentally bites into a little too much wasabi is a sight to behold!",
        "You plate up a hearty amount of white rice and a big fillet of tuna for "+resolvenamef(message)+". One more sprinkle of seasoning and it's devoured within minutes by "+resolvenamef(message)+".",
        "The roles are reversed and this time "+resolvenamef(message)+" is the one cooking, making some tempura with the shirmp you bought earlier. It turns out fried perfectly and the sauce is just right too. "+resolvenameF(message)+" is a great cook, isn't she?",
        "You cook a white fish fillet for "+resolvenamef(message)+", accompagned by a thick tomato sauce. She instantly starts digging in, scooping up as much sauce as she can with each bite."
    ];

    return h.random(a); 
}

function meatText(message) {
    const a = [
        "You slide a nice, juicy chicken breast out of the cast-iron pan and into "+resolvenamef(message)+"'s plate. She doesn't even wait for the rest of the dish to grab a bite.",
        "Satisfied with your sirloin steak, you plate it up with some aspargus and serve it to "+resolvenamef(message)+". She's ecstatic about it.",
        "You picked up ground meat to make hamburgers, but in an attempt to be classy you present them to "+resolvenamef(message)+" as \"steamed hams\" from Utica.",
        "Taking inspiration from one of your japanese anime, you decide to deep-fry some pork cutlets to make tonkatsu. You made a mess of the kitchen while frying, but "+resolvenamef(message)+" thinks it's tasty nonetheless."
    ];

    return h.random(a); 
}

function chocolateText(message) {
    const a = [
        "You hand a tablet of fine, dark chocolate to "+resolvenamef(message)+", which she savours every square of, even feeding you one of them.",
        resolvenameF(message)+" shows up with a bag of chocolate candies to share with you. You end up both taking turns picking one in the bag, quickly emptying it.",
        "You share a tablet of white chocolate with "+resolvenamef(message)+". So greasy, so sugary, but so soft and sweet. Quite the guilty pleasure.",
        "What's in the box? A random assortment of chocolates, and neither of you know what you're getting with, leading to "+resolvenamef(message)+" and you trying to guess what each of them are before noticing explanations on the bottom of the box."
    ];

    return h.random(a); 
}

function flowersText(message) {
    const a = [
        "You got "+resolvenamef(message)+" a nice, big, varied bouquet of flowers, with a combination of wildly different smells. "+resolvenameF(message)+" is a little overwhelmed by the size, they quickly get into a vase.",
        "You choose a single, beautiful rose to bring home to "+resolvenamef(message)+". It looks gorgeous in her hair.",
        resolvenameF(message)+" hands you a bouquet of pretty, small violet flowers she apparently delicately plucked herself. The scent is overpowering!",
        resolvenameF(message)+" carefully grasps the pot containing a delicate orchid from your hands, sniffing it with a smile on her face, before looking up how to care for it."
    ];

    return h.random(a); 
}

function drinkText(message) {
    const a = [
        resolvenameF(message)+" takes a large sip from a weird fluorescent, colored energy drink. She looks all pumped up now.",
        "A glass of that ginger-based energy drink later, and "+resolvenamef(message)+" is ready for anything!",
        resolvenameF(message)+" cracks open a can of some generic energy drink, frowning at the smell, but downs it in an instant before hiccuping.",
        resolvenameF(message)+" slowly sips up a caffeine-based drink, getting herself ready for the rest of the day."
    ];

    return h.random(a);
}

function gameText(message) {
    const a = [
        "You hand "+resolvenamef(message)+" an RPG, wondering how long it'll take her to go through the main story.. and if she'll stop at the final boss or go out of her way to do the sidequests.",
        resolvenameF(message)+" readies herself for another FPS to run and gun through. Her aim at those games is steadily getting better and she's starting to be pretty good in multiplayer.",
        "You wanted to show "+resolvenamef(message)+" that new puzzle game she could defy you at, but she's still hooked to the last one. You leave it on the pile for later.",
        resolvenameF(message)+" sits down on the sofa with you to play a racing game, knocking your own car asides several times before pouting as you throw a blue shell at her."
    ];

    return h.random(a);
}

function phoneText(message) {
    const a = [
        "You got "+resolvenamef(message)+" the new model of smart phone in store. She immediately makes use of it by phoning you while you are in the same room.",
        "As you show "+resolvenamef(message)+" the new phone you got her, she accidentally sends you a text full of gibberish while getting used to it.",
        resolvenameF(message)+" wastes no time, taking a selfie with you right after you hand her a new phone, setting it as her background picture. She's really cute on it.",
        "A few minutes after you gave "+resolvenamef(message)+" her new phone, she's still struggling with it. The phone starts working better when you peel off the sticker on the screen, and "+resolvenamef(message)+" hides her face out of embarassment."
    ];

    return h.random(a);
}

function notHungryText(message) {
    const a = [
        "You ask "+resolvenamef(message)+" if she wants more food, but she shakes her head.",
        "Looking at "+resolvenamef(message)+", it looks like she's full. She's not gonna eat for a moment.",
        "You attempt to give "+resolvenamef(message)+" a second serving of food, but she's not even done with the first one.",
        resolvenameF(message)+" is stuffed! She can't really eat more for the time being."
    ];

    return h.random(a);
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
    return {folder: folder, pic: pic, name: "-", health: 60, love: 60, happy: 60, wealth: 60, 
    smart: 20, fit: 20, lastsleep: 1, lastcuddled: 1, lastfed: 1, lastjogged: 1, trait: "None", 
    lasttraitchange: 1, cl: "-", ingame: 0, gamestart: 1, gamestatus: {}, xp: 0};
}

function pictaken(file) {
    const array = Object.keys(taken);
    for (let i=0;i<array.length;i++) {
        if (taken[array[i]] == file) return true;
    }
    return false;
}

function level(uid) {
    let lvl = 1;
    let total = 34;
    while (taken[uid].xp>=total) {
        total += 30*lvl+Math.pow(lvl+1,2);
        lvl++;
    }
    return lvl;
}

module.exports = {
    waifu,
    rerollwaifu,
    show,
    quickshow,
    save,
    name,
    buy,
    cuddle,
    classes,
    sleep,
    jog,
    update,
    help,
    shop: buyembed,
    trait,
    resolvename,
    resolvenameF,
    resolvenamef,
    top,
    taken,
    numtoscale
};
