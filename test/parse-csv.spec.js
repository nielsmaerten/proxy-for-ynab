const chai = require("chai");
const expect = chai.expect;
const Proxy = require("../src");
const testData = require("./test-data");

describe("parser.csv()", () => {
  it("accepts a CSV string + filename", () => {
    Proxy.parser.csv(testData.csvString, "my-test-file");
  });

  it("returns a parseResult", () => {
    let result = Proxy.parser.csv(testData.valid.csvString, testData.valid.filename);
    expect(result).to.not.equal(undefined);
  });
});
