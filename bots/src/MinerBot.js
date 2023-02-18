const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalNear} = require('mineflayer-pathfinder').goals
const mineflayer = require('mineflayer');

const utils = require("./commons/utils.js")
const errors = require("./commons/errors.js")
require('dotenv').config()
var args = process.argv.slice(2);

let digPos;
var state ="";
var owner = args[1];

const bot = mineflayer.createBot({
	host: "TestBot.aternos.me",
	port : 31080,
	username: args[0]});

bot.loadPlugin(pathfinder);
bot.once('spawn', ()=>{
	const defaultMove = new Movements(bot);
	bot.pathfinder.setMovements(defaultMove);
	mcData = require('minecraft-data')(bot.version);
	cosmicLooper();
});

//**************************************************************************************** */

bot.on('whisper', async (username, message)=>{
	if(username==owner){
		if(utils.getOwnerPos(bot,owner)){
			state = message.split(' '); 
			bot.state = state[0];

			if(state[0]=='mine'){
				digPos = setMineLoop(state[1])
				}
			else if(state[0] =='come')
				setComeLoop();
			else if(state[0] =='follow'){}
			
			else
				errors.sendError(bot,owner,"WRONG_REQUEST");
		}
	}
	else
		errors.sendError(bot,username,"NOT_OWNER")		
});


async function cosmicLooper() {
	console.log("state : " + bot.state);
	state[0] = bot.state;

	if(state[0] == "mine")
		await easyMineLoop(state[1],state[2]);
	if(state[0] == "follow")
		await utils.followLoop(state[1]);
		
	setTimeout(cosmicLooper, process.env.LOOP_PERIOD);
}

async function setMineLoop(facing,level){
	if(!Object.keys(utils.angle).includes(facing))
		errors.sendError(bot,owner,"WRONG_ORIENTATION");

	if(!level)
		errors.sendError(bot,owner,"WRONG_LEVEL");

	else{
		var dest = utils.dest(bot.entity.position,facing,level);
		bot.pathfinder.setGoal(new GoalNear(dest.x+0.5, dest.y, dest.z,0.1));
	}
	return dest;
}

async function setComeLoop(){
	var dest = utils.getOwnerPos(bot,owner);
	bot.pathfinder.setGoal(new GoalNear(dest.x+0.5, dest.y, dest.z,0.1));
}

async function easyMineLoop(facing){
	if(bot.entity.position.distanceTo(digPos)<= 0.5)
		console.log("arrivé");	
	else{
		var nextStep = utils.nextStep(bot,facing);
		if(nextStep.name =='air' || nextStep.name =='water' || nextStep.name =='lava')
			errors.sendError(bot,owner,"POSSIBLE_CAVE");
	}
}







