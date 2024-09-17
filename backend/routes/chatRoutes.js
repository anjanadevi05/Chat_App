const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {accessChat,fetchChats,createGroupChat,renameGroup,removeFromGroup,addToGroup} = require("../controllers/chatControllers");

const router = express.Router();

router.route("/").post(protect, accessChat);//accessing or creating chat
//protect->only logged in users can use
//accessChat->only users who are in the chat can use
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);//create group
router.route("/rename").put(protect, renameGroup);//renaming->update so put request
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);
//remove and add from grp->update->put

module.exports = router;