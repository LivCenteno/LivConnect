const express = require("express");
const userRouter = express();
const userController = require("../controllers/userController");

userRouter.post("/create", userController.createUser); // Create User
module.exports = userRouter;
