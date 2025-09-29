const express = require("express");
const Router = express.Router({ mergeParams: true });
const reviewController = require("../Controllers/reviewController");
const authController = require("../Controllers/authController");

Router.route("/")
  .post(authController.protect, reviewController.addReviews)
  .get(authController.protect, reviewController.getReviews);

// Router.route("/:id").delete(reviewController.deleteReview);
module.exports = Router;
