const { GoalNear} = require('mineflayer-pathfinder').goals;
const { log } = require('mathjs');
const utils = require('../utils.js');

//imports
const sleep = utils.sleep;
const MCError = utils.MCError;

const getDestination = (Bot,facing)=>{
	let level = 16;
	let digPos = Bot.bot.entity.position; 
	let dir1 = {
		"nord": digPos.offset(0,-level,-level), 
		"sud":  digPos.offset(0,-level,level), 
		"ouest" : digPos.offset(-level,-level,0),
		"est" :  digPos.offset(level,-level,0)
	};
	return dir1[facing];
}
const mineLoop = async (Bot,facing,dest)=>{
	if(Bot.bot.entity.position.distanceTo(dest)<= 0.5)
		Bot.state = '';
	else{
		
		//nextStep
		let p = Bot.bot.entity.position;
		let dir1 = {"nord": p.offset(0,-1,-1), "sud":  p.offset(0,-1,1), "ouest" : p.offset(-1,-1,0),"est" :  p.offset(1,-1,0)};
		let nextStep = Bot.bot.blockAt(dir1[facing]);

		console.log(nextStep);

		if(nextStep.name =='air' || nextStep.name =='water' || nextStep.name =='lava')
			return new MCError(Bot,"POSSIBLE_CAVE");
		else
			nextStep  = nextStep.position;
			Bot.bot.pathfinder.setGoal(new GoalNear(nextStep.x,nextStep.y,nextStep.z,0.1));
			await sleep(2000);
	}
}
exports.getDestination = getDestination;
exports.mineLoop=mineLoop;
