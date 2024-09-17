//import express
const express = require("express");
const {
  registerUser,authUser,allUsers
} = require("../controllers/userControllers");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();//instance of router from express


//instance of route to create diff route
//router.route("/").get(protect, allUsers);//to chain multiple request-route+get
router.route("/").post(registerUser).get(protect,allUsers);//registerUser-logic(Controller)
router.post("/login", authUser);

//

module.exports = router;
