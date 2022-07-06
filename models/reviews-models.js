const connection = require("../db/connection");

exports.fetchReviewByReviewId = (id) => {
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
      if (review.rowCount > 0) {
        return review.rows[0];
      }
      return Promise.reject({ status: 404, msg: "Not Found" });
    });
};

exports.updateReviewByReviewId = (id, update) => {
  if (typeof update.inc_votes === "number") {
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

exports.fetchReviews = () => {
  return connection
    .query(
      `
  SELECT reviews.*, COUNT (comments.review_id) AS comment_count FROM reviews
  LEFT JOIN comments
  ON reviews.review_id = comments.review_id
  GROUP BY reviews.review_id
  ORDER BY created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchCommentsByReviewId = (id) => {
  if (!isNaN(Number(id))) {
    return connection
      .query(
        `
  SELECT * FROM comments
WHERE comments.review_id = $1;`,
        [id]
      )
      .then(({ rows }) => {
        if (rows.length > 0) {
          return rows;
        }
        return Promise.reject({ status: 404, msg: "Review Id Not Found" });
      });
  }
  return Promise.reject({ status: 400, msg: "Invalid Review Id" });
};

exports.insertComment = (id, newComment) => {
  const { username, body } = newComment;
  return connection
    .query(
      `
  INSERT INTO comments (author, body, review_id)
  VALUES ($1, $2, $3) RETURNING *;
  `,
      [username, body, id]
    )
    .then((review) => {
      return review.rows[0];
    });
};
