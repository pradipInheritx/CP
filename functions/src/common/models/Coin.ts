import { ICryptoSnapshotTickers } from "@polygon.io/client-js";
import coinList from "../consts/coins.json";
import { firestore } from "firebase-admin";
// import { rest } from "./Ajax";
import { CPVIObj, cpviTaskCoin, cpviTaskPair } from "./CPVI";
import moment from "moment";
import axios from "axios";
// import {voteConverter} from "../../common/models/Vote";
// import {Totals} from "../../common/models/Calculation";

export type Coin = {
  name: string;
  symbol: string;
  id: number;
  price: number;
  trend?: number;
};

export type CoinSnap = {
  timestamp: string;
  data: { [symbol: string]: Coin };
};

export type Leader = {
  displayName?: string;
  email: string;
  userId: string;
  avatar?: string;
  score: number;
  subscribers?: number;
};

export const filterCoins: (
  input: { [p: string]: Coin },
  allCoins: string[]
) => { [p: string]: Coin } = (
  input: { [p: string]: Coin },
  allCoins: string[]
) => {
  if (!allCoins.length) {
    return input;
  }
  const cs = Object.assign({}, input);
  Object.keys(cs)
    .filter((c) => !allCoins.includes(c))
    .forEach((c) => delete cs[c]);

  return cs;
};

export const calculateCoinsByTicker: (
  res: ICryptoSnapshotTickers
) => { [p: string]: Coin } | undefined = (res: ICryptoSnapshotTickers) => {
  return res.tickers
    ?.map((t) => {
      if (t.ticker?.slice(-3) === "USD") {
        return {
          symbol: t.ticker?.substr(2).slice(0, -3) || "",
          price: t.lastTrade?.p || 0,
          trend: Number(
            Number(
              ((t.lastTrade?.p || 0) / (t.prevDay?.c || 1) - 1) * 100
            ).toFixed(3)
          ),
        };
      }
      return undefined;
    })
    .filter((t) => t)
    .reduce((total, current) => {
      if (current) {
        const { symbol, price, trend } = current;
        const data = (
          coinList as unknown as {
            [key: string]: {
              id: number;
              name: string;
              symbol: string;
            };
          }
        )[symbol];
        const { id, name } = data || {};
        if (id) {
          total[symbol] = { price, symbol, id, name, trend };
        }
      }
      return total;
    }, {} as { [key: string]: Coin });
};

export const getAllCoins: () => Promise<string[]> = async () => {
  const docs = await firestore().collection("settings").doc("coins").get();
  return (
    docs.data() as {
      coins: { symbol: string }[];
    }
  ).coins.map((c) => c.symbol);
};

export const getAllPairs: () => Promise<string[]> = async () => {
  const docs = await firestore().collection("settings").doc("pairs").get();
  return (
    docs.data() as {
      pairs: { symbol1: string; symbol2: string }[];
    }
  ).pairs.map((c) => {
    return `${c.symbol1}-${c.symbol2}`;
  });
};

export const fetchCoinsFromCoinCapAndWazirX = async () => {
  try {
    const getAllCoinFromCoinCap = await axios.get(
      "https://api.coincap.io/v2/rates",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    console.log("getAllCoinFromCoinCap", getAllCoinFromCoinCap);

    const getAllCoinFromWazirX = await axios.get(
      "https://api.wazirx.com/sapi/v1/tickers/24hr",
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    console.log("getAllCoinFromWazirX", getAllCoinFromWazirX);
  } catch (error) {
    console.log("error", error);
  }
};

export const fetchCoins = async () => {
  // const res = await rest.snapshotAllTickers();
  const res = { count: 0, status: "true", tickers: [] };
  const newCoins = calculateCoinsByTicker(res);
  if (newCoins) {
    const allCoins = await getAllCoins();
    await firestore()
      .collection("stats")
      .doc("coins")
      .set(filterCoins(newCoins, allCoins), { merge: true });
  }
};

export const sequence_operate = (
  arr: (() => void)[],
  index: number,
  interval: number | undefined
) => {
  setTimeout(function () {
    try {
      arr[index] && arr[index]();
    } catch (e) {
      console.log(e, arr[index], index);
    }
    if (index < arr.length) sequence_operate(arr, index + 1, interval);
  }, interval);
};

async function saveCPVI(value: CPVIObj) {
  const { timestamp, coin } = value;
  console.log("coin --->", coin);
  console.log("value --->", value);
  value.direction0 = Math.trunc(value.direction0);
  value.direction1 = Math.trunc(value.direction1);
  await firestore()
    .collection("askBidStats")
    .doc("results")
    .collection(coin)
    .doc(timestamp.toMillis() + "")
    .set(value, { merge: true });
}

export const fetchAskBidCoin = async () => {
  await cpviTaskCoin(async (result) => {
    // for (const value of Object.values(result)) {
    //   const { timestamp, coin } = value;
    //   console.log("coin --->", coin);
    //   console.log("value --->", value);
    //   value.direction0 = Math.trunc(value.direction0)
    //   value.direction1 = Math.trunc(value.direction1)
    //   await firestore()
    //     .collection("askBidStats")
    //     .doc("results")
    //     .collection(coin)
    //     .doc(timestamp.toMillis() + "")
    //     .set(value, { merge: true });
    // }
    await Promise.all([Object.values(result).map((e) => saveCPVI(e))]);
  });
  return true;
};

export const fetchAskBidPair = async () => {
  await cpviTaskPair(async (result) => {
    for (const value of Object.values(result)) {
      const { timestamp, coin, direction0, direction1 } = value;
      if (direction0 > 0 || direction1 > 0) {
        await firestore()
          .collection("askBidStats")
          .doc("results")
          .collection(coin)
          .doc(timestamp.toMillis() + "")
          .set(value, { merge: true });
      }
    }
  });
};

export const prepareCPVI = async (hours: number, table: string) => {
  const collections = await firestore()
    .collection("askBidStats")
    .doc("results")
    .listCollections();

  const start = moment().toDate();
  const end = moment().subtract(hours, "hour").toDate();

  // collections.map(async (collection) => {
  for (let i = 0; i < collections.length; i++) {
    const collection = collections[i];

    console.log("collection --->", collection.id);
    const data = await firestore()
      .collection("askBidStats")
      .doc("results")
      .collection(collection.id)
      .where("timestamp", "<", firestore.Timestamp.fromDate(start))
      .where("timestamp", ">", firestore.Timestamp.fromDate(end))
      .get();

    if (!data.docs.length) {
      continue;
    }
    const { direction0, direction1 } = data.docs.reduce(
      (total, doc) => {
        const { direction0, direction1 } = doc.data() as CPVIObj;
        return {
          direction0: total.direction0 + direction0,
          direction1: total.direction1 + direction1,
        };
      },
      {
        direction0: 0,
        direction1: 0,
      }
    );
    console.log("direction0 --->", direction0);
    console.log("direction1 --->", direction1);
    if (direction0 > 0 || direction1 > 0) {
      await firestore()
        .collection("askBidStats")
        .doc(table)
        .collection(collection.id)
        .doc(firestore.Timestamp.now().toMillis() + "")
        .set(
          {
            direction0,
            direction1,
            coin: collection.id,
            timestamp: firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
    }
  }
  // });
};
