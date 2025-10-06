const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const Review = require("../models/reviewModel");
const Tour = require("../models/toursModel");
const handleFactory = require("./FactoryHandler");

exports.addReviews = catchAsync(async (req, res, next) => {
  let { tour, user, description, rating } = req.body;
  if (!tour) tour = req.params.tourId;
  if (!user) user = req.user.id;

  const Checkreview = await Review.findOne({ $and: [{ tour }, { user }] });
  if (Checkreview) {
    return next(new appError("You have already reviewed on this tour", 401));
  }

  if (!description || !rating) {
    return next(new appError("Please fill all fields", 401));
  }

  const tourdoc = await Tour.findById(tour);

  if (!tourdoc) {
    return next(new appError("Tour not found", 401));
  }

  const review = await Review.create({ user, tour, description, rating });

  res.status(201).json({
    status: "success",
    data: reviews,
  });
});

exports.getReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  const { tourId } = req.params;
  const user = req.user;
  if (tourId) {
    filter = { tour: tourId };
  }

  if (!user) {
    return next(new appError("User not logged in", 401));
  }

  let tour;
  if (tourId) {
    tour = await Tour.findbyId(tour);
    if (!tour) {
      return next(new appError("Tour does not exist", 401));
    }
  }

  const reviews = await Review.find(filter);

  res.status(201).json({
    status: "success",
    length: reviews.length,
    data: reviews,
  });
});

exports.deleteReview = handleFactory.deleteOne(Review);

exports.updateReview = handleFactory.updateOne(Review);
