import { calcStats, formatDate, getBulkHistoricData, lastXDays } from "./Chart";
import { rest } from "./Socket";
import { IHistoricTrade } from "@polygon.io/client-js";
import moment from "moment";
import { minuteData } from "./Chart.data";
import { BarData, Time } from "lightweight-charts";

describe("Chart", function () {
  describe("lastXDays", function () {
    it("last 1 day", () => {
      const actual = lastXDays(1);
      expect(actual).toStrictEqual([formatDate(moment(new Date(Date.now())))]);
    });
    it("last 2 day", () => {
      const actual = lastXDays(2);
      expect(actual).toStrictEqual([
        formatDate(moment(new Date(Date.now()))),
        formatDate(moment().subtract(1, "days")),
      ]);
    });
  });
  describe("getBulkHistoricData", function () {
    const mocked = jest.fn();
    mocked.mockReturnValue(
      new Promise((resolve) => {
        resolve({} as IHistoricTrade);
      })
    );
    rest.historicTrades = mocked;

    const expected = { [formatDate()]: {} };
    it("last 1 days", async () => {
      const actual = await getBulkHistoricData(1, "BTC", "USD");
      expect(Object.keys(actual)).toStrictEqual(Object.keys(expected));
    });
  });

  describe("formatDate", () => {
    ["2021-11-10", "2020-03-04"].forEach((date) => {
      it(date, () => {
        expect(formatDate(moment(new Date(date)))).toBe(date);
      });
    });
  });

  describe("calcStats", () => {
    it("calculate minutes stats", () => {
      const actual = calcStats(minuteData);
      expect(actual).toStrictEqual({
        time: 1642962870 as Time,
        open: 35170.83,
        close: 35202.81,
        high: 35267,
        low: 35141.9,
      } as BarData);
    });
  });
});
