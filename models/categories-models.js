const connection = require("../db/connection");

exports.fetchCategories = () => {
  return connection.query(`SELECT * FROM categories`).then(({ rows }) => {
    return rows;
  });
};
