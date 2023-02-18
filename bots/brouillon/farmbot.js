//la nuit il co deco instant
const mineflayer = require('mineflayer');
const vec3 = require('vec3');
mcData = require('minecraft-data');

var seedName = 'wheat_seeds';
var harvestName = 'wheat';

const bot = mineflayer.createBot({
	host: "TestBot.aternos.me",
	username: "FarmMachine",
  	port:31080
	//viewDistance: "tiny",
});

function sleep(ms) {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
  }

var bedPosition;
var chestPosition;


bot.on('kicked', (reason, loggedIn) => console.log(reason, loggedIn));
bot.on('error', err => console.log(err));

bot.once('spawn', ()=>{
	cosmicLooper();
});

//enter the coordinates of chest and bed in chat
bot.on('whisper', async (username, message)=>{
	let tokens = message.split(' ');
	
	switch(tokens[0]) {
		case 'bed':
			bedPosition = vec3(parseInt(tokens[1]), parseInt(tokens[2]), parseInt(tokens[3]));
			break;
		case 'chest':
			chestPosition = vec3(parseInt(tokens[1]), parseInt(tokens[2]), parseInt(tokens[3]));
			break;
    case 'deposit':
      		await depositLoop2();
      		break;
	case 'drop':
			await drop();

	}
});

async function whisperMessage(){
	bot.on('whisper', async (username, message)=>{
		let tokens = message.split(' ');
		console.log(tokens);
		switch(tokens[0]) {
			case 'bed':
				bedPosition = vec3(parseInt(tokens[1]), parseInt(tokens[2]), parseInt(tokens[3]));
				break;
			case 'chest':
				chestPosition = vec3(parseInt(tokens[1]), parseInt(tokens[2]), parseInt(tokens[3]));
				break;
		case 'deposit':
				  await depositLoop2();
				  break;
		case 'drop':
				await drop();
	
		}

		return tokens[0]
	});

}

async function cosmicLooper() {
	let order = await whisperMessage()

	if (bot.time.timeOfDay > 12000) await sleepLoop();
	else if (bot.inventory.slots.filter(v=>v==null).length < 11 || order =='deposit') {
		await depositLoop();
	} else await farmLoop();

	setTimeout(cosmicLooper, 20);
}

async function sleepLoop() {
	if (!bedPosition) {
		let bed = bot.findBlock({
			matching: blk=>bot.isABed(blk),
		});
		bedPosition = bed.position;
	}

	try {
		if (bedPosition) {
			if (bot.entity.position.distanceTo(bedPosition) < 2) {
				bot.setControlState('forward', false);
				bed = bot.blockAt(bedPosition);
				bot.sleep(bed);
			} else {
				bot.lookAt(bedPosition);
				bot.setControlState('forward', true);
			}
		} else console.log("Can't find bed");
	} catch(err) {
		console.log(err);
	}
}

async function depositLoop() {
	let chestBlock = bot.findBlock({
		matching: mcData.blocksByName['chest'].id,
	});

	if (!chestBlock) return;

	if (bot.entity.position.distanceTo(chestBlock.position) < 2) {
		bot.setControlState('forward', false);
		let chest = await bot.openChest(chestBlock);

		for (slot of bot.inventory.slots) {
			if (slot && slot.name == harvestName) {
				await chest.deposit(slot.type, null, slot.count);
			}
		}
		chest.close();
	} else {
		bot.lookAt(chestBlock.position);
		bot.setControlState('forward', true);
	}
}

async function depositLoop2(){
	var chestBlock = await chest()[1];

	console.log("chest block" + chestBlock);

	if (chestBlock){
		try{
			if (bot.entity.position.distanceTo(chestBlock.position) < 2) {
				console.log("prochr" );
				bot.setControlState('forward', false);

				let chest = await bot.openChest(chestBlock);
		
				for (slot of bot.inventory.slots) {
					if (slot && slot.name == harvestName) {
						await chest.deposit(slot.type, null, slot.count);
					}
				}
				chest.close();
			} else {
				bot.lookAt(chestBlock.position);
				console.log("chest block pos" + chestBlock.position);

				bot.setControlState('forward', true);
			}
		} catch(err) {
			console.log(err);
		}
	}

}

async function farmLoop() {

	let harvest = readyCrop();
	
	if (harvest) {
		bot.lookAt(harvest.position);
		try {
			if (bot.entity.position.distanceTo(harvest.position) < 1) {
				bot.setControlState('forward', false);

				await bot.dig(harvest);
				if (!bot.heldItem || bot.heldItem.name != seedName) 
					await bot.equip(mcData.itemsByName[seedName].id);
				let dirt = bot.blockAt(harvest.position.offset(0, -1, 0));

				await bot.placeBlock(dirt, vec3(0, 1, 0));

				bot.setControlState('forward', true);
				await sleep(1000)
				bot.setControlState('forward', false);

			} else {
				bot.setControlState('forward', true);
			}
		} catch(err) {
			console.log(err);
		}
	}
}

//vérifier que le blé a poussé
function readyCrop() {
	return bot.findBlock({
		matching: (blk)=>{
			return(blk.name == harvestName && blk.metadata == 7);
		}
	});
}

function chest() {
	return bot.findBlock({
		matching: (blk)=>{
			return(blk.name == 'chest');
		}
	});
}

async function drop(){

	for (slot of bot.inventory.slots) {
		if (slot && slot.name == harvestName) {
			
			bot.tossStack(slot,drop);
		}
	}

}