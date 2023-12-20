import { userConverter, UserProps } from "./User";
import { firestore, messaging } from "firebase-admin";
import { uniq } from "lodash";
import { Change } from "firebase-functions/v1";
import { QueryDocumentSnapshot } from "firebase-functions/v1/firestore";
import { sendNotification } from "./Subscribe";

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

// Halving
export const getCurrentPaxReward: (
  totalBlocksGivenUntilNow: number
) => number = (totalBlocksGivenUntilNow: number) => {
  const level = Math.floor(totalBlocksGivenUntilNow / (TotalBlocks / 100));
  return InitialBlockReward / Math.pow(2, level);
};

export type PaxTransaction = {
  type: PaxTransactionType;
  status: PaxTransactionStatus;
  time: firestore.FieldValue;
  amount: number;
  user: string;
  address?: string;
};

export const createPaxTransaction: (
  transaction: CpmTransaction
) => Promise<void> = async (transaction: CpmTransaction) => {
  const { totalBlocksGivenUntilNow, user } = transaction;
  const amount =
    transaction.blocks * getCurrentPaxReward(totalBlocksGivenUntilNow);

  const obj: PaxTransaction = {
    amount,
    status: PaxTransactionStatus.PENDING,
    time: firestore.FieldValue.serverTimestamp(),
    type: PaxTransactionType.MINT,
    user,
  };

  await firestore().collection("pax_transactions").doc().set(obj);
};

export const checkPendingTransactions: () => Promise<void> = async () => {
  const pendings = (
    await firestore()
      .collection("pax_transactions")
      .where("status", "==", PaxTransactionStatus.PENDING)
      .get()
  ).docs as unknown as PaxTransaction[];
  const users = uniq(pendings.map((pending) => pending.user));

  for (const user of users) {
    const userObj = await firestore()
      .collection("users")
      .doc(user)
      .withConverter(userConverter)
      .get();

    const { token } = userObj.data() || {};
    if (!token) return;

    await sendNotificationForPending(
      pendings.filter((pending) => pending.user === user),
      token,
      userObj.id
    );
  }
};

export const sendNotificationForPending: (
  pending: PaxTransaction[],
  token: string,
  id: string
) => Promise<void> = async (pending: PaxTransaction[], token: string, id) => {
  const totalPendingPax = pending.reduce((total, current) => {
    total += current.amount;
    return total;
  }, 0);

  const body = `You have ${totalPendingPax} pending PAX, please enter your wallet address in order to mint them`;

  const message: messaging.Message = {
    token,
    notification: {
      title: "Action required",
      body,
    },
    webpush: {
      headers: {
        Urgency: "high",
      },
      fcmOptions: {
        link: "#", // TODO: put link
      },
    },
  };

  await sendNotification({
    token,
    message,
    body,
    title: "Action required",
    id,
  });
};

export const onEnteringAddress: (
  snapshot: Change<QueryDocumentSnapshot>
) => Promise<void> = async (snapshot: Change<QueryDocumentSnapshot>) => {
  const after = snapshot.after.data() as UserProps;

  if (after.address) {
    const pendings = (
      await firestore()
        .collection("pax_transactions")
        .where("user", "==", snapshot.after.id)
        .where("status", "==", PaxTransactionStatus.PENDING)
        .get()
    ).docs;

    const batch = firestore().batch();

    for (const pending of pendings) {
      await updateProcessing(batch, pending, after);
    }

    await batch.commit();
  }
};

export const updateProcessing: (
  batch: FirebaseFirestore.WriteBatch,
  transaction: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>,
  userProps?: UserProps
) => Promise<void> = async (
  batch: firestore.WriteBatch,
  transaction: firestore.QueryDocumentSnapshot<firestore.DocumentData>,
  userProps?: UserProps
) => {
    const { paid, address } = userProps || {};
    if (!(paid && address)) {
      return;
    }

    await processTransaction(address, transaction.data() as PaxTransaction);
    await batch.set(
      transaction.ref,
      { status: PaxTransactionStatus.PROCESSING, address },
      { merge: true }
    );
  };

export const shouldUpdateTransactions: (
  before: UserProps,
  after: UserProps
) => Promise<boolean> = async (before: UserProps, after: UserProps) => {
  const changed = after.address != before.address;

  if (!changed) {
    return false;
  }

  return await validateAddress(after.address);
};

export const validateAddress: (
  address: string | undefined
) => Promise<boolean> = (address: string | undefined) => {
  return Promise.resolve(true);
};

// TODO: request binance chain request of send pax to address
export const processTransaction: (
  address: string,
  transaction: PaxTransaction
) => Promise<never> = async (address: string, transaction: PaxTransaction) => {
  return Promise.reject(new Error("Not implemented"));
};

export const updateAndGetPaxDistribution: (
  pax: any
) => Promise<void> = async (pax: any) => {


  await firestore().collection("settings").doc().collection("Pax");
};