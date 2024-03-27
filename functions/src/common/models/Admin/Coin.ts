import { firestore } from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import { getAllCoins as getAllCoin } from "../Coin";
import axios from "axios";
import env from "../../../env/env.json";

// import { getPriceOnParticularTime } from "../Rate";

import {
  getDataFromTimestampBaseURL,
  defaultHeaderForgetDataFromTimestamp,
} from "../../consts/config";
import { sendNotification } from "../Notification";
import { messaging } from "firebase-admin";
import { errorLogging } from "../../helpers/commonFunction.helper";

type Coin = {
  id: any;
  coinName: string;
  symbol: any;
  coinLogo: any;
  status: string;
  voteBarRange: any;
};

export const addCoin = async (req: any, res: any) => {
  const { coinName, symbol, coinLogo, voteBarRange, status } = req.body;
  try {
    const id = uuidv4();
    const coin: Coin = { id, coinName, symbol, coinLogo, voteBarRange, status };
    const coinRef = await firestore().collection("settings").doc("coins").get();
    let coinData: any = coinRef.data();
    let checkCoin = coinData.coins.find((coin: any) => {
      return coin.coinName == coinName;
    });
    if (checkCoin) {
      return res.status(409).send({
        status: false,
        message: `${coinName} coin is already exist`,
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
      message: "New coin successfully added",
      result: getCoin,
    });
  } catch (error) {
    errorLogging("addCoin", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in addCoin",
      result: error,
    });
  }
};

export const updateStatusOfCoin = async (req: any, res: any) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const coinRef = await firestore().collection("settings").doc("coins").get();
    let coinData: any = coinRef.data();
    let getCoin = coinData.coins.find((coin: any) => {
      return coin.id == id;
    });
    if (!getCoin) {
      return res.status(404).send({
        status: false,
        message: `Coin not found: ${id}`,
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
      message: "Coin status is successfully update",
      result: getCoin,
    });
  } catch (error) {
    errorLogging("updateStatusOfCoin", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in updateStatusOfCoin",
      result: error,
    });
  }
};

export const updateVoteBarRangeOfCoin = async (req: any, res: any) => {
  const { id } = req.params;
  const { voteBarRange } = req.body;
  try {
    const coinRef = await firestore().collection("settings").doc("coins").get();
    let coinData: any = coinRef.data();
    const getAllCoinList: any = [];

    coinData.coins.forEach((coin: any) => {
      getAllCoinList.push(coin);
    });

    const checkCoin = getAllCoinList.find((coin: any) => coin.id == id);
    if (!checkCoin) {
      return res.status(404).send({
        status: false,
        message: `${id} is not found`,
        result: null,
      });
    }

    let getCoins = getAllCoinList.map((coin: any) => {
      return coin.id == id ? { ...coin, voteBarRange } : coin;
    });

    await firestore()
      .collection("settings")
      .doc("coins")
      .set({ coins: getCoins }, { merge: true });

    const getCoin = getCoins.find((coin: any) => coin.id === id);

    res.status(200).send({
      status: true,
      message: "Coin voteBarRange is successfully update",
      result: getCoin,
    });
  } catch (error) {
    errorLogging("updateVoteBarRangeOfCoin", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in updateVoteBarRangeOfCoin",
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
    errorLogging("getAllCoins", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in getAllCoins",
      result: error,
    });
  }
};

export const getCoinById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    console.log("id -------", id);
    const getCoinsQuery = await firestore()
      .collection("settings")
      .doc("coins")
      .get();
    let getCoinsData: any = getCoinsQuery.data();
    let getCoin = getCoinsData.coins.find((coin: any) => {
      return coin.id == id;
    });
    if (!getCoin) {
      return res.status(404).send({
        status: false,
        message: `Coin not found: ${id}`,
        result: null,
      });
    }
    res.status(200).send({
      status: true,
      message: "Get coin successfully.",
      result: getCoin,
    });
  } catch (error) {
    errorLogging("getCoinById", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in getCoinById",
      result: error,
    });
  }
};

export const updateCoin = async (req: any, res: any) => {
  const { id } = req.params;
  const { coinName, symbol, coinLogo, voteBarRange, status } = req.body;
  try {
    const updateCoinData = {
      id,
      coinName,
      symbol,
      coinLogo,
      voteBarRange,
      status,
    };
    const getAllDataQuery = await firestore()
      .collection("settings")
      .doc("coins")
      .get();

    const getAllCoinsData: any = getAllDataQuery.data();
    const getCoin: any = getAllCoinsData.coins.find((coin: any) => {
      return coin.id == id;
    });
    if (!getCoin)
      return res.status(404).send({
        status: true,
        message: "Coin not found : " + id,
        result: null,
      });
    getCoin.coins = updateCoinData;

    await firestore()
      .collection("settings")
      .doc("coins")
      .set(getCoin, { merge: true });
    // await firestore()
    //   .collection("settings")
    //   .doc("coins")
    //   .update("coins", firestore.FieldValue.arrayUnion(updateCoinData));

    res.status(200).send({
      status: true,
      message: "Coin update successfully",
      result: getCoin,
    });
  } catch (error) {
    errorLogging("updateCoin", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in updateCoin",
      result: error,
    });
  }
};

//Notification
const getPriceOnpaticularTime = async (coin: any, timestamp: any) => {
  try {
    const getCoinPrice = await axios.get(
      getDataFromTimestampBaseURL(coin, timestamp),
      defaultHeaderForgetDataFromTimestamp
    );

    // console.info("getCoinPrice----", getCoinPrice.data[0].p);
    return getCoinPrice.data && getCoinPrice.data[0] && getCoinPrice.data[0].p
      ? getCoinPrice?.data[0]?.p
      : 0;
  } catch (err) {
    console.log("Error(getPriceOnpaticularTime): ", err);
    return 0;
  }
};

// get all users and send notification
const getAllUsersAndSendNotification = async (
  coinName: string,
  body: string
) => {
  const getAllUsers: any = [];
  const getAllUsersRef = await firestore().collection("users").get();
  getAllUsersRef.forEach((data) => {
    getAllUsers.push({ id: data.id, ...data.data() });
  });
  const title = `🚨 ${coinName} coin  price ALERT! ⚠️`;
  for (var i = 0; i <= getAllUsers.length; i++) {
    const token = getAllUsers[i].token;
    if (!token) {
      console.log("token not found.");
      continue;
    }

    const message: messaging.Message = {
      token,
      notification: {
        title,
        body,
      },
      webpush: {
        headers: {
          Urgency: "high",
        },
        fcmOptions: {
          link: `${env.BASE_SITE_URL}/coins/${coinName}`, // TODO: put link for deep linking
        },
      },
    };
    await sendNotification({
      token,
      message,
      body,
      title,
      id: getAllUsers[i].id,
    });
  }
};

// call Past data from api
const getPriceOnpaticularTimeFromPast = async (
  coinName: string,
  timestamp: number
) => {
  const getCoinPrice: any = await axios.get(
    `https://api.binance.us/api/v3/aggTrades?symbol=${coinName}&limit=1&endTime=${timestamp}`,
    defaultHeaderForgetDataFromTimestamp
  );
  return getCoinPrice?.data[0].p;
};

export const getCoinCurrentAndPastDataDifference = async (timeDifference:number) => {
  try {
    console.log(
      "----------getCoinCurrentAndPastDataDifference started-----------"
    );
    const getCoins = await getAllCoin();
    const currentTime = Date.now();
    const beforeFourHoursTime = currentTime - timeDifference * 3600000;
    // const beforeFourHoursTime = currentTime - (5 * 60 * 1000);
    const currentCoinAndPrice: any = [];
    const missingCoinInBinanceApi = [
      "LUNA",
      "FTT",
      "LTC",
      "KLAY",
      "CARL",
      "BABY",
      "STX",
      "WBTC",
      "DAI",
      "CRO",
      "HBAR",
      "LEO",
      "XMR",
      "XTZ",
      "MIOTA",
      "CAKE",
      "BTT",
      "BABYDOGE",
      "BSV",
      "EGLD",
    ];
    for (const data of getCoins) {
      //check the coins
      if (missingCoinInBinanceApi.includes(data)) {
        continue;
      }

      const coin = data.toUpperCase() + "USDT";
      const priceCurrent: number = Number(
        await getPriceOnpaticularTime(coin, currentTime)
      );
      const priceFourBefore: number = Number(
        await getPriceOnpaticularTimeFromPast(coin, beforeFourHoursTime)
      );
      console.log("Price Current: " + priceCurrent, typeof priceCurrent);
      console.log(
        "priceFourBefore: " + priceFourBefore,
        typeof priceFourBefore
      );
      if (priceCurrent != undefined && priceFourBefore != undefined) {
        priceCurrent.toFixed(3);
        priceFourBefore.toFixed(3);
        const differencePrice: number = priceFourBefore - priceCurrent;
        differencePrice.toFixed(3);
        const differnceInPercentag: number =
          (differencePrice / priceFourBefore) * 100;

        currentCoinAndPrice.push({
          coinName: data,
          differnceInPercentag: differnceInPercentag.toFixed(3),
        });
      }
    }

    currentCoinAndPrice.forEach(async (coin: any) => {
      if (coin.differnceInPercentag < -5) {
        // Write Notification
        console.log("sent notification on down");
        await getAllUsersAndSendNotification(
          coin.coinName,
          `${coin.coinName} value drop! Make your vote now! ⏬`
        );
      }
      if (coin.differnceInPercentag > 5) {
        // Write Notification
        console.log("sent notification on up");
        await getAllUsersAndSendNotification(
          coin.coinName,
          `${coin.coinName} is on fire! Make your vote now! ⏫`
        );
      }
    });
  } catch (err) {
    console.log("Error (getCoinCurrentAndPastDataDiffernce): ", err);
  }
};

export const getCoinPagination = async (req: any, res: any) => {
  try {
    const { coinName ="", pageNumber=1, pageSize=5, sorting='asc' } = req.query;
    const getAllCoinsQuery: any = (
      await await firestore().collection("settings").doc("coins").get()
    ).data();

    const getAllCoins = getAllCoinsQuery.coins;

    // searching
      const getCoin = getAllCoins.filter(
        (coin: any) => coin.name.toLowerCase().includes(coinName.toLowerCase())
      );
      console.log("getCoin : ", getCoin);

  
      if (sorting.toLowerCase() == "asc") {
        getCoin.sort((a: any, b: any) => a.id - b.id);
      } else if (sorting.toLowerCase() == "desc") {
        getCoin.sort((a: any, b: any) => b.id - a.id);
      }

      const startIndex: number = (pageNumber - 1) * pageSize;
      const endIndex: number = startIndex + parseInt(pageSize);

      console.log("startIndex, endIndex: ", startIndex, endIndex);

      const coinPagination = getCoin.slice(startIndex, endIndex);

      console.log("coinPagination : ", coinPagination);

      return res.status(200).send({
        status: true,
        message: "Get the coins successfully",
        data: coinPagination,
        total: getAllCoins.length,
      });
   
  } catch (error) {
    errorLogging("getCoinPagination", "ERROR", error);
  }
};


