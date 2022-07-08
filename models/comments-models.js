const connection = require("../db/connection");

exports.removeComment = (id) => {
  return connection.query(`DELETE FROM comments WHERE comment_id = $1`, [id]);
};

exports.updateComment = (id, update) => {
  const voteIncrement = update.inc_votes;
  return connection
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING*;`,
      [voteIncrement, id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
