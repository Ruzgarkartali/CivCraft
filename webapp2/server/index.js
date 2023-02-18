const express = require("express");
const app = express();
const mysql = require("mysql");
require("dotenv").config();
const cors = require('cors');
const reqs =  require('./sql_requests.json');

app.use(express.json());
app.use(cors());

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

app.listen(3001,()=>{
    console.log("running server");
});


