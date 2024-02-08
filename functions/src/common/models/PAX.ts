import { UserProps } from "../interfaces/User.interface";
import { firestore } from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import { errorLogging } from "../helpers/commonFunction.helper"
import { paxTransactionObj } from "../interfaces/Pax.interface";
import * as constants from "../consts/payment.const.json";
import { sendPaxPendingNotification } from "./SendCustomNotification";

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
  console.log("Time stamp : ",Timestamp.now())
  const getParentPendingPaymentReference = await firestore().collection("paxTransaction").add(
    {
      ...paxTransactionData,
      isVirtual: true,
      timestamp: firestore.FieldValue.serverTimestamp(),
      status: "PENDING"
    });
  if (getParentPendingPaymentReference) {
    await sendPaxPendingNotification(paxTransactionData.userId)
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
    transactionTime: Timestamp.now(),
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
    // for (let userDetail = 0; userDetail < getUserDetails.length; userDetail++) {

    // }
    return getUserDetails;
  } catch (error) {
    return errorLogging("checkUsersWellDAddress", "Error", error)
  }
}

export const getAllPendingPaxByUserId = async (userId: string) => {
  try {
    if (!userId) return errorLogging("getAllPendingPaxByUserId", "Error", "userId is required");
    const pendingPaxList: Array<any> = []
    let sumOfPendingPax: number = 0;
    const getAllPendingPaxByUserId: any = (await firestore().collection('paxTransaction').where("userId", "==", userId).get()).docs.map((payment: any) => payment.data());
    const getAllPendingPax: Array<paxTransactionObj> = getAllPendingPaxByUserId.filter((pax: any) => pax.status == constants.PAYMENT_STATUS_PENDING && pax.isVirtual != true);
    console.log("getAllPendingPax length : ", getAllPendingPax.length)
    getAllPendingPax.forEach((payment: paxTransactionObj) => {
      pendingPaxList.push(payment);
      sumOfPendingPax += payment.currentPaxValue;
    })
    console.log("pendingPaxList : ", pendingPaxList)
    return {
      status: true,
      message: "Get all pending payments successfully",
      result: {
        pendingPaxTotal: sumOfPendingPax,
        paxList: pendingPaxList
      }
    }
  } catch (error) {
    console.error("getAllPendingPaxByUserId : Error => ", error)
    return errorLogging("getAllPendingPaxByUserId", "Error", error);
  }
}