const express = require("express");
const { apiHealthCheck } = require("./controllers/api-controller");
const apiRouter = require("./routers/api-router");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.get("/", apiHealthCheck);
app.use("/api", apiRouter);

//ERROR HANDLING

//PSQL error handlers
app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502" || err.code === "42601") {
    res.status(400).send({ msg: "Bad Request" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "Not Found" });
  }
  next(err);
});

//Custom error handlers
app.get("*", (req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

//Unhandled errors
app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Server Error" });
});

module.exports = app;
