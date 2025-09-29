const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const catchAsync = require("../utils/catchAsync");
const user = require("./../models/UserModel");
const AppError = require("./../utils/appError");
const sendEmail = require("./../utils/email");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const secret = process.env.JWT_SECRET;

const verifyPassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (err) {
    return false;
  }
};

exports.signup = catchAsync(async (req, res) => {
  const newUser = await user.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

  res.status(201).json({
    status: "success",
    data: newUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new AppError("Please Provide email and password", 400));
  }

  const loggedUser = await user.findOne({ email }).select("+password");

  const valid = await loggedUser.correctPassword(password);

  if (!loggedUser || !valid) {
    return res.status(401).json({
      status: "error",
      message: "Password or email is incorrect",
    });
  }

  const token = jwt.sign({ id: loggedUser._id }, secret);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please login to get access", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, secret);

  const freshUser = await user.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError("The User Does not exist", 401));
  }

  if (freshUser.changePasswrodAfter(decoded.iat)) {
    return next(new AppError("User recently changed password", 401));
  }

  req.user = freshUser;
  next();
});

exports.restrictedTo = () => {
  return (req, res, next) => {
    if (req.user.role !== "admin" && req.user.role !== "lead-guide") {
      return res.status(404).json({
        status: "error",
        message: "You can't delete any tour",
      });
    } else {
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const FoundUser = await user.findOne({ email: req.body.email });

  if (!FoundUser) {
    return res.status(404).json({
      status: "error",
      message: "Account not found",
    });
  }

  const resetToken = FoundUser.createPasswordResetToken();
  await FoundUser.save({ validateBeforeSave: false });

  console.log(resetToken);
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}.\nIgnore this email if you didn't request a password reset.`;

  try {
    // await sendEmail({
    //   email: FoundUser.email,
    //   subject: "Your password reset token (valid for 10 mins)",
    //   message,
    // });

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    FoundUser.passwordResetToken = undefined;
    FoundUser.passwordResetExpires = undefined;
    await FoundUser.save({ validateBeforeSave: false });

    res.status(404).json({
      status: "error",
      message: "There was an error sending the email. Try again later!",
      err,
    });
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1. Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const FoundedUser = await user.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2. If token has expired or user not found
  if (!FoundedUser) {
    res.status(400).json({
      status: "error",
      message: "Can't find token",
    });
  }

  // 3. Set the new password
  FoundedUser.password = req.body.password;
  FoundedUser.passwordConfirm = req.body.passwordConfirm;
  FoundedUser.passwordResetToken = undefined;
  FoundedUser.passwordResetExpires = undefined;

  await FoundedUser.save();

  // 4. Log the user in, send JWT
  const token = jwt.sign({ id: FoundedUser._id }, secret);

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const { currentPassword, newPassword } = req.body;

  // 1. Find user by email
  const FoundUser = await user.findOne({ email }).select("+password");

  if (!FoundUser) {
    return res.status(400).json({
      status: "error",
      message: "You can't perform this action",
    });
  }

  // 2. Check if token is present
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "You are currently not logged in!",
    });
  }

  // 3. Verify current password
  const isMatch = await verifyPassword(currentPassword, FoundUser.password);

  if (!isMatch) {
    return res.status(401).json({
      status: "error",
      message: "Your password is incorrect",
    });
  }

  // 4. Hash new password and update
  FoundUser.password = newPassword;
  FoundUser.passwordConfirm = newPassword;
  console.log(FoundUser.password);
  // FoundUser.passwordConfirm = FoundUser.password;

  await FoundUser.save();

  // 5. Send new token
  const newToken = jwt.sign({ id: FoundUser._id }, secret);

  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
    token: newToken,
  });
});

exports.updateInfo = catchAsync(async (req, res) => {
  const { email, field, value } = req.body;
  const FoundUser = await user.findOne({ email });
  if (!FoundUser) {
    return res.status(401).json({
      status: "error",
      message: "No such a user",
    });
  }
  if (field === "password") {
    return res.status(401).json({
      status: "error",
      message: "You can't change password here...",
    });
  }

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "You are currently not logged in ...",
    });
  }
  try {
    FoundUser[field] = value;
    await user.findOneAndUpdate(
      { email },
      { [field]: value },
      { new: true } // return updated doc
    );
  } catch (err) {
    console.error("Save error:", err);
    return res.status(500).json({
      status: "error",
      message: "Failed to save user",
      error: err.message,
    });
  }
});
