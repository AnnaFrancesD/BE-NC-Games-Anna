const connection = require("../db/connection");

exports.fetchReviewByReviewId = (id) => {
  if (typeof Number(id) === "number" && !isNaN(Number(id))) {
    if (Number(id) > 0 && Number(id) < 14) {
      return connection
        .query(`SELECT * FROM reviews WHERE review_id = $1;`, [id])
        .then((review) => {
          return review.rows[0];
        });
    }
    return Promise.reject({ status: 404, msg: "User Id Not Found" });
  }
  return Promise.reject({ status: 400, msg: "Invalid User Id" });
};

exports.updateReviewByReviewId = (reviewId, reviewUpdate) => {
  console.log(reviewUpdate);
};
