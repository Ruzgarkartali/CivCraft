const { spawnSync } = require('child_process');
require('../../bots/src/miner');
const path = require('path');
const { Worker, workerData } = require('worker_threads');


let script = 'miner.js'
let botname =  'MinedddrBot'
let owner = 'Ruzgarkartali'
// 
let chemin = path.join(__dirname,'..','..','bots','src',script);

const worker = new Worker(chemin,{workerData:{arg1:botname,arg2:owner}});


console.log("olaaa");
