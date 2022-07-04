const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");

afterAll(() => {
  return connection.end();
});
