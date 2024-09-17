const express= require("express");
const dotenv= require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const colors=require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app=express();//express js api
dotenv.config();
connectDB();


app.use(express.json()); // to accept json data-from the frontend

app.get("/",(req,res) => {
    res.send('API is Running');//sent response
});

//instead of 'get' we use 'use'
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

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
app.listen(PORT,console.log(`Server Started on PORT ${PORT}`.yellow.bold));

//to run this server we have a start script in the script of package.json file...
//instead of the command node backend/server.j s
//nodemon-we kill the server everytime and then run npm start...to avoid that we install this