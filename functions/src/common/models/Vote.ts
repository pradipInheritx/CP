import * as admin from "firebase-admin";
import { VoteResultProps, TimeFrame } from "../interfaces/Vote.interface";
import { getPriceOnParticularTime } from "../models/Rate";
import Calculation from "../models/Calculation";
import { errorLogging } from "../models/Calculation";
import { sendMintForPaxToUser, sendMintForPaxToAdmin } from "./Reward"
import { addPaxTransactionWithPendingStatus } from "./PAX";

import FirestoreDataConverter = admin.firestore.FirestoreDataConverter;

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
        // const paxDistribution = paxDistributionToUser ? await getUserAndCalculatePax(paxDistributionToUser, getSuccessAndScore?.score) : "";
        // console.log("paxDistribution : ", paxDistribution)
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
          // "paxDistributionToUser": paxDistribution
        }
      } else {
        price = valueExpirationTimeOfCoin1 ? valueExpirationTimeOfCoin1 : await getPriceOnParticularTime(coin1, timestamp);
        console.info("Get Price", price);
        const calc = new Calculation(vote, Number(price), voteId, userId, status);
        const getSuccessAndScore: any = await calc.calcOnlySuccess();
        // const paxDistribution = paxDistributionToUser ? await getUserAndCalculatePax(paxDistributionToUser, getSuccessAndScore?.score) : "";
        // console.log("paxDistribution : ", paxDistribution)
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
          // "paxDistributionToUser": paxDistribution
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
        await calc.calc(getVoteRef);
        await checkAndUpdateRewardTotal(userId);
        const paxDistribution = paxDistributionToUser ? await getUserAndCalculatePax(paxDistributionToUser) : "";
        console.log("paxDistribution : ", paxDistribution)
        return { status: true, message: "Success", "paxDistributionToUser": paxDistribution }
      } else {
        price = valueExpirationTimeOfCoin1 ? valueExpirationTimeOfCoin1 : await getPriceOnParticularTime(coin1, timestamp);
        console.info("Get Price", price);
        const calc = new Calculation(vote, Number(price), voteId, userId, status);
        await calc.calc(getVoteRef);
        await checkAndUpdateRewardTotal(userId);
        const paxDistribution = paxDistributionToUser ? await getUserAndCalculatePax(paxDistributionToUser) : "";
        console.log("paxDistribution : ", paxDistribution)
        return { status: true, message: "Success", "paxDistributionToUser": paxDistribution }
      }
    }
  } catch (error) {
    return { status: false, message: "Something went wrong", error }
  }
}

async function checkAndUpdateRewardTotal(userId: string) {
  try {
    const getUserRef = admin.firestore().collection('users').doc(userId);
    const getUserDetails: any = (await getUserRef.get()).data();
    const getUserScore: number = getUserDetails?.voteStatistics?.score;
    const getUserTotal: number = getUserDetails?.rewardStatistics?.total;
    const checkScore = getUserScore - (getUserTotal * 100);
    console.log("getUserScore : ", getUserScore);
    console.log("getUserTotal : ", getUserTotal);
    console.log("checkScore || checkScore > 99.99: ", checkScore, " || ", checkScore > 99.99);
    if (checkScore > 99.99) {
      getUserRef
        .set(
          {
            rewardStatistics: {
              total: admin.firestore.FieldValue.increment(1),
              claimed: getUserDetails?.rewardStatistics?.claimed || 0,
            },
          },
          { merge: true }
        ).then(() => {
          console.log("Total and Claimed are updated Successfully");
        })
    }
  } catch (error) {
    console.error("checkAndUpdateRewardTotal failed to update the reward total. Error", error);
  }
}

export const getUserAndCalculatePax = async (paxDetails: any) => {
  try {
    const getUserDetails = (await admin.firestore().collection("users").doc(paxDetails.userId).get()).data();
    if (!getUserDetails) {
      return errorLogging("getUserAndCalculatePax", "ERROR", "User not found");
    }
    const getUserScore: number = getUserDetails?.voteStatistics?.score;
    const getUserTotal: number = getUserDetails?.rewardStatistics?.total;
    const checkScore = getUserScore - (getUserTotal * 100);
    console.log("getUserScore : ", getUserScore);
    console.log("getUserTotal : ", getUserTotal);
    console.log("checkScore || checkScore > 99.99: ", checkScore, " || ", checkScore > 99.99);
    if (checkScore > 99.99) {
      let getResultAfterSentPaxToUser: any;
      let getResultAfterSentPaxToAdmin: any;

      if (paxDetails.isUserUpgraded === true) {
        // Call to user mintFor Address
        getResultAfterSentPaxToUser = await sendMintForPaxToUser(paxDetails);
        await addPaxTransactionWithPendingStatus(paxDetails)
        console.info("getResultAfterSentPaxToUser", getResultAfterSentPaxToUser);
        return getResultAfterSentPaxToUser
      }
      if (paxDetails.isUserUpgraded === false) {
        // Call to Admin mintFor Address
        getResultAfterSentPaxToAdmin = await sendMintForPaxToAdmin(paxDetails);
        await addPaxTransactionWithPendingStatus(paxDetails);
        console.info("getResultAfterSentPaxToAdmin", getResultAfterSentPaxToAdmin);
        return getResultAfterSentPaxToAdmin
      }
    }

  } catch (error) {
    return errorLogging("getUserAndCalculatePax", "ERROR", error);
  }
}

export const addVoteResultForCPVI = async (voteData: VoteResultProps) => {
  try {
    console.log("start addVoteResultForCPVI")
    const cpviCollectionReference = admin.firestore().collection('voteResultForCPVI').doc(voteData.coin);
    const getDocument = await cpviCollectionReference.get();

    const userVote = voteData.direction == 0 ? "bull" : "bear";

    const incrementKeyValue: any = {};
    incrementKeyValue[userVote] = admin.firestore.FieldValue.increment(1)
    console.log("incrementKeyValue : ", incrementKeyValue);
    console.log("getDocument.exists : ",getDocument.exists)

    // check document already exist or not and check timestamp to will be not cross the after 7 days
    if (getDocument.exists == false) {

      const newCPVI = voteData.direction == 0 ? {
        bull: 1,
        bear: 0,
        timestamp: admin.firestore.Timestamp.now()
      } : {
        bull: 0,
        bear: 1,
        timestamp: admin.firestore.Timestamp.now()
      }
      await cpviCollectionReference.set(newCPVI);

    } else {
      const cpviData = getDocument.data();
      const getTimeStamp = cpviData?.timestamp;
      console.log("getTimeStamp : ", getTimeStamp);
      const after7daysTimeStamp = getTimeStamp._seconds + (7 * 24 * 3600); //get after 7 days seconds
      const currentTimestamp = (Date.now() / 1000);
      if (getDocument.exists == true && after7daysTimeStamp < currentTimestamp) {
        await cpviCollectionReference.set(incrementKeyValue,{merge: true}).then(()=>{
          console.log("new vote updated successfully")
        })
      }
    }
    console.log("End addVoteResultForCPVI")
    return null
  } catch (error) {
    return errorLogging("addVoteResultForCPVI", "Error", error);
  }
}