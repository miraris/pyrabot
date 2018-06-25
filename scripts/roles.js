var exports = module.exports = {};

const discord = require("discord.js");
const fs = require("fs");
const u = require("./currency");
const h = require("./helpers");

var assignable = {}; //assignable roles for each server

load();

console.log("Roles: loading.");

function addRole(message) {
    let errormsg = message.author.username+", usage is '$add role rolename'.";

    if (!message.guild) return "Can't do that here.";

    if (!message.member.hasPermission("ADMINISTRATOR")) return "Only admins can add roles.";

    if (!message.content.includes("$add role ")) return errormsg;

    const text = message.content.replace("$add role ", "").toLowerCase();

    if (!assignable[message.guild.id.toString()])
        assignable[message.guild.id.toString()] = [];

    let roles = message.guild.roles;
    let all = roles.keyArray();

    for (let i=0;i<all.length;i++) {
        let role = roles.find("id", all[i]);
        if (role.name.toLowerCase() == text) {
            if (!assignable[message.guild.id.toString()].includes(role.id)) {
                assignable[message.guild.id.toString()].push(role.id);
                save();
            }
            return "Added the role '"+role.name+"' to the list of roles I can assign.";
        }
    }

    return "Couldn't find that role.";
}

function listRoles(message) {
    if (!message.guild) return "Can't do that here.";

    if (!assignable[message.guild.id.toString()] || assignable[message.guild.id.toString()].length==0) {
        return "There are no roles I can assign!";
    }

    let list = assignable[message.guild.id.toString()];

    const embed = new discord.RichEmbed()
        .setAuthor("~~ Available Roles ~~", "https://cdn.discordapp.com/avatars/456934877841981462/5a880bec4e424aab34fcf6f62cc8a363.png?size=128")
        .setColor("#FF0000")
        .setTitle("Here are the roles users can ask me for:");

    let str = "";
    let roles = message.guild.roles;

    for (let i=0;i<list.length;i++) {
        let role = roles.find("id", list[i]);
        if (role!=null) str += role.name;
        if (i!=list.length-1) str+= ", ";
    }

    embed.addField("(get a role with '$role rolename')",str, true);

    return {embed};

}

function removeRole(message) {
    let errormsg = message.author.username+", usage is '$remove role rolename'.";

    if (!message.guild) return "Can't do that here.";

    if (!message.content.includes("$remove role ")) return errormsg;

    const text = message.content.replace("$remove role ", "").toLowerCase();

    if (!assignable[message.guild.id.toString()])
        assignable[message.guild.id.toString()] = [];

    let roles = message.guild.roles;
    let all = roles.keyArray();

    for (let i=0;i<all.length;i++) {
        let role = roles.find("id", all[i]);
        if (role.name.toLowerCase() == text && assignable[message.guild.id.toString()].includes(role.id)) {
            message.member.removeRole(role.id);
            return message.author.username+" no longer has the role '"+role.name+"'.";
        }
    }

    return "I can't remove that role from you.";
}

function attrRole(message) {
    let errormsg = message.author.username+", usage is '$role rolename'.";

    if (!message.guild) return "Can't do that here.";

    if (!message.content.includes("$role ")) return errormsg;

    const text = message.content.replace("$role ", "").toLowerCase();

    if (!assignable[message.guild.id.toString()])
        assignable[message.guild.id.toString()] = [];

    let roles = message.guild.roles;
    let all = roles.keyArray();

    for (let i=0;i<all.length;i++) {
        let role = roles.find("id", all[i]);
        if (role.name.toLowerCase() == text && assignable[message.guild.id.toString()].includes(role.id)) {
            message.member.addRole(role.id);
            return message.author.username+" now has the role '"+role.name+"'.";
        }
    }

    return "I can't assign you that role.";
}

function save() {
    fs.writeFileSync('scripts/roles/roles.txt', JSON.stringify(assignable));
}

function load() {
    let n = fs.readFileSync('scripts/roles/roles.txt', 'latin1');

    if (n.length!=0) {
        assignable = JSON.parse(n);
    }
}

module.exports = {
    addRole,
    attrRole,
    listRoles,
    save,
    removeRole
}