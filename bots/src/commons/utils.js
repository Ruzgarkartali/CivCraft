const errors = require("./errors.js")
const { Vec3 } = require('vec3');
const MinecraftData = require("minecraft-data");
const mineflayer = require('mineflayer');
const Math = require("mathjs");


const drop = (s) => {
	for (slot of bot.inventory.slots) {
		if (slot && slot.name == s) 
				bot.tossStack(slot,drop);	
	}
}

const getOwnerPos = (bot,owner) => {
    var player = digPos = bot.nearestEntity(e =>e.username==owner && e.type=='player');
    let pos = player.position;
    if(bot.entity.position.distanceTo(pos) > 16)
        return errors.sendError(bot,owner,"TOO_FAR");
    return new Vec3(pos.x,pos.y,pos.z);;
}

const equipBest = async (bot,owner,s)=>{
	let itmax = 0;
	let list = bests[s];
	console.log("s : " + s);
	if(!s)
		return;

	const items = bot.inventory.items().filter(item => list.includes(item.name))

    //si le bot n'a pas l'item recherché
	if(!items.length)
		return errors.sendError(bot,owner,"NO_"+s);

	//trouver le meilleur 
	for(let i = 0; i < items.length; i++)
		if (itmax < list.indexOf(items[i].name))
			itmax = list.indexOf(items[i].name)
	
	console.log(`je m'équipe de ma ${list[itmax]}`);
    try{
        await bot.equip(mcData.itemsByName[list[itmax]].id);
    }catch(e){
        console.log(e);
    }
}

const BlocksToDig = (bot,facing)=>{
	let digPos = bot.entity.position;
	let dir1 = {"nord": digPos.offset(0,0,-1), "sud":  digPos.offset(0,0,1), "ouest" : digPos.offset(-1,0,0),"est" :  digPos.offset(1,0,0)};
	let XZ = dir1[facing];
	let blocksList = [
        bot.blockAt(XZ.offset(0,1,0)),
		bot.blockAt(XZ),
		bot.blockAt(XZ.offset(0,-1,0))//descend de -1
	];
	return blocksList;
}

const dest = (digPos,facing,level)=>{
	let dir1 = {"nord": digPos.offset(0,-level,-level), "sud":  digPos.offset(0,-level,level), "ouest" : digPos.offset(-level,-level,0),"est" :  digPos.offset(level,-level,0)};
	return dir1[facing];
}

const nextStep = (bot,facing)=>{
	p = bot.entity.position;
	let dir1 = {"nord": p.offset(0,-2,-1), "sud":  p.offset(0,-2,1), "ouest" : p.offset(-1,-2,0),"est" :  p.offset(1,-2,0)};
	return bot.blockAt(dir1[facing]);
}

const dig = async (bot,owner,block) => {
	await bot.lookAt(block.position);

	if (block.diggable==false)
		errors.sendError(bot,owner,"NOT_DIGGABLE");
	if(block.name=='lava')
		errors.sendError(bot,owner,"LAVA")
	
	let bestTool = null;
	let liste = block.material.split('/');

	for (const key of Object.keys(bests)) {
		if (liste.find(element => element == key))
			bestTool = key.toUpperCase();
	}

    try{
		await equipBest(bot,owner,bestTool);
        await bot.dig(block);
    }catch(e){
        console.log(e);
    }
}

const bests = {
    "PICKAXE" : ["wooden_pickaxe","stone_pickaxe","iron_pickaxe","golden_pickaxe","diamond_pickaxe","netherite_pickaxe"],
    "AXE" : ["wooden_axe","stone_axe","iron_axe","golden_axe","diamond_axe","netherite_axe"],
	"SHOVEL":["wooden_shovel","stone_shovel","iron_shovel","golden_shovel","diamond_shovel","netherite_shovel"]
}

const angle = {"nord": Math.pi/2,"sud": -Math.pi,"ouest" : Math.pi,"est" : 0};
//const dir = {"nord": digPos.offset(0,-level,-level), "sud":  digPos.offset(0,-level,level), "ouest" : digPos.offset(-level,-level,0),"est" :  digPos.offset(level,-level,0)};
	
const followLoop = async (username) => {

    let player = null;
	let p = null;

	if(username == "me" || username == undefined){
		player = bot.players[owner]  ? bot.players[owner].entity : null;}
	// else if(username =="stay"){
	// 	player = bot.entity;
	// 	await attackLoop();
	// }
	else{
		player = bot.players[username]  ? bot.players[username].entity : null;
	}
	p = player.position;

	bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 2))
}

const sleep = async (ms) => {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
}

exports.drop = drop;
exports.getOwnerPos = getOwnerPos;
//exports.dir = dir;
exports.angle = angle;
exports.BlocksToDig = BlocksToDig;
exports.equipBest = equipBest;
exports.dig = dig;
exports.dest = dest;
exports.nextStep = nextStep;
exports.followLoop = followLoop;
exports.sleep = sleep;