// import { ICryptoSnapshotTickers } from "@polygon.io/client-js";
import coinList from "../consts/coins.json";
import { firestore } from "firebase-admin";
// import { rest } from "./Ajax";
import { CPVIObj, cpviTaskCoin, cpviTaskPair } from "./CPVI";
import moment from "moment";
import axios from "axios";
import {
  wazirXAPIEndPoint,
  coinCapAPIEndPoint,
  defaultHeader,
  successMessage,
} from "../consts/config";
import allCoinsDecimalFixedVaues from "../consts/coins.constant.json";

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

export type IWazirXSnapshotTickers = {
  id?: number;
  name?: string;
  price?: string;
  symbol?: string;
};

export type IWazirXSnapshotMetaData = {
  count?: number;
  status?: string;
  tickers?: IWazirXSnapshotTickers[];
};

export type CoinsWithKey = {
  [key: string]: {
    id: number;
    price: any;
    symbol: string;
    name: string;
  };
};

export type CoinsWithFixedDecimalValue = {
  [key: string]: {
    fixedValue: number;
  };
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

export const calculateCoinsByWazirXAndCoinCap = (
  getCoins: IWazirXSnapshotMetaData
) => {
  return getCoins.tickers
    ?.map((t: IWazirXSnapshotTickers) => {
      return {
        id: t.id,
        name: t.name,
        symbol: t.symbol,
        price: t.price,
      };
    })
    .filter((t: IWazirXSnapshotTickers) => t)
    .reduce((total: any, current: any) => {
      if (current) {
        const { symbol, price } = current;
        const data = (
          coinList as unknown as {
            [key: string]: {
              id: number;
              name: string;
              symbol: string;
              price: string;
            };
          }
        )[symbol];
        const { id, name } = data || {};
        if (id) {
          total[symbol] = { id, price, symbol, name };
        }
      }
      return total;
    }, {} as { [key: string]: IWazirXSnapshotTickers });
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
    let getMappedCoinCapCoins: any;
    let getMappedWazirXCoins: any;
    const getAllCoinFromCoinCap = await axios.get(
      coinCapAPIEndPoint,
      defaultHeader
    );
    if (
      getAllCoinFromCoinCap &&
      getAllCoinFromCoinCap.data.data &&
      getAllCoinFromCoinCap.data.data.length
    ) {
      getMappedCoinCapCoins = await getAllCoinFromCoinCap.data.data.map(
        (getCoins: any, index: number) => ({
          name: getCoins.id.toUpperCase(),
          symbol: getCoins.symbol.toUpperCase(),
          price: getCoins.rateUsd,
        })
      );
    }
    const getAllCoinFromWazirX = await axios.get(
      wazirXAPIEndPoint,
      defaultHeader
    );
    if (
      getAllCoinFromWazirX &&
      getAllCoinFromWazirX.data &&
      getAllCoinFromWazirX.data.length
    ) {
      getMappedWazirXCoins = await getAllCoinFromWazirX.data.map(
        (getCoins: any, index: number) => ({
          name: getCoins.symbol.toUpperCase(),
          symbol: getCoins.baseAsset.toUpperCase(),
          price: getCoins.lastPrice,
        })
      );
    }
    const mergedMappedCoins = [
      ...getMappedWazirXCoins,
      ...getMappedCoinCapCoins,
    ].map((getCoins: any, index: number) => ({
      id: index + 1,
      ...getCoins,
    }));
    return {
      count: mergedMappedCoins.length,
      status: successMessage,
      tickers: mergedMappedCoins,
    };
  } catch (error) {
    Logging("fetchCoinsFromCoinCapAndWazirX", "ERROR", error);
    return {
      count: 0,
      status: "Something went wrong in fetchCoinsFromCoinCapAndWazirX function",
      tickers: [],
    };
  }
};

export const insertNewCoinsWthTimestamp = async (newCoins: CoinsWithKey) => {
  const getCurrentTimestamp = firestore.Timestamp.fromDate(
    moment().add(5, "hour").add(30, "minutes").toDate()
  )
    .toMillis()
    .toString();
  await firestore()
    .collection("stats")
    .doc("last24HoursPrice")
    .collection(getCurrentTimestamp)
    .doc("allCoins")
    .create(newCoins);
};

export const getAllUpdated24HourRecords = async () => {
  const getAllTimestampFromLast24Hour = await firestore()
    .collection("stats")
    .doc("last24HoursPrice")
    .listCollections();

  const startTime = firestore.Timestamp.fromDate(
    moment().subtract(24, "hour").add(5, "hours").add(30, "minutes").toDate()
  )
    .toMillis()
    .toString();
  const endTime = firestore.Timestamp.fromDate(
    moment().add(5, "hour").add(30, "minutes").toDate()
  )
    .toMillis()
    .toString();

  const getAllStoredTimestampIds = getAllTimestampFromLast24Hour
    .map((timestamp) =>
      timestamp.id > startTime && timestamp.id < endTime
        ? timestamp.id
        : undefined
    )
    .filter((timestamp) => timestamp !== "undefined")
    .sort();

  if (getAllStoredTimestampIds && getAllStoredTimestampIds.length) {
    const getTimeStampDcument: string =
      getAllStoredTimestampIds[0] || "undefined";
    const getTimestampDocuments = await firestore()
      .collection("stats")
      .doc("last24HoursPrice")
      .collection(getTimeStampDcument)
      .get();

    let getLast24HourOldCoinsData = {};

    getTimestampDocuments.docs.forEach((getAllCoins) => {
      getLast24HourOldCoinsData = getAllCoins.data();
    });
    await updateTrendInAllCoins(getLast24HourOldCoinsData);
  }
};

export const removeTheBefore24HoursData = async () => {
  try {
    const timestamp24hrsBefore = firestore.Timestamp.fromDate(
      moment().subtract(24, "hour").add(5, "hours").add(30, "minutes").toDate()
    )
      .toMillis()
      .toString();

    const getAllPrevious24HoursCollection = await firestore()
      .collection("stats")
      .doc("last24HoursPrice")
      .listCollections();

    const getAllStoredTimestampIds = getAllPrevious24HoursCollection.map(
      (timestamp) =>
        timestamp.id < timestamp24hrsBefore ? timestamp.id : "null"
    );

    console.log("getAllStoredTimestampIds", getAllStoredTimestampIds);

    for (
      let storedCoin = 0;
      storedCoin < getAllStoredTimestampIds.length;
      storedCoin++
    ) {
      const collectionRef = await firestore().collection(
        `/stats/last24HoursPrice/${getAllStoredTimestampIds[storedCoin]}`
      );

      const query = collectionRef;
      const snapshot = await query.get();
      const batchSize = snapshot.size;

      if (batchSize === 0) {
        Logging("removeTheBefore24HoursData", "WARNING", "No documents left");
      }

      const batch = await firestore().batch();

      snapshot.docs.forEach(async (doc) => {
        await batch.delete(doc.ref);
      });
      await batch.commit();
    }
  } catch (error) {
    Logging("removeTheBefore24HoursData", "ERROR", error);
  }
};

export const updateTrendInAllCoins = async (allOldCoinsValue: CoinsWithKey) => {
  const getAllDataCoins = await firestore()
    .collection("stats")
    .doc("coins")
    .get();
  const getAllCoinsData = getAllDataCoins.data();
  for (const coin in getAllCoinsData) {
    if (coin in getAllCoinsData) {
      if (allOldCoinsValue[coin] && getAllCoinsData[coin]) {
        const trend = Number(
          Number(
            ((allOldCoinsValue[coin].price || 0) /
              (getAllCoinsData[coin].price || 1) -
              1) *
              100
          ).toFixed(3)
        );
        getAllCoinsData[coin].trend = trend;
        const allCoins = await getAllCoins();
        await firestore()
          .collection("stats")
          .doc("coins")
          .set(filterCoins(getAllCoinsData, allCoins), { merge: true });
      }
    }
  }
};

export const updateFixedValueInAllCoins = async (getAllCoins: CoinsWithKey) => {
  const allCoinsDecimalFixedVauesFromJson: CoinsWithFixedDecimalValue =
    allCoinsDecimalFixedVaues;

  for (const coin in getAllCoins) {
    if (coin in getAllCoins) {
      getAllCoins[coin].price =
        allCoinsDecimalFixedVauesFromJson[coin] &&
        allCoinsDecimalFixedVauesFromJson[coin].fixedValue
          ? Number(getAllCoins[coin].price).toFixed(
              allCoinsDecimalFixedVauesFromJson[coin].fixedValue
            )
          : Number(getAllCoins[coin].price).toFixed(2);
    }
  }
  return getAllCoins;
};

export const fetchCoins = async () => {
  const res: any = await fetchCoinsFromCoinCapAndWazirX();
  if (res && res.count) {
    const newCoins = calculateCoinsByWazirXAndCoinCap(res);
    if (newCoins) {
      const allCoins = await getAllCoins();
      await insertNewCoinsWthTimestamp(newCoins);
      await getAllUpdated24HourRecords();
      await removeTheBefore24HoursData();
      const getUpdateFixedValueInAllCoins = await updateFixedValueInAllCoins(
        filterCoins(newCoins, allCoins)
      );
      await firestore()
        .collection("stats")
        .doc("coins")
        .set(getUpdateFixedValueInAllCoins, {
          merge: true,
        });
    }
  }
};

export const updatePriceArray = async (before: any, after: any) => {
  const timeFrameToAPICallInSecond = 30;
  const timesOfAPICallIn24Hours = (60 / timeFrameToAPICallInSecond) * 60 * 24;
  for (const key in before) {
    if (key in before) {
      // your code here
      const newPriceArray = before[key]?.last24HoursPrice || [];
      newPriceArray.unshift(after[key].price);
      if (newPriceArray.length > timesOfAPICallIn24Hours) {
        newPriceArray.pop();
      }

      after[key].last24HoursPrice = newPriceArray;
      const trend = Number(
        Number(
          ((after[key].price || 0) /
            (newPriceArray[newPriceArray.length - 1] || 1) -
            1) *
            100
        ).toFixed(3)
      );
      after[key].trend = trend;
    }
  }

  await firestore()
    .collection("stats")
    .doc("coins")
    .set(after, { merge: true });
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

export const Logging = async (funcName: string, type: string, error: any) => {
  console.log(funcName, type, error); // We will modify later
};
