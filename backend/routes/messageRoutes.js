const express = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageControllers");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();


//protect->to check if the user is logined into the app
router.route("/").post(protect, sendMessage);
router.route("/:chatId").get(protect, allMessages);//to fetch all the chats for one single chat

module.exports = router;