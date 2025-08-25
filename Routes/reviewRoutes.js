const reviewController = require("../Controllers/reviewController");
const express = require("express");

const Router = express.Router();

Router.route("/")
  .get(reviewController.getAllReviews)
  .post(reviewController.createReviews);

module.exports = Router;
