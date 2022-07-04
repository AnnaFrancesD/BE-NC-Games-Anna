const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return connection.end();
});

describe("app", () => {
  describe("GET /api/categories", () => {
    test("status 200, responds with an array of category objects", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then(({ body: { categories } }) => {
          expect(categories).toBeInstanceOf(Array);
          categories.forEach((category) => {
            expect(category).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
    describe("ERRORS", () => {
      test("status 404, responds with error message when passed route that does not exist", () => {
        return request(app)
          .get("/api/types")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Not Found");
          });
      });
    });
  });
  describe("GET /api/reviews/review_id", () => {
    test("status 200, responds with a review object with the correct properties", () => {
      return request(app)
        .get("/api/reviews/2")
        .expect(200)
        .then(({ body: { review } }) => {
          expect(review).toBeInstanceOf(Object);
          expect(review).toEqual(
            expect.objectContaining({
              review_id: expect.any(Number),
              title: expect.any(String),
              review_body: expect.any(String),
              designer: expect.any(String),
              review_img_url: expect.any(String),
              votes: expect.any(Number),
              owner: expect.any(String),
              created_at: expect.any(String),
            })
          );
        });
    });
    describe("ERRORS", () => {
      test("status 400, responds with error message when passed invalid review id", () => {
        return request(app)
          .get("/api/reviews/this-is-not-an-id")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Invalid User Id");
          });
      });
      test("status 404, responds with error message when passed an id that does not exist", () => {
        return request(app)
          .get("/api/reviews/999")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("User Id Not Found");
          });
      });
    });
  });
  describe("PATCH /api/reviews/:review_id", () => {
    test("status 200, responds with the updated review object, for update that increments votes", () => {
      const reviewUpdate = { inc_votes: 1 };
      return request(app)
        .patch("/api/reviews/1")
        .expect(200)
        .send(reviewUpdate)
        .then(({ body: { review } }) => {
          expect(review).toBeInstanceOf(Object);
          expect(review).toEqual(
            expect.objectContaining({
              votes: 2,
            })
          );
        });
    });
    test("status 200, responds with the updated review object, for update that decrements votes", () => {
      const reviewUpdate = { inc_votes: -3 };
      return request(app)
        .patch("/api/reviews/4")
        .expect(200)
        .send(reviewUpdate)
        .then(({ body: { review } }) => {
          expect(review).toBeInstanceOf(Object);
          expect(review).toEqual(
            expect.objectContaining({
              votes: 4,
            })
          );
        });
    });
    describe("ERRORS", () => {
      test("status 400, responds with error message if req body is an empty object", () => {
        const reviewUpdate = {};
        return request(app)
          .patch("/api/reviews/2")
          .expect(400)
          .send(reviewUpdate)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
      });
      test("status 400, responds with error message if update is of incorrect type", () => {
        const reviewUpdate = { inc_votes: "i am a string, not a number!" };
        return request(app)
          .patch("/api/reviews/2")
          .expect(400)
          .send(reviewUpdate)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
      });
    });
  });
  describe("GET /api/users", () => {
    test("status 200, responds with an array of user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toBeInstanceOf(Array);
          users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
              })
            );
          });
        });
    });
    describe("ERRORS", () => {
      test("status 404, responds with error message when passed route that does not exist", () => {
        return request(app)
          .get("/api/uzerz")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Not Found");
          });
      });
    });
  });
});
