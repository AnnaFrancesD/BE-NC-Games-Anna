const express = require("express");
const { getCategories } = require("./controllers/categories-controllers");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

//ERROR HANDLING

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
