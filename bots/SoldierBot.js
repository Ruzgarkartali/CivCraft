const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalNear } = require('mineflayer-pathfinder').goals
const mineflayer = require('mineflayer');

const bot = mineflayer.createBot({
	host: "TestBot.aternos.me",
    port : 31080,
	username: "soldierBot"
	//viewDistance: "tiny",
});
bot.loadPlugin(pathfinder);
var owner = "Melih";
nreg = 5;
var res = '';
chef = false;
regiment = ['soldierbot2', 'soldierbot3'];


bot.once('spawn', ()=>{
	mcData = require('minecraft-data')(bot.version);
	//############### INIT #################################
	bot.game.gameMode="survival";
	console.log("gamemode : "+bot.game.gameMode);
	//################# PATH INIT ###############################
	const defaultMove = new Movements(bot);
	defaultMove.canDig = false;
	defaultMove.scafoldingBlocks = [];
	defaultMove.scafoldingBlocks.push(mcData.itemsByName['scaffolding'].id);
	bot.pathfinder.setMovements(defaultMove);
	
	console.log(defaultMove.scafoldingBlocks);

	//################# OTHERS ###############################
	cosmicLooper();
});

bot.on('whisper', async (username, message)=>{
	res = message.split(' ');
});


async function cosmicLooper() {
	if (res[0] == "follow"){
		await followLoop(res[1]);
	}

    if (res[0] == "regiment" && regiment != null){
        if (res[0] == "follow"){
            await followLoop(res[1]);
        }
    }

	if (res[0] == "stay"){
		await followLoop("stay");

	}

	if(res[0] == "attack"){
		await attackLoop();
	}

    if(res[0]  == "protect"){
        await protectLoop(res[1]);
    }

	if(res =='stop'){
	}
	setTimeout(cosmicLooper, 500);
}


//##################### UTILS ###############################

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


async function attackLoop(){
	let enemiesSword = ["wither_skeleton","stray","wither_skull","husk","zombie_villager",
					"creeper","skeleton","spider","zombie","slime","witch","phantom"];
	let enemiesBow = ["wither_skeleton","skeleton","blaze","magma_cube","ender_dragon"];

	const mobFilter = e => e.type === 'mob' && enemiesSword.includes(e.name) && bot.entity.position.distanceTo(e.position) < 5;
	const mob = bot.nearestEntity(mobFilter);

	if (mob){
		bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 2))

		bot.chat(`Attention il y a un ${mob.name}`);
		p = mob.position;
		await bot.lookAt(p);

		if(bot.entity.position.distanceTo(p) < 3){
			equipSword();
			bot.attack(mob);	
		}
	}
}



function equipSword(){
	let itmax = 0;
	let list = ["wooden_sword","stone_sword","iron_sword",
	"golden_sword","diamond_sword","netherite_sword"];
	
	const axes = bot.inventory.items().filter(item => list.includes(item.name))
	for(let i = 0; i < axes.length; i++){
		let it = list.indexOf(axes[i].name);
		if (itmax < it){
			itmax = it
		}
	}
	console.log(`je m'équipe de ma ${list[itmax]}`);
	bot.equip(mcData.itemsByName[list[itmax]].id);
}

// if mob is not underground
function notUG(mob){
	y = mob.position.y;
	let grassList = bot.findBlocks({
		matching:(blk)=>{
			return(blk.position.x == x && blk.position.z == z  && blk.name=="grass_block");
		}
	});

}
