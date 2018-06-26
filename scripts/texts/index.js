const h = require("../helpers");

module.exports = {
    sleeping: function (name) {
        const a = [
            `Sssshh... ${name} looks really cute when she sleeps. Let's not disturb her.`,
            `It looks like ${name} is having a good dream. Let's back away quietly.`,
            `${h.capitalize(name)} is still resting, looking really comfortable. Come back later!`,
            `${h.capitalize(name)}'s eyes flutter, she twitches a little, whispers a word, but she's sound asleep nonetheless. Let her sleep some more.`
        ];
    
        return h.random(a);   
    },
    sleep: function (name) {
        const a = [
            "You head to bed and "+name+" follows up to keep you company and cuddle up all night. See you later!",
            h.capitalize(name)+" drags herself into bed for some refreshing rest, she'll be back later. Sleep tight, "+name+"!",
            h.capitalize(name)+" grabs your hand and asks to go sleep with you, how can you say no to that face? Rest well!",
            h.capitalize(name)+" crashes on your bed, just waiting for you to join her before she starts sleeping. Don't make her wait!"
        ];
    
        return h.random(a); 
    },
    kiss: function (name) {
        const a = [
            `You give ${name} a little peck on the cheek. She seems content with it.`,
            `You kiss ${name} right on the cheek out of nowhere. She blushes a little.`,
            `${h.capitalize(name)} is being her usual self, doesn't that deserve a kiss? It looks like she appreciates the thought.`,
            `You lean in to french kiss ${name}, but you decide against it since you're in public, turning it into a quick kiss on the lips.`
        ];
    
        return h.random(a);
    },
    hug: function (name) {
        const a = [
            `You come and hug ${name} from behind. She's a bit surprised, but appreciative nonetheless.`,
            `You catch ${name} relaxing and sit down next to her, soon enough pulling her into a hug. She's having a good time!`,
            `${h.capitalize(name)} edges close to you, and you acknowledge her presence with a good old tight hug. Looks like that's what she wanted.`,
            `Oof! You're surprised by a sudden push. ${name} jumped at you to get a hug on her own terms. She looks more relaxed now.`
        ];
    
        return h.random(a);
    },
    pet: function (name) {
        const a = [
            `You gently caress ${name}'s scalp. She hides her face a little, but it's obvious to see she likes it.`,
            `You run your hand through ${name}'s hair and fix it a little bit. She looks even prettier now!`,
            `You pat ${name}'s head delicately, trying to not ruffle her beautiful hair.`,
            `You decide to tease ${name}" by playing a little with her ear, but that's mean, so you make up for it with a little headpat to appease her.`
        ];
    
        return h.random(a);
    },
    clingy: function (name) {
        const a = [
            "It looks like "+name+" doesn't feel like a public display of affection right now. Give her some space.",
            "Mmh... "+name+" seems busy. It looks like trying to be affectionate is just going to disturb her. Leave her be for now.",
            "You lean in to cuddle "+name+" a little, but she pushes you away gently. Guess she's not up for that right now.",
            "You go up to "+name+" but she softly voices to you she thinks you're being too clingy. Maybe you shouldn't be too push."
        ];
    
        return h.random(a); 
    },
    jog: function jogText(name) {
        const a = [
            "The weather is clear and it's not too hot outside. You and "+name+" put on sports clothes and go exercise together.",
            "You don't really feel like going outside, to be honest, but "+name+" is just too cute in her sports outfit. So, might as well join her, no?",
            h.capitalize(name)+" grabs you by the arm and hands you a pair of sneakers. Looks like she wants go jogging.. shouldn't be a bad time if it's with "+name+".",
            "You notice some good weather outside and decide that "+name+" could use some exercise. It'll be fun!"
        ];
    
        return h.random(a);    
    },
    jogCooldown: function (name) {
        const a = [
            h.capitalize(name)+" has her face buried in the sofa and doesn't look like she wants to move anytime soon. ",
            h.capitalize(name)+" is busy showering after working up a sweat, let's give her some time before working out again.",
            "You approach "+name+" to suggest more jogging, but you back out of it when you notice she's massaging her legs after the effort. Not right now.",
            h.capitalize(name)+" crashed on on the sofa the second she got her sports shoes off. She's definitely not up for another round."
        ];
    
        return h.random(a);    
    },
    book: function (name) {
        const a = [
            "As you pass by, you notice a book that appears to be about "+name+"'s lastest hobby and decide to pick it up. Judging by her smile, you did the right choice.",
            "Wandering in a nearby bookshop with "+name+", she seems interested in a random book off a shelf. You grab it and buy it for her, getting a kiss as thanks.",
            "Noticing "+name+"'s stacks of unread books is getting smaller, you go out and buy another one, discreetly dropping it on the pile while she's absent. She doesn't waste time and opens it right away as she finds it, delighted.",
            "Finding a copy of one of your favorite books at the store, you decide to introduce "+name+" to your favorite series. Looks like it was a good choice."
        ];
    
        return h.random(a);    
    },
    movie: function (name) {
        const a = [
            "Looking for something to do with "+name+", you decide to rent a movie off Internet. After a complicated choice, you're ready to kill some time in an enjoyable way.",
            "You bought popcorn, you bought snacks, and now you're just missing a movie. Letting "+name+" choose it, even if the movie is subpar you're sure to have a good time!",
            "For a change, you decide to watch a cult classic with "+name+". You both end the afternoon now knowing why everybody likes that movie.",
            "Looking for something to do, you pick up a movie none of you heard from. Turns out, it's some insanely stupid b-series. On the plus side, "+name+" laughed a lot as you riffed on it, so it wasn't too bad."
        ];
    
        return h.random(a); 
    },
    dress: function (name) {
        const a = [
            "Thinking "+name+"'s wardrobe needs to be refreshed a bit, you go and pick up a dress for her. You remembered her sizes right and it fits her great!",
            "You decide to pick up a new style of dress for "+name+", hoping it will suit her. Maybe that's not what she'd have went for, but she's more than happy to have variety.",
            "Walking along, you spy a cute dress you think will probably fit "+name+". And you're right, she looks stunning in it. You should do that more often.",
            "The weather changed a bit and you think it might be time to adapt "+name+"'s wardrobe for the current temperature. Coming back with new clothes, she seems more comfortable now."
        ];
    
        return h.random(a); 
    },
    jewels: function (name) {
        const a = [
            "Passing by a jeweler, you notice a cute little ring with a stone you think "+name+" will love. Once on her finger, it's obvious you did a correct choice.",
            "You decide to pick up a necklace for "+name+", choosing one with a pretty gemstone hanging from it. It compliments her eyes really well.",
            "A splendid bracelet is on sale, and it looks like a perfect gift for "+name+". Classy but not too showy, she looks wealthier just by having it.",
            "You help "+name+" put on her new pair of earrings, being careful not to pinch her earlobes. The sheen from the plating makes her look positively beaming."
        ];
    
        return h.random(a); 
    },
    veggies: function (name) {
        const a = [
            "Today on the menu is a vegetarian meal, a stir fry made of carrots, onions and soybean sprouts with sesame seeds and a copious amount of soy sauce, served with rice. "+name+" has nothing but compliments to say about that tasty dish.",
            "Out of inspiration, you decide to cook some simple pasta with a lovingly heated up tomato sauce, given a better kick thanks to some herbs and spices. Seeing "+name+"'s face, she still appreciates simplicity.",
            "You cooked some spinach and polenta for "+name+". Healty meals are always a good idea, and she's not one to disagree with that. Maybe you'll get ice cream or something for dessert..",
            "To change things, you decide to do a salade with lettuce, shredded carrot, shredded beetroot, and a tahini sauce. "+name+" greatly appreciates that kind of refreshing meal."
        ];
    
        return h.random(a); 
    },
    fish: function (name) {
        const a = [
            h.capitalize(name)+" having a refined palate, you got her some sushi. Her face when she accidentally bites into a little too much wasabi is a sight to behold!",
            "You plate up a hearty amount of white rice and a big fillet of tuna for "+name+". One more sprinkle of seasoning and it's devoured within minutes by "+name+".",
            "The roles are reversed and this time "+name+" is the one cooking, making some tempura with the shirmp you bought earlier. It turns out fried perfectly and the sauce is just right too. "+name+" is a great cook, isn't she?",
            "You cook a white fish fillet for "+name+", accompagned by a thick tomato sauce. She instantly starts digging in, scooping up as much sauce as she can with each bite."
        ];
    
        return h.random(a); 
    },
    meat: function (name) {
        const a = [
            "You slide a nice, juicy chicken breast out of the cast-iron pan and into "+name+"'s plate. She doesn't even wait for the rest of the dish to grab a bite.",
            "Satisfied with your sirloin steak, you plate it up with some aspargus and serve it to "+name+". She's ecstatic about it.",
            "You picked up ground meat to make hamburgers, but in an attempt to be classy you present them to "+name+" as \"steamed hams\" from Utica.",
            "Taking inspiration from one of your japanese anime, you decide to deep-fry some pork cutlets to make tonkatsu. You made a mess of the kitchen while frying, but "+name+" thinks it's tasty nonetheless."
        ];
    
        return h.random(a); 
    },
    chocolate: function (name) {
        const a = [
            "You hand a tablet of fine, dark chocolate to "+name+", which she savours every square of, even feeding you one of them.",
            h.capitalize(name)+" shows up with a bag of chocolate candies to share with you. You end up both taking turns picking one in the bag, quickly emptying it.",
            "You share a tablet of white chocolate with "+name+". So greasy, so sugary, but so soft and sweet. Quite the guilty pleasure.",
            "What's in the box? A random assortment of chocolates, and neither of you know what you're getting with, leading to "+name+" and you trying to guess what each of them are before noticing explanations on the bottom of the box."
        ];
    
        return h.random(a); 
    },
    flowers: function (name) {
        const a = [
            "You got "+name+" a nice, big, varied bouquet of flowers, with a combination of wildly different smells. "+name+" is a little overwhelmed by the size, they quickly get into a vase.",
            "You choose a single, beautiful rose to bring home to "+name+". It looks gorgeous in her hair.",
            h.capitalize(name)+" hands you a bouquet of pretty, small violet flowers she apparently delicately plucked herself. The scent is overpowering!",
            h.capitalize(name)+" carefully grasps the pot containing a delicate orchid from your hands, sniffing it with a smile on her face, before looking up how to care for it."
        ];
    
        return h.random(a); 
    },
    drink: function (name) {
        const a = [
            h.capitalize(name)+" takes a large sip from a weird fluorescent, colored energy drink. She looks all pumped up now.",
            "A glass of that ginger-based energy drink later, and "+name+" is ready for anything!",
            h.capitalize(name)+" cracks open a can of some generic energy drink, frowning at the smell, but downs it in an instant before hiccuping.",
            h.capitalize(name)+" slowly sips up a caffeine-based drink, getting herself ready for the rest of the day."
        ];
    
        return h.random(a);
    },
    game: function (name) {
        const a = [
            "You hand "+name+" an RPG, wondering how long it'll take her to go through the main story.. and if she'll stop at the final boss or go out of her way to do the sidequests.",
            h.capitalize(name)+" readies herself for another FPS to run and gun through. Her aim at those games is steadily getting better and she's starting to be pretty good in multiplayer.",
            "You wanted to show "+name+" that new puzzle game she could defy you at, but she's still hooked to the last one. You leave it on the pile for later.",
            h.capitalize(name)+" sits down on the sofa with you to play a racing game, knocking your own car asides several times before pouting as you throw a blue shell at her."
        ];
    
        return h.random(a);
    },
    phone: function (name) {
        const a = [
            "You got "+name+" the new model of smart phone in store. She immediately makes use of it by phoning you while you are in the same room.",
            "As you show "+name+" the new phone you got her, she accidentally sends you a text full of gibberish while getting used to it.",
            h.capitalize(name)+" wastes no time, taking a selfie with you right after you hand her a new phone, setting it as her background picture. She's really cute on it.",
            "A few minutes after you gave "+name+" her new phone, she's still struggling with it. The phone starts working better when you peel off the sticker on the screen, and "+name+" hides her face out of embarassment."
        ];
    
        return h.random(a);
    },
    notHungry: function (name) {
        const a = [
            "You ask "+name+" if she wants more food, but she shakes her head.",
            "Looking at "+name+", it looks like she's full. She's not gonna eat for a moment.",
            "You attempt to give "+name+" a second serving of food, but she's not even done with the first one.",
            h.capitalize(name)+" is stuffed! She can't really eat more for the time being."
        ];
    
        return h.random(a);
    },
    location: function (name) {
        const a = [
            `${name} finds herself inside an ancient pyramid.`,
            `${name} is transported to a darkened, burnt forest.`,
            `Suddenly, the floor below ${name}'s feet changes. She looks around and notices she's in a hallway of an empty palace.`,
            `${name} notices the sky becoming purple, her surroundings blurry and moving of their own accord. Is this some kind of dream?`,
            `Looks like ${name} was taken to the peak of a rocky mountain.`,
            `${name} realises she's in some sort of hostile, turbulent and digital environment. The floor and walls are made of grids and pixels.`
        ];
    
        return h.random(a);
    },
    event3enemy: function () {
        const a = [
            "A massive arachnid beast approaches her to strike. Its legs strike from:",
            "A violent monster spots her and goes for the kill. It attacks from:",
            "A predator smells her fear and confusion and jumps at her. It tries to bite from:",
            "A deranged human shouts \"Intruder!\" and lunges at her with a spear. The stabs come from:"
        ];
    
        return h.random(a);
    }
};
