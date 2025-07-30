const fs = require("fs");
const Tour = require("../models/toursModel");
const catchAsync = require("../utils/catchAsync");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage.price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

class APIFeatures {
  constructor(query, queryObj) {
    this.query = query;
    this.queryObj = queryObj;
  }

  filter() {
    const excludedFields = ["page", "sort", "fields", "limit"];
    excludedFields.forEach((el) => delete this.queryObj[el]);

    let queryStr = JSON.stringify(this.queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (!this.queryObj.sort) {
      this.query = this.query.sort("-price");
    } else {
      const sortBy = this.queryObj.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    }
    return this;
  }

  fields() {
    if (this.queryObj.fields) {
      const fields = this.queryObj.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    }
    return this;
  }

  async pagination() {
    const page = +this.queryObj.page || 1;
    const limit = +this.queryObj.limit || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    if (this.queryObj.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error("This page does not exist");
    }

    return this;
  }
}

// GET ALL TOURS
exports.getAllTours = catchAsync(async (req, res) => {
  const obj = new APIFeatures(Tour.find(), req.query);
  obj.filter().sort().fields();
  await obj.pagination();
  const result = await obj.query;

  res.status(200).json({
    status: "success",
    length: result.length,
    data: result,
  });
});

// GET SINGLE TOUR
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);

  // console.log(tour);
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Tour not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

// CREATE TOUR
exports.createTour = catchAsync(async (req, res, next) => {
  console.log("🔥 Incoming tour data:", req.body);

  const newTour = await Tour.create(req.body);
  console.log("✅ Tour created successfully:", newTour);

  res.status(201).json({
    status: "success",
    data: {
      tour: newTour,
    },
  });
});

// UPDATE TOUR
exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Tour not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
});

// DELETE TOUR
exports.deleteTour = catchAsync(async (req, res, next) => {
  const deletedTour = await Tour.findByIdAndDelete(req.params.id);

  if (!deletedTour) {
    return res.status(404).json({
      status: "fail",
      message: "Tour not found",
    });
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// GET TOUR STATS
exports.getTourStats = catchAsync(async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 0 } },
    },
    {
      $group: {
        _id: "$difficulty",
        numTours: { $sum: 1 },
        numRatings: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

// GET MONTHLY PLAN
exports.getMonthlyPlain = catchAsync(async (req, res) => {
  const year = +req.params.year;
  const stats = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStarts: { $sum: 1 },
        tours: { $push: "$name" },
      },
    },
    {
      $addFields: { month: "$_id" },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});
