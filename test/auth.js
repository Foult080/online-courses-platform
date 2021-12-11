const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const should = chai.should();

chai.use(chaiHttp);

describe("Auth route", () => {
  describe("authenticate user", () => {
    it("should return token", (done) => {
      let user = {
        email: "admin@gmail.com",
        password: "qwertyui",
      };
      chai
        .request(server)
        .post("/api/auth")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("authToken");
        });
      done();
    });
    it("shoud return error after send not valid email", (done) => {
      let user = {
        email: "admin@gmail",
        password: "qwertyui",
      };
      chai
        .request(server)
        .post("/api/auth")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("errors");
          res.body.errors.should.be.a("array");
        });
      done();
    });
    it("shoud return error after send not existing user", (done) => {
      let user = {
        email: "newadmin@gmail.com",
        password: "qwertyui",
      };
      chai
        .request(server)
        .post("/api/auth")
        .send(user)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.a("object");
        });
      done();
    });
  });
});
