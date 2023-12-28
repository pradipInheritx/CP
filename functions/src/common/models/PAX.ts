import { UserProps } from "./User";
import { firestore } from "firebase-admin";
import { errorLogging } from "../helpers/commonFunction.helper"

export const shouldHaveTransaction: (
  before: UserProps,
  after: UserProps
) => [boolean, number | undefined] = (before: UserProps, after: UserProps) => {
  const changed =
    (after.voteStatistics?.score || 0) > (before.voteStatistics?.score || 0);

  if (!changed) {
    return [false, undefined];
  }

  const divisionBefore = Math.floor((before.voteStatistics?.score || 0) / 100);
  const divisionAfter = Math.floor((after.voteStatistics?.score || 0) / 100);
  if (divisionAfter <= divisionBefore) {
    return [false, undefined];
  }

  return [
    true,
    (after.voteStatistics?.score || 0) - (before.voteStatistics?.score || 0),
  ];
};

export enum CpmTransactionType {
  REWARD = "reward",
}

export enum PaxTransactionType {
  MINT = "mint",
}

export const addPaxTransactionWithPendingStatus = async (paxTransactionData: any) => {
  const getParentPendingPaymentReference = await firestore().collection("paxTransaction").add({ ...paxTransactionData, timestamp: firestore.FieldValue.serverTimestamp(), status: "PENDING" });
  if (getParentPendingPaymentReference) {
    return {
      status: true,
      result: getParentPendingPaymentReference
    }
  } else {
    return {
      status: false,
      result: getParentPendingPaymentReference
    }
  }
};

export enum PaxTransactionStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  DONE = "done",
}

export type CpmTransaction = {
  type: CpmTransactionType;
  user: string;
  amount: number;
  transactionTime: firestore.FieldValue;
  blocks: number;
  totalBlocksGivenUntilNow: number;
};

export const TotalBlocks = 21 * Math.pow(10, 6);
export const InitialBlockReward = 50;

export type PaxData = {
  blocksGiven: number;
};

export const addCpmTransaction: (
  user: string,
  amount: number
) => Promise<void> = async (user: string, amount: number) => {
  const paxData = await firestore().collection("settings").doc("paxData").get();
  const obj: CpmTransaction = {
    amount,
    type: CpmTransactionType.REWARD,
    blocks: Math.floor(amount / 100),
    totalBlocksGivenUntilNow: paxData.data()?.blocksGiven || 0,
    transactionTime: firestore.FieldValue.serverTimestamp(),
    user,
  };
  await firestore().collection("cpm_transactions").doc().set(obj);
};

export type PaxTransaction = {
  type: PaxTransactionType;
  status: PaxTransactionStatus;
  time: firestore.FieldValue;
  amount: number;
  user: string;
  address?: string;
};

export const getPendingPaxTransaction = async () => {
  try {
    const getPax = (await firestore().collection("paxTransaction").where("status", "==", "PENDING").get()).docs.map((transaction: any) => transaction.data());
    console.log("getPax : ", getPax);
    if (!getPax) {
      return errorLogging("getPendingPaxTransaction", "Error", "No pending transaction available")
    }
    return {
      status: true,
      message: "Pending transaction successfully",
      result: getPax
    }
  } catch (error) {
    return errorLogging("getPendingPaxTransaction", "Error", error)
  }
}
export const checkUsersWellDAddress = async (userIds: any) => {
  try {
    const getUserDetails = [];
    for (let index = 0; index < userIds.length; index++) {
      const getUser: any = (await firestore().collection("users").doc(userIds[index]).get()).data();
      if (getUser?.paxAddress && getUser?.paxAddress.address) {
        getUserDetails.push(getUser)
      }
    }
    console.log("getUserDetails : ", getUserDetails);
    return getUserDetails;
  } catch (error) {
    return errorLogging("checkUsersWellDAddress", "Error", error)
  }
}