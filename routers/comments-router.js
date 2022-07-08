const { deleteComment } = require("../controllers/comments-controllers");
const { getCommentsByReviewId } = require("../controllers/reviews-controllers");

const commentsRouter = require("express").Router();

commentsRouter.delete("/:comment_id", deleteComment);

module.exports = commentsRouter;
