const dotenv = require("dotenv");

const app = require("./index.js");
const mongoose = require("mongoose");

/*Har wo function jo route se jud kar request-response cycle mein participate karta hai, wo middleware hi hota hai.*/

mongoose.connect("mongodb://127.0.0.1:27017/tests").then(() => {
  console.log("connected");
});

dotenv.config({ path: "./config.env" });
console.log(process.env);
const port = 3000;
app.listen(port, () => {
  console.log("App running");
});
