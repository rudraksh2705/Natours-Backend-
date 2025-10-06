const path = require("path");
const Tour = require("../models/toursModel");
const catchAsync = require("../utils/catchAsync");

exports.getOverview = catchAsync(async (req, res) => {
  const tours = await Tour.find();
  res.render("overview", {
    tours,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findOne({ slug: req.params.slug })
    .populate({
      path: "reviews",
      select: "review rating user",
      populate: {
        path: "user",
        select: "photo name",
      },
    })
    .populate({
      path: "guides",
      select: "name photo role",
    });

  res.status(200).render("tour", {
    tour,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render("login");
});
