import currency from "currency.js";
import {uniq} from "lodash";
import {SwipeEventData} from "react-swipeable";

export type Coin = {
  name: string;
  symbol: string;
  id: number;
  price: number;
  trend?: number;
  CPMRangePercentage?: number
};

export type CoinSnap = {
  timestamp: string;
  data: { [symbol: string]: Coin };
};

export const formatCurrency = (v: number, precision: number = 2) => currency(v, {precision}).format();

export type Rate = {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  num_market_pairs: number;
  date_added: string;
  tags: string[];
  max_supply: number;
  circulating_supply: number;
  total_supply: number;
  platform: {
    id: number;
    name: string;
    symbol: string;
    slug: string;
    token_address: string;
  } | null;
  cmc_rank: number;
  last_updated: string;
  quote: {
    [key: string]: {
      price: number;
      volume_24h: number;
      volume_change_24h: number;
      percent_change_1h: number;
      percent_change_24h: number;
      percent_change_7d: number;
      percent_change_30d: number;
      percent_change_60d: number;
      percent_change_90d: number;
      market_cap: number;
      market_cap_dominance: number;
      fully_diluted_market_cap: number;
      last_updated: string;
    };
  };
};

export const getCoins = () => {
  let coins: { [symbol: string]: Coin };
  try {
    coins = JSON.parse(localStorage.getItem("coins") + "");
  } catch (e) {
    coins = {};
  }
  return coins || {};
};

export const getAllCoins = () => {
  let allCoins: string[];
  try {
    allCoins = JSON.parse(localStorage.getItem("allCoins") + "");
  } catch (e) {
    allCoins = [];
  }

  return allCoins || {};
};

export const saveAllCoins = (allCoins: string[]) => {
  localStorage.setItem("allCoins", JSON.stringify(allCoins));
};

export const saveCoins = (coins: { [symbol: string]: Coin }) => {
  localStorage.setItem("coins", JSON.stringify(coins));
};

export const validateCoins = <T extends { id: string }>(c: T[]) =>
  c.length === uniq(c.map((el) => el.id)).length;
export const validateCoin = <T extends { id: string }>(c: T) =>
  !isNaN(Number(c.id)) && Object.values(c).every((el) => el);

export const transform = <T>(results: any, topics: string[]) => {
  return (results.data as any[]).reduce((total, current) => {
    if (topics.every((t) => Object.keys(current).includes(t))) {
      const enhanced = Object.keys(current).reduce((t, k) => {
        t[k.toLowerCase()] = current[k];
        return t;
      }, {} as any);
      total.push(enhanced);
    } else {
      throw new Error(`object doesn't have the required keys`);
    }
    return total;
  }, [] as T[]);
};

export type DBCoin = {
  symbol: string;
  name: string;
  id: string;
};

export type DBPair = {
  symbol1: string;
  symbol2: string;
  id: string;
};

export const filterCoins = (
  input: { [p: string]: Coin },
  allCoins: string[]
) => {
  if (!allCoins.length) {
    return input;
  }
  let cs = Object.assign({}, input);
  Object.keys(cs)
    .filter((c) => !allCoins.includes(c))
    .forEach((c) => delete cs[c]);

  return cs;
};

export const swipeOptions = ({
  index,
  setIndex,
  active,
  setActive,
  total,
}: {
  index: number;
  setIndex: (i: number) => void;
  active: number;
  setActive: (i: number) => void;
  total: number;
}) => {
  return {
    onSwiped: (eventData: SwipeEventData) => {
      let newIndex = index;
      let newActive = active;

      if (eventData.dir === "Right") {
        if (index - 1 < 0) {
          newIndex = total - 1;
        } else {
          newIndex = index - 1;
        }

        if (active === 0) {
          newActive = 2;
        } else {
          newActive = active - 1;
        }
      }

      if (eventData.dir === "Left") {
        if (index + 1 >= total) {
          newIndex = 0;
        } else {
          newIndex = index + 1;
        }

        if (active === 2) {
          newActive = 0;
        } else {
          newActive = active + 1;
        }
      }

      setIndex(newIndex);
      setActive(newActive);
    },
    trackMouse: true,
    trackTouch: true,
  };
};

export const precision: { [key: string]: number } = {
  BTC: 2,
  ETH: 2,
  BNB: 2,
  ADA: 6,
  SOL: 2,
  XRP: 4,
  LUNA: 7,
  DOGE: 5,
  DOT: 3,
  AVAX: 2,
  SHIB: 7,
  MATIC: 4,
  ATOM: 2,
  CRO: 4,
  LTC: 2,
  LINK: 2,
  NEAR: 2,
  UNI: 2,
  FTM: 3,
  ALGO: 4,
  TRX: 5,
  BCH: 2,
  FTT: 2,
  XLM: 4,
  MANA: 2,
  HBAR: 4,
  VET: 5,
  LEO: 2,
  ETC: 2,
  KLAY: 4,
  AXS: 2,
  EGLD: 2,
  FIL: 2,
  SAND: 2,
  XMR: 2,
  THETA: 2,
  HNT: 2,
  XTZ: 2,
  MIOTA: 4,
  ONE: 5,
  EOS: 2,
  AAVE: 2,
  CAKE: 3,
  GRT: 4,
  BSV: 2,
  STX: 4,
};
