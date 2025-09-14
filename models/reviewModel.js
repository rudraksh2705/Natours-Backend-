const mongoose = require("mongoose");

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
    description: {
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
    select: "email",
  });
  next();
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
