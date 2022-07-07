const connection = require("../db/connection");

exports.removeComment = (id) => {
  return connection.query(`DELETE FROM comments WHERE comment_id = $1`, [id]);
};
