import { firestore } from "firebase-admin";
import _ from "lodash";

type CoinPair = {
  id: string,
  symbol1: string,
  symbol2: string,
  status: string,
  logo: string
};

export type queryParams = {
  pageNumber: number;
  limit: number;
  sortBy: string;
  search: string;
};

export const addCoinPair = async (req: any, res: any) => {
  const {
    id,
    symbol1,
    symbol2,
    status,
    logo
  } = req.body;
  try {
    const coinPair: CoinPair = {
      id,
      symbol1,
      symbol2,
      status,
      logo
    };
    if (!coinPair) {
      return res.status(400).send({
        status: false,
        message: "Please enter all valid data for new pair",
        result: null,
      });
    }

    const coinPairRef = await firestore()
      .collection("settings")
      .doc("pairs")
      .get();

    let coinPairData: any = coinPairRef.data();
    let checkCoinPairIsExists = coinPairData.pairs.find((coin: any) => {
      return coin.id == id;
    });

    if (checkCoinPairIsExists) {
      return res.status(409).send({
        status: false,
        message: `This pair is already exists: ${symbol1}-${symbol2}`,
        result: null,
      });
    }

    coinPairData.pairs.push(coinPair);

    await firestore()
      .collection("settings")
      .doc("pairs")
      .set(coinPairData, { merge: true });

    let getCoinPair = coinPairData.pairs.find((coin: any) => {
      return coin.id == id;
    });

    res.status(200).send({
      status: true,
      message: "New coin pair added successfully",
      result: getCoinPair,
    });
  } catch (error) {
    errorLogging("addCoinPair", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in addCoinPair",
      result: error,
    });
  }
};

export const getAllPairs = async (req: any, res: any) => {
  try {
    const getCoinPairRef = await firestore()
      .collection("settings")
      .doc("pairs")
      .get();
    const getCoinPairData: any = getCoinPairRef.data();

    res.status(200).send({
      status: true,
      message: "Get all coin pair successfully",
      result: getCoinPairData,
    });
  } catch (error) {
    errorLogging("getAllPairs", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in getAllPairs",
      result: error,
    });
  }
};

export const getPairById = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const getPairsQuery = await firestore().collection("settings").doc("pairs").get();
    let getPairsData: any = getPairsQuery.data();
    let getPairs = getPairsData.pairs.find((coin: any) => {
      return coin.id == id;
    });
    if (!getPairs) {
      return res.status(404).send({
        status: false,
        message: `Coin not found: ${id}`,
        result: null,
      });
    }
    res.status(200).send({
      status: true,
      message: "Get coin pair successfully",
      result: getPairs,
    });

  } catch (error) {
    errorLogging("getPairById", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in getPairById",
      result: error,
    });
  }
}
export const updateVoteBarRangeOfCoinPair = async (req: any, res: any) => {
  const { id } = req.params;
  const { voteBarRange } = req.body;
  try {
    const coinpairRef = await firestore().collection("settings").doc("pairs").get();
    let coinPairData: any = coinpairRef.data();
    const getAllCoinpairsList: any = [];
    coinPairData.pairs.forEach((coin: any) => {
      getAllCoinpairsList.push(coin)
    });

    let checkPair = getAllCoinpairsList.find((pair: any) => {
      return pair.id == id;
    });
    if (!checkPair) {
      return res.status(404).send({
        status: false,
        message: `${id} is not found`,
        result: null,
      });
    }
    let getCoinspairs = getAllCoinpairsList.map((pairs: any) => {
      return pairs.id == id ? { ...pairs, voteBarRange } : pairs;
    });

    await firestore()
      .collection("settings")
      .doc("pairs")
      .set({ pairs: getCoinspairs }, { merge: true });

    const getPair = getCoinspairs.find((coin: any) => coin.id === id)
    res.status(200).send({
      status: true,
      message: "Pair voteBarRange is successfully update",
      result: getPair,
    });
  } catch (error) {
    errorLogging("updateVoteBarRangeOfCoinPair", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in updateVoteBarRangeOfCoinPair",
      result: error,
    });
  }
};

export const updateStatusOfCoinPair = async (req: any, res: any) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const coinRef = await firestore().collection("settings").doc("pairs").get();
    let coinData: any = coinRef.data();
    let getCoin = coinData.pairs.find((coinPair: any) => {
      return coinPair.id == id;
    });
    if (!getCoin) {
      return res.status(404).send({
        status: false,
        message: "Pair coin not found",
        result: null,
      });
    }
    getCoin.status = status;

    await firestore()
      .collection("settings")
      .doc("pairs")
      .set(coinData, { merge: true });

    res.status(200).send({
      status: true,
      message: "Pair status update successfully",
      result: getCoin,
    });
  } catch (error) {
    errorLogging("updateStatusOfCoinPair", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in updateStatusOfCoinPair",
      result: error,
    });
  }
};

export const updateCoinPair = async (req: any, res: any) => {
  const { id } = req.params;
  const { symbol1, symbol2, status } = req.body;
  try {
    const updatePairData = {
      id,
      symbol1,
      symbol2,
      status
    }
    const getAllDataQuery = await firestore()
      .collection("settings")
      .doc("pairs")
      .get();

    const getAllPairData: any = getAllDataQuery.data();
    const checkPair = getAllPairData.pairs.find((pair: any) => {
      return pair.id == id
    })
    if (!checkPair) return res.status(404).send({
      status: true,
      message: "Pair not found : " + id,
      result: null,
    });
    await firestore()
      .collection("settings")
      .doc("pairs")
      .update("pairs", firestore.FieldValue.arrayRemove(updatePairData));
    await firestore()
      .collection("settings")
      .doc("pairs")
      .update("pairs", firestore.FieldValue.arrayUnion(updatePairData));

    res.status(200).send({
      status: true,
      message: "Pair update successfully",
      result: checkPair,
    });
  } catch (error) {
    errorLogging("updateCoinPair", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in updateCoinPair",
      result: error,
    });
  }
};

export const errorLogging = async (
  funcName: string,
  type: string,
  error: any
) => {
  console.info(funcName, type, error);
};

