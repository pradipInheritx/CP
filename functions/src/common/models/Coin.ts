// import { ICryptoSnapshotTickers } from "@polygon.io/client-js";
import coinList from "../consts/coins.json";
import { firestore } from "firebase-admin";
// import { rest } from "./Ajax";
import { CPVIObj, cpviTaskCoin, cpviTaskPair } from "./CPVI";
import moment from "moment";
import {
  successMessage,
  webSocketBaseURL,
  allTradeCoinsRate,
} from "../consts/config";
import allCoinsDecimalFixedVaues from "../consts/coins.constant.json";
import { WebSocket } from "ws";
import wazirXCoinsFromJson from "../consts/wazirXCoins.json";

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

export const fetchCoinsFromCoinCapAndWazirX = async (
  getUpdatedCoinsRate: any
) => {
  try {
    if (getUpdatedCoinsRate && getUpdatedCoinsRate.length) {
      const mergedMappedCoins = [...getUpdatedCoinsRate].map(
        (getCoins: any, index: number) => ({
          id: index + 1,
          ...getCoins,
        })
      );
      return {
        count: mergedMappedCoins.length,
        status: successMessage,
        tickers: mergedMappedCoins,
      };
    } else {
      console.info("getUpdatedCoinsRate", getUpdatedCoinsRate);
      return false;
    }
  } catch (error) {
    errorLogging("fetchCoinsFromCoinCapAndWazirX", "ERROR", error);
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
      timestamp.id > startTime && timestamp.id < endTime ?
        timestamp.id :
        undefined
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
        errorLogging(
          "removeTheBefore24HoursData",
          "WARNING",
          "No documents left"
        );
      }
      const batch = await firestore().batch();
      snapshot.docs.forEach(async (doc) => {
        await batch.delete(doc.ref);
      });
      await batch.commit();
    }
  } catch (error) {
    errorLogging("removeTheBefore24HoursData", "ERROR", error);
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
          allCoinsDecimalFixedVauesFromJson[coin].fixedValue ?
          Number(getAllCoins[coin].price).toFixed(
            allCoinsDecimalFixedVauesFromJson[coin].fixedValue
          ) :
          Number(getAllCoins[coin].price).toFixed(2);
    }
  }
  return getAllCoins;
};

export const getUpdatedDataFromWebsocket = () => {
  const client = new WebSocket(webSocketBaseURL);
  client.onerror = async function () {
    await getUpdatedDataFromWebsocket();
    errorLogging("getUpdatedDataFromWebsocket", "ERROR", "Connection Error");
  };
  client.onopen = function () {
    errorLogging(
      "getUpdatedDataFromWebsocket",
      "INFO ON OPEN",
      "WebSocket Client Connected"
    );
    client.send(JSON.stringify({
      method: 'SUBSCRIBE',
      params: allTradeCoinsRate,
      id: 1
    }));
    // client.send(
    //   JSON.stringify({
    //     event: "subscribe",
    //     streams: allTradeCoinsRate,
    //   })
    // ); //This is for wazirX
  };
  client.onclose = async function () {
    await getUpdatedDataFromWebsocket();
    errorLogging(
      "getUpdatedDataFromWebsocket",
      "INFO ON CLOSE",
      "Echo Protocol Client Closed"
    );
  };
  client.onmessage = async function (e: any) {
    console.log("e.data =>", e.data);
    if (typeof e.data === "string") {
      const parseCoinsRateData: any = JSON.parse(e.data);
      console.info("parseCoinsRateData", parseCoinsRateData)
      const isResultFound = 'result' in parseCoinsRateData;
      if (parseCoinsRateData && !isResultFound) {
        await updateLatestCoinRate(parseCoinsRateData);
        await fetchCoins();
      }
    } else {
      errorLogging(
        "getUpdatedDataFromWebsocket",
        "ERROR",
        "Something went wrong while fetching the updated data"
      );
    }
  };
};

export const updateLatestCoinRate = async (latestCoinRate: any) => {
  errorLogging(
    "updateLatestCoinRate",
    "INFO ON UPDATE LATEST COIN RATE",
    "Comes in updateLatestCoinRate"
  );

  if (latestCoinRate) {
    const getCoinSymbolData: any = wazirXCoinsFromJson.find(
      (coin) => coin.name === latestCoinRate.s.toLowerCase()
    );
    if (getCoinSymbolData) {
      // @Delete all previous data of coin which needs to be add
      const deleteAllPreviousDataOfCoin = await firestore()
        .collection("latestUpdatedCoins")
        .where("name", "==", latestCoinRate.s.toLowerCase());
      await deleteAllPreviousDataOfCoin.get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          doc.ref.delete();
        });
      });
      console.info("getCoinSymbolData", getCoinSymbolData)
      await firestore()
        .collection("latestUpdatedCoins")
        .add({
          ...getCoinSymbolData,
          price: latestCoinRate.c,
          timestamp: latestCoinRate.E,
        });
    }
  } else {
    errorLogging(
      "updateLatestCoinRate",
      "INFO ON UPDATE LATEST COIN RATE",
      "Comes in ELSE part"
    );
  }
};

export const fetchCoins = async () => {
  const allUpdatedCoinsRates: any = [];
  const getAllLatestCoinsRateRef: any = await firestore().collection(
    "latestUpdatedCoins"
  );
  const coinRateSnapshot = await getAllLatestCoinsRateRef
    .orderBy("timestamp", "desc")
    .get();
  if (coinRateSnapshot.empty) {
    errorLogging("fetchCoins", "INFO ON FETCH COINS", "No matching documents.");
  } else {
    coinRateSnapshot.forEach((doc: any) => {
      allUpdatedCoinsRates.push(doc.data());
    });
    const res: any = await fetchCoinsFromCoinCapAndWazirX(allUpdatedCoinsRates);
    if (res && res.count) {
      const newCoins = calculateCoinsByWazirXAndCoinCap(res);
      if (newCoins) {
        const allCoins = await getAllCoins();
        const getUpdateFixedValueInAllCoins = await updateFixedValueInAllCoins(
          filterCoins(newCoins, allCoins)
        );

        await firestore()
          .collection("stats")
          .doc("coins")
          .set(getUpdateFixedValueInAllCoins, {
            merge: true,
          });

        await firestore()
          .collection("latestUpdatedCoins")
          .get()
          .then((queryLatestUpdatedCoinsSnapshot) => {
            queryLatestUpdatedCoinsSnapshot.docs.forEach((snapshot) => {
              snapshot.ref.delete();
            });
          });
        await insertNewCoinsWthTimestamp(newCoins);
      }
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
      (total: any, doc: any) => {
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

export const errorLogging = async (
  funcName: string,
  type: string,
  error: any
) => {
  console.log(funcName, type, error); // We will modify later
};
