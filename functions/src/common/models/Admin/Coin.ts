import { firestore } from "firebase-admin";
import { v4 as uuidv4 } from "uuid";

import { getAllCoins as getAllCoin } from "../Coin";
import {
  getDataFromTimestampBaseURL,
  defaultHeaderForgetDataFromTimestamp,
} from "../../consts/config";
import axios from "axios";
// import { sendNotification } from "../Notification";

type Coin = {
  coinId: any;
  coinName: string;
  symbol: any;
  coinLogo: any;
  status: string;
};

export const addCoin = async (req: any, res: any) => {
  const { coinName, symbol, coinLogo, status } = req.body;
  try {
    const id = uuidv4();
    const coin: Coin = { coinId: id, coinName, symbol, coinLogo, status };
    const coinRef = await firestore().collection("settings").doc("coins").get();
    let coinData: any = coinRef.data();
    let checkCoin = coinData.coins.find((coin: any) => {
      return coin.coinName == coinName;
    });
    if (checkCoin) {
      return res.status(409).send({
        status: false,
        message: "Already exist.",
        result: null,
      });
    }

    coinData?.coins.push(coin);

    await firestore()
      .collection("settings")
      .doc("coins")
      .set(coinData, { merge: true });

    let getCoin = coinData.coins.find((coin: any) => {
      return coin.coinId == id;
    });
    res.status(200).send({
      status: true,
      message: "New Coin Added.",
      result: getCoin,
    });
  } catch (error) {
    errorLogging("addCoin", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
};

export const updateStatusOfCoin = async (req: any, res: any) => {
  const { coinId } = req.params;
  const { status } = req.body;
  try {
    const coinRef = await firestore().collection("settings").doc("coins").get();
    let coinData: any = coinRef.data();
    let getCoin = coinData.coins.find((coin: any) => {
      return coin.coinId == coinId;
    });
    if (!getCoin) {
      return res.status(404).send({
        status: false,
        message: "Coin not found",
        result: null,
      });
    }
    getCoin.status = status;

    await firestore()
      .collection("settings")
      .doc("coins")
      .set(coinData, { merge: true });

    res.status(200).send({
      status: true,
      message: "Status update.",
      result: getCoin,
    });
  } catch (error) {
    errorLogging("updateStatusOfCoin", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
};

export const getAllCoins = async (req: any, res: any) => {
  try {
    const coinRef = await firestore().collection("settings").doc("coins").get();
    let coinData: any = coinRef.data();
    res.status(200).send({
      status: true,
      message: "Status update.",
      result: coinData,
    });
  } catch (error) {
    errorLogging("updateStatusOfCoin", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
};

export const getCoinById = async (req: any, res: any) => {
  const { coinId } = req.params;
  console.log("coinId ,,,,,,,,", coinId);
  try {
    const coinRef = await firestore().collection("settings").doc("coins").get();
    let coinData: any = coinRef.data();
    let getCoin = coinData.coins.find((coin: any) => {
      return coin.coinId == coinId;
    });
    if (!getCoin) {
      return res.status(404).send({
        status: false,
        message: "Coin not found",
        result: null,
      });
    }
    res.status(200).send({
      status: true,
      message: "Status update.",
      result: getCoin,
    });
  } catch (error) {
    errorLogging("updateStatusOfCoin", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
};
const getPriceOnpaticularTime = async (coin: any, timestamp: any) => {
  try {
    const getCoinPrice = await axios.get(
      getDataFromTimestampBaseURL(coin, timestamp),
      defaultHeaderForgetDataFromTimestamp
    );

    // console.info("getCoinPrice", getCoinPrice.data);
    return getCoinPrice.data &&
      getCoinPrice.data[0] &&
      getCoinPrice.data[0].price
      ? getCoinPrice?.data[0]?.price
      : 0;
  } catch (err) {
    console.log("Error(getPriceOnpaticularTime): ", err);
    return 0;
  }
};

const getAllUsersAndSendNotification = async () => {
  const getAllUsers: any = [];
  const getAllUsersRef = await firestore().collection("users").get();
  getAllUsersRef.forEach((data) => {
    getAllUsers.push(data.data());
  });

  for (var user = 0; user <= getAllUsers.length; user++) {}
};

export const getCoinCurrentAndPastDataDiffernce = async () => {
  try {
    const getCoins = await getAllCoin();
    const currentTime = Date.now();
    const beforeFourHoursTime = currentTime - 4 * 3600000;

    const currentCoinAndPrise: any = [];

    const arr: any = [];

    for (const data of getCoins) {
      const coin = data.toLowerCase() + "usdt";
      const priseCurrent = await getPriceOnpaticularTime(coin, currentTime);
      const priseFourBefore = await getPriceOnpaticularTime(
        coin,
        beforeFourHoursTime
      );
      console.log("priseCurrent >>>", priseCurrent);
      if (priseCurrent !== 0 && priseFourBefore !== 0) {
        console.log("priseCurrent >>>>", coin, priseCurrent, priseFourBefore);
        const differncePrise = priseFourBefore - priseCurrent;
        const differnceInPercentag =
          (differncePrise / beforeFourHoursTime) * 100;

        currentCoinAndPrise.push({ coinName: data, differnceInPercentag });
      }
    }

    currentCoinAndPrise.forEach((coin: any) => {
      if (coin.differnceInPercentag < -5) {
        // Write Notification
        getAllUsersAndSendNotification();
        arr.push(`${coin.coinName} Gone Down`);
      }
      if (coin.differnceInPercentag > 5) {
        // Write Notification
        arr.push(`${coin.coinName} Gone Up`);
      }
    });
    console.log("currentCoinAndPrise >>>", currentCoinAndPrise);
  } catch (err) {
    console.log("Error (getCoinCurrentAndPastDataDiffernce): ", err);
  }
};

export const errorLogging = async (
  funcName: string,
  type: string,
  error: any
) => {
  console.info(funcName, type, error);
};
