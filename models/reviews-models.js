const connection = require("../db/connection");

exports.fetchReviewByReviewId = (id) => {
  return connection
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [id])
    .then((review) => {
      return review.rows[0];
    });
};
