import "./App.css";
import {Route} from "react-router-dom";
import Homepage from "./Pages/Homepage.js"
import ChatPage from "./Pages/ChatPage.js";

function App() {
  return (
    <div className="App">
      <Route path="/" component={Homepage}  exact/>
      <Route path="/chats" component={ChatPage} />
    </div>
  );
}

export default App;

//here we create the first route for our home page and 2nd route for our chatpage
//each path will be have the component and create seperate file for each of the pages
//why do we give exact-when we give /chats home also rendered becoz of / so to avoid this we give exact
//login and sign-up(home page )frm there redirected to the chatpage
//rafce-shortcut to create functional component
