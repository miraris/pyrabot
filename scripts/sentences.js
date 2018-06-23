var exports = module.exports = {};

const fs = require('fs');
const u = require('./utils.js');
const minsentencesize = 11;
var lastupdate = new Date().getTime();

exports.wordcount = function() {
    return b.wordcount();
}

exports.save = function() {
    b.save();
}

exports.clear = function() {
    b.clear();
}

exports.learn = function(s) {
    b.safeConsume(s);
}

exports.reply = function() {
    let r = b.safeGenerate();
    while (r === "") r = b.safeGenerate();
    return r;
}

function isException(s) {
    return s.length>20 || !isAscii(s) || s.endsWith(">") || s.startsWith("<") ||
    s.startsWith("$") || s.startsWith("%") || s === "" || s.startsWith("http") ||
    s.includes("www.") || s.includes("tvvideos") || s.includes("comattachments");
}

function isAscii(str) {
    return /^[\x00-\x7F]*$/.test(str);
}

class Brain {

    constructor() {
        console.log("Brain: loading.");
        this.nodes = [];
        this.starters = {};
        this.load();
    }

    clear() {
        this.nodes = [];
        this.starters = {};
        this.save();
    }

    save() {
        let n = "";
        for (let i=0;i<this.nodes.length;i++) {
            n += JSON.stringify(this.nodes[i]);
            
            if (i<this.nodes.length-1) n += ";";
        }
        fs.writeFileSync('scripts/sentences/nodes.txt', n);

        fs.writeFileSync('scripts/sentences/starters.txt', JSON.stringify(this.starters));

        //console.log("Brain: saving.");
       
    }

    safeConsume(s) {
        try {
            this.consume(s);
        } catch (e) {
            console.log("Brain#consume: Error ->\n"+e);
        }
    }

    safeGenerate() {
        try {
            return this.generate();
        } catch (e) {
            console.log("Brain#generate: Error -> "+e);
            return "";
        }
    }

    load() {
        let n = fs.readFileSync('scripts/sentences/nodes.txt', 'latin1');
        if (n.length!=0) {
            let all = n.split(";");
            for (let i=0;i<all.length;i++) {
                this.nodes.push(new Node(JSON.parse(all[i])));
            }
        }

        let st = fs.readFileSync('scripts/sentences/starters.txt', 'latin1');
        if (st.length!=0) {
            this.starters = JSON.parse(st);
        }

        if (this.nodes.length==1)
        console.log("Brain#load: A total of 1 node now stored.");
        else
        console.log("Brain#load: A total of "+this.nodes.length+" nodes now stored.");

    }

    consume(s) {
        let sarray = s.split(/[\.?!]/g); //sentences
        
        for (let z=0;z<sarray.length;z++) { //each sentence

            let words = sarray[z].replace(/[\[\];?!\.\\\/:(){},\*\"]/g, "").split(" ");

            for (let i=0;i<words.length;i++) { //each word
                let w = words[i];

                if (isException(w)) continue;

                if (i==0 || (i==1 && words[0]==='')) {

                    this.updateStarter(w);

                    if (!this.nodeExists(w)) {
                        this.nodes.push(new Node(w));
                    }

                    if (words.length==1 || (words.length==2 && words[0]==='')) {
                        this.getNode(w).update("null value");
                    } else {
                        this.getNode(w).update(words[i+1]);
                    }

                } else if (i<words.length-1) {

                    if (!this.nodeExists(w)) {
                        this.nodes.push(new Node(w));
                    }

                    this.getNode(w).update(words[i+1]);

                } else {

                    if (!this.nodeExists(w)) {
                        this.nodes.push(new Node(w));
                    }

                    this.getNode(w).update("null value");
                }
                
            }
        }

        /*if (this.nodes.length==1)
        console.log("Brain#consume: A total of 1 node now stored.");
        else
        console.log("Brain#consume: A total of "+this.nodes.length+" nodes now stored.");*/

        let now = new Date().getTime();
        if (now>lastupdate+5*60*1000) { //every 5 min
            this.save();
            lastupdate = now;
        }
    }

    generate() {
        if (this.nodes.length==0 || this.starters.length==0) {
            console.log("Brain#generate: Not enough knowledge.");
            return;
        }

        let absolutemax = 50;
        let w = null;
        let res = "";

        for (let i=0;i<absolutemax;i++) {

            if (i==0) {

                w = this.randomStarter(Math.random());              

                while (this.getNode(w).isEnd()) {
                    w = this.randomStarter(Math.random());                   
                }
                res = this.capitalize(w);

            } else if (i<absolutemax-1) {

                if (this.getNode(w).isEnd()) {
                    res+=".";
                    if (res.length>=minsentencesize) return res;
                    else {
                        w = this.randomStarter(Math.random());
                        while (this.getNode(w).isEnd()) {
                            w = this.randomStarter(Math.random());                   
                        }
                        res = this.capitalize(w)+" ";
                    }
                }
                else res+=" ";

                w = this.getNode(w).noNullRandomChild(Math.random());
                res += w;
        

            } else {

                if (this.getNode(w).isEnd()) {
                    res+=".";
                    return res;
                }

                w = this.getNode(w).noNullRandomChild(Math.random());
                res += w;

                res += ".";
                return res;
            }
        }
        
        return res;
    }

    generateLim(limit) {
        if (this.nodes.length==0 || this.starters.length==0) {
            console.log("Brain#generateLim: Not enough knowledge.");
            return;
        }

        console.log("==== Brain#generate with static limit ==== Output ====");
        let w = null;
        let res = "";

        for (let i=0;i<limit;i++) {

            let roll = Math.random();

            if (i==0) {

                w = this.randomStarter(roll);
                
                res += this.capitalize(w);

                if (limit==1) res+=".";
                else if (this.getNode(w).isEnd()) res+=".\n";
                else res+=" ";

            } else if (i<limit-1) {

                if (this.getNode(w).isEnd()) {
                    w = this.randomStarter(roll);
                    res += this.capitalize(w);
                } else {
                    w = this.getNode(w).randomChild(roll);
                    res += w;
                }

                if (this.getNode(w).isEnd()) res+=".\n";
                else res+=" ";

            } else {

                if (this.getNode(w).isEnd()) {
                    w = this.randomStarter(roll);
                    res += this.capitalize(w);
                } else {
                    w = this.getNode(w).randomChild(roll);
                    res += w;
                }

                res += ".";
            }
        }
        
        return res;
    }

    randomStarter(chance) {
        let d = this.starterDenominator();
        let total = 0;
        let array = Object.keys(this.starters);
        for (let i=0;i<array.length;i++) {
            if (chance<(this.starters[array[i]]+total)/d) return array[i];
            total += this.starters[array[i]];
        }
        return null;
    }

    starterDenominator() {
        let x = 0;
        let array = Object.keys(this.starters);
        for (let i=0;i<array.length;i++) {
            x += this.starters[array[i]];
        }
        return x;
    }

    updateStarter(s) {
        if (this.starters[s]) this.starters[s]++;
        else this.starters[s] = 1; 
    }

    nodeExists(s) {
        for (let i=0;i<this.nodes.length;i++) {
            if (this.nodes[i].word === s) return true;
        }
        return false;
    }

    getNode(s) {
        for (let i=0;i<this.nodes.length;i++) {
            if (this.nodes[i].word === s) return this.nodes[i];
        }
        return null;
    }

    status() {
        return "Brain#status: "+this.nodes.length+" nodes, "+Object.keys(this.starters).length+" starters stored.";
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    wordcount() {
        if (this.nodes.length>1) return "I know "+u.prettynumber(this.nodes.length)+" words!";
        else return "I know 1 word!";
    }
}

class Node {

    constructor(w) {
        if (typeof w === "string") {
            this.word = w;
            this.children = {};
        } else {
            this.word = w.word;
            this.children = w.children;
        }
    }

    update(s) {
        if (!isAscii(s) || s == undefined || isException(s)) return;
        if (this.children[s]) this.children[s]++;
        else this.children[s] = 1;
    }

    noNullRandomChild(chance) {
        let c = this.randomChild(chance);
        while (c === "null value") {
            let newchance = Math.random();
            c = this.randomChild(newchance);
        }
        return c;
    }

    randomChild(chance) {
        let d = this.childDenominator();
        let total = 0;
        let array = Object.keys(this.children);
        for (let i=0;i<array.length;i++) {
            if (chance<(this.children[array[i]]+total)/d) return array[i];
            total += this.children[array[i]];
        }
        return null;
    }

    isEnd() {
        if (!this.children["null value"]) return false;
        else return Math.random()<=(this.children["null value"]/this.childDenominator());
    }

    childDenominator() {
        let x = 0;
        let array = Object.keys(this.children);
        for (let i=0;i<array.length;i++) {
            x += this.children[array[i]];
        }
        return x;
    }

    data() {
        let array = Object.keys(this.children);
        let r = "Word: "+this.word+"\nChildren: ";
        for (let i=0;i<array.length;i++) {
            r += "<"+array[i]+","+this.children[array[i]]+"> ";
        }
        return r;
    }
}

var b = new Brain();