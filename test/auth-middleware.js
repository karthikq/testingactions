/** @format */

const authMiddle = require("../middleware/is-auth");
const expect = require("chai").expect;
const sinon = require("sinon");
const jwt = require("jsonwebtoken");

describe("auth middleware", () => {
  it("should throw an error", () => {
    const req = {
      get: function () {
        return null;
      },
    };
    expect(authMiddle.bind(this, req, {}, () => {})).to.throw(
      "Not authenticated."
    );
  });

  it("Should throw an error if authorization header is only one string", () => {
    const req = {
      get: function (headerName) {
        return headerName;
      },
    };
    expect(authMiddle.bind(this, req, {}, () => {})).to.throw();
  });
  it("test userid property", () => {
    const req = {
      get: function (headerName) {
        return "Bearer tokeasdasdasdasdn";
      },
    };
    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });

    authMiddle(req, {}, () => {});
    expect(req).to.have.property("userId");
    jwt.verify.restore();
  });
});
