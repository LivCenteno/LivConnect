const express = require("express");
const userRouter = express();
const userController = require("../controllers/userController");

userRouter.get("/login", userController.login); // Login
userRouter.post("/create", userController.createUser); // Create User
userRouter.get("/:id", userController.viewUserviaId); // View User Via ID
userRouter.put("/update/username/:id", userController.updateUsername); // Update User's Username
userRouter.put("/update/password/:id", userController.changePassword); // Update User's Password

module.exports = userRouter;
