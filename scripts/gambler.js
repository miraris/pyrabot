var exports = module.exports = {};

const discord = require('discord.js');
const c = require('./currency.js');

console.log("Gambler: loading.");

exports.gamble = function(message) {
    return gamble(message);
}

function gamble(message) {
    let args = message.content.split(" ");
    if (args.length!=2 || args[1] != parseInt(args[1], 10) || parseInt(args[1], 10)<=0) {
        return message.author.username+", usage is '$gamble x', where x is an integer."; 
    } else {
        let amt = parseInt(args[1], 10);

        if (!c.deductcurrency(message.author.id.toString(), amt)) {
            return message.author.username+" does not have enough "+c.currency();
        }

        if (Math.random()>=0.5) {
            c.addcurrency(message.author.id.toString(), amt*2);
            return message.author.username+" **won** and now has "+c.getcurrency(message.author.id.toString())+" "+c.currency();
        } else {
            return message.author.username+" **lost** and now has "+c.getcurrency(message.author.id.toString())+" "+c.currency();
        }
    }
}
