/** @format */

const expect = require("chai").expect;

const sinon = require("sinon");
const User = require("../models/user");
const mongoose = require("mongoose");
const authController = require("../controllers/auth");

describe("auth controller", () => {
  let userId;
  before(function (done) {
    mongoose
      .connect(
        "mongodb+srv://admin2:admin1234@cluster0.44gx5.mongodb.net/test",
        {
          useUnifiedTopology: true,
        }
      )
      .then(() => {
        const user = new User({
          email: "a.com",
          password: "qwerty",
          name: "a",
          posts: [],
        });
        return user.save();
      })
      .then((user) => {
        userId = user;
        done();
      });
  });
  it("throw an error when database operations does't execute", (done) => {
    sinon.stub(User, "findOne");
    User.findOne.throws();
    const req = {
      body: {
        email: "a.com",
        password: "qweerrttyr",
      },
    };
    authController
      .login(req, {}, () => {})
      .then((result) => {
        expect(result).to.be.an("error");
        expect(result).to.have.property("statusCode", 500);
        done();
      });
    User.findOne.restore();
  });
  it("testing if we get back the user with the status", (done) => {
    console.log(userId);
    const req = {
      userId: userId._id,
    };
    const res = {
      statusCode: 500,
      userStatus: null,
      status: function (code) {
        this.statusCode = code;

        return this;
      },
      json: function (data) {
        this.userStatus = data.status;
      },
    };
    authController
      .getUserStatus(req, res, () => {})
      .then((result) => {
        expect(res.statusCode).to.be.equal(300);
        done();
      });
  });
  after(function (done) {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });
});
