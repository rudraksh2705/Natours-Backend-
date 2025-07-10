const express = require("express");

//Mounting the Router
const Router = express.Router();

const userController = require("./../Controllers/userController");

Router.route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

Router.route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = Router;
