const express = require("express");

//Mounting the Router
const Router = express.Router();
const authController = require("./../Controllers/authController");
const userController = require("./../Controllers/userController");

Router.post("/signup", authController.signup);
Router.post("/login", authController.login);

Router.post("/forgotPassword", authController.forgotPassword);
Router.patch("/resetPassword/:token", authController.resetPassword);

Router.patch("/changeCurrentPassword", authController.updatePassword);
Router.patch("/updateUserInfo", authController.updateInfo);

Router.route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

Router.route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = Router;
