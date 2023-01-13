import { abbrNum } from "./numbers";

describe("number", () => {
  it("1000 to 1k", () => {
    expect(abbrNum(1000)).toBe("1k");
  });
});
