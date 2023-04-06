const mcData = require('minecraft-data')('1.18');
const Math = require("mathjs");
const mineflayer = require('mineflayer');
const data = require('./data.json');
const Vec3 = require('vec3');
require('dotenv').config({path:"../.env"});

//imports
const trees = data.trees;
const bests = data.bests;

class MCBot{
  
    constructor(botname,owner,work){
        this.bot = mineflayer.createBot({
            host: "TestBot.aternos.me",
            port : 31080,
            username:botname});
        this.owner = owner;
        this.state = null;
		this.work  = null;
    }
    
}

class MCError{
    constructor(Bot, code){
        console.log(data.errors[code]);
        Bot.bot.whisper(Bot.owner,data.errors[code]);
        
        Bot.state = null;
        Bot.bot.pathfinder.stop();
    }
}

const getOwnerPos = (Bot) => {
    try{
        var player = digPos = Bot.bot.nearestEntity(e =>e.username==Bot.owner && e.type=='player');
        if(!player)
		    return new MCError(Bot,"TOO_FAR");
        let pos = player.position;
        if(Bot.bot.entity.position.distanceTo(pos) > process.env.MAX_ORDER_DISTANCE || !pos)
            return new MCError(Bot,"TOO_FAR");
        return new Vec3(pos.x,pos.y,pos.z);
    }catch(e){
        console.log(e);
    }
 
}

const equipBest = async (Bot,s)=>{
	let itmax = 0;
	let list = data.bests[s];

	if(!s)
		return;

	const items = Bot.bot.inventory.items().filter(item => list.includes(item.name));

    //si le bot n'a pas l'item recherché
	if(!items.length)
		return new MCError(Bot,"NO_"+s);

	//trouver le meilleur 
	for(let i = 0; i < items.length; i++)
		if (itmax < list.indexOf(items[i].name)) itmax = list.indexOf(items[i].name)
	
	console.log(`je m'équipe de ma ${list[itmax]}`);
    try{
        await Bot.bot.equip(mcData.itemsByName[list[itmax]].id,null);
    }catch(e){
        console.log(e);
    }
}


const sleep = async (ms) => {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
}

exports.MCBot = MCBot;
exports.equipBest = equipBest;
exports.sleep = sleep;
exports.MCError = MCError;
exports.getOwnerPos = getOwnerPos;
