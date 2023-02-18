const { spawnSync } = require('child_process');
require('../../bots/src/miner');
const path = require('path');

let script = 'miner.js'
let botname =  'MinedddrBot'
let owner = 'Ruzgarkartali'

let chemin = path.join(__dirname,'..','..','bots','src',script);

const child = spawnSync('node',[chemin,botname,owner],{
    maxBuffer:  512 * 1024
    //shell: true
});
