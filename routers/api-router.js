const express = require("express");
const apiRouter = require("express").Router();

apiRouter.get("/", getEndpoints);

module.exports = apiRouter;
