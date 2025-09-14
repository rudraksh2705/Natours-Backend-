const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const Review = require("../models/reviewModel");

exports.addReviews = catchAsync(async (req, res, next) => {
  const { tour, user, description, rating } = req.body;

  if (!tour || !user || !description || !rating) {
    return next(new appError("Fields are missing", 401));
  }

  const data = await Review.create({ tour, user, description, rating });

  res.status(201).json({
    status: "success",
    data,
  });
});

exports.getReviews = catchAsync(async (req, res, next) => {
  const data = await Review.find();
  res.status(201).json({
    status: "success",
    data,
  });
});
