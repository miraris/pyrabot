const c = require('./currency.js');

console.log("Gambler: loading.");

/**
 * Gamble command
 *
 * @param message
 * @returns {string}
 */
function gamble(message) {
    const author = message.author.username;
    let args = message.content.split(" ");

    if (args.length !== 2 || args[1] != parseInt(args[1], 10) || parseInt(args[1], 10) <= 0) {
        return `${author}, usage is '$gamble x', where x is an integer.`;
    }

    const amt = parseInt(args[1], 10);

    if (!c.deductcurrency(message.author.id.toString(), amt)) {
        return `${author} does not have enough ${c.currency()}`;
    }

    if (Math.random() >= 0.5) {
        c.addcurrency(message.author.id.toString(), amt * 2);
        return `${author} **won** and now has ${c.getcurrency(message.author.id.toString())} ${c.currency()}`;
    }

    return `${author} **lost** and now has ${c.getcurrency(message.author.id.toString())} ${c.currency()}`
}

module.exports = {
    gamble
};
