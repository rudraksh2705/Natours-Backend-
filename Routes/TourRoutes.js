const express = require("express");
// const fs = require('fs');
const tourController = require("./../Controllers/TourController");

//Mounting the Router
const Router = express.Router();

Router.param("id", (req, res, next, val) => {
  tourController.checkId;
});

Router.param("id", (req, res, next, val) => {});

Router.route("/")
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour);

Router.route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = Router;
