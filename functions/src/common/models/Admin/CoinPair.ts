import { firestore } from "firebase-admin";
import _ from "lodash";

type CoinPair = {
  pairId: number;
  pairName: string;
  firstCoin: string;
  SecondCoin: string;
  firstSymbol: string;
  secondSymbol: string;
  logos: any;
  cmp: number;
  rank: number;
  weightOrderBook: number;
  rangeResultInCmp: number;
  status: string;
};
export type queryParams = {
  pageNumber: number;
  limit: number;
  sortBy: string;
  search: string;
};

export const addCoinPair = async (req: any, res: any) => {
  const {
    pairId,
    firstCoin,
    SecondCoin,
    firstSymbol,
    secondSymbol,
    logos,
    cmp,
    rank,
    weightOrderBook,
    rangeResultInCmp,
    status,
  } = req.body;
  try {
    const pairName = firstSymbol + "-" + secondSymbol;
    const coinPair: CoinPair = {
      pairId,
      pairName,
      firstCoin,
      SecondCoin,
      firstSymbol,
      secondSymbol,
      logos,
      cmp,
      rank,
      weightOrderBook,
      rangeResultInCmp,
      status,
    };
    console.log("CoinPairs >>>>>", coinPair);
    if (!coinPair) {
      return res.status(400).send({
        status: false,
        message: "Missing value",
        result: null,
      });
    }
    const coinPairRef = await firestore()
      .collection("settings")
      .doc("pairs")
      .get();
    let coinPairData: any = coinPairRef.data();
    let checkCoinPair = coinPairData.pairs.find((coin: any) => {
      return coin.pairId == pairId;
    });

    if (checkCoinPair) {
      return res.status(409).send({
        status: false,
        message: "Already exist.",
        result: null,
      });
    }

    coinPairData.pairs.push(coinPair);
    console.log("coinPairsData >>>>>>>>>>>>>", coinPairData);
    await firestore()
      .collection("settings")
      .doc("pairs")
      .set(coinPairData, { merge: true });

    let getCoinPair = coinPairData.pairs.find((coin: any) => {
      return coin.pairId == pairId;
    });
    res.status(200).send({
      status: true,
      message: "New Coin Pair Added.",
      result: getCoinPair,
    });
  } catch (error) {
    errorLogging("addCoinPair", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
};

//listing
export const getAllCardsPairs = async (req: any, res: any) => {
  try {
    const getCoinPairArray: any = [];
    const getCoinPairRef = await firestore()
      .collection("settings")
      .doc("pairs")
      .get();
    const getCoinPairData: any = getCoinPairRef.data();

    getCoinPairData.pairs.forEach((pairs: any) => {
      getCoinPairArray.push(pairs);
    });
    console.log("get all coinsPairs >>>>>", getCoinPairArray);
    res.status(200).send({
      status: true,
      message: "get all coin pairs.",
      result: getCoinPairArray,
    });
  } catch (error) {
    errorLogging("getAllCardsPairs", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
};

export function paginate(array: any, page_size: number, page_number: number) {
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

export const pairsListingFunction = async (req: any, res: any) => {
  const { pageNumber, limit, sortBy, search } = req.query;
  try {
    let array: any = [];
    const getCoinPairRef = await firestore()
      .collection("settings")
      .doc("pairs")
      .get();
    const getCoinPairData: any = getCoinPairRef.data();
    console.log("req.params", req.params);
    console.log("req.paramas>>>>>", pageNumber, limit, sortBy, search);
    getCoinPairData.pairs.forEach((pairs: any) => {
      array.push(pairs);
    });

    // Sort by any field of admin collection
    if (sortBy) {
      let parts = sortBy.split(":");
      let sortByField: any = parts[0];
      let sortOrder: any = parts[1];
      array = _.orderBy(array, sortByField, sortOrder);
      console.log("sortBy >>>", array);
    }

    // Pagination implemented
    if (pageNumber && limit) {
      array = paginate(array, limit, pageNumber);
      console.log("Pagination >>>", array);
    }

    // Search on firstName or email
    if (search) {
      array = array.find((item: any) => {
        let parts = search .split(":");
        let value : any = parts[1];
        console.log("value >>>>>",value)
        return (
          item.pairName == value ||
          item.rank == value ||
          item.firstCoin == value ||
          item.SecondCoin == value ||
          item.firstSymbol == value ||
          item.secondSymbol == value
        );
      });
      console.log("search >>>", array);
    }

    res.status(200).send({
      status: true,
      message: "get all coin pairs.",
      result: array,
    });
    return array;
  } catch (error) {
    errorLogging("pairsListingFunction", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
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
