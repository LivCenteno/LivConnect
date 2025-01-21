const express = require("express");
const userRouter = express();
const userController = require("../controllers/userController");

userRouter.post("/create", userController.createUser); // Create User
userRouter.get("/:id", userController.viewUserviaId); // View User Via ID
module.exports = userRouter;
