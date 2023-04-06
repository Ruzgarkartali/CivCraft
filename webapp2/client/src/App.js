import './App.css';
import Axios from 'axios';
import React, {useEffect, useReducer, useState} from "react";
import { BrowserRouter as Router, Switch, Route,Routes, Link,useHistory} from 'react-router-dom';
import Cookie from 'js-cookie';
import{actions_buttons} from './components/ActionButton';
const { spawn } = require('child_process');


const SetCookie = (cookiename,value)=>{
  Cookie.set(cookiename,value,{
    expires:0.1,
    secure:true
  });
};

function ActionPage(){

  //variables
  const history = useHistory();
  const [actions,setactions] = useState([]);

  //behaviors
  if(!Cookie.get('botname')) history.push("/");

  const loadData = async () => {
  const response = await Axios.get(`http://localhost:3001/session/actions/${Cookie.get('jobId')}`);
   setactions(response.data);
   console.log(actions);
  }
  useEffect(()=>{
    loadData();
  },[]);

  

  return(
    <div className="App" >
      <h1> DashBoard de <div style = {{color:"red"}}> {Cookie.get('botname')}</div>&nbsp;
      <img src={require("./assets/" + Cookie.get('image') + ".png")} width="40" />
      </h1>

      <table align='center'>
        {actions.map((value,index)=>{
          return(
            <div>
            &nbsp;
            {actions_buttons(value["actionName"])}
            <div class="line-1"></div>
            &nbsp;
            </div>

            );
      })}
      </table>
    </div>
  );

}


//*************************************************************************************** */
//*************************************************************************************** */

function SessionPage() {

  //variables
  const history = useHistory();
  const [bots,setbots] = useState([]);
  const [message,setmessage] = useState("");
  const [online,setonline] = useState([]);

  function onlineMode(i){
    if(i==0) return(<div><span class="red-dot"></span> offline</div>)
    if(i==1) return(<div><span class="green-dot"></span> online</div>)
    if(i==2) return(<div><span class="orange-dot"></span> connecting ...</div>)
  }

  if(!Cookie.get('user')) history.push("/");

  const loadData = async () => {
  const response = await Axios.get(`http://localhost:3001/session/${Cookie.get('id')}`);
   setbots(response.data);
  }
  useEffect(()=>{
    loadData();
  },[]);

  const onClickName = (value) =>{
    //if(! value['online']) return alert("ce bot n'est pas connecté, appuyez sur connect/disconnect"); else{
    console.log(value);
    SetCookie("jobId",value['jobId']);
    SetCookie("botname",value['username']);
    SetCookie("image",value['jobName']);
    history.push("/session/actions");
}

  const onClickConnect =  async (value,index) =>{
    if(bots[index]['online'] == 0){
      updateOnline(2,index);
      await Axios.post("http://localhost:3001/session/connect", {
        owner: Cookie.get('user'),
        script:value["script"],
        botname:value['username']
      }).then((response)=>{
        if(response.data== "logged"){
          updateOnline(1,index);
        }
        if(response.data== "exit"){
          updateOnline(0,index);
        }
      })
    }

    if(bots[index]['online'] == 1){
      await Axios.post("http://localhost:3001/session/disconnect", {
        botname:value['username']
      }).then((response)=>{
        if(response.data== "logged"){
          updateOnline(1,index);
        }
        if(response.data== "exit"){
          updateOnline(0,index);
        }
      })
    }
}

  const updateOnline = (online,i) => {
    setbots(
        bots.map((value,index) =>
            index === i
                ? { ...value, online: online }
                : { ...value }
        )
    );
  };

  return(
      <div className="App" >

          <Router>
            <Route exact path="/session/actions" component={ActionPage} />
          </Router>

          <h1>Bienvenue {Cookie.get('user')}</h1>
          <h4>Voici vos Bots : </h4>
        <table id="customers">
          <tr>
            <th>Nom</th>
            <th>Métier</th>
            <th>en ligne</th>
            <th>Connexion</th>
          </tr>
      {bots.map((value,index)=>{
        console.log('online : ' + value['online']);
        return(
          <tr>
              <td><Link onClick={() => onClickName(value)}> {value["username"]} </Link></td>
              <td><img src={require("./assets/" + value["jobName"] + ".png")} width="40" /></td>
              <td>{onlineMode(value["online"])}</td>
              <td><button onClick={()=>{onClickConnect(value,index)}}> Connect/Disconnect </button></td>
            </tr>
        )
      })}
      </table>
  </div>
  );
}

//*************************************************************************************** */
//*************************************************************************************** */

function LoginPage() {

  //variables
  const [user,setuser] = useState("");
  const [pass,setpass] = useState("");
  const [message,setmessage] = useState("");
  const history = useHistory();

  //behaviors
  const login = async () => {
    Axios.post("http://localhost:3001/login", {
      user:user,
      pass:pass
    }).then((r) => {
      let res = r.data.length;
      console.log(res);
      if (!res) setmessage("Mauvais nom d'utilisateur ou mauvais mot de passe !");
      else{
        SetCookie('user',user);
        SetCookie('id',r.data[0]["playerId"]);
        history.push("/session");
      }
    });
  }
  return (
      <div className="App">
      <Router>
        <Route exact path="/session" component={SessionPage} />
      </Router>

        <h1> CivCraft Bot Manager</h1>
        <p style={{ color: 'red' }}>{message}</p>
        <input type="text" placeholder="username" onChange={(e) => setuser(e.target.value)}/> <br></br>
        <input type="text" placeholder="password" onChange={(e) => setpass(e.target.value)}/> <br></br>
        <button onClick={login}> Se connecter </button>
      </div>
  );
}

//*************************************************************************************** */
//*************************************************************************************** */

function App() {
  return (
  <Router>
    <Switch>

      <Route exact path="/">
        <LoginPage />
      </Route>

      <Route exact path="/session">
        <SessionPage />
      </Route>

      <Route exact path="/session/actions">
        <ActionPage />
      </Route>

    </Switch>
  </Router>
  );
}

export default App;
