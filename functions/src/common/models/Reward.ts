import {firestore} from "firebase-admin";
import {userConverter, UserProps} from "../models/User";


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
  const pickedPercentageArray = distribution[cmp].cardTierPickingChanceInPercent;

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

const getAllCards = (): any => async () => {
  const docs = await firestore().collection("settings").doc("cards").get();

  console.log("docs.data() --->", docs.data()?.cards);
  return docs.data()?.cards || [];
};

const pickCardTierByPercentageArray = async (percentageArr: number[]) => {
  // const cardsByTier: { [key: string]: string[] } = {
  //   Common: ["ABC", "DEF", "GHI", "JKL", "MNO"],
  //   Uncommon: ["AYF", "AKO", "BSR", "WTE", "SHT"],
  //   Rare: ["WTJ", "SAM", "QYD", "SLL", "DYJ"],
  //   Epic: ["OPD", "WNN", "CHD", "AUL", "SYI"],
  //   Legendary: ["XFL", "MHG", "FKU", "CSJ", "ZCW"],
  // };
  const cardData = await getAllCards();
  console.log("cardData --->", cardData);

  // console.log('data --->', data);
  // const cardsByTier: { [key: number]: string[] } = {
  //   1: ["ABC", "DEF", "GHI", "JKL", "MNO"],
  //   2: ["AYF", "AKO", "BSR", "WTE", "SHT"],
  //   3: ["WTJ", "SAM", "QYD", "SLL", "DYJ"],
  //   4: ["OPD", "WNN", "CHD", "AUL", "SYI"],
  //   5: ["XFL", "MHG", "FKU", "CSJ", "ZCW"],
  // };

  const cardsByTier: { [key: string]: string[] } = {};
  interface cardType {
    cardList: string[],
    tierName : string
  }

  cardData.map((e : cardType) => {
    cardsByTier[e.tierName] = e.cardList;
  });


  const randomIndex = Math.floor(Math.random() * percentageArr.length);
  const selectedTier = percentageArr[randomIndex];
  const selectedCardTier = Object.keys(cardsByTier)[selectedTier];
  const pickedTierArray = cardsByTier[selectedCardTier];
  return {tierName: selectedCardTier, pickedTierArray};
};

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
  user: string, winData: winRewardData, winningTime: number
) => Promise<void> = async (user: string, winData: winRewardData, winningTime: number) => {
  console.log("Beginning execution addRewardTransaction function");
  const obj: RewardTransaction = {
    user,
    winningTime,
    winData,
    transactionTime: firestore.FieldValue.serverTimestamp(),
  };
  await firestore().collection("reward_transactions").doc().set(obj);
  console.log("Finished execution addRewardTransaction function");
};


export const claimReward: (
  uid: string
) => { [key: string]: any } = async (uid: string) => {
  console.log("Beginning execution claimReward function");
  const userRef = firestore()
      .collection("users")
      .doc(uid)
      .withConverter(userConverter);

  const userProps = await userRef.get();
  const userData = userProps.data();

  const {total, claimed} = userData?.rewardStatistics || {total: 0, claimed: 0};

  if ((total - claimed) > 0) {
    const cmp = (claimed + 1) * 100 > 1000 ? 1000 : (claimed + 1) * 100;
    const tierPickupArray = createArrayByPercentageForPickingTier(cmp);
    const {pickedTierArray, tierName} = await pickCardTierByPercentageArray(tierPickupArray);
    const firstRewardCard = pickRandomValueFromArray(pickedTierArray);
    const secondRewardExtraVotes = getRandomNumber(distribution[cmp].extraVotePickFromRange);
    const thirdRewardDiamonds = getRandomNumber(distribution[cmp].diamondsPickFromRange);
    const rewardObj = userData?.rewardStatistics || {total: 0, claimed: 0, cards: [], extraVote: 0, diamonds: 0};
    rewardObj.claimed += 1;
    rewardObj?.cards?.length ? rewardObj.cards.push(firstRewardCard) : rewardObj.cards = [firstRewardCard];
    rewardObj?.extraVote ? rewardObj.extraVote += secondRewardExtraVotes : rewardObj.extraVote = secondRewardExtraVotes;
    rewardObj?.diamonds ? rewardObj.diamonds += thirdRewardDiamonds : rewardObj.diamonds = thirdRewardDiamonds;

    await firestore()
        .collection("users")
        .doc(uid)
        .set({rewardStatistics: rewardObj}, {merge: true});

    const winData: winRewardData = {
      firstRewardCardType: tierName,
      firstRewardCard,
      secondRewardExtraVotes,
      thirdRewardDiamonds,
    };
    await addRewardTransaction(uid, winData, claimed + 1);
    console.log("Finished execution claimReward function");
    return winData;
  }
  console.log("Finished execution claimReward function");
  return {
    firstRewardCard: "",
    secondRewardExtraVotes: 0,
    thirdRewardDiamonds: 0,
  };
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
  firstRewardCardType: string,
  firstRewardCard: string,
  secondRewardExtraVotes: number,
  thirdRewardDiamonds: number
}


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
        .set({
          rewardStatistics: {
            total: newReward,
            claimed: claimedUpdated,
          },
        }, {merge: true});

    console.log("Finished execution addReward function");
    return;
  }
};
