const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    tour_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      max: 5,
      min: 1,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user_id",
    select: "name photo",
  });

  next();
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
