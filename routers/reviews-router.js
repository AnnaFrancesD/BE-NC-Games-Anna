const {
  getReviews,
  getReviewByReviewId,
  getCommentsByReviewId,
  patchReviewByReviewId,
  postComment,
  postReview,
} = require("../controllers/reviews-controllers");

const reviewsRouter = require("express").Router();

reviewsRouter.get("/", getReviews);

reviewsRouter.get("/:review_id", getReviewByReviewId);

reviewsRouter.get("/:review_id/comments", getCommentsByReviewId);

reviewsRouter.patch("/:review_id", patchReviewByReviewId);

reviewsRouter.post("/:review_id/comments", postComment);

reviewsRouter.post("/", postReview);

module.exports = reviewsRouter;
