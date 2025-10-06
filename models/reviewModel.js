const mongoose = require("mongoose");
const Tour = require("./toursModel");

const reviewSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "Tour",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "user",
    },
    review: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5],
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "email photo name",
  });
  next();
});

reviewSchema.statics.calculateAverageRating = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: {
        tour,
      },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    // If no reviews, reset values
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5, // default value if you use one
    });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calculateAverageRating(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.pre(/^findOneAnd/, async function () {
  await this.r.constructor.calculateAverageRating(this.r.tour);
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
