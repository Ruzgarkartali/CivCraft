const { log } = require('mathjs');
const data = require('../data.json');
const mcData = require('minecraft-data')('1.18');
const { GoalNear} = require('mineflayer-pathfinder').goals;
const Vec3 = require('vec3');
const utils = require('../utils.js');
//imports
const sleep = utils.sleep;
const equipBest = utils.equipBest;
const MCError = utils.MCError;

//variables
let info;
let pos1; let pos2;

const setFarmZone = (p1,p2) =>{pos1 = p1.offset(0,-1,0);pos2 = p2.offset(0,-1,0);}

const inFarmZone = (p) =>{

	const minX = Math.min(pos1.x, pos2.x);
    const minZ = Math.min(pos1.z, pos2.z);
    const maxX = Math.max(pos1.x, pos2.x);
    const maxZ = Math.max(pos1.z, pos2.z);
    if (
      p.x >= minX &&
      p.x <= maxX &&
      p.z >= minZ &&
      p.z <= maxZ
    ) 
		return true;
	else
		return false;
}

const farmLoop = async (Bot) => {

	if(!pos1 || !pos2)
		return new MCError(Bot,"NO_FARMZONE");

	if(!info)
		info = readyCrop(Bot);
	else {
		let harvest = info[0];
		let seedName = info[1];
		let p = harvest.position;
		Bot.bot.pathfinder.setGoal(new GoalNear(p.x, p.y, p.z, 0.1));

		if (Bot.bot.entity.position.distanceTo(harvest.position) < 1){
			try{
				await Bot.bot.dig(harvest);
				if (!Bot.bot.heldItem || Bot.bot.heldItem.name != seedName) 
						await Bot.bot.equip(mcData.itemsByName[seedName].id);
						await sleep(250)
				

				//faire 1 pas pour ramasser la plante
				Bot.bot.setControlState('forward', true);
				await sleep(250)
				Bot.bot.setControlState('forward', false);

				
				let dirt = Bot.bot.blockAt(harvest.position.offset(0, -1, 0));
				
				//si la terre n'est pas labourée
				if (dirt.name == 'dirt' ||dirt.name == 'grass_block'){
					console.log('ce nest pas de la farmland');
					await equipBest(Bot,"HOE");
					await Bot.bot.activateBlock(dirt);
					console.log('cest regle');
				}

				//placer la graine
				await Bot.bot.placeBlock(dirt, Vec3(0, 1, 0));

				info = null;
			}catch(e){
				console.log(e);
			}
		}
		else{
			console.log(Bot.bot.entity.position.distanceTo(harvest.position));
		}
	}
}

//vérifier que le blé a poussé
function readyCrop(Bot) {


	let out = null;
	for(const v of data.harvests) {
		console.log('je cherche ' + v.harvest);
		let search = Bot.bot.findBlock({
			matching: (blk)=>{
				return(blk.name == v.harvest && (blk.metadata==v.metadata || blk.boundingBox == 'block'));
			}
		});
		console.log("search = ");
		console.log(search);
		if(search && inFarmZone(search.position)){
			console.log("jai trouvé");
			out = [search, v.seed];
			break;
		}
	}
	return out;
}

exports.farmLoop = farmLoop;
exports.setFarmZone=setFarmZone;
