import { firestore } from "firebase-admin";
import * as admin from "firebase-admin";
// import { getStorage, getDownloadURL,ref } from "firebase/storage"
// import path from "path";
import { userConverter, UserProps } from "../models/User";
import { sendNotification } from "./Notification";
import { messaging } from "firebase-admin";
// import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const distribution: { [key: number]: { [key: string]: number[] } } = {
  0: {
    cardTierPickingChanceInPercent: [90, 5, 3, 2, 0],
    extraVotePickFromRange: [1, 5],
    diamondsPickFromRange: [1, 3],
  },
  100: {
    cardTierPickingChanceInPercent: [90, 5, 3, 2, 0],
    extraVotePickFromRange: [1, 7],
    diamondsPickFromRange: [1, 5],
  },
  200: {
    cardTierPickingChanceInPercent: [90, 5, 3, 2, 0],
    extraVotePickFromRange: [1, 10],
    diamondsPickFromRange: [1, 7],
  },
  300: {
    cardTierPickingChanceInPercent: [80, 10, 5, 3, 2],
    extraVotePickFromRange: [1, 15],
    diamondsPickFromRange: [1, 10],
  },
  400: {
    cardTierPickingChanceInPercent: [75, 10, 5, 5, 5],
    extraVotePickFromRange: [1, 15],
    diamondsPickFromRange: [1, 10],
  },
  500: {
    cardTierPickingChanceInPercent: [70, 15, 5, 5, 5],
    extraVotePickFromRange: [1, 15],
    diamondsPickFromRange: [1, 15],
  },
  600: {
    cardTierPickingChanceInPercent: [65, 15, 10, 5, 5],
    extraVotePickFromRange: [1, 20],
    diamondsPickFromRange: [1, 15],
  },
  700: {
    cardTierPickingChanceInPercent: [50, 20, 15, 10, 5],
    extraVotePickFromRange: [1, 20],
    diamondsPickFromRange: [1, 15],
  },
  800: {
    cardTierPickingChanceInPercent: [40, 20, 20, 10, 10],
    extraVotePickFromRange: [1, 25],
    diamondsPickFromRange: [1, 20],
  },
  900: {
    cardTierPickingChanceInPercent: [30, 15, 15, 20, 20],
    extraVotePickFromRange: [1, 25],
    diamondsPickFromRange: [1, 20],
  },
  1000: {
    cardTierPickingChanceInPercent: [20, 15, 15, 25, 25],
    extraVotePickFromRange: [1, 35],
    diamondsPickFromRange: [1, 25],
  },
};

function createArrayByPercentageForPickingTier(cmp: number) {
  const array = [];
  const pickedPercentageArray =
    distribution[cmp].cardTierPickingChanceInPercent;

  let tier = 0;
  for (let i = 0; i < pickedPercentageArray[i]; i++) {
    const eachPercentage = pickedPercentageArray[i];
    for (let j = 0; j < eachPercentage; j++) {
      array.push(tier);
    }
    tier++;
  }
  return array;
}

/* export const getAllCards = (): any => async () => {
  const docs = await admin.firestore().collection("settings").doc("cards").get();

  //console.log("docs.data() --->", docs.data()?.cards);
  return docs.data()?.cards || []
};*/

// get all collection data
// async function getAllCards() {
//   const docs = await firestore().collection("settings").doc("cards").get();
//   console.log("docs.data() --->", docs.data()?.cards);
//   return docs.data()?.cards || [];
// }

// get all collection data
export async function getAllNftGallery() {
  const snapshot = await firestore().collection("nftGallery").get();
  const array: any = [];
  snapshot.forEach((doc) => {
    array.push({ id: doc.id, ...doc.data() });
  });
  return array;
}

// get collection data by document id
async function getNftCollectionDataById(docId: any) {
  const collectionData = await firestore()
    .collection("nftGallery")
    .doc(docId)
    .get();
  return collectionData.data();
}

// get all reward transactions by card id
async function getRewardTransactionsByCardId(cardId: number) {
  console.log("cardID >>>>", cardId);
  const transaction = await firestore()
    .collection("reward_transactions")
    .where("winData.firstRewardCardId", "==", cardId)
    .get();
  const transData: any = [];
  console.log("trasnaction >>>>>>", transaction);
  transaction.forEach((item: any) => {
    console.log("item.data ?>>>>>>>", item.data());
    transData.push(item.data());
  });
  return transData;
}

// get multiple users by user ids
async function getMultipleUsersByUserIds(userIds: Array<string>) {
  console.log("getMultipleUsersByUserIds............");
  const userList: any = await firestore()
    .collection("users")
    .where("uid", "in", userIds)
    .get();

  console.log("userLIST >>>>>>>", userList);
  const users: any = [];
  userList.forEach((item: any) => {
    users.push(item.data());
  });
  console.log("USER >>>>>>>>", users);
  return users;
}

/* const getAllNftGallery = (): any => async () => {
  const snapshot = await firestore().collection("nft_gallery").get();

  var array:Object[] = []
  await firestore().collection('nft_gallery').get()
    .then(querySnapshot => {
      querySnapshot.docs.forEach(doc => {
        array.push(doc.data());
    });
  });
  return array;

  const data = await firestore().collection('nft_gallery')
  var tempDoc:Object[] = []
  data.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
         tempDoc.push({ id: doc.id, ...doc.data() })
      })
      console.log(tempDoc)
  })

  return tempDoc
  return snapshot.docs.map(doc => doc.data());
};*/

const pickCardTierByPercentageArray = async (percentageArr: number[]) => {
  console.log("PERCENTAGE ARR", percentageArr);
  // const cardsByTier: { [key: string]: string[] } = {
  //   Common: ["ABC", "DEF", "GHI", "JKL", "MNO"],
  //   Uncommon: ["AYF", "AKO", "BSR", "WTE", "SHT"],
  //   Rare: ["WTJ", "SAM", "QYD", "SLL", "DYJ"],
  //   Epic: ["OPD", "WNN", "CHD", "AUL", "SYI"],
  //   Legendary: ["XFL", "MHG", "FKU", "CSJ", "ZCW"],
  // };
  // const cardData = await getAllCards();
  // console.log("cardData Response--->", cardData);

  const nftGalleryData = await getAllNftGallery();
  // console.log("ALBUMS IIIIIIIII>>>>>", nftGalleryData);

  const cards: any = [];
  nftGalleryData.forEach((element: any) => {
    const albumId = element.albumId;
    const albumName = element.albumName;
    const docId = element.id;
    // console.log("ALBUMS IIIIIIIII>>>>>", element);
    element.setDetails.forEach((setDetail: any) => {
      // console.log("SETDEAQILS >>>>>", setDetail);
      const setId = setDetail.setId;
      setDetail.cardsDetails.forEach((cardDetail: any) => {
        // console.log("CARDDEAQILS >>>>>", cardDetail);

        cards.push({
          albumId,
          albumName,
          docId,
          setId,
          ...cardDetail,
        });
      });
    });
  });

  const groupByType: any = groupBy(["cardType"]);
  const cardsByTier: any = groupByType(cards);
  console.log("CARDS TIER ==>", cardsByTier);

  // console.log("cardsByTier --->", cardsByTier);
  // const cardsByTier: { [key: number]: string[] } = {
  //   1: ["ABC", "DEF", "GHI", "JKL", "MNO"],
  //   2: ["AYF", "AKO", "BSR", "WTE", "SHT"],
  //   3: ["WTJ", "SAM", "QYD", "SLL", "DYJ"],
  //   4: ["OPD", "WNN", "CHD", "AUL", "SYI"],
  //   5: ["XFL", "MHG", "FKU", "CSJ", "ZCW"],
  // };

  // const oldcardsByTier: { [key: string]: string[] } = {};
  // interface cardType {
  //   cardList: string[],
  //   tierName: string
  // }

  // cardData.map((e: cardType) => {
  //   oldcardsByTier[e.tierName] = e.cardList;
  // });

  // console.log("CARDS TIER", oldcardsByTier);

  let selectedTier = getRandomSelectedTier(cardsByTier, percentageArr);
  console.log("RETURN SELECTED TIER VALUE -> ", selectedTier);
  /*const randomIndex = Math.floor(Math.random() * percentageArr.length);
  console.log("RANDOM INDEX", randomIndex);

  const selectedTier = percentageArr[randomIndex];
  console.log("SELECTED TIER", selectedTier);*/

  const selectedCardTier = Object.keys(cardsByTier)[selectedTier];
  console.log("SELECTED CARD TIER", selectedCardTier);

  const pickedTierArray = cardsByTier[selectedCardTier];
  console.log("PICKED TIER ARRAY", pickedTierArray);

  return { tierName: selectedCardTier, pickedTierArray };
};

function getRandomSelectedTier(cardsByTier: any, percentageArr: any): number {
  const randomIndex = Math.floor(Math.random() * percentageArr.length);
  console.log("RANDOM INDEX", randomIndex);

  const selectedTier = percentageArr[randomIndex];
  console.log("SELECTED TIER", selectedTier);
  console.log(
    "Object.keys(cardsByTier).length",
    Object.keys(cardsByTier).length
  );

  let returnValue;

  returnValue = selectedTier;

  if (selectedTier >= Object.keys(cardsByTier).length) {
    returnValue = getRandomSelectedTier(cardsByTier, percentageArr);
  }

  return returnValue;
}

const groupBy =
  <T>(keys: (keyof T)[]) =>
    (array: T[]): Record<string, T[]> =>
      array.reduce((objectsByKeyValue, obj) => {
        const value = keys.map((key) => obj[key]).join("-");
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
      }, {} as Record<string, T[]>);

const pickRandomValueFromArray = (arr: string[]): string => {
  // generate a random index
  const randomIndex = Math.floor(Math.random() * arr.length);

  // use the random index to access a random element from the array
  const randomElement = arr[randomIndex];
  return randomElement;
};

const getRandomNumber = (range: number[]): number => {
  const [min, max] = range;
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const addRewardTransaction: (
  user: string,
  winData: winRewardData,
  winningTime: number
) => Promise<void> = async (
  user: string,
  winData: winRewardData,
  winningTime: number
) => {
    console.log("Beginning execution addRewardTransaction function");
    const obj: RewardTransaction = {
      user,
      winningTime,
      winData,
      transactionTime: firestore.FieldValue.serverTimestamp(),
    };
    console.log("addRewardTransaction.......", obj);
    await firestore().collection("reward_transactions").doc().set(obj);
    console.log("Finished execution addRewardTransaction function");
  };

export const claimReward: (uid: string) => { [key: string]: any } = async (
  uid: string
) => {
  try {
    console.log("Beginning execution claimReward function");
    const userRef = firestore()
      .collection("users")
      .doc(uid)
      .withConverter(userConverter);

    const userProps = await userRef.get();
    const userData = userProps.data();

    const { total, claimed } = userData?.rewardStatistics || {
      total: 0,
      claimed: 0,
    };

    if (total - claimed > 0) {
      const cmp = (claimed + 1) * 100 > 1000 ? 1000 : (claimed + 1) * 100;
      const tierPickupArray = createArrayByPercentageForPickingTier(cmp);
      const { pickedTierArray, tierName } = await pickCardTierByPercentageArray(
        tierPickupArray
      );
      const firstRewardCardObj: any = pickRandomValueFromArray(pickedTierArray);
      console.log("FIRST REWARD OBJ==>", firstRewardCardObj);
      const firstRewardCard = firstRewardCardObj["cardName"];
      const firstRewardCardSerialNo = firstRewardCardObj.sno.length ? pickRandomValueFromArray(
        firstRewardCardObj["sno"]
      ) : ""; // Added this condition because somnetimes sno is blank

      const secondRewardExtraVotes = getRandomNumber(
        distribution[cmp].extraVotePickFromRange
      );
      const thirdRewardDiamonds = getRandomNumber(
        distribution[cmp].diamondsPickFromRange
      );
      const rewardObj = userData?.rewardStatistics || {
        total: 0,
        claimed: 0,
        cards: [],
        extraVote: 0,
        diamonds: 0,
      };

      console.log("rewardObj1......", rewardObj);
      rewardObj.claimed += 1;
      rewardObj?.cards?.length
        ? rewardObj.cards.push(firstRewardCard)
        : (rewardObj.cards = [firstRewardCard]);
      rewardObj?.extraVote
        ? (rewardObj.extraVote += secondRewardExtraVotes)
        : (rewardObj.extraVote = secondRewardExtraVotes);
      rewardObj?.diamonds
        ? (rewardObj.diamonds += thirdRewardDiamonds)
        : (rewardObj.diamonds = thirdRewardDiamonds);
      console.log("rewardObj2......", rewardObj);
      await firestore()
        .collection("users")
        .doc(uid)
        .set({ rewardStatistics: rewardObj }, { merge: true });

      const collectionData: any = await getNftCollectionDataById(
        firstRewardCardObj.docId
      );

      console.log("collectionData", collectionData);
      const setDetails = collectionData.setDetails.find(
        (data: any) => data.setId == firstRewardCardObj.setId
      );

      console.log("SET DETAILS", setDetails);
      const cardData = setDetails.cardsDetails.find(
        (item: any) => item.cardId == firstRewardCardObj.cardId
      );
      cardData.sno = cardData.sno.filter(
        (item: any) => item != firstRewardCardSerialNo
      );
      cardData.quantity = cardData.sno.length;

      const winData: winRewardData = {
        firstRewardCardType: tierName,
        firstRewardCardId: firstRewardCardObj.cardId,
        firstRewardCard,
        firstRewardCardCollection: firstRewardCardObj["albumName"],
        firstRewardCardSerialNo,
        secondRewardExtraVotes,
        thirdRewardDiamonds,
      };
      await addRewardTransaction(uid, winData, claimed + 1);
      const transData: any = await getRewardTransactionsByCardId(cardData.cardId);

      console.log("TRANSDATSA", transData);
      const userIds = transData.map((item: any) => item.user);
      cardData.noOfCardHolders = Array.from(new Set(userIds)).length + 1;

      await firestore()
        .collection("nftGallery")
        .doc(firstRewardCardObj.docId)
        .set(collectionData);
      console.log("Finished execution claimReward function");
      return winData;
    } else {
      console.log("Finished execution claimReward function");
      return {
        firstRewardCard: "",
        secondRewardExtraVotes: 0,
        thirdRewardDiamonds: 0,
      };
    }
  } catch (error) {
    console.info("ERROR:", "claimReward", error)
    return {
      firstRewardCard: "",
      secondRewardExtraVotes: 0,
      thirdRewardDiamonds: 0,
    };
  }
};

export enum CpmTransactionType {
  REWARD = "reward",
}

export enum PaxTransactionType {
  MINT = "mint",
}

export enum PaxTransactionStatus {
  PFinished = "pFinished",
  PROCESSING = "processing",
  DONE = "done",
}

export type RewardTransaction = {
  user: string;
  winData: winRewardData;
  winningTime: number;
  transactionTime: firestore.FieldValue;
};

export type winRewardData = {
  firstRewardCardType: string;
  firstRewardCard: string;
  firstRewardCardSerialNo: string;
  firstRewardCardCollection: string;
  secondRewardExtraVotes: number;
  thirdRewardDiamonds: number;
  firstRewardCardId: number;
};

export const addReward: (
  userId: string,
  before: UserProps,
  after: UserProps
) => void = async (userId: string, before: UserProps, after: UserProps) => {
  console.log("Beginning execution addReward function");
  const changed =
    (after.voteStatistics?.score || 0) > (before.voteStatistics?.score || 0);

  if (!changed) {
    return;
  }

  const divisionBefore = Math.floor((before.voteStatistics?.score || 0) / 100);
  const divisionAfter = Math.floor((after.voteStatistics?.score || 0) / 100);
  // console.log('divisionAfter --->', divisionAfter);
  // console.log('divisionBefore --->', divisionBefore);
  if (divisionAfter > divisionBefore) {
    // console.log('before.rewardStatistics?.total --->', before.rewardStatistics?.total);
    const newReward = (before.rewardStatistics?.total || 0) + 1;
    const claimedUpdated = before.rewardStatistics?.claimed || 0;
    // console.log('newReward --->', newReward);
    await firestore()
      .collection("users")
      .doc(userId)
      .set(
        {
          rewardStatistics: {
            total: newReward,
            claimed: claimedUpdated,
          },
        },
        { merge: true }
      );
    await sendNotificationForCpm(userId); // For Send Notification
    console.log("Finished execution addReward function");
    return;
  }
};

const sendNotificationForCpm = async (userId: any) => {
  const userRef = await firestore().collection("users").doc(userId).get();
  const user: any = userRef.data();
  const token = user.token;
  if (!token) {
    console.log("Token not found");
  }

  const message: messaging.Message = {
    token,
    notification: {
      title: "Wow",
      body: "Claim your rewards now!",
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
  console.log("Message:", message);
  await sendNotification({
    token,
    message,
    body: "Claim your rewards now!",
    title: "Wow",
    id: userId,
  });
};



// User listing for a particular card holders
export const cardHolderListing: (cardId: number) => {
  [key: string]: any;
} = async (cardId: number) => {
  const transData: {
    winData: {
      firstRewardCard: string;
      firstRewardCardCollection: string;
      firstRewardCardId: number;
      firstRewardCardSerialNo: string;
      firstRewardCardType: string;
      secondRewardExtraVotes: number;
      thirdRewardDiamonds: number;
    };
    user: string;
  }[] = await getRewardTransactionsByCardId(cardId);
  console.log("transData cardHolderListing---", transData);
  const userIds = transData.map((item: any) => item.user);
  console.log("users map cardHolderListing---", userIds);
  const users: any = await getMultipleUsersByUserIds(userIds);
  // console.log("users cardHolderListing---", users)
  return users;
};

// Upload Image for Cards
export const uploadImage = async (
  cardImage: any,
  collectionId: any,
  setId: any,
  cardId: string
) => {
  const ref = await admin.storage().bucket("default-bucket");
  console.log("File name --- ");

  const metaData = {
    contentType: "Image/jpg",
  };
  ref
    .upload(cardImage, metaData)
    .then(() => getImageUrl(collectionId, setId, cardId))
    .catch((error: any) => {
      console.log("EROROR image", error);
    });
};

// get Image url and add into firestore
const getImageUrl = async (
  collectionId: string,
  setId: number,
  cardId: string
) => {
  const ref = await admin.storage().bucket("default-bucket");
  const [, , meta] = await ref.getFiles({
    maxResults: 1,
  });
  const url = meta.items
    .filter((f: any) => f.contentType !== "text/plain")
    .shift().mediaLink;
  console.log("Image Url ", url);

  const collectionData: any = await firestore()
    .collection("nft_gallery")
    .doc(collectionId)
    .get();
  console.log("collectionData--- ", collectionData.data());
  const collection = collectionData.data();
  const setDetails = collection.setDetails.find((data: any) => {
    console.log("data.id, setId", data.id, setId);
    return data.id == setId;
  });
  console.log("setDeatils --- ", setDetails);
  const cardData = setDetails.cards.find((item: any) => {
    console.log("data.id, setId", item.id, cardId);
    return item.cardId == cardId;
  });
  cardData.imageUpload = url;

  await firestore()
    .collection("nft_gallery")
    .doc(collectionId)
    .set(collectionData);

  return url;
  // const ntfGallery = await firestore()
  //   .collection("nft_gallery")
  //   .doc('SWnA6wLlv9bPVRIlHKHY')

  // // Atomically add a new region to the "regions" array field.
  // ntfGallery.update({
  //   regions: firestore.FieldValue.arrayUnion("greater_virginia")
  // });
};
