import { firestore } from "firebase-admin";
// import * as admin from "firebase-admin";
// import { getStorage, getDownloadURL,ref } from "firebase/storage"
// import path from "path";
import { userConverter, UserProps } from "../models/User";
import { toArray } from "lodash";
import { sendNotificationForCpm } from "./SendCustomNotification";
import { getCardDetails } from "./Admin/Rewards";
import {
  addPaxTransactionWithPendingStatus
} from "../models/PAX";

import axios from "axios";
import * as parentConst from "../consts/payment.const.json";
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

// get all reward transactions by card id
async function getRewardTransactionsByCardId(cardId: string) {
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
  console.log("getMultipleUsersByUserIds............", userIds);

  const queryPromises = userIds.map(user => {
    return firestore().collection('users')
      .where('uid', '==', user)
      .get();
  });

  const querySnapshots = await Promise.all(queryPromises);

  const users: any[] = [];

  querySnapshots.forEach(querySnapshot => {
    querySnapshot.docs.forEach(doc => {
      const documentData = doc.data() as any;
      users.push(documentData);
    });
  });


  console.log("USER >>>>>>>>", users);
  return users;
}


async function selectPickedTierArray(cardTier: string) {
  const cardsArrayByTier: any[] = []
  const cardTierArrQuery = await firestore().collection('cardsDetails').where('cardType', '==', cardTier).get();
  cardTierArrQuery.docs.map((cardData: any) => {
    let card = cardData.data();
    cardsArrayByTier.push({
      cardId: cardData.id,
      albumId: card.albumId,
      cardName: card.cardName,
      cardType: card.cardType,
      quantity: card.quantity,
      noOfCardHolders: card.noOfCardHolders,
      totalQuantity: card.totalQuantity,
      cardStatus: card.cardStatus
    });
  })
  return cardsArrayByTier
}

function getRandomSelectedTier(percentageArr: any): string {
  const cardsTierArr: any = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'];
  const randomIndex = Math.floor(Math.random() * percentageArr.length);
  console.log("RANDOM INDEX", randomIndex);

  const selectedTierFromPercentagArr = percentageArr[randomIndex];
  console.log("SELECTED TIER", selectedTierFromPercentagArr);
  return cardsTierArr[selectedTierFromPercentagArr]
}

const pickCardTierByPercentageArray = async (percentageArr: number[]) => {
  try {
    const selectCardType = await getRandomSelectedTier(percentageArr);
    console.log('Select card Tier : ', selectCardType);
    const pickedTierArray = await selectPickedTierArray(selectCardType);
    console.log('picked tier array : ', pickedTierArray);
    return pickedTierArray;
  } catch (error) {
    console.info("ERROR:", "pickCardTierByPercentageArray", error)
    return [];
  }
};


const getRandomNumber = (range: number[]): number => {
  const [min, max] = range;
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const addRewardTransaction: (
  user: string,
  winData: winRewardData,
  winningTime: number
) => Promise<any> = async (
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
    return obj;
  };

function cardQuantityOver() {
  return {
    status: false,
    message: "All cards quaunity is over",
    result: null,
  };
}

export const getPickRandomValueFromArrayFunc: any = async (cardTierArray: any) => {
  console.log("CARD_TIER_ARRAY_LENGTH_1 : ", cardTierArray.length)
  if (cardTierArray.length === 0) return cardQuantityOver();
  // generate a random index
  const randomIndex = Math.floor(Math.random() * cardTierArray.length);

  // use the random index to access a random element from the array
  const getFirstRewardCardObj: any = cardTierArray[randomIndex]
  console.log("getFirstRewardCardObj-----", getFirstRewardCardObj)

  let returnValue;
  if (getFirstRewardCardObj.quantity === 0 || getFirstRewardCardObj.noOfCardHolders === getFirstRewardCardObj.totalQuantity ||
    getFirstRewardCardObj?.cardStatus?.toLowerCase() != "active"
  ) {
    cardTierArray.filter((card: any, index: number) => {
      if (card.cardId === getFirstRewardCardObj.cardId) cardTierArray.splice(index, 1);
    })
    returnValue = await getPickRandomValueFromArrayFunc(cardTierArray);
  } else {
    console.log("getFirstRewardCardObj final return-----", getFirstRewardCardObj)
    returnValue = getFirstRewardCardObj
  }
  return returnValue;
}

const pickRandomValueFromArray = (arr: string[]): string => {
  // generate a random index
  const randomIndex = Math.floor(Math.random() * arr.length);

  // use the random index to access a random element from the array
  const randomElement = arr[randomIndex];
  return randomElement;
};

const getVirtualRewardStatisticsByUserId = async (uid: string) => {
  const getVirtualRewardStatisticsQuery = await firestore().collection('virtualRewardStatistics').where('userId', '==', uid).get();
  const getVirtualRewardStatistics = getVirtualRewardStatisticsQuery.docs.map((reward) => reward.data());
  console.log("getVirtualRewardStatistics : ", getVirtualRewardStatistics)
  return getVirtualRewardStatistics[0];
}

export const claimReward: (uid: string, isVirtual: boolean
) => { [key: string]: any } = async (
  uid: string,
  isVirtual: boolean,
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
      if (isVirtual === true) {
        const checkUserDataExist = await getVirtualRewardStatisticsByUserId(uid);
        if (checkUserDataExist) return checkUserDataExist.winData;
      }
      // add reward_transaction here
      if (isVirtual === false && total - claimed > 0) {
        const getVirtualRewardStatistic = await getVirtualRewardStatisticsByUserId(uid);
        console.log("getVirtualRewardStatistic : ", getVirtualRewardStatistic)
        // update the reward in User data
        await firestore().collection("users").doc(uid).set({ rewardStatistics: getVirtualRewardStatistic.rewardObj }, { merge: true });
        // add reward details into reward_transaction collection
        const result = await addRewardTransaction(uid, getVirtualRewardStatistic.winData, claimed + 1);
        await firestore().collection('virtualRewardStatistics')
          .doc(getVirtualRewardStatistic.rewardId)
          .delete()
          .then(() => console.log(`${getVirtualRewardStatistic.rewardId} is deleted successfully`))
          .catch((error) => { console.error(`Error removing ${getVirtualRewardStatistic.rewardId} document: ${error}`); });
        console.log("isVirtual Result : ", result)
        return result.winData;
      }


      if (total - claimed > 0) {

        // ----- Start preparing reward data -----
        const cmp = (claimed + 1) * 100 > 1000 ? 1000 : (claimed + 1) * 100;
        const tierPickupArray = createArrayByPercentageForPickingTier(cmp);
        const pickedTierArray = await pickCardTierByPercentageArray(tierPickupArray);
        console.log("pickedTierArray : ", tierPickupArray);

        const firstRewardCardObj: any = await getPickRandomValueFromArrayFunc(pickedTierArray);
        console.log("FIRST REWARD OBJ==>", firstRewardCardObj);

        if (firstRewardCardObj?.cardStatus?.toLowerCase() != "active") return firstRewardCardObj;

        console.log("firstRewardCard.cardId --", firstRewardCardObj.cardId);

        const secondRewardExtraVotes = getRandomNumber(
          distribution[cmp].extraVotePickFromRange
        );
        const thirdRewardDiamonds = getRandomNumber(
          distribution[cmp].diamondsPickFromRange
        );

        // get the transaction details
        const transData: any = (await firestore()
          .collection("reward_transactions")
          .where("winData.firstRewardCardId", "==", firstRewardCardObj.cardId)
          .get()).docs.map((reward) => reward.data());
        console.log("TRANSDATA length: ", transData.length);
        console.log("TRANSDATA : ", transData);

        const userIds = transData.map((item: any) => item.user);
        console.log("userID ", userIds)
        console.log("userID length : ", userIds.length);
        // ----- End preparing reward data -----


        // ----- Start manipulate reward data for update and set-----
        const rewardObj: any = userData?.rewardStatistics ? {
          claimed: userData?.rewardStatistics.claimed,
          cards: userData?.rewardStatistics.cards,
          extraVote: userData?.rewardStatistics.extraVote,
          diamonds: userData?.rewardStatistics.diamonds
        } : {
          total: 0,
          claimed: 0,
          cards: [],
          extraVote: 0,
          diamonds: 0,
        };

        console.log("user rewardStatistics ......", rewardObj);

        // get the selected card details
        const getRewardCardDetails: any = await getCardDetails(firstRewardCardObj.cardId);

        rewardObj.claimed += 1;
        rewardObj?.cards?.length
          ? rewardObj.cards.push(getRewardCardDetails.cardName)
          : (rewardObj.cards = [getRewardCardDetails.cardName]);
        rewardObj?.extraVote
          ? (rewardObj.extraVote += secondRewardExtraVotes)
          : (rewardObj.extraVote = secondRewardExtraVotes);
        rewardObj?.diamonds
          ? (rewardObj.diamonds += thirdRewardDiamonds)
          : (rewardObj.diamonds = thirdRewardDiamonds);
        console.log("rewardObj......", rewardObj);


        //Select random serial number from card
        const firstRewardCardSerialNo = getRewardCardDetails.sno.length ? pickRandomValueFromArray(
          getRewardCardDetails["sno"]
        ) : ""; // Added this condition because somnetimes sno is blank

        // remove the Serial number from the card
        getRewardCardDetails.sno = getRewardCardDetails.sno.filter(
          (item: any) => item != firstRewardCardSerialNo
        );

        // update the card quantity in card collection
        getRewardCardDetails.quantity = getRewardCardDetails.sno.length;

        const winData: winRewardData = {
          firstRewardCardType: getRewardCardDetails.cardType,
          firstRewardCardId: firstRewardCardObj.cardId,
          firstRewardCard: getRewardCardDetails.cardName,
          firstRewardCardCollection: getRewardCardDetails.albumName,
          firstRewardCardSerialNo,
          firstRewardCardImageUrl: getRewardCardDetails.cardImageUrl,
          firstRewardCardVideoUrl: getRewardCardDetails.cardVideoUrl,
          secondRewardExtraVotes,
          thirdRewardDiamonds,
        };


        // ----- End manipulate reward data for update and set-----


        // ----- Start set and Update reward data into virtual collection-----

        if (userIds && userIds.length) {
          console.info("Before  getRewardCardDetails.noOfCardHolders : ", getRewardCardDetails.noOfCardHolders)
          getRewardCardDetails.noOfCardHolders = Array.from(new Set(userIds)).length;
          console.info("After  getRewardCardDetails.noOfCardHolders : ", getRewardCardDetails.noOfCardHolders)
          await firestore()
            .collection("cardsDetails")
            .doc(firstRewardCardObj.cardId)
            .set(getRewardCardDetails, { merge: true });
        }

        // add data into virtual collection
        const addQuery = await firestore().collection('virtualRewardStatistics').add({ userId: uid, rewardObj, winData });
        console.log("addQuery ID  : ", addQuery.id);

        await firestore().collection('virtualRewardStatistics').doc(addQuery.id).set({ rewardId: addQuery.id }, { merge: true });

        console.log("Finished execution claimReward function");
        return winData;
        // ----- End set and Update reward data into virtual collection-----

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

export const sendMintForPaxToAdmin = async (paxDistributionToUser: any) => {
  try {
    console.info("Get paxDistributionToUser For Admin", paxDistributionToUser);

    console.log("Start Smart Contract Function For Admin Mint For");

    const options = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjowLCJvcmdfaWQiOjUsImlzcyI6IldFTExEQVBQIiwic3ViIjoibWFuYWdlLnBheGJlcDIwIiwiYXVkIjpbIkdST1VQUyIsIkFQUExJQ0FUSU9OUyIsIkFVVEgiLCJXRUIzIl0sImV4cCI6MjA1MDI1MTY2MX0.2WUhJ_lwgWaBB3lI7dYaLoZGJCBeOQZkV5TgDy0BLVI", // For Smart Contract Prod VoteToEarn
      },
    };

    const transactionBodyForSmartContractOnAdminMintFor: any = {
      "abi": parentConst.SMART_CONTRACT_ABI_ARRAY_FOR_MINT,
      "address": parentConst.SMART_CONTRACT_ADMIN_ADRESS_LIVE,
      "gas_limit": parentConst.SMART_CONTRACT_GAS_LIMIT_FOR_MINT,
      "method": parentConst.SMART_CONTRACT_METHOD_MINT_FOR,
      "network": parentConst.PAYMENT_BNB_MINT_FOR_NETWORK_NAME,
      "params": [
        {
          "_to": parentConst.SMART_CONTRACT_ADMIN_ADRESS_FOR_MINT, //This is the admin address for PAX receive //paxDistributionToUser.mintForUserAddress,
          "_amount": paxDistributionToUser.currentPaxValue,
          "_gas": parentConst.SMART_CONTRACT__GAS
        },
      ],
    };
    console.info("transactionBodyForSmartContractOnAdminMintFor", transactionBodyForSmartContractOnAdminMintFor);

    const transaction = await axios.post("https://console.dev.welldapp.io/api/callSmartContract", transactionBodyForSmartContractOnAdminMintFor, options);

    if (transaction.data) {
      //paxDistributionToUser.userId
    }

    console.log("End smart contract payment function in admin", transaction);

    return { status: true, result: transaction.data };
  } catch (error) {
    return { status: false, result: { message: `Something went wrong while process the mint for admin ${error}` } };
  }
}


export const sendMintForPaxToUser = async (paxDistributionToUser: any) => {
  try {
    console.info("Get paxDistributionToUser For User", paxDistributionToUser);

    console.log("Start Smart Contract Function For User Mint For");

    if (!paxDistributionToUser.mintForUserAddress) {
      console.info("Need To Store For PAX Pending Transaction For User Due To BNB Address")
      await addPaxTransactionWithPendingStatus(paxDistributionToUser);
      return {
        status: false,
        message: "User mint for address is not available for receive the pax"
      }
    }

    const options = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjowLCJvcmdfaWQiOjUsImlzcyI6IldFTExEQVBQIiwic3ViIjoibWFuYWdlLnBheGJlcDIwIiwiYXVkIjpbIkdST1VQUyIsIkFQUExJQ0FUSU9OUyIsIkFVVEgiLCJXRUIzIl0sImV4cCI6MjA1MDI1MTY2MX0.2WUhJ_lwgWaBB3lI7dYaLoZGJCBeOQZkV5TgDy0BLVI", // For Smart Contract Prod VoteToEarn
      },
    };

    const transactionBodyForSmartContractOnUserMintFor: any = {
      "abi": parentConst.SMART_CONTRACT_ABI_ARRAY_FOR_MINT,
      "address": parentConst.SMART_CONTRACT_ADMIN_ADRESS_LIVE,
      "gas_limit": parentConst.SMART_CONTRACT_GAS_LIMIT_FOR_MINT,
      "method": parentConst.SMART_CONTRACT_METHOD_MINT_FOR,
      "network": parentConst.PAYMENT_BNB_MINT_FOR_NETWORK_NAME,
      "params": [
        {
          "_to": paxDistributionToUser.mintForUserAddress, //This is the user pax address for PAX receive
          "_amount": paxDistributionToUser.currentPaxValue,
          "_gas": parentConst.SMART_CONTRACT__GAS
        },
      ],
    };
    console.info("transactionBodyForSmartContractOnUserMintFor", transactionBodyForSmartContractOnUserMintFor);

    const transaction = await axios.post("https://console.dev.welldapp.io/api/callSmartContract", transactionBodyForSmartContractOnUserMintFor, options);

    console.log("End smart contract payment function in admin", transaction);

    if (transaction.data) {
      const user: any = (await firestore().collection("users").doc(paxDistributionToUser.userId).get()).data();
      console.log("user : ", user?.uid, " paxEarned : ", user?.paxEarned);
      const paxEarned = user?.paxEarned + paxDistributionToUser.currentPaxValue;
      await firestore().collection("users").doc(paxDistributionToUser.userId).set({
        paxEarned
      }, { merge: true })
    }

    return { status: true, result: transaction.data };
  } catch (error) {
    return { status: false, result: { message: `Something went wrong while process the mint for user ${error}` } };
  }
}

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
  firstRewardCardImageUrl: string;
  firstRewardCardVideoUrl: string;
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
    console.log("Send the block complete notification : ", userId);
    await sendNotificationForCpm(userId); // For Send Notification
    console.log("Finished execution addReward function");
    return;
  }
};

// User listing for a particular card holders
export const cardHolderListing: (cardId: string) => {
  [key: string]: any;
} = async (cardId: string) => {
  const transData: {
    winData: {
      firstRewardCard: string;
      firstRewardCardCollection: string;
      firstRewardCardId: string;
      firstRewardCardSerialNo: string;
      firstRewardCardType: string;
      secondRewardExtraVotes: number;
      thirdRewardDiamonds: number;
    };
    user: string;
  }[] = await getRewardTransactionsByCardId(cardId);
  console.log("transData cardHolderListing---", transData);
  let userIds: any = transData.map((item: any) => item.user);
  userIds = new Set(userIds);
  let userList = toArray(userIds)
  console.log("users map cardHolderListing---", userList);
  const users: any = await getMultipleUsersByUserIds(userList);
  // console.log("users cardHolderListing---", users)
  return users;
};
