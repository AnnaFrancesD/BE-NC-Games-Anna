const connection = require("../db/connection");

exports.fetchReviewByReviewId = (id) => {
  return connection
    .query(
      `SELECT reviews.*, COUNT (comments.review_id) AS comment_count FROM reviews
        LEFT JOIN comments
        ON reviews.review_id = comments.review_id
        WHERE reviews.review_id = $1
        GROUP BY reviews.review_id;`,
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
  const voteIncrement = update.inc_votes;
  return connection
    .query(
      `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING*;`,
      [voteIncrement, id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.fetchReviews = (
  sort_by = "created_at",
  order = "DESC",
  category = ""
) => {
  const validSortByQueries = [
    "title",
    "designer",
    "owner",
    "review_img_url",
    "review_body",
    "category",
    "created_at",
    "votes",
  ];

  const validOrderByQueries = ["DESC", "ASC"];

  const validCategories = [
    "euro game",
    "dexterity",
    "social deduction",
    "children's games",
    "",
    "strategy",
    "hidden-roles",
    "push-your-luck",
    "roll-and-write",
    "deck-building",
    "engine-building",
  ];

  if (!validSortByQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid Query" });
  }

  if (!validOrderByQueries.includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "Invalid Query" });
  }

  if (!validCategories.includes(category)) {
    return Promise.reject({ status: 400, msg: "Invalid Query" });
  }

  let queryStr = `
  SELECT reviews.*, COUNT (comments.review_id) AS comment_count FROM reviews
  LEFT JOIN comments
  ON reviews.review_id = comments.review_id`;

  const queryCategory = [];

  if (category) {
    category = category.replace(`'`, `''`);
    queryStr += ` WHERE reviews.category = $1`;
    queryCategory.push(category);
  }

  queryStr += ` GROUP BY reviews.review_id
  ORDER BY ${sort_by} ${order}`;
  return connection.query(queryStr, queryCategory).then(({ rows }) => {
    return rows;
  });
};

exports.fetchCommentsByReviewId = (id) => {
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
      return Promise.reject({ status: 404, msg: "Not Found" });
    });
};

exports.insertComment = (id, newComment) => {
  if (Object.keys(newComment).length !== 2) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }
  const { username, body } = newComment;
  return connection
    .query(
      `
  INSERT INTO comments (author, body, review_id)
  VALUES ($1, $2, $3) RETURNING *;
  `,
      [username, body, id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.insertReview = (newReview) => {
  console.log(Object.keys(newReview).length);
  if (Object.keys(newReview).length !== 5) {
    return Promise.reject({ status: 400, msg: "Bad Request" });
  }

  const { owner, title, review_body, designer, category } = newReview;
  return connection
    .query(
      `INSERT INTO reviews (owner, title, review_body, designer, category)
      VALUES ($1, $2, $3, $4, $5) RETURNING review_id;
     `,
      [owner, title, review_body, designer, category]
    )
    .then(({ rows }) => {
      const id = rows[0].review_id;
      return id;
    })
    .then((id) => {
      return connection.query(
        `SELECT reviews.*, COUNT (comments.review_id) AS comment_count FROM reviews
        LEFT JOIN comments
        ON reviews.review_id = comments.review_id
        WHERE reviews.review_id = $1
        GROUP BY reviews.review_id;`,
        [id]
      );
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
