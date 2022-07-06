const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
const req = require("express/lib/request");

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
              review_id: 2,
              title: "Jenga",
              review_body: "Fiddly fun for all the family",
              designer: "Leslie Scott",
              review_img_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              votes: 5,
              owner: "philippaclaire9",
              comment_count: "3",
              category: "dexterity",
              created_at: "2021-01-18T10:01:41.251Z",
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
            expect(msg).toBe("Bad Request");
          });
      });
      test("status 404, responds with error message when passed an id that does not exist", () => {
        return request(app)
          .get("/api/reviews/999")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Not Found");
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
          expect(users.length).toBeGreaterThan(0);
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
  describe("GET /api/reviews", () => {
    test("status 200, responds with an array of review objects with the correct properties", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeInstanceOf(Array);
          reviews.forEach((review) => {
            expect(review).toEqual(
              expect.objectContaining({
                owner: expect.any(String),
                title: expect.any(String),
                review_id: expect.any(Number),
                category: expect.any(String),
                review_img_url: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                review_body: expect.any(String),
                designer: expect.any(String),
                comment_count: expect.any(String),
              })
            );
          });
        });
    });
    test("status 200, response array is sorted by date by default", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toBeSortedBy("created_at", {
            coerce: true,
            descending: true,
          });
        });
    });
    describe("QUERIES", () => {
      test("status 200, reviews can be sorted by any valid column", () => {
        return request(app)
          .get("/api/reviews/?sort_by=title")
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toBeSortedBy("title", { descending: true });
          });
      });
      test("status 200, reviews can be sorted by specified order", () => {
        return request(app)
          .get("/api/reviews/?sort_by=owner&order=asc")
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toBeSortedBy("owner");
          });
      });
      test("status 200, reviews can be filtered by topic value specified in the query (for request that returns one review", () => {
        return request(app)
          .get("/api/reviews/?category=dexterity")
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews.length).toBe(1);
            reviews.forEach((review) => {
              expect(review).toEqual(
                expect.objectContaining({
                  title: "Jenga",
                  category: "dexterity",
                })
              );
            });
          });
      });
      test("status 200, reviews can be filtered by topic value specified in the query (for request that returns multiple reviews", () => {
        return request(app)
          .get("/api/reviews/?category=social+deduction")
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews.length).toBe(11);
            reviews.forEach((review) => {
              expect(review).toEqual(
                expect.objectContaining({
                  category: "social deduction",
                })
              );
            });
          });
      });

      describe("ERRORS", () => {
        test("status 400, responds with error message if sort_by query is invalid", () => {
          return request(app)
            .get("/api/reviews/?sort_by=invalid_query")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid Query");
            });
        });
        test("status 404, responds with error message if order query is invalid", () => {
          return request(app)
            .get("/api/reviews/?order=hello")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad Request");
            });
        });
        test("status 400, responds with error message if category query is invalid", () => {
          return request(app)
            .get("/api/reviews/?category=not_a_category")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Invalid Query");
            });
        });
      });
    });
    describe("GET /api/reviews/:review_id/comments", () => {
      test("status 200, responds with an array of comments for the given review_id with the correct properties", () => {
        return request(app)
          .get("/api/reviews/3/comments")
          .then(({ body: { comments } }) => {
            expect(comments).toBeInstanceOf(Array);
            comments.forEach((comment) => {
              expect(comment).toHaveProperty("comment_id");
              expect(comment).toHaveProperty("votes");
              expect(comment).toHaveProperty("created_at");
              expect(comment).toHaveProperty("author");
              expect(comment).toHaveProperty("body");
              expect(comment).toHaveProperty("review_id");
            });
          });
      });
      describe("ERRORS", () => {
        test("status 400, responds with error message when passed invalid review_id", () => {
          return request(app)
            .get("/api/reviews/this-is-not-an-id-either/comments")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Bad Request");
            });
        });
        test("status 404, responds with error message when passed id that does not exist", () => {
          return request(app)
            .get("/api/reviews/99/comments")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Not Found");
            });
        });
      });
    });
  });
  describe("POST /api/reviews/:review_id/comments", () => {
    test("status 201, responds with the posted comment", () => {
      const newComment = {
        username: "bainesface",
        body: "I was the werewolf...",
      };
      return request(app)
        .post("/api/reviews/3/comments")
        .expect(201)
        .send(newComment)
        .then(({ body: { comment } }) => {
          expect(comment).toBeInstanceOf(Object);
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: 7,
              author: "bainesface",
              body: "I was the werewolf...",
              review_id: 3,
              votes: 0,
              created_at: expect.any(String),
            })
          );
        });
    });
    describe("ERRORS", () => {
      test("status 400, responds with error message if the request body is missing fields", () => {
        const newComment = {};
        return request(app)
          .post("/api/reviews/3/comments")
          .expect(400)
          .send(newComment)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
      });
      test("status 400, responds with error message if the request body has extra fields", () => {
        const newComment = {
          username: "Anna",
          body: "This is my review",
          cheese: "cheese",
        };
        return request(app)
          .post("/api/reviews/3/comments")
          .expect(404)
          .send(newComment)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Not Found");
          });
      });
      test("status 400, responds with error message if review id is invalid", () => {
        const newComment = {
          username: "bainesface",
          body: "I was the werewolf...",
        };
        return request(app)
          .post("/api/reviews/not_an_id/comments")
          .expect(400)
          .send(newComment)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
      });
      test("status 404, responds with error message if review id does not exist", () => {
        const newComment = {
          username: "bainesface",
          body: "I was the werewolf...",
        };
        return request(app)
          .post("/api/reviews/99/comments")
          .expect(404)
          .send(newComment)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Not Found");
          });
      });
      test("status 404, responds with error message if username does not exist", () => {
        const newComment = {
          username: "Anna",
          body: "comment",
        };
        return request(app)
          .post("/api/reviews/3/comments")
          .expect(404)
          .send(newComment)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Not Found");
          });
      });
    });
  });
});
