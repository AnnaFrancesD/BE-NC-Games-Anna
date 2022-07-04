const res = require("express/lib/response");
const { fetchUsers } = require("../models/users-models");

exports.getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};
