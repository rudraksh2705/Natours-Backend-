const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("./../models/UserModel");
const FactoryHandler = require("./FactoryHandler");
const secret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

exports.getAllUsers = catchAsync(async (req, res) => {
  const data = await User.find();
  res.status(200).json({
    status: "success",
    results: data.length,
    data: data,
  });
});

exports.createUser = catchAsync(async (req, res) => {
  console.log("entered");
  const data = await User.create(req.body);
  console.log("created");
  res.status(201).json({
    status: "success",
    data: data,
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  let token;
  console.log("ok1");
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  console.log("ok2");
  if (!token) {
    return next(new AppError("User is not logged in", 401));
  }
  const decoded = jwt.verify(token, secret);
  const user = await User.findById(decoded.id);
  res.status(201).json({
    status: "success",
    data: user,
  });
});

exports.updateUser = FactoryHandler.updateOne(User);

exports.deleteUser = FactoryHandler.deleteOne(User);
