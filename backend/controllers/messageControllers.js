const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const allMessages = asyncHandler(async (req, res) => {
    //fetch all message for all the chats
    try 
    {
        //find all the id->it takes from the req's params
      const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "name pic email")
        .populate("chat");
         //send the message as response
      res.json(messages);
    } 
    catch (error)
     {
      res.status(400);
      throw new Error(error.message);
    }
  });


  //send a new msg
const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body; //get the content from the request
  
    //if wrong chatid passed
    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.sendStatus(400);
    }
  //if not an error-message model defines all those parameters
    var newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    };
   //inside try and catch query ur db 
    try {

        //populate all the 3 models which was defined
        var message = await Message.create(newMessage);//message->model
         //populate-used to populate reference fields in a document of a certain collection with documents from another collection.
        message = await message.populate("sender", "name pic");//execpopulate as we are using an instance of moongose->but no need in new version
        message = await message.populate("chat");
        //populate the user
        message = await User.populate(message, {
          path: "chat.users",
          select: "name pic email",
        });
    
        //find the chat by id and update withe messages (all the latest message)
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    
        res.json(message);//send back the message
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    });

    module.exports = { sendMessage , allMessages};