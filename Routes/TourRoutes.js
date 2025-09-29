const express = require("express");
// const fs = require('fs');
const tourController = require("./../Controllers/TourController");
const authController = require("./../Controllers/authController");
const reviewRoutes = require("./reviewRoutes");

//Mounting the Router
const Router = express.Router();

Router.route("/tour-stats").get(tourController.getTourStats);

Router.route("/getMonthlyPlan/:year").get(tourController.getMonthlyPlain);

Router.route("/top-5-cheap").get(
  tourController.aliasTopTours,
  tourController.getAllTours
);

Router.route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);

Router.route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictedTo("admin"),
    tourController.deleteTour
  );

Router.use("/:tourId/review", reviewRoutes);

module.exports = Router;
