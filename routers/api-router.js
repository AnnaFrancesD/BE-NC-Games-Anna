const apiRouter = require("express").Router();
const { getEndpoints } = require("../controllers/api-controller");
const categoriesRouter = require("./categories-router");
const commentsRouter = require("./comments-router");
const reviewsRouter = require("./reviews-router");
const usersRouter = require("./users-router");

apiRouter.get("/", getEndpoints);

apiRouter.use("/users", usersRouter);

apiRouter.use("/categories", categoriesRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/reviews", reviewsRouter);

module.exports = apiRouter;
