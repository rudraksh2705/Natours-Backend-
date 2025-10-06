const express = require("express");
const Router = express.Router();
const viewController = require("../Controllers/viewController");
const authController = require("../Controllers/authController");

Router.route("/tour/:slug").get(viewController.getTour);
Router.route("/").get(viewController.getOverview);
Router.route("/overview").get(viewController.getOverview);
Router.route("/login").get(viewController.login);
Router.use(authController.isAuthenticated);

module.exports = Router;
