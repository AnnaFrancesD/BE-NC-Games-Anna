const {
  fetchReviewByReviewId,
  updateReviewByReviewId,
  fetchReviews,
  fetchCommentsByReviewId,
  insertComment,
} = require("../models/reviews-models");

exports.getReviewByReviewId = (req, res, next) => {
  const id = req.params.review_id;
  fetchReviewByReviewId(id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReviewByReviewId = (req, res, next) => {
  const id = req.params.review_id;
  updateReviewByReviewId(id, req.body)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res, next) => {
  fetchReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByReviewId = (req, res, next) => {
  const id = req.params.review_id;
  fetchCommentsByReviewId(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const id = req.params.review_id;
  insertComment(id, req.body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
