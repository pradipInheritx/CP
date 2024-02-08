import { getChosenPairs } from "../../Components/Pairs/utils";
import { coins, totals } from "../../Components/Pairs/testData";
import { getFilteredData, getFilteredDataByFav, getPairs } from "./PairTable";

const allPairs = [
  ["BTC", "ETH"],
  ["ADA", "SOL"],
  ["DOGE", "SHIB"],
  ["ETH", "BNB"],
  ["DOT", "MATIC"],
  ["XRP", "ADA"],
  ["LTC", "XRP"],
  ["CRO", "BNB"],
  ["SAND", "MANA"],
  ["UNI", "CAKE"],
  ["XLM", "XTZ"],
  ["LUNA", "DOGE"],
  ["DOGE", "BABYDOGE"],
  ["LINK", "TRON"],
  ["FTT", "BNB"],
];

describe("PairTable", () => {
  describe("getChosenPairs", () => {
    it("test1", () => {
      const str = "ADA";
      const actual = getChosenPairs(allPairs, str);
      const expected = [
        ["ADA", "SOL"],
        ["XRP", "ADA"],
      ];
      expect(actual).toStrictEqual(expected);
    });
  });

  describe("getFilteredData", () => {
    it("should filtered data properly", () => {
      const pairs = getPairs(allPairs, coins);
      const actual = getFilteredData("btc", pairs, totals);
      expect(actual).toStrictEqual([
        {
          coin1: "BTC",
          coin2: "ETH",
        },
      ]);
    });
  });

  describe("getFilteredDataByFav", () => {
    it("should filtered data properly", () => {
      const pairs = getPairs(allPairs, coins);
      const actual = getFilteredDataByFav(["BTC-ETH"], pairs, totals);
      expect(actual).toStrictEqual([
        {
          coin1: "BTC",
          coin2: "ETH",
        },
      ]);
    });
  });
});
