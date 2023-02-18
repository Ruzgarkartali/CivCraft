const pathfinder = require('mineflayer-pathfinder').pathfinder
const Movements = require('mineflayer-pathfinder').Movements
const { GoalNear } = require('mineflayer-pathfinder').goals
const mineflayer = require('mineflayer');
const Math = require("mathjs")
const vec3 = require('vec3');
const { count, sluDependencies } = require('mathjs');

//**************************************************************** 
let res = '';
let boucle = 0;
var treeList;
var owner = 'Ruzgarkartali';
var tree = null;
var digged = false;

const bot = mineflayer.createBot({
	host: "TestBot.aternos.me",
    port : 31080,
	username: "woodbot"
	//viewDistance: "tiny",
});
bot.loadPlugin(pathfinder);


bot.once('spawn', ()=>{
	mcData = require('minecraft-data')(bot.version);
	//############### INIT #################################
	bot.game.gameMode="survival";
	console.log("gamemode : "+bot.game.gameMode);
	//################# PATH INIT ###############################
	const defaultMove = new Movements(bot);
	defaultMove.digCost = 0.7;
	defaultMove.scafoldingBlocks = [];
	defaultMove.scafoldingBlocks.push(mcData.itemsByName['scaffolding'].id);
	bot.pathfinder.setMovements(defaultMove);
	console.log(defaultMove.scafoldingBlocks);

	//################# OTHERS ###############################
	cosmicLooper();
});

bot.on('whisper', async (username, message)=>{
	console.log("salut");
	res = message;
});

async function cosmicLooper() {
	if (res == 'work'){
		await workLoop();
	}

	if(res == "follow me"){
		await followLoop();
	}

	if(res.split(' ')[0] = 'drop'){
		await drop(res.split(' ')[1]);
	}

	if(res =='stop'){
		bot.stopDigging();
	}
	setTimeout(cosmicLooper, 500);
}

async function followLoop(){
	let player = bot.players[owner]  ? bot.players[owner].entity : null;
	let p = player.position;
	bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1))
}

async function workLoop(){
	tree = nearestTree();
	digged = false;

	if(tree){
		let p = tree.position
		console.log("block name :" + tree.name);
		console.log("je vais à " + p);

		bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1));

	
		if(bot.entity.position.distanceTo(p) <= 2){
			console.log("arrivé");
			bot.pathfinder.stop();	
			equipAxe();				
			try{
				await bot.dig(tree,true);
			}catch(e){
				console.log(e);
			}
			console.log(tree);
		}
		else{
			console.log("pas encore arrivé, il reste "+ parseFloat(bot.entity.position.distanceTo(p)));
		}
		await sleep(200);
		
	}
	else{
		bot.chat(`/w ${owner} Il n'y a pas de bois autour `);res='';
	}

}

//########################### UTILS #############################

bot.on("diggingCompleted",(tree)=>{
	if(tree){
		console.log("j'ai fini");
		digged = true;
	}
});

function nearestTree(){
	let treeTypes =['oak_log','spruce_log','birch_log','jungle_log',
	'acacia_log','dark_oak_log','stripped_oak_log','stripped_spruce_log',
	'stripped_birch_log','stripped_jungle_log','stripped_acacia_log',
	'stripped_dark_oak_log'];
	let min = Infinity;
	let nearest =null;
	for(let i = 0; i < treeTypes.length; i++) { 
		let tree = bot.findBlock({
			matching: mcData.blocksByName[treeTypes[i]].id,
			maxDistance: 20
		});
		if(tree == null) 
			continue;
		else {
			if (bot.entity.position.distanceTo(tree.position) < min){
				min = bot.entity.position.distanceTo(tree.position)
				nearest = tree;
			}
		}
	}
	return nearest;
}

function equipAxe(){
	let itmax = 0;
	let list = ["wooden_axe","stone_axe","iron_axe",
	"golden_axe","diamond_axe","netherite_axe"];
	
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



function getTreeList(){
	let treeTypes =['oak_log','spruce_log','birch_log','jungle_log',
	'acacia_log','dark_oak_log','stripped_oak_log','stripped_spruce_log',
	'stripped_birch_log','stripped_jungle_log','stripped_acacia_log',
	'stripped_dark_oak_log'];
	let list = [];
	for(let i = 0; i < treeTypes.length; i++) { 
		let tmp = bot.findBlocks({
			matching: mcData.blocksByName[treeTypes[i]].id,
			maxDistance: 20,
			count:Infinity
		});
		if(tmp == null) continue
		else {
			for(let j = 0; j < tmp.length; j++){
				console.log(treeTypes[i] + " : " + tmp[j] + " : " + bot.entity.position.distanceTo(tmp[j]) );
				list.push(tmp[j]);
			}
		}
	}

	return list;
		
}

function sleep(ms) {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
  }

async function drop(s){
	for (slot of bot.inventory.slots) {
		if (slot && slot.name == s) 
				bot.tossStack(slot,drop);	
	}
}
