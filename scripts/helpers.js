/**
 * Checks whether the message is from the bot owner
 *
 * @param {object} message
 * @returns {boolean}
 */
const fromOwner = (message) => {
    return (message.author.id === process.env.OWNER_ID);
};

/**
 * Returns a time difference as a human-readable string
 *
 * @param newest
 * @param oldest
 * @returns {string}
 */
const timeDiffToString = (newest, oldest) => {
    const time = newest-oldest;
    const h = Math.floor(time/(1000*60*60));
    const m = Math.floor(time/(1000*60))%60;
    const s = Math.floor(time/(1000))%60;
    let r = "";
    const pluralizeTime = (time, noun, suffix = 's') =>
        `${time} ${noun}${time !== 1 ? suffix : ''}`;

    r += (h>0) ? `${pluralizeTime(h, "hour")} ` : '';
    r += (m>0) ? `${pluralizeTime(m, "minute")} ` : '';
    r += pluralizeTime(s, "second");

    return r;
};

/**
 * Prettifies a number (adds decimal points to hundreds)
 *
 * @param n
 * @returns {string}
 */
const prettyNumber = (n) => {
    const s = n.toString();
    let final = "";

    for (let i = 0; i < s.length; i++) {
        final += s[i];
        if (i % 3 === (s.length - 1) % 3 && i !== s.length - 1) final += '.';
    }
    return final;
};

/**
 * Capitalize a string
 *
 * @param str
 * @returns {string}
 */
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Returns a random element from an array
 *
 * @param {Array} arr 
 */
const random = (arr) => arr[Math.floor(Math.random() * ((arr.length-1)))];

module.exports = {
    fromOwner,
    prettyNumber,
    timeDiffToString,
    capitalize,
    random
};