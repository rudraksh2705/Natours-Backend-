const express = require("express");
// const fs = require('fs');
const tourController = require("./../Controllers/TourController");

//Mounting the Router
const Router = express.Router();

// Router.param("id", (req, res, next, val) => {
//   tourController.checkId;
// });

// Router.param("id", (req, res, next, val) => {});

Router.route("/tour-stats").get(tourController.getTourStats);

Router.route("/getMonthlyPlan/:year").get(tourController.getMonthlyPlain);

Router.route("/top-5-cheap").get(
  tourController.aliasTopTours,
  tourController.getAllTours
);

Router.route("/")
  .get(tourController.getAllTours)
  .post(tourController.createTour);

Router.route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = Router;
