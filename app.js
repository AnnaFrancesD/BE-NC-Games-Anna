const express = require("express");
const { getCategories } = require("./controllers/categories-controllers");
const {
  getReviewByReviewId,
  patchReviewByReviewId,
  getReviews,
  getCommentsByReviewId,
  postComment,
} = require("./controllers/reviews-controllers");
const { getUsers } = require("./controllers/users-controllers");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReviewByReviewId);
app.patch("/api/reviews/:review_id", patchReviewByReviewId);
app.get("/api/users", getUsers);
app.get("/api/reviews", getReviews);
app.get("/api/reviews/:review_id/comments", getCommentsByReviewId);
app.post("/api/reviews/:review_id/comments", postComment);

//ERROR HANDLING

//PSQL error handlers
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
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
