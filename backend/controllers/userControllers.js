const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

//express async handler handles error automatically
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;
  //wrap the elements of this function with async handler 

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Please Enter all the Feilds");
    }//if any required field is not filled throw error
  
    const userExists = await User.findOne({ email });//to check if the user is an existing user
  //query the db model->User model which was defined...find with email_id

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
  
    const user = await User.create({
      name,
      email,
      password,
      pic,
    });//create user in the db using the model
  
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } 
    //201->success.return the user
    //token->function to generate the token with the user id
    else {
      res.status(400);
      throw new Error("User not found");
    }
  });

// to handle after login
  const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    const user = await User.findOne({ email });
  
    //if user exist and password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } 
    //throws an error
    else {
      res.status(401);
      throw new Error("Invalid Email or Password");
    }
  });


  const allUsers = asyncHandler(async (req, res) => {
    //api->/api/user->there are 2 ways to send the data to backend->through the body->as a post request
    //or through the query string->/api/user?search="username"
    //normally we write req.prams but for query ->req.query.search
    //{{Chatsy}}/api/user?search=Amara&search=Mia->in postman
    const keyword = req.query.search
    //console.log(keyword) ->to display in the console
      ? {
          $or: [
            //we are either searching the name or email...if the entered value matches the name or email
            { name: { $regex: req.query.search, $options: "i" } },
            //i->case sensitive($reqex to pattern matching and filter them)
            //there are many options->m,o,....
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};//else if not matched
  
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    //find({ _id: { $ne: req.user._id }->this is for seaching users in the app so we exclude the user
    //who is searching
    res.send(users);//query the db and ssend back thee users
    //$ne: req.user._id->for running this we should know the user who is currently logged in->
    //so we need the  jwt
  });


  module.exports = { registerUser,authUser,allUsers};