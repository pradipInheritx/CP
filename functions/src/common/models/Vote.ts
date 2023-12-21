import * as admin from "firebase-admin";
import { UserTypeProps } from "./User";
import { getPriceOnParticularTime } from "../models/Rate";
import Calculation from "../models/Calculation";
import Timestamp = admin.firestore.Timestamp;
import FirestoreDataConverter = admin.firestore.FirestoreDataConverter;

export type VoteProps = {
  coin: string;
  userId: string;
  timeframe: TimeFrame;
  direction: Direction;
  valueVotingTime: number | number[];
  status?: UserTypeProps;
  trendChange?: number;
};

export const voteConverter: FirestoreDataConverter<VoteResultProps> = {
  toFirestore(modelObject: VoteResultProps): FirebaseFirestore.DocumentData {
    return modelObject;
  },
  fromFirestore(
    snapshot: FirebaseFirestore.QueryDocumentSnapshot
  ): VoteResultProps {
    const data = snapshot.data();
    return data as VoteResultProps;
  },
};

export type VoteResultProps = VoteProps & {
  voteTime: Timestamp;
  expiration: Timestamp;
  valueExpirationTime?: number | number[];
  direction?: any;
  success?: number;
  score?: number;
  CPMRangePercentage?: number;
  CPMRangeCurrentValue?: number;
};

export type TimeFrame = {
  index: number;
  name: string;
  seconds: number;
};

export enum Direction {
  BULL,
  BEAR,
}

export const calculateOffset: (timeframe: TimeFrame) => number = (
  timeframe: TimeFrame
) => timeframe.seconds * 1000;

export const updateVotesTotal = async () => {
  console.log("Beginning execution of updateVotesTotal 2 --->");
  const app = await admin.firestore().collection("stats").doc("app").get();
  console.log("Beginning execution of updateVotesTotal --->");
  if (!app.exists || (app.exists && !app.data()?.totalVotes)) {
    const votes = await admin.firestore().collection("votes").get();

    await admin
      .firestore()
      .collection("stats")
      .doc("app")
      .set({ totalVotes: votes.size }, { merge: true });
  } else {
    await admin
      .firestore()
      .collection("stats")
      .doc("app")
      .update({ totalVotes: admin.firestore.FieldValue.increment(1) });
  }
  console.log("Finished execution of updateVotesTotal --->");
  return;
};

export const updateVotesTotalForSingleCoin = async (coin: any) => {
  const data = await admin.firestore().collection("stats").doc("totals").get();

  const mappedData = data.data();

  const obj: any = {};
  if (mappedData?.hasOwnProperty(`${coin}`)) {
    obj[`${coin}`] = {
      success: mappedData[coin].success,
      total: mappedData[coin].total + 1,
    };

    await admin.firestore().collection("stats").doc("totals").update(obj);
  } else {
    obj[`${coin}`] = {
      success: 0,
      total: 1,
    };
    const test = await admin.firestore().collection("stats").doc("totals");
    await test.set(obj, { merge: true });
  }

  console.log("Finished execution of updateVotesTotalForSingleCoin --->");
  return;
};


export const getResultAfterVote = async (requestBody: any) => {
  try {
    let price: any;
    const {
      coin1,
      coin2,
      voteId,
      voteTime,
      valueVotingTime,
      valueExpirationTimeOfCoin1,
      valueExpirationTimeOfCoin2,
      expiration,
      timestamp,
      userId,
      status,
      //Pax Distribution
    } = requestBody;

    console.info("status", status);

    // Snapshot Get From ID
    console.info("Vote ID", voteId, typeof voteId);
    const getVoteRef = await admin.firestore().collection("votes").doc(voteId);
    const getVoteInstance = await getVoteRef.get();
    const getVoteData = getVoteInstance.data();
    console.info("getVoteData", getVoteData?.score);
    if ((getVoteData && getVoteData.score === 0) || getVoteData && getVoteData.score) {
      console.info("getVoteData", getVoteData);
      return { status: false, message: "Something went wrong in calculation in score" }
    } else {
      const vote = {
        ...getVoteData,
        expiration,
        voteTime,
        valueVotingTime,
      } as unknown as VoteResultProps;
      console.info("vote", getVoteData);
      if (coin2) {
        const priceOne = valueExpirationTimeOfCoin1 ? valueExpirationTimeOfCoin1 : await getPriceOnParticularTime(coin1, timestamp);
        const priceTwo = valueExpirationTimeOfCoin2 ? valueExpirationTimeOfCoin2 : await getPriceOnParticularTime(coin2, timestamp);
        price = [Number(priceOne), Number(priceTwo)];
        console.info("Get Price", price);
        const calc = new Calculation(vote, price, voteId, userId, status);
        const getSuccessAndScore: any = await calc.calcOnlySuccess();
        console.info("getSuccessAndScore", getSuccessAndScore)
        return {
          voteId: getVoteData?.voteId,
          valueVotingTime,
          voteTime,
          "valueExpirationTime": price,
          expiration,
          userId,
          direction: getVoteData?.direction,
          timeframe: getVoteData?.timeframe,
          coin: `${await returnShortCoinValue(coin1.toUpperCase())}-${await returnShortCoinValue(coin2.toUpperCase())}`,
          success: getSuccessAndScore?.successScoreValue,
          score: getSuccessAndScore?.score
        }
      } else {
        price = valueExpirationTimeOfCoin1 ? valueExpirationTimeOfCoin1 : await getPriceOnParticularTime(coin1, timestamp);
        console.info("Get Price", price);
        const calc = new Calculation(vote, Number(price), voteId, userId, status);
        const getSuccessAndScore: any = await calc.calcOnlySuccess();
        console.info("getSuccessAndScore", getSuccessAndScore);
        return {
          voteId: getVoteData?.voteId,
          valueVotingTime,
          voteTime,
          "valueExpirationTime": price,
          expiration,
          direction: getVoteData?.direction,
          userId,
          timeframe: getVoteData?.timeframe,
          coin: `${await returnShortCoinValue(coin1.toUpperCase())}`,
          success: getSuccessAndScore?.successScoreValue,
          score: getSuccessAndScore?.score
        }
      }
    }
  } catch (error) {
    console.info("ERR:", error);
    return { status: false, message: "Something went wrong in calculation", error }
  }
}

export const
  returnShortCoinValue = async (getCoin: any) => {
    const coinValueFor3Slice = ["BTCUSDT", "ADAUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "UNIUSDT", "XRPUSDT", "LTCUSDT", "CROUSDT", "TRXUSDT", "DOTUSDT", "CLMUSDT", "VETUSDT", "EOSUSDT", "XLMUSDT"];
    const getIndexFrom3Slice = coinValueFor3Slice.findIndex((item: any) => item === getCoin.toUpperCase());
    if (getIndexFrom3Slice != -1) {
      return coinValueFor3Slice[getIndexFrom3Slice].substring(0, 3);
    }
    const coinValueFor4Slice = ["DOGEUSDT", "SHIBUSDT", "CAKEUSDT", "SANDUSDT", "MANAUSDT", "LINKUSDT", "HBARUSDT"];
    const getIndexFrom4Slice = coinValueFor4Slice.findIndex((item: any) => item === getCoin.toUpperCase());
    if (getIndexFrom4Slice != -1) {
      return coinValueFor4Slice[getIndexFrom4Slice].substring(0, 4);
    }
    const coinValueFor5Slice = ["MATICUSDT"];
    const getIndexFrom5Slice = coinValueFor5Slice.findIndex((item: any) => item === getCoin.toUpperCase());
    console.log("getIndexFrom5Slice : ", getIndexFrom5Slice)
    if (getIndexFrom5Slice != -1) {
      return coinValueFor5Slice[getIndexFrom5Slice].substring(0, 5);
    }
    console.log("getCoin : ", getCoin)
    return getCoin;
  }

export const getOldAndCurrentPriceAndMakeCalculation = async (requestBody: any) => {
  try {
    let price: any;
    const {
      coin1,
      coin2,
      voteId,
      voteTime,
      valueVotingTime,
      valueExpirationTimeOfCoin1,
      valueExpirationTimeOfCoin2,
      expiration,
      timestamp,
      userId,
      status,
    } = requestBody;

    console.info("status", status);

    // Snapshot Get From ID
    console.info("Vote ID", voteId, typeof voteId);
    const getVoteRef = await admin.firestore().collection("votes").doc(voteId);
    const getVoteInstance = await getVoteRef.get();
    const getVoteData = getVoteInstance.data();
    console.info("getVoteData", getVoteData?.score);
    if ((getVoteData && getVoteData.score === 0) || getVoteData && getVoteData.score) {
      console.info("getVoteData", getVoteData);
      return { status: false, message: "Something went wrong in score" }
    } else {
      const vote = {
        ...getVoteData,
        expiration,
        voteTime,
        valueVotingTime,
      } as unknown as VoteResultProps;
      console.info("vote", getVoteData);
      if (coin2) {
        const priceOne = valueExpirationTimeOfCoin1 ? valueExpirationTimeOfCoin1 : await getPriceOnParticularTime(coin1, timestamp);
        const priceTwo = valueExpirationTimeOfCoin2 ? valueExpirationTimeOfCoin2 : await getPriceOnParticularTime(coin2, timestamp);
        price = [Number(priceOne), Number(priceTwo)];
        console.info("Get Price", price);
        const calc = new Calculation(vote, price, voteId, userId, status);
        await calc.calc(getVoteRef);
        return { status: true, message: "Success" }
      } else {
        price = valueExpirationTimeOfCoin1 ? valueExpirationTimeOfCoin1 : await getPriceOnParticularTime(coin1, timestamp);
        console.info("Get Price", price);
        const calc = new Calculation(vote, Number(price), voteId, userId, status);
        await calc.calc(getVoteRef);
        return { status: true, message: "Success" }
      }
    }
  } catch (error) {
    return { status: false, message: "Something went wrong", error }
  }
}