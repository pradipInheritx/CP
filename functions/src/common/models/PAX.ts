import { UserProps } from "./User";
import { firestore } from "firebase-admin";

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


// export const addPaxTransactionWithPendingStatus = async (paxTransaction: any) => {

// };


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

