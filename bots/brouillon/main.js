const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalNear,Goal } = require('mineflayer-pathfinder').goals
const mineflayer = require('mineflayer');

const { Vec3 } = require('vec3');
const { round, isFraction } = require('mathjs');
const utils = require("./utils.js")
const errors = require("./errors.js")
import easyMineLoop from "../MinerBot/easyMineLoop.js";



let digPos;
var state ="";
var owner = "Ruzgarkartali";



const bot = mineflayer.createBot({
	host: "localhost",
    port : 53784,
	username: "minerV0"
});

bot.loadPlugin(pathfinder);

bot.on('whisper', async (username, message)=>{
	if(username==owner){
	
		if(utils.getOwnerPos(bot,owner)){
			state = message.split(' '); 
			bot.state = state[0];

			if(state[0]=='mine')
				{digPos = setMineLoop(state[1])}
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

bot.once('spawn', ()=>{
	const defaultMove = new Movements(bot);
	bot.pathfinder.setMovements(defaultMove);
	defaultMove.digCost = 1;
	const mcData = require('minecraft-data')(bot.version);
	cosmicLooper();
});

async function cosmicLooper() {
	console.log("state : " + bot.state);
	state[0] = bot.state;

	if(state[0] == "mine")
		await easyMineLoop(state[1],state[2]);
	if (state[0] == "follow")
		await followLoop(state[1]);
		
	setTimeout(cosmicLooper, 500);
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


/*
async function mineLoop(facing,level=16){

	var blocksList = utils.BlocksToDig(bot,facing);

	blocksList.forEach(async block => {if(block.name !='air') await utils.dig(bot,owner,block);});
	
	var nextStep = utils.nextStep(bot,facing);

	if(nextStep.name =='air' || nextStep.name =='water' || nextStep.name =='lava')
		errors.sendError(bot,owner,"POSSIBLE_CAVE");
}
*/

async function followLoop(username){

    let player = null;
	let p = null;

	if(username == "me" || username == undefined){
		player = bot.players[owner]  ? bot.players[owner].entity : null;}
	else if(username =="stay"){
		player = bot.entity;
		await attackLoop();
	}
	else{
		player = bot.players[username]  ? bot.players[username].entity : null;
	}
	p = player.position;

	bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 2))
}





