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
      test('status 404, responds with message "Not Found"', () => {
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
  });
});
