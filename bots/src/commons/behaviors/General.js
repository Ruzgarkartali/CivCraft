const { GoalNear} = require('mineflayer-pathfinder').goals;
const utils = require('../utils.js');

//imports
const MCError = utils.MCError;

const come = (Bot) => {
	var player = Bot.bot.nearestEntity(e =>e.username==Bot.owner && e.type=='player');
	if(!player)
		return new MCError(Bot,"NULL");

    let pos = player.position;
    if(Bot.bot.entity.position.distanceTo(pos) > 16)
    	return new MCError(Bot,"TOO_FAR");
	
	Bot.bot.pathfinder.setGoal(new GoalNear(pos.x+0.5, pos.y, pos.z,0.1));
}

const drop = (Bot,s) => {
	for (let slot of Bot.bot.inventory.slots) {
		if (slot && slot.name == s) 
				Bot.bot.tossStack(slot);	
	}
}

const followLoop = async (Bot) => {
	let player = Bot.bot.players[Bot.owner]  ? Bot.bot.players[Bot.owner].entity : null;
	if(!player)
		return new MCError(Bot,"NULL");

	let p = player.position;
	Bot.bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 2))
}
exports.come=come;
exports.drop=drop;
exports.followLoop=followLoop;



