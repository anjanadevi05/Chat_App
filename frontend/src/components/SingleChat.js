import React from 'react'
import ProfileModal from "./miscellaneous/ProfileModal";
import { getSender, getSenderFull } from "../config/ChatLogics";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { IconButton, Spinner, useToast, FormControl,Input } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
import ScrollableChat from "./ScrollableChat";
import { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css";
import io from 'socket.io-client'
import Lottie from "react-lottie";
import animationData from "../animation/typing.json";

const ENDPOINT="http://localhost:5000"
var socket,selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);

   const toast = useToast();

   const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };


   const { selectedChat, setSelectedChat, user, notification, setNotification} =
    ChatState();
  
  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);//to true to say that it is loading

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      console.log(messages);
      setMessages(data);
      setLoading(false);

     socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
   
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);
  
  //whenever user clicks onto 
  useEffect(() => {
    fetchMessages();
    selectedChatCompare=selectedChat;//to have the backup of the selected chat
  },[selectedChat])

  //console.log(notification,"whofffffffffffff")
//everytime a message is recieved 
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if none of the chat isselected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
       //to give notification if message recieved
      } else {
        setMessages([...messages, newMessageRecieved]);
        //else we add it to our set of messages
      }
    });
  });

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        //fetching our api
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);
        socket.emit("new message", data);
        //setNewMessage("");
        setMessages([...messages, data]);
        //....messages old msgs and data is the latest msg
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    } 
  };


  const typingHandler = async (e) => {
    setNewMessage(e.target.value);
    //typing indicator logic
    
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    //if the user is stoped typing....
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;//after 3 sec stop
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
   
  };
  
  return (
    <>
      {selectedChat ? (
        <>
         <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <IconButton
                d={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")}
              />
            </Box>
            <Box flex="1" textAlign="center">
              {!selectedChat.isGroupChat ? (
                <Text>{getSender(user, selectedChat.users)}</Text>
                  ) : (
                    <Text>{selectedChat.chatName.toUpperCase()}</Text>
                      )}
            </Box>
            <Box>
              {!selectedChat.isGroupChat ? (
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                  ) : (
                    
                    <UpdateGroupChatModal
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                      fetchMessages={fetchMessages}
                    />
                    )}
            </Box>
           </Text>
           <Box
            d="flex"
            flexDir="column"
            justifyContent="space-between"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="89%"
            borderRadius="lg"
            position="relative"
           >
  <Box
    flexGrow={1}
    overflowY="auto" 
    h="85%"
  >
    {loading ? (
      <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
    ) : (
      <ScrollableChat messages={messages} />
    )}
  </Box>
  <FormControl
    onKeyDown={sendMessage}
    id="first-name"
    isRequired
    mt={3}
    position="relative" 
    bottom={0}
    left={0}
    right={0}
    p={2} 
  >
    {istyping ? (
      <div>
        <Lottie
          options={defaultOptions}
          height={30}
          width={70}
          style={{ marginBottom: 15, marginLeft: 0 }}
        />
      </div>
    ) : null}
    <Input
      variant="filled"
      bg="#E0E0E0"
      placeholder="Enter a message.."
      value={newMessage}
      onChange={typingHandler}
    />
  </FormControl>
</Box>

        </>
     ) : (
   <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};


export default SingleChat


//loading->if chat is loading->it is a ternary operator
//if loading first part ,else after the colon part
//form control to get input
//