const { fetchReviewByReviewId } = require("../models/reviews-models");

exports.getReviewByReviewId = (req, res, next) => {
  const id = req.params.review_id;
  fetchReviewByReviewId(id).then((review) => {
    res.status(200).send({ review });
  });
};
