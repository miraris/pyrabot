const discord = require('discord.js');
const h = require('./helpers');
const fs = require('fs');

var bank = {}; //{"230940": {amt: 309, lastmsg: 3093303}, ...}
const currency = process.env.CURRENCY;
var lastupdate = new Date().getTime();

/**
 * Load bank
 */
const load = () => {
    const n = fs.readFileSync('scripts/currency/bank.txt', 'latin1');
    if (n.length!==0) {
        bank = JSON.parse(n);
    }
};

load();

console.log("Currency: loading.");

const mycurrency = (message) => {
    if (!bank[message.author.id.toString()]) {
        bank[message.author.id.toString()] = {amt: 5, lastmsg: new Date().getTime()};
    }

    const formatted = h.prettyNumber(Math.floor(bank[message.author.id.toString()].amt));
    return message.author.username+" has "+formatted+" "+currency;
};

const gencurrency = (message) => {
    if (!bank[message.author.id.toString()]) {
        bank[message.author.id.toString()] = {amt: 5, lastmsg: new Date().getTime()};
    } else {
        let newmsg = new Date().getTime();
        bank[message.author.id.toString()].amt += newcurrency(message, newmsg);
        bank[message.author.id.toString()].lastmsg = newmsg;
    }

    const newupdate = new Date().getTime();
    if (newupdate-lastupdate>5*60*1000) { //every 5 min
        //console.log("Currency: saving.");
        save();
    }
};

const addcurrency = (id, val) => {
    if (!bank[id]) bank[id] = {amt: 5+val, lastmsg: new Date().getTime()};
    else {
        bank[id].amt += val;
    }

    save();
};

const deductcurrency = (id, val) => {
    if (!bank[id]) {
        bank[id] = {amt: 5, lastmsg: new Date().getTime()};
    }
    
    if (bank[id].amt-val<0) return false;

    bank[id].amt -= val;
    save();
    return true;
};

function top(message) {
    let keys = Object.keys(bank);
    let array = [];
    for (let i=0;i<keys.length;i++) array.push({id: keys[i], amt: bank[keys[i]].amt});
    if (array.length===0) {
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
            if (index===10) break;
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
    const args = message.content.split(" ");
    if (args.length!==3 || args[2] != parseInt(args[2], 10) || parseInt(args[2], 10)<=0) {
        return `${message.author.username}, usage is $gift @someone x', where x is an integer.`;
    } else {
        const amt = parseInt(args[2], 10);
        const receiver = args[1].replace(/[!<@>]/g, "");

        if (discord.SnowflakeUtil.deconstruct(receiver).binary == "0000000000000000000000000000000000000000000000000000000000000000") {
            return message.author.username+", please @ someone to gift them!";
        } else if (!deductcurrency(message.author.id.toString(), amt)) {
            return message.author.username + " does not have enough " + currency;
        }

        addcurrency(receiver, amt);
        return message.author.username+", your gift has been sent!";

    }
}

const getcurrency = (id) => {
    if (!bank[id]) {
        bank[id] = {amt: 5, lastmsg: new Date().getTime()};
    }
    const amount = Math.floor(bank[id].amt);

    return h.prettyNumber(amount)
};

const newcurrency = (message, newmsg) => {
    let lastmsg = bank[message.author.id.toString()].lastmsg;

    if (newmsg-lastmsg<500) return 0; //no spam
   
    let base = (newmsg - lastmsg)/950;
    let exp = 100000001/200000000;

    return Math.pow(base, exp)/5;
};

const save = () => {
    fs.writeFileSync('scripts/currency/bank.txt', JSON.stringify(bank));
};

module.exports = {
    top,
    mycurrency,
    gencurrency,
    deductcurrency,
    addcurrency,
    getcurrency,
    gift,
    currency: function () {
        return currency;
    },
    save
};
