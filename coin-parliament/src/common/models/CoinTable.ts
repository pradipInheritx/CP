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
  type: any,
  str:any,
  result: string[],
  callback: (total: string[], current: string) => string[],
  coins: { [p: string]: Coin },
  totals: { [p: string]: Totals },
  allCoins: string[],
) => {
  const filteredKeys = result.reduce(callback, [] as string[]);  
  const filterText = filterDataText(str,filteredKeys)
  const newCoins = filterCoins(coins, type == "fav" && str ? filterText : filteredKeys );
  return getData({ coins: newCoins, totals, allCoins });
};
export const filterDataText = (
  str: string,
  filterBy: string[]
) => {  
  
  let filtertext: string[] = []
  filterBy.map((item,index) => {
    if (str && item.includes(str) ) {
      filtertext.push(item)
    }
  })
  return filtertext 
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

const type = "tex"

    return filterData(
      type,
      str,
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
  filter: string,
  result: string[],
  coins: { [p: string]: Coin },
  totals: { [p: string]: Totals },
  allCoins: string[],
) => {
const type="fav"
  const str = filter.toUpperCase();
  return filterData(
    type,
    str,
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
