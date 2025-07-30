const catchAsync = require("../utils/catchAsync");
const user = require("./../models/UserModel");

exports.getAllUsers = catchAsync(async (req, res) => {
  const data = await user.find();
  res.status(200).json({
    status: "success",
    results: data.length,
    data: data,
  });
});

exports.createUser = catchAsync(async (req, res) => {
  console.log("entered");
  const data = await user.create(req.body);
  console.log("created");
  res.status(201).json({
    status: "success",
    data: data,
  });
});

exports.getUser = (req, res) => {
  res.status(200).json({
    status: "error",
    data: {
      data: "Not Found",
    },
  });
};

exports.updateUser = (req, res) => {
  res.status(200).json({
    status: "error",
    data: {
      data: "Not Found",
    },
  });
};

exports.deleteUser = (req, res) => {
  res.status(200).json({
    status: "error",
    data: {
      data: "Not Found",
    },
  });
};
