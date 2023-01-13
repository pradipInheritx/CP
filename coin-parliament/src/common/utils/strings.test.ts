import { abbrNum } from "./numbers";
import { generateUsername } from "./strings";

describe("strings", () => {
  it("generates random username", () => {
    const username = generateUsername();
    expect(username.split(" ").length).toBeGreaterThanOrEqual(1);
  });
});
