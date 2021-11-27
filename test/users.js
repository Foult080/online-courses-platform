const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");
const should = chai.should();
const faker = require("faker");

chai.use(chaiHttp);

const user = {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
};

//testing user route
describe("User route", () => {
  describe("add user", () => {
    it("it should return token", async function (done) {
      chai
        .request(server)
        .post("/api/users")
        .send(user)
        .end((err, res) => {
          console.log(res.status, res.body);
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("token");
        });
      done();
    });
    it("after send empty object it shoud return errors", (done) => {
      chai
        .request(server)
        .post("/api/users")
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("errors");
          res.body.errors.should.be.a("array");
          done();
        });
    });
    it("after send not valid email it shoud return error", (done) => {
      let user = {
        name: faker.name.findName,
        email: "some@mail",
        password: faker.internet.password,
      };
      chai
        .request(server)
        .post("/api/users")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("errors");
          res.body.errors.should.be.a("array");
          res.body.errors[0].should.have.property("msg");
          done();
        });
    });
    it("after send existing user it shoud return error", (done) => {
      chai
        .request(server)
        .post("/api/users")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("errors");
          res.body.errors.should.be.a("array");
          res.body.errors[0].should.have.property("msg");
          
        });
        done();
    });
  });
  describe("reset password", () => {
    it("shoud return error after sending not valid email", (done) => {
      let user = {
        email: "admin@gmail",
      };
      chai
        .request(server)
        .put("/api/users/restore")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property("errors");
          res.body.errors.should.be.a("array");
          res.body.errors[0].should.have.property("msg");
          done();
        });
    });
    it("shoud return error after sending not existing user", (done) => {
      chai
        .request(server)
        .put("/api/users/restore")
        .send({
          email: "foult0802@gmail.com",
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property("errors");
          res.body.errors.should.be.a("array");
        });
      done();
    });
    it("shoud return success", (done) => {
      chai
        .request(server)
        .put("/api/users/restore")
        .send({
          email: user.email,
        })
        .end((err, res) => {
          res.should.have.status(200);
        });
      done();
    });
  });
});
