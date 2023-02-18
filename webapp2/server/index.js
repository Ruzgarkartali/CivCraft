const express = require("express");
const app = express();
const mysql = require("mysql");
require("dotenv").config();
const cors = require('cors');
const reqs =  require('./sql_requests.json');
const bot = require( '../../bots/src/AlphaBot');
app.use(express.json());
app.use(cors());
const { spawnSync } = require('child_process');
const path = require('path');

let botlist = [];

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
    let owner = req.body.owner;
    let order = req.body.order;
    let botname = req.body.botname;
    bot.bot.whisper(botname,owner +" "+order);
});

app.post("/session/connect",(req,res) => {
    let owner = req.body.owner;
    let script = req.body.script;
    let botname = req.body.botname;

    let chemin = path.join(__dirname,'..','..','bots','src',script);

    botlist.push(spawnSync('node',[chemin,botname,owner],{
        maxBuffer:  512 * 1024
    }));

    console.log(child.stdout.toString());
});

app.listen(3001,()=>{
    console.log("running server");
});


