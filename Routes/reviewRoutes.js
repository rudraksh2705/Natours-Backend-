const express = require("express");
const Router = express.Router();
const reviewController = require("../Controllers/reviewController");
const authController = require("../Controllers/authController");

Router.route("/")
  .post(authController.protect, reviewController.addReviews)
  .get(reviewController.getReviews);

module.exports = Router;
