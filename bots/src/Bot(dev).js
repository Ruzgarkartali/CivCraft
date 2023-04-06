const utils = require('./commons/utils.js');
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const Movements = require('mineflayer-pathfinder').Movements;
const general = require('./commons/behaviors/General.js')
const miner = require('./commons/behaviors/Miner.js');
const Lumberjack = require('./commons/behaviors/Lumberjack.js');
const Farmer = require('./commons/behaviors/Farm.js');
const data = require('./commons/data.json');
const { log } = require('mathjs');

//imports
const drop = general.drop;const come = general.come;const followLoop = general.followLoop;
const MCBot= utils.MCBot;const MCError = utils.MCError;const getOwnerPos = utils.getOwnerPos;
const getDestination = miner.getDestination;const mineLoop = miner.mineLoop;
const cutLoop = Lumberjack.cutLoop;const getTreeList=Lumberjack.getTreeList;
const farmLoop=Farmer.farmLoop;const setFarmZone=Farmer.setFarmZone;

//config
const botname = 'bot';
const owner = 'Ruzgarkartali';
const work = 'miner';

//vars
let args;
let variable;
let scaffolding;
let from; let to;

const Bot = new utils.MCBot(botname,owner,work);
Bot.bot.loadPlugin(pathfinder);
Bot.bot.once('spawn', ()=>{
	const defaultMove = new Movements(Bot.bot);

	defaultMove.scafoldingBlocks = [];
	data.scaffolding.forEach(e =>{defaultMove.scafoldingBlocks.push(Bot.bot.registry.itemsByName[e].id)})

	Bot.bot.pathfinder.setMovements(defaultMove);
	cosmicLooper();
});


Bot.bot.on('whisper', async (username, message)=>{
	Bot.state = message.split(' ')[0];
	args = message.split(' ').slice(1);

	//vérifier si proprio
	
	//si trop loin
	let userPos = getOwnerPos(Bot);
	if(userPos != 'Vec3' || !userPos)
		return

	//preparation step (once)
	switch(Bot.state){
		case 'come'  : come(Bot); break;
		case 'drop'  : drop(Bot,args[0]); break;
		case 'mine'  : variable = getDestination(Bot,args[0]);break;
		case 'follow': break;
		case 'cut'   : variable = getTreeList(Bot,args[0]);break;
		case 'farm'  : break;

		//farmzone
		case 'from'  : from = getOwnerPos(Bot);break;
		case 'to'    : to = getOwnerPos(Bot); setFarmZone(from,to);  break;
		default 	 : new MCError(Bot,"WRONG_REQUEST");break;
	}
});


//loop (à voir si on peut transformer les if en switch case)
async function cosmicLooper() {
	console.log(Bot.state);
	if(Bot.state == 'mine')
		await mineLoop(Bot,args[0],variable);
	else if(Bot.state == 'follow')
		await followLoop(Bot);
	else if(Bot.state == 'cut')
		await cutLoop(Bot,variable);
	else if(Bot.state == 'farm')
		await farmLoop(Bot);
	else
		Bot.state =null;
		
	setTimeout(cosmicLooper, 2000);
}