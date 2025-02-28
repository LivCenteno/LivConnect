const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const knex = require("./api/models/connection_db");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

knex.raw("SELECT VERSION()").then(() => {
  console.log(`Connection To DB is Successful`);
});

// Header Settings
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "*");
    return res.status(200).json({});
  }

  next();
});

const chatRouter = require("./api/routers/chatRouter");
const userRouter = require("./api/routers/userRouter");
app.use("/user", userRouter);
app.use("/chat", chatRouter);

// ERROR MIDDLEWARE
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
