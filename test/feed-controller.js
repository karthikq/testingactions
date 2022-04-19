/** @format */

const expect = require("chai").expect;

const sinon = require("sinon");
const User = require("../models/user");
const mongoose = require("mongoose");
const feedController = require("../controllers/feed");

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
  it("test if the post is created", (done) => {
    const req = {
      body: {
        title: "test",
        content: "Test",
      },
      file: {
        path: "abc",
      },
      userId: userId._id,
    };
    const res = {
      status: function () {
        return this;
      },
      json: function () {},
    };
    feedController
      .createPost(req, res, () => {})
      .then((savedUser) => {
        expect(savedUser).to.have.property("posts");
        expect(savedUser.posts).to.have.length(1);

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
