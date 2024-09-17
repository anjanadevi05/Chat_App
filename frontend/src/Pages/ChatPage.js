import React , { useEffect ,useState} from 'react';
import axios from "axios";

const ChatPage = () => {
  //chats to display data and setchats to change the data
  const [chats, setChats] = useState([]);

  const fetchChats= async() =>
    {
      const {data} =await axios.get('/api/chat');
      setChats(data);

    };
//we use useeffect to call the function fetchChats,so whenever useeffect is rendered fetchchats is called
    useEffect(() => {
      fetchChats();
    }, [])
    

  return (
    <div>
      {
        chats.map((chat)=>
        (<div key={chat._id}>{chat.chatName}</div>
        ))
      }
    </div>
  );
};

export default ChatPage


//api call to present the data-fetchChats
//to fetch a api we need a package named axio
//to use await keyword we need async function
//to render the output we got in console to frontend we write the js code in the return part-
//to write js code in the html tag we use curly braces
//to store the data in a state-useState(Shortcut)