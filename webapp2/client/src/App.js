import './App.css';
import Axios from 'axios';
import React, {useEffect, useState} from "react";
import { BrowserRouter as Router, Switch, Route,Routes, Link,useHistory} from 'react-router-dom';
import Cookie from 'js-cookie';


const SetCookie = (cookiename,value)=>{
  Cookie.set(cookiename,value,{
    expires:1,
    secure:true
  });
};

function SessionPage() {

  const history = useHistory();
  const [bots,setbots] = useState([]);

  if(!Cookie.get('user')) history.push("/");

  const loadData = async () => {
  const response = await Axios.get(`http://localhost:3001/session/${Cookie.get('id')}`);
   setbots(response.data);
  }
  useEffect(()=>{
    loadData();
  },[]);



  return(
      <div className="App" >
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
        return(
            <tr>  
              <td>{value["username"]}</td>
              <td>{value["jobName"]}</td>
              <td>{value["online"]}</td>
              <td><button> Connect/Disconnect </button></td>
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
    }).then((response) => {
      console.log(response.data[0]);
      if (!response.data) setmessage("Mauvais nom d'utilisateur ou mauvais mot de passe !");
      else{
        SetCookie('user',user);
        SetCookie('id',response.data[0]["playerId"]);
        history.push("/session");
      }
    });
  }
  return (
      <div className="App">
      <Router>
        <Route path="/session" component={SessionPage} />
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
      <Route path="/session">
        <SessionPage />
      </Route>
    </Switch>
  </Router>
  );
}

export default App;
