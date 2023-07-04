import * as admin from "firebase-admin";
import { UserTypeProps } from "./User";
import { messaging } from "firebase-admin";
import { getPriceOnParticularTime } from "../models/Rate";
import Calculation from "../models/Calculation";
import Timestamp = admin.firestore.Timestamp;
import FirestoreDataConverter = admin.firestore.FirestoreDataConverter;
import { sendNotification } from "./Notification";

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

export const checkInActivityOfVotesAndSendNotification = async () => {
  const currentDate = admin.firestore.Timestamp.now().toMillis();
  console.log("Current date => ", currentDate);

  const last24HoursMillis = 24 * 60 * 60 * 1000;
  console.log("last24HoursMillis => ", last24HoursMillis);

  const last24HoursDate = admin.firestore.Timestamp.fromMillis(currentDate - last24HoursMillis).toMillis();
  console.log("Last 24 hours date => ", last24HoursDate);

  const getUsers = await admin.firestore().collection("users").get();
  const getAllUsers: any = getUsers.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
    };
  });

  for (let user = 0; user < getAllUsers.length; user++) {
    const getLastUserVoteSnapshot = await admin.firestore().collection("votes").where("userId", "==", getAllUsers[user].id).where("voteTime", "<", last24HoursDate).orderBy("voteTime", "desc").limit(1).get();
    console.info("getLastUserVoteSnapshot", getLastUserVoteSnapshot);
    const lastVotedData: any = [];
    getLastUserVoteSnapshot.forEach((doc) => {
      lastVotedData.push({ id: doc.id, ...doc.data() });
      console.info(doc.id, "=>", doc.data());
    });
    if (lastVotedData && lastVotedData.length) {
      const body = "VOTE NOW!";
      const token = getAllUsers[user].token;

      console.info("Token,", token);
      const message: messaging.Message = {
        token,
        notification: {
          title: "🗳 It's Time to Make Your Voice Heard Again! 🗳",
          body,
        },
        webpush: {
          headers: {
            Urgency: "high",
          },
          fcmOptions: {
            link: "#", // TODO: put link for deep linking
          },
        },
      };
      console.info("Id,", getAllUsers[user].id);
      await sendNotification({
        token,
        message,
        body,
        title: "🗳 It's Time to Make Your Voice Heard Again! 🗳",
        id: getAllUsers[user].id,
      });
    }
  }
};

export const getOldAndCurrentPriceAndMakeCalculation = async (
  requestBody: any
) => {
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
      // Do Nothing
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
      } else {
        price = valueExpirationTimeOfCoin1 ? valueExpirationTimeOfCoin1 : await getPriceOnParticularTime(coin1, timestamp);
        console.info("Get Price", price);
        const calc = new Calculation(vote, Number(price), voteId, userId, status);
        await calc.calc(getVoteRef);
      }
    }
  } catch (error) {
    console.info("ERR:", error);
  }
};
