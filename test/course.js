require("dotenv").config();
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index");

chai.use(chaiHttp);

const user = {
  email: process.env.MAILER_USER,
  password: process.env.MAILER_PASSWORD,
};

let token = "hello";

describe("Courses route:", () => {
  describe("get all courses", () => {
    it("should return token", async (done) => {
      chai
        .request(server)
        .post("/api/auth")
        .send(user)
        .end((err, res) => {
          console.log(res.body);
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("authToken");
        });
        done();
    });
  });
});
