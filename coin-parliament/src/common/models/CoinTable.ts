import {Row} from "react-table";
import * as matchSorter from "match-sorter";
import {Coin} from "./Coin";
import {Totals} from "../../Contexts/CoinsContext";
import {uniq} from "lodash";

export type BearVsBullRow = {
  symbol: string;
};

export const fuzzyTextFilterFn = (
  rows: readonly Row<BearVsBullRow>[],
  id: number,
  filterValue: string,
) =>
  matchSorter.matchSorter<Row<BearVsBullRow>>(rows, filterValue, {
    keys: [(row) => row.values[id]],
  });

fuzzyTextFilterFn.autoRemove = (val: any) => !val;

export const getVotes = (symbol: string, totals: { [p: string]: Totals }) =>
  totals[symbol]?.total || 0;
export const getData = ({
  coins,
  totals,
  allCoins,
}: {
  coins: { [p: string]: Coin };
  totals: { [p: string]: Totals };
  allCoins: string[]
  }) => {
  
  const coinkey = Object.values(coins)
  
  return coinkey.map((coin) => {
      return {
        symbol: coin.symbol,
        votes: getVotes(coin.symbol, totals),
        index: allCoins?.length?   allCoins?.indexOf(coin.symbol):0,
      };
    })
    .sort((a, b) => a.index === -1 || b.index === -1 ? -1 : a.index - b.index)
    .map((a) => {
      return { symbol: a.symbol };
    });
};

export const filterCoins = (
  coins: { [symbol: string]: Coin },
  filterBy: string[]
) => {
  const newCoins: { [symbol: string]: Coin } = {};
  Object.keys(coins).forEach((key) => {
    if (filterBy.includes(coins[key].symbol)) {
      newCoins[key] = coins[key];
    }
  });

  return newCoins;
};

export const filterData = (
  result: string[],
  callback: (total: string[], current: string) => string[],
  coins: { [p: string]: Coin },
  totals: { [p: string]: Totals },
  allCoins: string[],
) => {
  const filteredKeys = result.reduce(callback, [] as string[]);
  const newCoins = filterCoins(coins, filteredKeys);
  return getData({coins: newCoins, totals, allCoins});
};

export const getFilteredData = (
  filter: string,
  coins: { [p: string]: Coin },
  totals: { [p: string]: Totals },
  allCoins: string[],
) => {
  const str = filter.toUpperCase();
  if (str) {
    const symbols = Object.values(coins).map((c) => c.symbol);
    const names = Object.values(coins).map((c) => c.name);

    const result = uniq([
      ...symbols.filter((s) => s?.indexOf(str) !== -1),
      ...names.filter((s) => s?.indexOf(str) !== -1),
    ]);

    return filterData(
      result,
      (total, current) => {
        if (coins[current]?.name === str || coins[current]?.symbol === str) {
          total = [str, ...total];
        } else {
          total.push(current);
        }
        return total;
      },
      coins,
      totals,
      allCoins,
    );
  } else {
    return getData({coins, totals, allCoins});
  }
};

export const getFilteredDataByFav = (
  result: string[],
  coins: { [p: string]: Coin },
  totals: { [p: string]: Totals },
  allCoins: string[],
) => {
  return filterData(
    result,
    (total, current) => {
      if (result.includes(coins[current]?.symbol)) {
        total.push(current);
      }
      return total;
    },
    coins,
    totals,
    allCoins,
  );
};
