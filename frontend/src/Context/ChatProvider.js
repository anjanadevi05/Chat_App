import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom"; // Use useHistory from react-router-dom

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
   const [selectedChat, setSelectedChat] = useState();
   const [chats, setChats] = useState([]);

  const history = useHistory(); // useHistory instead of useNavigate for React Router v5

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    
    if(userInfo){
    setUser(userInfo);
    }
    else  {
      history.push("/"); // Use history.push() to navigate
    }
  }, [history]);

  return (
    <ChatContext.Provider value={{ user, setUser, selectedChat,
        setSelectedChat,chats, setChats }}>
      {children}
    </ChatContext.Provider>
  );
  

};
export const ChatState = () => {
  return useContext(ChatContext);
};


export const useChatContext = () => useContext(ChatContext); // Helper hook to access ChatContext

export default ChatProvider;
