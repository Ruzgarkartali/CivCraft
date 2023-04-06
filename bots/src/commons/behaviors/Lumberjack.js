const { GoalNear} = require('mineflayer-pathfinder').goals;
const utils = require('../utils.js');
const data = require('../data.json');
const { log } = require('mathjs');
const mcData = require('minecraft-data')('1.18');
require('dotenv').config({path:"../../.env"});

//imports
const sleep = utils.sleep;
const MCError = utils.MCError;
const equipBest = utils.equipBest;

const workLoop = async (Bot,liste) => {
	tree = nearestTree();
	digged = false;

	if(tree){
		let p = tree.position
		console.log("block name :" + tree.name);
		console.log("je vais à " + p);

		Bot.bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 1));

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

const getTreeList = (Bot,radius)=>{
	const list= [];

	if(radius >= process.env.MAX_CUT_RADIUS)

	for(let i = 0; i < data.trees.length; i++) { 
		let tmp = Bot.bot.findBlocks({matching: mcData.blocksByName[data.trees[i]].id,maxDistance: radius,count:Infinity});
		if(tmp == null) continue
		else 
			for(let j = 0; j < tmp.length; j++)
				list.push(tmp[j]);	
	}
	return list;		
}

const cutLoop = async (Bot,liste) =>{

	const items = Bot.bot.inventory.items().filter(item => data.scaffolding.includes(item.name));
	if(!items.length)
		return new MCError(Bot,'NO_SCAFF')
	
	if(!liste.length)
		return new MCError(Bot,"NO_WOOD");
	
	if(!Bot.bot.blockAt(liste[0]))
		liste.shift();
	
	else if(Bot.bot.entity.position.distanceTo(liste[0])<2){
		Bot.bot.pathfinder.stop();
		await equipBest(Bot,"AXE");	
		try{
		await Bot.bot.dig(Bot.bot.blockAt(liste[0]),true);
		}catch(e){console.log(e);}
		liste.shift();
	}
	else{
		console.log("pas encore arrivé, il reste "+ parseFloat(Bot.bot.entity.position.distanceTo(liste[0])));
		Bot.bot.pathfinder.setGoal(new GoalNear(liste[0].x,liste[0].y,liste[0].z,1));
	}
}
/*
const cut2 = async (Bot,radius) =>{
	if(!radius)
		return new MCError(Bot,"WRONG_REQUEST");

	let liste = getTreeList(Bot,radius);

	liste.map(async (pos,i)=>{
		console.log("arbre "+ i);
		let block = Bot.bot.blockAt(pos);
		Bot.bot.pathfinder.setGoal(new GoalNear(pos.x,pos.y,pos.z,2));
		while(Bot.bot.entity.position.distanceTo(pos)>1){
			console.log('ss');
			await sleep(5000);
		}
		try{
		await Bot.bot.dig(block);
		}catch(e){console.log(e);}
	})
}
*/
exports.cutLoop = cutLoop;
exports.getTreeList = getTreeList;