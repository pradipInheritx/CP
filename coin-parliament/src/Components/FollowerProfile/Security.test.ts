import { validatePassword } from "./utils";

describe("Security", () => {
  describe("validatePassword", () => {
    it("E3dgdsshhewyg# - true", () => {
      expect(validatePassword("E3dgdsshhewyg#", "avi111", "E3dgdsshhewyg#")).toBeTruthy();
    });

    it("E3dgdssshhewyg# - false", () => {
      expect(validatePassword("E3dgdssshhewyg#", "avi111", "E3dgdssshhewyg#")).toBeFalsy();
    });

    it("E3dgdavi111# - false", () => {
      expect(validatePassword("E3dgdavi111#", "avi111", "E3dgdavi111#")).toBeFalsy();
    });
  });
});
