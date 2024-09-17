//chatname and latest message for one to one
//if a groupchat-users,grp admin,chatname and latest message

const mongoose = require("mongoose");

const chatModel = mongoose.Schema(
    {
      chatName: { type: String, trim: true },
      isGroupChat: { type: Boolean, default: false },
      users: [{ type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         }],
      latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
      groupAdmin: { type: mongoose.Schema.Types.ObjectId, 
        ref: "User" },
    },
    { timestamps: true }
  );


const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;

  //create a schema and define the objects..
  //name string-trim to remove trailing spaces
  //isGroupChat boolean default false
  //users array of user ids-single chat-2 users and grp chat >2
  //type of users-will contain id of the particular user...ref to the user model
  //latestMessage-to display in the front...ref to the message model
  //next a grp admin
  //when new data is added mongodb adds timestamp-true
  //naming the model as chat and the export this