import { Router } from "express";
const router = Router();

import { getAllUserChats, createNewMessage, getSingleChat, updateMessageStatus } from "../controllers/chatController.js";

router.route("/all-user-chats").get(getAllUserChats);
router.route("/new-message").post(createNewMessage);
router.route("/update-message-status").put(updateMessageStatus);
router.route("/single-chat").get(getSingleChat);

export default router;