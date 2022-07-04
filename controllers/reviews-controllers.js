const {
  fetchReviewByReviewId,
  updateReviewByReviewId,
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

exports.patchReviewByReviewId = (req, res) => {
  const id = req.params.review_id;
  updateReviewByReviewId(id, req.body).then((review) => {
    res.status(200).send({ review });
  });
};
