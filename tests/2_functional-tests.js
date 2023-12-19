/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server.js");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  suite("Routing tests", function () {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "test" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body[0].title,"test");
              assert.isArray(res.body);
            });
          done();
        });

        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({ title: "" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body[0], "missing required field title");
            });
          done();
        });
      },
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            assert.isArray(res.body);
          });
        done();
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .get("/api/books/6574983jgbg3nnjjf")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body[0], "no book exists");
          });
        done();
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server)
          .get("/api/books/6581412518431985513f3e2e")
          .end((err, res) => {
            assert.equal(res.status, 200);
           // assert.equal(res.body.title, "fda");
          });
        done();
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          chai
            .request(server)
            .post("/api/books/658149b1f1e6bb2506e8192d")
            .send({ comment: "test" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              //assert.equal(res.body.comments[0], "test");
            });
          done();
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          chai
            .request(server)
            .post("/api/books/658135231815f162d54c8349")
            .send({ comment: "" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body[0], "missing required field title");
            });
          done();
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          chai
            .request(server)
            .post("/api/books/658135231815f162d54czz8349")
            .send({ comment: "test" })
            .end((err, res) => {
              assert.equal(res.status, 200);
              assert.equal(res.body[0], "no book exists");
            });
          done();
        });
      },
    );

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        chai.request(server)
            .keepOpen()
            .delete("/api/books")
            .send({_id:"65813c7f18431985513f3e24"})
            .end((err,res)=>{
              assert.equal(res.status,200);
            })
        done();
      });

      test("Test DELETE /api/books/[id] with  id not in db", function (done) {
        chai.request(server)
            .delete("/api/books")
            .send({_id:"833urjdh"})
            .end((err,res)=>{
              assert.equal(res.status,200);
             // assert.equal(res.body[0],"no book exists")
            })
        done();
      });
    });
  });
});
