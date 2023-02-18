import Cookie from 'js-cookie';
import Axios from 'axios';


function MineButton(){

  const onClick=(facing) =>{
    Axios.post("http://localhost:3001/session/actions/order", {
      owner: Cookie.get("user"),
      order:"mine "+facing,
      botname:Cookie.get("botname")
    })
  }

    return (

      <table>
        <tr>
          <td> </td>
          <td><button onClick={()=>{onClick("nord")}} id="actions"> nord </button> </td>
          <td> </td>
        </tr>
        <tr>
          <td><button onClick={()=>{onClick("ouest")}} id="actions" style={{width:"75px"}} > ouest </button> </td>
          <td>MINE </td>
          <td><button onClick={()=>{onClick("est")}} id="actions"> est </button> </td>
        </tr>
        <tr>
          <td> </td>
          <td><button onClick={()=>{onClick("sud")}} id="actions"> sud </button> </td>
          <td> </td>
        </tr>

          
      </table>
    );
}

function FollowButton(){

  const onClick=() =>{
    Axios.post("http://localhost:3001/session/actions/order", {
      owner: Cookie.get("user"),
      order:"follow",
      botname:Cookie.get("botname")
    })};

 return(
  <div>
    <button onClick={()=>{onClick()}} id="actions">Follow me</button> 
  </div>
 );
}

function cutwood(){

}
function farm(){

}

function drop(){


  return(
    <div>
      <button id="actions">Drop all resources</button> 
    </div>
   );
}

function come(){

  const onClick=() =>{
    Axios.post("http://localhost:3001/session/actions/order", {
      owner: Cookie.get("user"),
      order:"come",
      botname:Cookie.get("botname")
    })};

  return(
    <div>
      <button onClick={()=>{onClick()}} id="actions">Come here</button> 
    </div>
   );
}

function defend(){

}



export const actions_buttons = (action) => {
  switch(action){
  case "mine": return MineButton(); break;
  case "follow":return FollowButton();break;
  case "drop":return drop();break;
  case "come":return come();break;
  }
}