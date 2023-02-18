const mineflayer = require('mineflayer');
require("dotenv").config();

const bot = mineflayer.createBot({
    host: "TestBot.aternos.me",
    port : 31080,
    username:"AlphaBot"
});

exports.bot = bot;