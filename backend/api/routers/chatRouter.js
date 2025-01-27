const express = require("express");
const chatRouter = express();
const chatController = require("../controllers/chatController");

chatRouter.post("/message", chatController.addChat); //Add Chat

module.exports = chatRouter;
