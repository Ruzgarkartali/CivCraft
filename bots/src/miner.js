const pathfinder = require('mineflayer-pathfinder').pathfinder;
const Movements = require('mineflayer-pathfinder').Movements;
const { GoalNear} = require('mineflayer-pathfinder').goals;
const mineflayer = require('mineflayer');
const utils = require("./commons/utils.js");
const errors = require("./commons/errors.js");
require('dotenv').config();
const { workerData, parentPort } = require('worker_threads');
const { re } = require('mathjs');
const { readSync } = require('fs');

console.log("maxime est rentré");

let owner=workerData["arg2"];
let botname =workerData["arg1"];

/*
parentPort.on('message', (msg) => {
	console.log("ddd");
	console.log(msg);
});
*/


let digPos;
var state ="";

const bot = mineflayer.createBot({
	host: "TestBot.aternos.me",
	port : 31080,
	username:botname});


bot.loadPlugin(pathfinder);
bot.once('spawn', ()=>{
	const defaultMove = new Movements(bot);
	bot.pathfinder.setMovements(defaultMove);
	mcData = require('minecraft-data')(bot.version);
	cosmicLooper();
});

bot.once('login',()=>{
	parentPort.postMessage("logged");
})
bot.once('end',(reason)=>{
	parentPort.postMessage("exit");
})

//**************************************************************************************** */

bot.on('whisper', async (username, message)=>{
	user = message.split(' ')[0]; 
	if(username=="AlphaBot" && user==owner){
		if(utils.getOwnerPos(bot,owner)){
			state = message.split(' '); 
			bot.state = state[1];

			if(state[1]=='mine')
				digPos = setMineLoop(state[2]);
			else if(state[1] =='come')
				setComeLoop();
			else if(state[1] =='follow'){}
			
			else
				errors.sendError(bot,owner,"WRONG_REQUEST");
		}
	}
	else
		errors.sendError(bot,username,"NOT_OWNER")		
});


async function cosmicLooper() {

	state[1] = bot.state;

	if(state[1] == "mine")
		await easyMineLoop(state[2]);
	if(state[1] == "follow")
		await utils.followLoop(owner);
		
	setTimeout(cosmicLooper, 2000);
}

async function setMineLoop(facing){
	if(!Object.keys(utils.angle).includes(facing))
		errors.sendError(bot,owner,"WRONG_ORIENTATION");

		/*
	if(!level)
		errors.sendError(bot,owner,"WRONG_LEVEL");
		*/

	else{
		var dest = utils.dest(bot.entity.position,facing);
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
console.log(workerData);





