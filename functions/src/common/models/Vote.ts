import * as admin from "firebase-admin";
import { UserTypeProps } from "./User";
import { firestore, messaging } from "firebase-admin";
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
    const getLastUserVoteSnapshot = await admin.firestore().collection("votes").where("userId", "==", getAllUsers[user].id).orderBy('voteTime', 'desc').limit(1).get();
    let lastVotedData: any = [];
    getLastUserVoteSnapshot.forEach(doc => {
      lastVotedData.push({ id: doc.id, ...doc.data() })
      console.info(doc.id, '=>', doc.data());
    });
    if (lastVotedData && lastVotedData.length) {
      const body = "Don't forget to make your daily vote";
      let token = getAllUsers[user].token;

      console.info("Token,", token);
      const message: messaging.Message = {
        token,
        notification: {
          title: "Don't forget to make your daily vote",
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
        title: "Don't forget to make your daily vote",
        id: getAllUsers[user].id,
      });
    }
  }
}

export const getOldAndCurrentPriceAndMakeCalculation = async (
  requestBody: any
) => {
  let price: any;
  const {
    coin1,
    coin2,
    voteId,
    voteTime,
    valueVotingTime,
    expiration,
    timestamp,
  } = requestBody;

  // Snapshot Get From ID
  const getVoteRef = firestore().collection("votes").doc(voteId);
  const getVoteInstance = await getVoteRef.get();
  const getVoteData = getVoteInstance.data();

  const vote = {
    ...getVoteData,
    expiration,
    voteTime,
    valueVotingTime,
  } as unknown as VoteResultProps;

  if (coin2) {
    const priceOne = await getPriceOnParticularTime(coin1, timestamp);
    const priceTwo = await getPriceOnParticularTime(coin2, timestamp);
    price = [Number(priceOne), Number(priceTwo)];
    console.info("Get Price", price)
    const calc = new Calculation(vote, price, voteId);
    await calc.calc(getVoteRef);
  } else {
    price = await getPriceOnParticularTime(coin1, timestamp);
    const calc = new Calculation(vote, Number(price), voteId);
    await calc.calc(getVoteRef);
  }
};
