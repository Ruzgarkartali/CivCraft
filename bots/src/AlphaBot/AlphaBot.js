const mineflayer = require('mineflayer');

export const bot = mineflayer.createBot({host: process.env.HOST,port : process.env.PORT,username:"AlphaBot"});
