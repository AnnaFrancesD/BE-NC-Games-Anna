const connection = require("../db/connection");

exports.fetchReviewByReviewId = (id) => {
  if (typeof Number(id) === "number" && !isNaN(Number(id))) {
    if (Number(id) > 0 && Number(id) < 14) {
      return connection
        .query(
          `SELECT a.*, COUNT (b.review_id) AS comment_count FROM reviews a
        LEFT JOIN comments b
        ON a.review_id = b.review_id
        WHERE a.review_id = $1
        GROUP BY a.review_id;`,
          [id]
        )
        .then((review) => {
          return review.rows[0];
        });
    }
    return Promise.reject({ status: 404, msg: "User Id Not Found" });
  }
  return Promise.reject({ status: 400, msg: "Invalid User Id" });
};

exports.updateReviewByReviewId = (id, update) => {
  if (update.inc_votes !== undefined && typeof update.inc_votes === "number") {
    const voteIncrement = update.inc_votes;
    return connection
      .query(
        `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING*;`,
        [voteIncrement, id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  }
  return Promise.reject({ status: 400, msg: "Bad Request" });
};
