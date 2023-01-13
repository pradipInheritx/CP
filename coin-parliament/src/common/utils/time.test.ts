import { calcTimeLeft } from "./time";

describe("time", () => {
  it("in 4 hours", () => {
    expect(calcTimeLeft(new Date().getTime() + 4 * 60 * 60 * 1000)).toBe(
      "4h 0m 0s"
    );
  });
});
