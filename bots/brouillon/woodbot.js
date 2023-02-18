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

const bot = mineflayer.createBot({
	host: "TestBot.aternos.me",
    port : 31080,
	username: "woodbot"
	//viewDistance: "tiny",
});
bot.loadPlugin(pathfinder)

bot.once('spawn', ()=>{
	//############### INIT #################################
	bot.chat("/tp -92.5 65 -105.5");
	bot.game.gameMode = "creative";
	console.log("gamemode : "+bot.game.gameMode);
	//################################################
	mcData = require('minecraft-data')(bot.version);
	cosmicLooper();
});

//enter the coordinates of chest and bed in chat
bot.on('whisper', async (username, message)=>{
	let tokens = message.split(' ');
	res = tokens[0];
	if (res =='work'){
		treeList =  getTreeList();
		console.log("treeList : " + treeList );
	}
});

async function cosmicLooper() {
	if (res == 'work'){
		await workLoop();
	}
	setTimeout(cosmicLooper, 500);
}

async function workLoop(){
	
	for(let i = 0; i < treeList.length; i++) {
		let p = treeList[i].offset(0.5,0.5,0.5);
		console.log("je vais à " + p);
		const defaultMove = new Movements(bot);
		bot.pathfinder.setMovements(defaultMove);
		defaultMove.digCost = 0.7;
		bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1));

		let tree = getTreeBlock(p);
		console.log("block name :" + tree.name);


		while(true){
			console.log("pas encore arrivé, il reste "+bot.entity.position.distanceTo(p));
			if(bot.entity.position.distanceTo(p) <= 2){
				console.log("arriv");
				bot.pathfinder.stop();
				equipAxe();
				bot.dig(tree);
				break;
			}
	
			await sleep(200);
		}
	}
		
}

//########################### UTILS #############################
function getTreeBlock(p){
	let tree = bot.findBlock({
		matching:(blk)=>{
			return(blk.position == p);
		},
		maxDistance: 20
	});
	console.log("block name :" + tree.name);
	return tree;
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
