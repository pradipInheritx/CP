import * as admin from "firebase-admin";
import { VoteResultProps, TimeFrame } from "../interfaces/Vote.interface";
import { getPriceOnParticularTime } from "../models/Rate";
import Calculation from "../models/Calculation";
// import { sendMintForPaxToUser, sendMintForPaxToAdmin } from "./Reward"
// import { addPaxTransactionWithPendingStatus } from "./PAX";

import FirestoreDataConverter = admin.firestore.FirestoreDataConverter;
import { errorLogging } from "../helpers/commonFunction.helper";
import { getUserAndCalculatePax } from "./CmpCalculation";

export const calculateOffset: (timeframe: TimeFrame) => number = (
  timeframe: TimeFrame
) => timeframe.seconds * 1000;

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
          score: getSuccessAndScore?.score,

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
          score: getSuccessAndScore?.score,
        }
      }
    }
  } catch (error) {
    console.info("ERR:", error);
    return { status: false, message: "Something went wrong in calculation", error }
  }
}

export const returnShortCoinValue = async (getCoin: any) => {
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
      //Pax Distribution
      paxDistributionToUser
    } = requestBody;

    console.info("status", status);
    console.log("paxDistributionToUser from getResultAfterVote : ", paxDistributionToUser)

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
        const getSuccessAndScore: any = await calc.calcOnlySuccess();
        console.log("getSuccessAndScore : ", getSuccessAndScore)
        const paxDistribution = paxDistributionToUser ? await getUserAndCalculatePax(paxDistributionToUser, getSuccessAndScore?.score) : "";
        console.log("paxDistribution : ", paxDistribution)
        await calc.calc(getVoteRef);
        return {
          status: true, message: "Success", result: {
            "paxDistributionToUser": paxDistribution
          }
        }
      } else {
        price = valueExpirationTimeOfCoin1 ? valueExpirationTimeOfCoin1 : await getPriceOnParticularTime(coin1, timestamp);
        console.info("Get Price", price);
        const calc = new Calculation(vote, Number(price), voteId, userId, status);
        const getSuccessAndScore: any = await calc.calcOnlySuccess();
        console.log("getSuccessAndScore : ", getSuccessAndScore)
        const paxDistribution = paxDistributionToUser ? await getUserAndCalculatePax(paxDistributionToUser, getSuccessAndScore?.score) : "";
        console.log("paxDistribution : ", paxDistribution)
        await calc.calc(getVoteRef);
        return {
          status: true, message: "Success", result: {
            "paxDistributionToUser": paxDistribution
          }
        }
      }
    }
  } catch (error) {
    return { status: false, message: "Something went wrong", error }
  }
}





export const addVoteResultForCPVI = async (voteData: VoteResultProps) => {
  try {
    console.log("start addVoteResultForCPVI")
    const cpviCollectionReference = admin.firestore().collection('voteResultForCPVI').doc(voteData.coin);
    const getDocument = await cpviCollectionReference.get();
    const incrementKeyValue: any = {};
    const newCPVIObject: any = {};
    let userVote: string;
    const checkCoinPair = voteData.coin.trim().split('-');
    // For Pair 
    if (checkCoinPair.length == 2) {
      newCPVIObject[checkCoinPair[0]] = 0
      newCPVIObject[checkCoinPair[1]] = 0
      voteData.direction == 0 ? (newCPVIObject[checkCoinPair[0]] = 1) : (newCPVIObject[checkCoinPair[1]] = 1);
      if (getDocument.exists == false) {
        // create a new CPVI
        console.log("newCPVIObject : ", newCPVIObject)
        await createNewCPVIDocumnet(voteData, newCPVIObject)
      } else {

        userVote = voteData.direction == 0 ? checkCoinPair[0] : checkCoinPair[1];
        incrementKeyValue[userVote] = admin.firestore.FieldValue.increment(1)
        console.log("incrementKeyValue : ", incrementKeyValue);
        console.log("getDocument.exists : ", getDocument.exists)
        const cpviData = getDocument.data();
        const getTimeStamp = cpviData?.timestamp;
        const after7daysTimeStamp = getTimeStamp._seconds + (7 * 24 * 3600); //get after 7 days seconds
        const currentTimestamp = Math.round(Date.now() / 1000);

        console.log("getTimeStamp : ", getTimeStamp);
        console.log("currentTimestamp - after7daysTimeStamp", currentTimestamp, " - ", after7daysTimeStamp);

        if (after7daysTimeStamp > currentTimestamp) {
          // update the CPVI
          await cpviCollectionReference.set(incrementKeyValue, { merge: true }).then(() => {
            console.log("CPVI updated successfully")
          })
        } else {
          // create a new CPVI
          console.log("newCPVIObject : ", newCPVIObject)
          await createNewCPVIDocumnet(voteData, newCPVIObject)
        }
      }
      console.log("End addVoteResultForCPVI")
      return null
    } else if (checkCoinPair.length == 1) {

      const newCPVI = voteData.direction == 0 ? {
        BULL: 1,
        BEAR: 0,
        timestamp: admin.firestore.Timestamp.now()
      } : {
        bull: 0,
        bear: 1,
        timestamp: admin.firestore.Timestamp.now()
      }

      console.log("getDocument.exists : ", getDocument.exists)

      // check document already exist or not and check timestamp to will be not cross the after 7 days
      if (getDocument.exists == false) {
        await createNewCPVIDocumnet(voteData, newCPVI)
      } else {
        const cpviData = getDocument.data();
        const getTimeStamp = cpviData?.timestamp;
        const after7daysTimeStamp = getTimeStamp._seconds + (7 * 24 * 3600); //get after 7 days seconds
        const currentTimestamp = Math.round(Date.now() / 1000);

        console.log("getTimeStamp : ", getTimeStamp);
        console.log("currentTimestamp - after7daysTimeStamp", currentTimestamp, " - ", after7daysTimeStamp);

        if (after7daysTimeStamp > currentTimestamp) {
          userVote = voteData.direction == 0 ? "BULL" : "BEAR";
          incrementKeyValue[userVote] = admin.firestore.FieldValue.increment(1)
          console.log("incrementKeyValue : ", incrementKeyValue);
          await cpviCollectionReference.set(incrementKeyValue, { merge: true }).then(() => {
            console.log("CPVI updated successfully")
          })
        } else {
          await createNewCPVIDocumnet(voteData, newCPVI)
        }
      }
      console.log("End addVoteResultForCPVI")
      return true
    } else {
      console.error("Coin/Pair is not valid")
      return false
    }

  } catch (error) {
    return errorLogging("addVoteResultForCPVI", "Error", error);
  }
}

async function createNewCPVIDocumnet(voteData: VoteResultProps, newCPVIObject: any) {
  try {

    await admin.firestore().collection('voteResultForCPVI').doc(voteData.coin).set({ ...newCPVIObject, timestamp: admin.firestore.Timestamp.now() }, { merge: true }).then(() => {
      console.log("New CPVI is generated")
    });
  }
  catch (error) {
    errorLogging("createNewCPVIDocumnet", "Error", error);
  }
}