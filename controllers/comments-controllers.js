const { removeComment, updateComment } = require("../models/comments-models");

exports.deleteComment = (req, res, next) => {
  const id = req.params.comment_id;
  removeComment(id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchComment = (req, res, next) => {
  const id = req.params.comment_id;
  updateComment(id, req.body)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
