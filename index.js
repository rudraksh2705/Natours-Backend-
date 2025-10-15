const path = require("path");
const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./Routes/TourRoutes");
const userRouter = require("./Routes/UserRoutes");
const reviewRouter = require("./Routes/reviewRoutes");
const viewRouter = require("./Routes/viewRoutes");
const AppError = require("./utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const message = `Invalid input data ...`;
  return new AppError(message);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value : ${value} , Please use another`;
  return new AppError(message, 400);
};

function handleJWTError(err) {
  return new AppError("Token is Invalid", 401);
}

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "Views"));

app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString;
  // console.log(req.headers);
  next();
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/", viewRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`cant't find ${req.originalUrl} on this server!`, 404));
});

app.get("/test", (req, res) => {
  res.send("Server is working fine");
});

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    let error = { ...err };
    console.log(error);
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (error.name === "CastError") {
      error = handleCastErrorDB(error);
    } else if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    } else if (err.name === "ValidationError") {
      error = handleValidationError(error);
    } else if (err.name === "JsonWebTokenError") {
      error = handleJWTError(error);
    }
    sendErrorProd(err, res);
  }
});

module.exports = app;
