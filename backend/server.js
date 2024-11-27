const express= require("express");
const dotenv= require("dotenv");
const path=require('path');
//const { chats } = require("./data/data");-to display dummy data to check in postman
const connectDB = require("./config/db");
const colors=require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app=express();//express js api
dotenv.config();
connectDB();


app.use(express.json()); // to accept json data-from the frontend

/*app.get("/",(req,res) => {
    res.send('API is Running');//sent response
});*/

//instead of 'get' we use 'use'
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const _dirname=path.resolve();
//to deploy we will use a variable of .env set it to deployment mode
//that variable can be production or under development
if(process.env.NODE_ENV=='production')
{
    app.use(express.static(path.join(__dirname, "/frontend/build")));
  //build->to build frontend npm run build->to start the production of the app->will fill the needed files for production in bild folder
   app.get("*", (req, res) =>
      res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
    );
    //api call-> * for everything
}
else{
  app.get("/",(req,res) => {
    res.send('API is Running');//sent response
});
}
/*
//req and res are callback parameters
app.get("/api/chat",(req,res)=>{
    res.send(chats);//sending the dummy data of chats as a response
});

app.get("/api/chat/:id",(req,res)=>{
    console.log(req.params.id);//whatever api of the id is requested...that id is printed in d console
    const singleChat=chats.find(c=>c._id ===req.params.id);
    res.send(singleChat);//send the single chat to the web
});
*/

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT=process.env.PORT || 5000;
const server=app.listen(PORT,console.log(`Server Started on PORT ${PORT}`.yellow.bold));
const io=require('socket.io')(server,{
    pingTimeout:90000,
    cors: {
        origin: "http://localhost:3000",
    }
});

io.on("connection",(socket)=>{
    console.log("connected to socket.io");
    socket.on("setup", (userData) => {
        socket.join(userData._id);
        //console.log(userData._id);
        socket.emit("connected");
      });

      socket.on("join chat", (room) => {
        socket.join(room);
        console.log("User Joined Room: " + room);
      });

      socket.on("typing", (room) => socket.in(room).emit("typing"));
      socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

      socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;//to know from which chat the msg is
    
        if (!chat.users)
             return console.log("chat.users not defined");
    
        chat.users.forEach((user) => {
          if (user._id == newMessageRecieved.sender._id) 
            return;
    
          socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    });

})


//io.on->to establish the connection
//then after setup we use join to create a room for the user
//on function to setup which takes the user function from the frontend
//pingtimeout is the time it will stay active
//to run this server we have a start script in the script of package.json file...
//instead of the command node backend/server.j s
//nodemon-we kill the server everytime and then run npm start...to avoid that we install this