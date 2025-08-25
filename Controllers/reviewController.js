const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllReviews = catchAsync(async (req, res) => {
  console.log("entered1");
  const data = await Review.find();
  console.log("entered2");
  res.status(200).json({
    status: "success",
    results: data.length,
    data,
  });
});

exports.createReviews = catchAsync(async (req, res) => {
  console.log("entered");
  await Review.create(req.body);
  res.status(200).json({
    status: "success",
    data: req.body,
  });
});
