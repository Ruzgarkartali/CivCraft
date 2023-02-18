const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-viewer').mineflayer


const bot = mineflayer.createBot({
  username: 'Bot',
  host:"TestBot.aternos.me",
  port:31080
})

bot.once('spawn', async () => {
  console.log("sss");
  mineflayerViewer(bot, { port: 3000 })
  // Draw the path followed by the bot
  console.log(bot.entity.position)
})

bot.on('playerJoined', async (player) => {
  if (player.username !== bot.username) {
    await sleep(200);
    bot.chat(`/w ${player.username} work`)
  }
})

function sleep(ms) {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
}