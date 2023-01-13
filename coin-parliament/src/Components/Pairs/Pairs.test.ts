import { getSymbolsCombinations } from "./utils";

describe("Pairs", function () {
  describe("getSymbolsCombinations", function () {
    it("should work well", () => {
      const coin1 = {
        name: "name1",
        symbol: "symbol1",
        id: 0,
        price: 0,
      };

      const coin2 = {
        name: "name2",
        symbol: "symbol2",
        id: 0,
        price: 0,
      };

      const coin3 = {
        name: "name3",
        symbol: "symbol3",
        id: 0,
        price: 0,
      };

      const actual = getSymbolsCombinations([coin1, coin2, coin3]);
      const expected = [
        [coin1, coin2],
        [coin1, coin3],
        [coin2, coin3],
      ];

      expect(actual).toStrictEqual(expected);
    });
  });
});
