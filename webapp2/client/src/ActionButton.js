import Cookie from 'js-cookie';
import {bot} from '../../../bots/src/AlphaBot/AlphaBot';

function MineButton(){

  const onClick=(facing) =>{
   //bot.whisper(Cookie.get("botname"),Cookie.get("user") +" mine " + facing);
   bot.chat(Cookie.get("user") +" mine " + facing);
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
 return(
  <div>
    <button id="actions">Follow me</button> 
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
  return(
    <div>
      <button id="actions">Come here</button> 
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