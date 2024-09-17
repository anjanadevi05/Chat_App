const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;//creating or fetching a one-one chat
     //get the current user id
     //check if the userid exist else error
    if (!userId) {
      console.log("UserId param not sent with request");
      return res.sendStatus(400);
    }
  //chatModel->various fields we have to define the fields
    var isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
        //both request shld be true
        //elemMatch->shld match
      ],
    })
    //if user found populate the user array with all the user info
      .populate("users", "-password")//dont display password
      .populate("latestMessage");//give out the latest msgs
  
      //latest message->message model so we populate the sender field also
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      //select the senders name,pic,email
      select: "name pic email",
    });
  
    //if chat exist return the chat
    if (isChat.length > 0) {
        //0 because there will exist only one chat
      res.send(isChat[0]);
    } else {//create a new chat
      var chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],//chat has 2 users
      };
    //create and store in db->query
      try {
        const createdChat = await Chat.create(chatData);
        //get the created chat with the id of created chat and store in fullchat
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        res.status(200).json(FullChat);//send it but setting status as 200
      } 
      catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    }
  });

//fetch the chat-check which user is logged in and query for all of the users chat
  const fetchChats = asyncHandler(async (req, res) => {
    try {
        //chat->chat model
      Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      //.then((result)=> res.send(result))->will just give the chats of the user,but we also have fields
      //like chatName,latestMessage,groupadmin,and we have to sort from latest msg to oldest
      //find the user and return all chats in which the user is a part of
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })//new to old
        //result->all fields of the sender
        .then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
          });
          res.status(200).send(results);//return to the user
        });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });

  const createGroupChat = asyncHandler(async (req, res) => {
    //takes 2 input->chat name,list of users
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Please Fill all the feilds" });
    }//to fill the fields
  
    var users = JSON.parse(req.body.users);//stringified format and in backend the string is parsed into obj
  
    if (users.length < 2) {//a group shld have more than 2 else throw an error
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }
  
    users.push(req.user);//current users who are logged in
  
    //query db->give all fields of the group chat
    try {
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,//one who creates the group
      });
  
      //return the group chat->similar to fetch chat
      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
  
      res.status(200).json(fullGroupChat);
    } 
    catch (error)
     {
      res.status(400);
      throw new Error(error.message);
    }
  });


  //to rename
  const renameGroup = asyncHandler(async (req, res) => {
    //which chat to rename and new chat name
    const { chatId, chatName } = req.body;
  //find by the chat id and update
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,//if we dont give this it will return the old name
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!updatedChat) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(updatedChat);
    }
  });

  //to remove->same as add
  const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
  
    // check if the requester is admin
  
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        //instead of push we pull
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!removed) {
      res.status(404);
      throw new Error("Chat Not Found");
    } 
    else {
      res.json(removed);
    }
  });

  const addToGroup = asyncHandler(async (req, res) => {
    //to which grp and which id
    const { chatId, userId } = req.body;
  
    //anyone can add
    /* const added = await Chat.findByIdAndUpdate(
        $push: { users: userId },
        new: true,
    )*/
  // check if the requester is admin...only admin can add
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
    //populate the other fields
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!added) {
      res.status(404);
      throw new Error("Chat Not Found");
    } 
    else {
      res.json(added);
    }
  });

  module.exports = {
    accessChat,fetchChats,createGroupChat,renameGroup,removeFromGroup,addToGroup
  };