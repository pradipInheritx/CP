import moment from "moment";
import {
  calcIndication,
  calcWeightedIndication,
  getDatesArray,
  roundDay,
  roundMinutes,
} from "./CPVI";

describe("CPVI", () => {
  it("roundDay", () => {
    const date = new Date();
    const expected = new Date(
        `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    ).getTime();
    const actual = roundDay(date);
    expect(actual).toBe(expected);
  });

  it("roundMinutes", () => {
    const date = new Date();
    expect(roundMinutes(date)).toBe(
        new Date(
            `${date.getFullYear()}/${
              date.getMonth() + 1
            }/${date.getDate()} ${date.getHours()}:00:00`
        ).getTime()
    );
  });

  describe("calcIndications", () => {
    it("should be 50", () => {
      expect(calcIndication(0, 0)).toBe(50);
    });

    it("should be 50 (populated)", () => {
      expect(calcIndication(1, 1)).toBe(50);
    });

    it("should be 33.33", () => {
      expect(calcIndication(1, 2)).toBe(
          Number(Number(100 * (1 / 3)).toFixed(3))
      );
    });
  });

  describe("calcWeightedIndication", () => {
    it("should return 70.59%", async () => {
      const total = {
        direction0: 1,
        direction1: 1,
      };

      const remote = {
        direction0: 3,
        direction1: 1,
      };

      const weight = 0.7;

      const actual = await calcWeightedIndication(total, remote, weight);
      expect(actual).toBe(70.59);
    });
  });
  describe("dates array", () => {
    it("last day, hours", () => {
      const start = moment().subtract(24, "hours").unix() * 1000;
      const end = Date.now();
      const actual = getDatesArray(3600, start, end);
      expect(actual.length).toBe(24 + 1);
      expect(actual[0]).toBe(end);
    });

    it("last month, days", () => {
      const start = moment().subtract(30, "days").unix() * 1000;
      const end = Date.now();
      const actual = getDatesArray(86400, start, end);
      expect(actual.length).toBe(30 + 1);
      expect(actual[0]).toBe(end);
    });
  });
});
