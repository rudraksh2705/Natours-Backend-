const fs = require("fs");
const Tour = require("../models/toursModel");

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
      console.log(fields);
      this.query = this.query.select(fields);
    } else {
      // this.query = this.query.select("name price description");
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
exports.getAllTours = async (req, res) => {
  try {
    const obj = new APIFeatures(Tour.find(), req.query);
    await obj.filter().sort().fields().pagination();
    const result = await obj.query;

    return res.status(200).json({
      status: "success",
      length: result.length,
      data: result,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

// GET SINGLE TOUR
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
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
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

// CREATE TOUR
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail", // was "Fail"
      message: err.message,
    });
  }
};

// UPDATE TOUR
exports.updateTour = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// DELETE TOUR
exports.deleteTour = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getMonthlyPlain = async (req, res) => {
  try {
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
          numTourStarts: { $sum: 1 }, // ✅ fixed
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
  } catch (err) {
    res.status(404).json({
      status: "No data",
      message: err.message,
    });
  }
};
