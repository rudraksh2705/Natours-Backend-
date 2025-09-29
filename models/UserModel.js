const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    required: [true, "Name Field is required"],
    type: String,
  },

  email: {
    unique: true,
    required: [true, "Email is required"],
    type: String,
    lowercasr: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },

  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },
  photo: String,

  password: {
    required: [true, "Password is required"],
    type: String,
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, "Please Confirm your password"],
    //works on create and save
    validate: function (el) {
      return el === this.password;
    },
  },

  passwordResetExpires: Date,

  passwordResetToken: String,

  passwordChangedAt: Date,
});

/*
Hashes the plain text password using bcrypt with 10 salt rounds.
Replaces the plain password with the hashed one before saving to the database.
*/

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.changePasswrodAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const user = mongoose.model("user", userSchema);

module.exports = user;
