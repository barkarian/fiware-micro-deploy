const express = require("express");
const app = express();
const cors = require("cors");
const { connectToMongo } = require("./mongodb");

require("./initializeOrion")();
require("./initializeApplication")();
require("dotenv").config();

app.use(cors());
app.use(express.json());
connectToMongo();
//Routes
app.use("/auth", require("./auth/auth.routes"));
app.use("/api/events", require("./eventOrganizer/eventOrganizer.routes"));
app.use("/api/subscriptions", require("./subscriptions/subscriptions.routes"));
app.use("/api/admin", require("./admin/admin.routes"));
app.use("/api/user", require("./user/user.routes"));

app.get("/", function (req, res) {
  res.send("Hello World from 5000");
});

app.listen(5000, () => {
  console.log("server is running on port 5000");
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
