const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalNear,Goal } = require('mineflayer-pathfinder').goals
const mineflayer = require('mineflayer');
const Math = require("mathjs");
const { Vec3 } = require('vec3');
const { round, isFraction } = require('mathjs');

var owner = 'Ruzgarkartali';
let digPos;
var state = '';
let done= false;


const bot = mineflayer.createBot({
	host: "TestBot.aternos.me",
    port : 31080,
	username: "minerbot"
	//viewDistance: "tiny",
});

bot.loadPlugin(pathfinder);

//event 
bot.on('whisper', async (username, message)=>{
    state = message.split(' ');

	switch(state[0]){
		case 'mine':
			if (!done){
				digPos = bot.neastatetEntity();
				done = true;
			}
			digPos = digPos.position;
			break;
	}
});

bot.once('spawn', ()=>{
	mcData = require('minecraft-data')(bot.version);
	//############### INIT #################################
	console.log("gamemode : "+bot.game.gameMode);
	//################# PATH INIT ###############################
	const defaultMove = new Movements(bot);
	defaultMove.digCost = 0.7;
	defaultMove.scafoldingBlocks = [];
	defaultMove.scafoldingBlocks.push(mcData.itemsByName['cobblestone'].id);
    defaultMove.scafoldingBlocks.push(mcData.itemsByName['dirt'].id);
	bot.pathfinder.setMovements(defaultMove);
	//################# OTHERS ###############################
	cosmicLooper();
});

async function cosmicLooper() {
	console.log('state : '+ state);

	if(state[0] == "mine"){
 		await mineLoop(state[1]);
	}

	else if(state[0] == 'drop'){
		await drop(state[1]);
	}

    else if(state == "follow me"){
		await followLoop();
	}

	setTimeout(cosmicLooper, 500);
}



async function followLoop(){
	let player = bot.players[owner]  ? bot.players[owner].entity : null;
	let p = player.position;
	bot.pathfinder.setGoal(new Goal(p.x, p.y, p.z, 1))
}

async function mineLoop(facing){
	
    let dir = {"nord": Math.pi/2,"sud": -Math.pi,"ouest" : Math.pi,"est" : 0};
	
    bot.pathfinder.setGoal(new GoalNear(digPos.x, digPos.y, digPos.z,1));
	

	//si erreur d'ecriture
    if(!Object.keys(dir).includes(facing)){bot.whisper(owner,"Je n'ai pas compris l'orientation. Réessaye (nord/sud/est/ouest)");state = '';}
	else if(bot.entity.position.distanceTo(digPos)< 1.5){
		blocksList = BlocksToDig(facing);

		blocksList.forEach(async elem => {
			if(elem.name !='air'){
				console.log("je casse : " + elem.name);
				bot.lookAt(elem.position);
				equipPickAxe();

				try{
					await bot.dig(elem);
				}catch(e){
					console.log(e);
				}
			
			}
		});
		digPos = blocksList[1];
		bot.pathfinder.setGoal(new GoalNear(digPos.x, digPos.y, digPos.z,0.1));
	}
	else{
		console.log("pas encore arrivé, il statete "+ round(bot.entity.position.distanceTo(digPos),2));
	}
	
}

async function drop(s){
	for (slot of bot.inventory.slots) {
		if (slot && slot.name == s) 
				bot.tossStack(slot,drop);	
	}
}

//############ utils ####################

function BlocksToDig(facing){
	
	let XZ = digPos;
	let dir = {"nord": XZ.offset(0,0,-1), "sud":  XZ.offset(0,0,1), "ouest" : XZ.offset(-1,0,0),"est" :  XZ.offset(1,0,0)};
	XZ = dir[facing];
	let blocksList = [
		bot.blockAt(XZ.offset(0,1,0)),
		bot.blockAt(XZ),
		bot.blockAt(XZ.offset(0,1,0)),
		bot.blockAt(XZ),
		bot.blockAt(XZ.offset(0,-1,0)),
		bot.blockAt(XZ.offset(0,2,0))
	];
	return blocksList;
}


function equipPickAxe(){
	let itmax = 0;
	let list = ["wooden_pickaxe","stone_pickaxe","iron_pickaxe",
	"golden_pickaxe","diamond_pickaxe","netherite_pickaxe"];
	
	const axes = bot.inventory.items().filter(item => list.includes(item.name))

	if(axes.length==0){
		console.log("je n'ai pas de pickaxe sur moi");
		state='';
		return
	}

	for(let i = 0; i < axes.length; i++){
		let it = list.indexOf(axes[i].name);
		if (itmax < it){
			itmax = it
		}
	}
	console.log(`je m'équipe de ma ${list[itmax]}`);
	console.log("id "+ mcData.itemsByName[list[itmax]].id);
	bot.equip(mcData.itemsByName[list[itmax]].id);
}

function sleep(ms) {
	return new Promise((stateolve) => {
	  setTimeout(stateolve, ms);
	});
  }