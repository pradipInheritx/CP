import { firestore } from "firebase-admin";
import _ from "lodash";

type CoinPair = {
  id: number,
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
      message: "Get all pair coin successfully",
      result: getCoinPairData,
    });
  } catch (error) {
    errorLogging("getAllCardsPairs", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in getAllCardsPairs",
      result: error,
    });
  }
};

export function paginate(array: any, page_size: number, page_number: number) {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

export const pairListingFunction = async (req: any, res: any) => {
  try {
    let array: any = [];
    const getCoinPairRef = await firestore()
      .collection("settings")
      .doc("pairs")
      .get();

    const getAllPairCoin: any = getCoinPairRef.data();

    res.status(200).send({
      status: true,
      message: "Get all pair coins successfully.",
      result: getAllPairCoin,
    });
    return array;
  } catch (error) {
    errorLogging("pairListingFunction", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in pairListingFunction",
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
      message: "Status update for pair coin",
      result: getCoin,
    });
  } catch (error) {
    errorLogging("updateStatusOfCoinPair", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in updateStatusOfCoin",
      result: error,
    });
  }
};

export const updateRankWeightCMPAndPerCMPOfCoinPair = async (req: any, res: any) => {
  const { id } = req.params;
  const { rank, CMP, weightOfOrderBook, percentageRangeInCMP } = req.body;
  try {
    const coinRef = await firestore().collection("settings").doc("pairs").get();
    let coinPairData: any = coinRef.data();
    let getCoinPair = coinPairData.coins.find((coin: any) => {
      return coin.id == id;
    });
    if (!getCoinPair) {
      return res.status(404).send({
        status: false,
        message: `Coin pair not found: ${id}`,
        result: null,
      });
    }
    getCoinPair = { ...getCoinPair, rank, CMP, weightOfOrderBook, percentageRangeInCMP };
    console.info("getCoinPair", getCoinPair)

    await firestore()
      .collection("settings")
      .doc("pairs")
      .set(getCoinPair, { merge: true });

    res.status(200).send({
      status: true,
      message: "Coin pair update successfully",
      result: getCoinPair,
    });
  } catch (error) {
    errorLogging("updateRankWeightCMPAndPerCMPOfCoinPair", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in updateRankWeightCMPAndPerCMPOfCoinPair",
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

