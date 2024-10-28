//to get the jwt of autorized user
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

//asynchandler to handle the errors
//req, res, next->has 3 param as middleware..to move onto next operation
const protect = asyncHandler(async (req, res, next) => {
  let token;


  //req.headers.authorization->token
  //req.headers.authorization.startsWith("Bearer")->both condition true
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
        //Bearer fgrcfkcjflo->this is how the token looks like
      token = req.headers.authorization.split(" ")[1];//decode the token->remove the bearer

      //decodes token id from the .env file
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      //find the user in the db and return it without the password

      next();
    } 
    //if token is not there->both for that
    catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };