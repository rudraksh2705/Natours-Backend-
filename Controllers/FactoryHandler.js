const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log(req.params.id);
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No ducement Found for deleting", 404));
    }

    res.status(204).json({
      status: "success",
      message: "document deleted successfully",
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return res.status(404).json({
        status: "fail",
        message: "document not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  });
