const connection = require("../db/connection");

exports.fetchUsers = () => {
  return connection.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchUserByUsername = (username) => {
  return connection
    .query(
      `
  SELECT * FROM users
WHERE users.username = $1;`,
      [username]
    )
    .then(({ rows }) => {
      if (rows.length > 0) {
        return rows[0];
      }
      return Promise.reject({ status: 404, msg: "Not Found" });
    });
};
