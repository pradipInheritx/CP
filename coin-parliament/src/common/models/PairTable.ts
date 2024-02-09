import {Coin} from "./Coin";
import {Totals} from "../../Contexts/CoinsContext";
import {queryToPair, symbolCombination} from "../../Components/Pairs/utils";
import {flatten, uniq} from "lodash";
import {getVotes} from "./CoinTable";

export type PairsRow = {
  coin1: string;
  coin2: string;
};

export const getData = ({
  pairs,
  totals,
  str,
}: {
  pairs: Coin[][];
  totals: { [p: string]: Totals };
  str?: any;
  }) => {
  const filterpair = str ? filterpairdata(str, pairs) : [...pairs]

  // console.log(pairs,"filterpair")

  return filterpair
    .map((combination:any) => {
      if (!combination) return undefined;
      const [coin1, coin2] = combination;
      return {
        coin1: coin1.symbol,
        coin2: coin2.symbol,
      };
    })
    .filter((p:any) => p && p?.coin1 && p?.coin2)
    .sort(
      (a:any, b:any) =>
        getVotes(symbolCombination([b?.coin1 + "", b?.coin2 + ""]), totals) -
        getVotes(symbolCombination([a?.coin1 + "", a?.coin2 + ""]), totals)
    ) as PairsRow[];
};

export const filterData = (  
  result: string[],
  callback: (total: string[], current: string) => string[],
  pairs: Coin[][],
  totals: { [p: string]: Totals }
) => {
  const filteredKeys = result.reduce(callback, [] as string[]);
  const newPairs: Coin[][] = filterPairs(pairs, filteredKeys);
  return getData({ pairs: newPairs, totals });
};

export const filterPairs = (pairs: Coin[][], filteredKeys: string[]) => {
  return pairs.filter((pair) => {
    const [coin1, coin2] = pair;

    return (
      filteredKeys.indexOf(coin1.symbol) !== -1 ||
      filteredKeys.indexOf(coin2.symbol) !== -1 ||
      filteredKeys.indexOf(coin1.name) !== -1 ||
      filteredKeys.indexOf(coin2.name) !== -1
    );
  });
};

export const getFilteredData = (
  filter: string,
  pairs: Coin[][],
  totals: { [p: string]: Totals }
) => {
  const str = filter.toUpperCase();
  const type="text"
  if (str) {
    const fl = flatten(pairs).filter((p) => p);

    const symbols = uniq(fl.map((c) => c.symbol));
    const names = uniq(fl.map((c) => c.name));

    const result = uniq([
      ...symbols.filter((s) => s?.indexOf(str) !== -1),
      ...names.filter((s) => s?.indexOf(str) !== -1),
    ]);
    return filterData(      
      result,
      (total, current) => {
        if (
          pairs.find((p) => {
            const [coin1, coin2] = p;

            return (
              coin1.symbol.indexOf(current) !== -1 ||
              coin2.symbol.indexOf(current) !== -1 ||
              coin1.name.indexOf(current) !== -1 ||
              coin2.name.indexOf(current) !== -1
            );
          })
        ) {
          total.push(current);
        }
        return total;
      },
      pairs,
      totals
    );
  } else {
    return getData({ pairs, totals });
  }
};

export const getFilteredDataByFav = (
  filter: string,
  result: string[],
  pairs: Coin[][],
  totals: { [p: string]: Totals }
) => {
  const str = filter.toUpperCase();
  const type = "fav"
  
  // const filterpair = filterpairdata(str, pairs)
  // console.log(result,"resultvalue")


  return getPairData({    
    pairs:
      pairs.filter((p: any) => {
      const [coin1, coin2] = p;      
        return result.find((r: any) => {
        console.log(r,"rvalue")
          const [val1, val2] = queryToPair(r);
          
        return (
          (coin1.symbol === val1 && coin2.symbol === val2) ||
          (coin1.symbol === val2 && coin2.symbol === val1)
        );
      });
      }),
      totals,
      str,
  });
};


export const getPairData = ({
  pairs,
  totals,
  str,
}: {
  pairs: Coin[][];
  totals: { [p: string]: Totals };
  str?: any;
}) => {
  const filterpair = str ? filterpairdata(str, pairs) : [...pairs]

  // console.log(pairs, "onlyfilterpair")

  return filterpair
    .map((combination: any) => {
      if (!combination) return undefined;
      const [coin1, coin2] = combination;
      return {
        coin1: coin1.symbol,
        coin2: coin2.symbol,
      };
    })
    .filter((p: any) => p && p?.coin1 && p?.coin2)
    .sort(
      (a: any, b: any) =>
        getVotes(symbolCombination([b?.coin1 + "", b?.coin2 + ""]), totals) -
        getVotes(symbolCombination([a?.coin1 + "", a?.coin2 + ""]), totals)
    ) as PairsRow[];
};

export const filterpairdata = (
  str:string,
  pairs: any,
) => {
  let filterValue:any = []
  pairs.map((item:any,index:any) => {
    if (item[0]?.symbol.includes(str) || item[1]?.symbol.includes(str)) {
      filterValue.push(item)
    }
  })  
  return filterValue
}


export const getNumRows = (expanded?: boolean, num: number = 0) => {
  return expanded ? num : 3;
};

export const getNumCards = (
  width: number | undefined,
  expanded: boolean = false
) => {
  const defaultNum = expanded ? 2 : 3;
  if (!width) {
    return defaultNum;
  }
  if (width > 979) {
    return 6;
  }
  return defaultNum;
};

export const getNumCardsPairs = (
  width: number | undefined,
  expanded: boolean = false
) => {
  const defaultNum = expanded ? 1 : 3;
  if (!width) {
    return defaultNum;
  }
  if (width > 767 && width < 979) {
    return expanded ? 2 : 3;
  }

  if (width >= 979) {
    return expanded ? 3 : 3;
  }
  return defaultNum;
};

export const getOffset = (
  width: number | undefined,
  expanded: boolean = false
) => {
  const defaultNum = expanded ? 0 : 20;
  if (!width) {
    return defaultNum;
  }
  if (width > 979) {
    return 0;
  }
  return defaultNum;
};

export const getPairs = (
  allPairs: string[][],
  coins: { [symbol: string]: Coin },
  chosen?: string[][]
) => {
  return (chosen || allPairs)
    .map((p) => p.map((c) => coins[c]))
    .filter((p) => p.every((c) => c));
};
