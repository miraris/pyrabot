var exports = module.exports = {};

const discord = require('discord.js');
const u = require('./utils.js');
const fs = require('fs');

var bank = {}; //{"230940": {amt: 309, lastmsg: 3093303}, ...}
const currency = ":pizza:";
var lastupdate = new Date().getTime();
load();

console.log("Currency: loading.");

exports.top = function(message) {
    return top(message);
}

exports.mycurrency = function(message) {
    return mycurrency(message);
}

exports.gencurrency = function(message) {
    gencurrency(message);
}

exports.deductcurrency = function(id, val) {
    return deductcurrency(id, val);
}

exports.addcurrency = function(id, val) {
    addcurrency(id, val);
}

exports.getcurrency = function(id) {
    return getcurrency(id);
}

exports.gift = function(message) {
    return gift(message);
}

exports.currency = function() {
    return currency;
}

exports.save = function() {
    save();
}

function mycurrency(message) {
    if (!bank[message.author.id.toString()]) {
        bank[message.author.id.toString()] = {amt: 5, lastmsg: new Date().getTime()};
    }

    let formatted = u.prettynumber(Math.floor(bank[message.author.id.toString()].amt));

    return message.author.username+" has "+formatted+" "+currency;
}

function gencurrency(message) {
    if (!bank[message.author.id.toString()]) {
        bank[message.author.id.toString()] = {amt: 5, lastmsg: new Date().getTime()};
    } else {
        let newmsg = new Date().getTime();
        bank[message.author.id.toString()].amt += newcurrency(message, newmsg);
        bank[message.author.id.toString()].lastmsg = newmsg;
    }

    let newupdate = new Date().getTime();
    if (newupdate-lastupdate>5*60*1000) { //every 5 min
        //console.log("Currency: saving.");
        save();
    }
}

function addcurrency(id, val) {
    if (!bank[id]) bank[id] = {amt: 5+val, lastmsg: new Date().getTime()};
    else {
        bank[id].amt += val;
    }

    save();
}

function deductcurrency(id, val) {
    if (!bank[id]) {
        bank[id] = {amt: 5, lastmsg: new Date().getTime()};
    }
    
    if (bank[id].amt-val<0) return false;
    else {
        bank[id].amt -= val;
        save();
        return true;
    }
}

function top(message) {
    let keys = Object.keys(bank);
    let array = [];
    for (let i=0;i<keys.length;i++) array.push({id: keys[i], amt: bank[keys[i]].amt});
    if (array.length==0) {
        return "But there was nobody...";
    } else {
        array = array.sort(function(a,b) {
            return b.amt - a.amt;
        });

        const embed = new discord.RichEmbed()
        .setAuthor("~~ The richest users! ~~", "https://cdn.discordapp.com/avatars/456934877841981462/5a880bec4e424aab34fcf6f62cc8a363.png?size=128")
        .setColor("#FF0000")
        .setTitle("Here are my wealthiest lovelies:");

        let index = 1;

        for (let i=0;i<array.length;i++) {
            if (i==10) break;
            let member = message.guild.members.find("id", array[i].id.toString())
            if (member!=null) {
                let name = member.user.username;
                embed.addField(index+" - "+name,"with "+getcurrency(array[i].id)+" "+currency, true);
                index++;
            }
        }
        
        return {embed};
    }
}

function gift(message) {
    let args = message.content.split(" ");
    if (args.length!=3 || args[2] != parseInt(args[2], 10) || parseInt(args[2], 10)<=0) {
        return message.author.username+", usage is '$gift @someone x', where x is an integer."; 
    } else {
        let amt = parseInt(args[2], 10);
        let receiver = args[1].replace(/[!<@>]/g, "");

        if (discord.SnowflakeUtil.deconstruct(receiver).binary == "0000000000000000000000000000000000000000000000000000000000000000") {
            return message.author.username+", please @ someone to gift them!";
        } else if (!deductcurrency(message.author.id.toString(), amt)) {
            return message.author.username+" does not have enough "+currency;
        } else {
            addcurrency(receiver, amt);
            return message.author.username+", your gift has been sent!";
        }
    }
}

function getcurrency(id) {
    if (!bank[id]) {
        bank[id] = {amt: 5, lastmsg: new Date().getTime()};
    }

    return u.prettynumber(Math.floor(bank[id].amt));
}

function newcurrency(message, newmsg) {
    let lastmsg = bank[message.author.id.toString()].lastmsg;

    if (newmsg-lastmsg<500) return 0; //no spam
   
    let base = (newmsg - lastmsg)/950;
    let exp = 100000001/200000000;

    return Math.pow(base, exp)/5;
}

function load() {
    let n = fs.readFileSync('scripts/currency/bank.txt', 'latin1');
    if (n.length!=0) {
        bank = JSON.parse(n);
    }
}

function save() {
    fs.writeFileSync('scripts/currency/bank.txt', JSON.stringify(bank));
}