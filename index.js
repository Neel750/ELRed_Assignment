/** @format */

const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
var mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
var User = require("./models/userModel");
const userModel = require("./models/userModel");
const {
  createTask,
  getAllTask,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  changeOrderOfTask,
} = require("./controllers/taskController");
const { login, signUp, verifyOTP } = require("./controllers/userController");
const { verifyToken } = require("./middleware/auth");

const app = express();

// set up middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Logger
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    exposedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "x-access-token",
      "XSRF-TOKEN",
      "Access-Control-Allow-Credentials",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "x-access-token",
      "XSRF-TOKEN",
      "Access-Control-Allow-Credentials",
    ],
  })
);

const getActualRequestDurationInMilliseconds = (start) => {
  const NS_PER_SEC = 1e9; // convert to nanoseconds
  const NS_TO_MS = 1e6; // convert to milliseconds
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
};

let logger = (req, res, next) => {
  let current_datetime = new Date();
  let formatted_date =
    current_datetime.getFullYear() +
    "-" +
    (current_datetime.getMonth() + 1) +
    "-" +
    current_datetime.getDate() +
    " " +
    current_datetime.getHours() +
    ":" +
    current_datetime.getMinutes() +
    ":" +
    current_datetime.getSeconds();
  let method = req.method;
  let url = req.url;
  let status = res.statusCode;
  const start = process.hrtime();
  const durationInMilliseconds = getActualRequestDurationInMilliseconds(start);
  let log = `[${formatted_date}] ${method}:${url} ${status} ${
    durationInMilliseconds.toLocaleString() + "ms"
  }`;
  console.log(log);
  next();
};
app.use(logger);

app.post("/register", async function (req, res) {
  await signUp(req, res);
});

app.post("/verify", async function (req, res) {
  await verifyOTP(req, res);
});

app.post("/login", async (req, res) => {
  await login(req, res);
});

app.post("/task", verifyToken, async (req, res) => {
  await createTask(req, res);
});

app.post("/task/order", verifyToken, async (req, res) => {
  await changeOrderOfTask(req, res);
});

app.get("/task", verifyToken, async (req, res) => {
  await getAllTask(req, res);
});

app.get("/task/:id", verifyToken, async (req, res) => {
  await getTaskById(req, res);
});

app.patch("/task/:id", verifyToken, async (req, res) => {
  await updateTaskById(req, res);
});

app.delete("/task/:id", verifyToken, async (req, res) => {
  await deleteTaskById(req, res);
});
// Set `strictQuery: false` to globally opt into filtering by properties that aren't in the schema
// Included because it removes preparatory warnings for Mongoose 7.
// See: https://mongoosejs.com/docs/migrating_to_6.html#strictquery-is-removed-and-replaced-by-strict
mongoose.set("strictQuery", false);

// Define the database URL to connect to.
const mongoDB =
  "mongodb+srv://shahneel1562:mq9I3mwm76mNRgQx@cluster0.ascni7z.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(mongoDB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

app.listen(process.env.port, () => {
  console.log(`Server running @${process.env.port}`);
});
