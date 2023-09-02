const config = require("./utils/config");
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const blogRouter = require("./controllers/blog");
const usersRouter = require("./controllers/user");
const loginRouter = require("./controllers/login");
const mongoose = require("mongoose");

const middleware = require("./utils/middleware");
const logger = require("./utils/logger");

mongoose.set("strictQuery", false);

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/blogs", blogRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

const mongoUrl = config.MONGODB_URI;

mongoose
  .connect(mongoUrl)
  .then(() => {
    logger.info("connected");
  })
  .catch(() => {
    logger.error("error");
  });

module.exports = app;
