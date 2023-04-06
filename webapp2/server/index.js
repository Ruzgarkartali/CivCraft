const express = require("express");
const app = express();
const mysql = require("mysql");
require("dotenv").config();
const cors = require('cors');
const reqs =  require('./sql_requests.json');
const bot = require( '../../bots/src/AlphaBot');
app.use(express.json());
app.use(cors());
const path = require('path');
const { Worker, workerData } = require('worker_threads');
console.clear();

let n_bots = parseInt(process.env.N_BOTS);

function createWorker(script,botname,owner,res){
    let chemin = path.join(__dirname,'..','..','bots','src',script);
    if(n_bots){
        return new Promise((resolve,rejects)=>{
            const worker = new Worker(chemin,{workerData:
                {arg1:botname,arg2:owner}});

            worker.on("message",(data)=>{
                res.send(data);
                if(data=="logged"){
                    n_bots-=1;
                    db.query(reqs["UPDATE_ONLINE"],[1,botname]);
                }
                if(data=="exit"){
                    worker.terminate();
                    n_bots+=1;
                    db.query(reqs["UPDATE_ONLINE"],[0,botname]);
                }
            })
            worker.on('error',(e)=>{console.log(e);n_bots+=1});
        })
    }else console.log("plus de place");
}

const db = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME,
});

app.post("/login",(req,res)=> {
    let vars = [req.body.user,req.body.pass];
    const q = db.query(reqs["LOGIN_CHECK"],vars,(e, r) => { 
        if(e) res.send({e:e});
        else {
            console.log(r);
            res.send(r);
        }
    });
    console.log("Query : " + q.sql);
});

app.get("/session/:id", (req,res) => {
    const q = db.query(reqs["GET_BOTS"],[req.params.id],(e, r) => { 
        if(e) res.send({e:e});
        else  res.send(r);
    });
    console.log("Query : " + q.sql);
});

app.get("/session/actions/:jobId", (req,res) => {
    const q = db.query(reqs["GET_ACTIONS"],[req.params.jobId],(e,r)=>{
        if(e) res.send({e:e});
        else  res.send(r);
    });
    console.log("Query : " + q.sql);
})

app.post("/session/actions/order",(req,res) => {
    bot.bot.whisper(req.body.botname,req.body.owner +" "+req.body.order);
});

app.post("/session/connect",async (req,res) => {
    let chemin = path.join(__dirname,'..','..','bots','src',req.body.script);
    const result = await createWorker(req.body.script,req.body.botname,req.body.owner,res);
  
});

app.post("/session/disconnect",(req,res)=>{
    bot.bot.chat('kick ' + req.body.botname);
    bot.bot.chat('/kick ' + req.body.botname);

    db.query(reqs["UPDATE_ONLINE"],[0,req.body.botname],(e,r)=>{
        if(e) res.send({e:e});
        else  res.send('exit');
    });
});

app.listen(3001,()=>{
  
    console.log('\x1b[42m%s\x1b[0m',"don't forget to connect to VPN !");


    //connection to db
    db.connect((e,r)=>{
        if(e) console.log('\x1b[31m%s\x1b[0m','ERROR ' + e.message);
        else console.log('connected to db ! ');
    });


    console.log("running server ...");
});


