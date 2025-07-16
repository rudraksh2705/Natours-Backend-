const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./Routes/TourRoutes");
const userRouter = require("./Routes/UserRoutes");

const app = express();

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

module.exports = app;
