const endpoints = require("../endpoints.json");

exports.getEndpoints = (req, res, next) => {
  res
    .status(200)
    .send(endpoints)
    .catch((err) => {
      next(err);
    });
};

exports.apiHealthCheck = (req, res, next) => {
  res
    .status(200)
    .send({ msg: "All ok" })
    .catch((err) => {
      next(err);
    });
};
