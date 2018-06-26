const discord = require("discord.js");
const fs = require("fs");
const c = require("./currency");
const h = require("./helpers");
const w = require("./waifus");
const p = process.env.COMMAND;
const texts = require("./texts");

const ping = 4000;
const sleepduration = 2*60*60*1000;

//events:
//1 sequence no timing
//2 correct action
//3 sequence timing

//add to taken:
//ingame 0/1/2/3
//gamestart timestamp
//gamestatus varies
//xp number

function main(message) {
    let uid = message.author.id.toString(); 

    if (!w.taken[uid])
        return message.author.username+" has not claimed a waifu yet. Use '"+p+"waifu'.";

    let sleepres = isAsleep(uid, message);
    if (sleepres.asleep==true) return sleepres.message;

    if (w.taken[uid].cl === "-")
        return message.author.username+" must assign "+w.resolveName(message)+" a class before playing.";

    if (w.taken[uid].ingame!=0) {
        w.taken[uid].ingame=0;
        return "But "+w.resolveName(message)+" was ingame! "+message.author.username+
            " forfeits the match.\n\n"+lose(message);
    }

    const embed = new discord.RichEmbed()
        .setAuthor("~~ "+w.resolveName(message)+"'s Quest ~~", "https://cdn.discordapp.com/avatars/456934877841981462/5a880bec4e424aab34fcf6f62cc8a363.png?size=128")
        .setColor("#FF0000")
        .addField("­",texts.location(w.resolveNameDirect(message)));

    const minigame = h.randomInt(2,3); 

    switch(minigame) {
        case 1: break;
        case 2:
            prepareEvent2(uid, embed);
            break;
        case 3:
            prepareEvent3(uid, embed);
            break;
    }
    
    return {embed};
}

function win(message) {
    let uid = message.author.id.toString(); 
    let moneygain = h.randomInt(10, 30);
    let xpgain = h.randomInt(20, 55);

    c.addcurrency(uid, moneygain);
    w.taken[uid].happy += 0.5;
    w.taken[uid].health += 0.5;
    w.taken[uid].love += 0.5;
    w.taken[uid].wealth += 0.5;
    w.taken[uid].smart += 0.25;
    w.taken[uid].fit += 0.25;
    w.taken[uid].xp += xpgain;
    w.taken[uid].ingame = 0;

    let xpcalcs = xpToLevel(uid);

    return message.author.username+" won "+moneygain+" "+c.currency()+" and "+
        w.resolveName(message)+" gained "+xpgain+" xp! ("+xpcalcs.tonext+" xp to **Level "+(xpcalcs.level+1)+"**)";
}

function lose(message) {
    let uid = message.author.id.toString(); 
    let moneyloss = c.getcurrency(uid)/100;

    c.deductcurrency(uid, moneyloss);
    w.taken[uid].happy -= 1;
    w.taken[uid].health -= 1;
    w.taken[uid].love -= 1;
    w.taken[uid].wealth -= 1;
    w.taken[uid].smart -= 0.5;
    w.taken[uid].fit -= 0.5;
    w.taken[uid].ingame = 0;

    return message.author.username+" lost "+Math.floor(moneyloss)+" "+c.currency()+" for the defeat.";
}

function go(message) {
    let uid = message.author.id.toString(); 

    if (!w.taken[uid])
        return message.author.username+" has not claimed a waifu yet. Use '"+p+"waifu'.";

    let sleepres = isAsleep(uid, message);
    if (sleepres.asleep==true) return sleepres.message;

    if (!message.content.includes(p+"do ")) return message.author.username+", that's an invalid action!";

    const minigame = w.taken[uid].ingame;

    switch(minigame) {
        case 0:
            return w.resolveName(message)+" is not ingame. Start a game with '"+p+"waifu game'.";
        case 1: break;
        case 2:
            return playEvent2(message);
        case 3:
            return playEvent3(message);
    }
}

function playEvent2(message) {
    let uid = message.author.id.toString(); 
    let state = w.taken[uid].gamestatus;

    const act = message.content.replace(p+"do ", "").toLowerCase();

    if (act===state.ans) {
        return "As "+w.resolveName(message)+" didn't hide the truth, the mirror kept its promise and sent her home.\n\n"+win(message);
    } else {
        return "Enraged by obvious lie, the mirror strikes and shatters.\n\n"+lose(message);
    }
}

function playEvent3(message) {
    let uid = message.author.id.toString(); 
    let state = w.taken[uid].gamestatus;
    let fitbonus = Math.floor(w.taken[uid].fit/20)*500;
    let now = new Date().getTime();
    let time = ping + 500*state.length + fitbonus;

    let diff = now-w.taken[uid].gamestart;

    if (diff>time) {
        return w.resolveName(message)+" took too long to dodge and was hurt! ("+diff/1000+"s)"
            +"\n\n"+lose(message);
    }

    const acts = message.content.replace(p+"do ", "").toLowerCase().split(" ");

    if (acts.length != state.length) {
        return w.resolveName(message)+" dodged the wrong way and was hurt!\n\n"+lose(message);
    }

    for (let i=0;i<state.length;i++) {
        if ((state[i]=="left" && acts[i]!="d") ||
            (state[i]=="right" && acts[i]!="a" && acts[i]!="q") ||
            (state[i]=="up" && acts[i]!="s") ||
            (state[i]=="down" && acts[i]!="w" && acts[i]!="z"))
            return w.resolveName(message)+" dodged the wrong way and was hurt!\n\n"+lose(message);
    }

    return w.resolveName(message)+" successfully escaped the situation!\n\n"+win(message);
}

function prepareEvent2(uid, embed) {
    let cl = w.taken[uid].cl;

    embed.addField("­","Near her, a magical mirror appears. Its echoing voice is heard.");
    embed.addField("­","\"If you wish to return home, I can take you there. I can see through you, and I "+
        "know your **qualities** and **"+cl+" class**. Even though I already know what it is, I want you to trust me "+
        "with what your heart most deeply desires. Do not lie.\"");

    let a = event2choices(uid);
    w.taken[uid].ingame = 2;
    w.taken[uid].gamestatus = a;

    let str = "";
    str += "**a)** "+a.opts[0]+"\n";
    str += "**b)** "+a.opts[1]+"\n";
    str += "**c)** "+a.opts[2]+"\n";
    str += "**d)** "+a.opts[3]+"\n";

    embed.addField("­",str);
    embed.addField("­","Choose an option. (**"+p+"do a**, for example)");
}

function prepareEvent3(uid, embed) {
    embed.addField("­", texts.event3enemy());

    let a = event3attacks();
    let now = new Date().getTime();
    w.taken[uid].ingame = 3;
    w.taken[uid].gamestart = now;
    w.taken[uid].gamestatus = a;

    let str = "";
    for (let i=0;i<a.length;i++) {
        str += "**"+a[i]+"**";
        if (i!=a.length-1) str += ", ";
    }

    let fitbonus = Math.floor(w.taken[uid].fit/20)/2;
    let time = ping/1000 + 0.25*a.length + fitbonus;

    embed.addField("­",str);
    embed.addField("­","Quickly dodge the sequence of attacks in the **opposite** direction with **W/A/S/D**!");
    embed.addField("­","(type **"+p+"do w d s w**, for example)");
    embed.addField("­","You have "+time+" seconds! :hourglass:");
}

function event2choices(uid) {
    const q =      ["Bring the world to its knees.", //0
                    "Govern and conquer.",
                    "Support those who believe in you.",
                    "Know what it feels like to take one's life.",
                    "Outpace and outperform.",
                    "Escape from this terrible fate.", //5
                    "Obtain power beyond measure.",
                    "Learn more. Knowledge is power!",
                    "Bring happiness to others.",
                    "Toy with people's feelings.",
                    "Keep the balance in this world.", //10
                    "Test the limits of nature!",
                    "Be one with the Earth.",
                    "Purge the world from its pests.",
                    "Life live to its fullest.",
                    "Make my own rules.", //15
                    "Do what I think is right.",
                    "Crimson dreams.",
                    "To invent and to improve.",
                    "Always do better each day.",
                    "Witness the greatest histories.", //20
                    "Absolute control.",
                    "Meet someone I can trust.",
                    "Work towards the greater good.",
                    "A bit of chaos would make things more fun."
                    ];

    let correct = [];
    
    switch (w.taken[uid].cl) {
        case "Demoness": correct = [q[0], q[1], q[6], q[15], q[21], q[24]]; break;    
        case "Prodigy": correct = [q[4], q[18], q[19], q[7]]; break; 
        case "Goddess": correct = [q[6], q[8], q[10], q[12], q[16], q[23]]; break; 
        case "Myth": correct = [q[10], q[12], q[16], q[20]]; break; 
        case "Angel": correct = [q[8], q[10], q[14], q[23]]; break; 
        case "Dark Angel": correct = [q[3], q[6], q[15], q[17]]; break; 
        case "Assassin": correct = [q[13], q[15], q[16], q[17]]; break; 
        case "Yandere": correct = [q[3], q[9], q[15], q[17], q[24]]; break; 
        case "Reaper": correct = [q[13], q[15], q[17], q[21]]; break; 
        case "Succubus": correct = [q[6], q[9], q[21], q[24]]; break; 
        case "Magical Girl": correct = [q[2], q[8], q[14], q[10]]; break; 
        case "Cursed Girl": correct = [q[5], q[13], q[16]]; break; 
        case "Scientist": correct = [q[7], q[11], q[18], q[21], q[23]]; break; 
        case "Mage": correct = [q[6], q[7], q[11], q[18]]; break; 
        case "Necromancer": correct = [q[6], q[7], q[11]]; break; 
        case "Cheerleader": correct = [q[2], q[8], q[14], q[19]]; break; 
        case "Warrior": correct = [q[1], q[6], q[23]]; break; 
        case "Knight": correct = [q[2], q[16], q[19]]; break; 
        case "Athlete": correct = [q[2], q[14], q[19]]; break; 
        case "Dreamer": correct = [q[7], q[15], q[18]]; break; 
        case "Cupid": correct = [q[8], q[9], q[24]]; break; 
        case "Eternal": correct = [q[11], q[12], q[14], q[20]]; break; 
        case "Queen": correct = [q[1], q[6], q[15], q[21]]; break; 
        case "Alchemist": correct = [q[7], q[11], q[18], q[19]]; break; 
        case "Commander": correct = [q[1], q[0], q[6], q[13], q[20], q[21]]; break; 
        case "Mercenary": correct = [q[6], q[13], q[17]]; break; 
        case "Adventurer": correct = [q[7], q[14], q[11]]; break; 
        case "Pet": correct = [q[2], q[22], q[8]]; break;   
    }

    let answer = h.random(correct);
    let letter;
    let index = h.randomInt(0,3);
    let choices = ["", "", "", ""];
    
    switch (index) {
        case 0:
            choices[0] = answer;
            letter = "a";
            break;
        case 1:
            choices[1] = answer;
            letter = "b";
            break;
        case 2:
            choices[2] = answer;
            letter = "c";
            break;
        case 3:
            choices[3] = answer;
            letter = "d";
            break;
    }

    let possible = h.arrayDiff(q,correct);

    for (let i=0;i<4;i++) {         
        if (i!=index) {
            let ch = h.random(possible);
            choices[i] = ch;
            possible.splice(possible.indexOf(ch), 1);
        }
    }

    return {opts: choices, ans: letter};

}

function event3attacks() {
    const opt = ["left", "right", "up", "down"];

    let d = h.randomInt(4,6);
    let r = [];

    for (let i=0;i<d;i++) {
        r.push(h.random(opt));
    }

    return r;
}

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

function isAsleep(uid, message) {
    const now = new Date().getTime();
	
    if (now-w.taken[uid].lastsleep<sleepduration) {
        let end = w.taken[uid].lastsleep+sleepduration;
        let msg = texts.sleeping(w.resolveNameDirect(message))+" (wait " +h.timeDiffToString(end,now)+")";
        return {asleep: true, message: msg};
    }
    return {asleep: false};
}

function xpToLevel(uid) {
    let lvl = 1;
    let total = 34;
    while (w.taken[uid].xp>=total) {
        total += 30*lvl+Math.pow(lvl+1,2);
        lvl++;
    }
    return {level: lvl, tonext: total-w.taken[uid].xp};
}

module.exports = {
    main,
    go,
    xpToLevel
};