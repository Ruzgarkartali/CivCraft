const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalNear,Goal } = require('mineflayer-pathfinder').goals
const mineflayer = require('mineflayer');

const utils = require("./commons/utils.js");
const errors = require("./commons/errors.js");
require('dotenv').config()
var args = process.argv.slice(2);


var state ="";
var owner = args[1];


const bot = mineflayer.createBot({host: process.env.HOST,port : process.env.PORT,username: args[0]});
bot.loadPlugin(pathfinder);
bot.once('spawn', ()=>{
	const defaultMove = new Movements(bot);
	bot.pathfinder.setMovements(defaultMove);
	defaultMove.digCost = 1;
	mcData = require('minecraft-data')(bot.version);
	cosmicLooper();
});

bot.on('whisper', async (username, message)=>{
	if(username==owner){
	
		if(utils.getOwnerPos(bot,owner)){
			state = message.split(' '); 
			bot.state = state[0];

			if(state[0]=='work'){
                work()
            }
			
			else
				errors.sendError(bot,owner,"WRONG_REQUEST");
		}
	}
	else
		errors.sendError(bot,username,"NOT_OWNER");		
});

async function cosmicLooper() {
	console.log("state : " + bot.state);
	state[0] = bot.state;

	setTimeout(cosmicLooper, 500);
}

async function work(){
    let cow = bot.nearestEntity(e => e.name =='cow')
    console.log(cow);
}