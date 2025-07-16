const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./index.js");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/tests").then((con) => {
  console.log("connected mongo db");
});

dotenv.config({ path: "./config.env" });
const port = 3000;
app.listen(port, () => {
  console.log("App running");
});
