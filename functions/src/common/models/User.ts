import { firestore } from "firebase-admin";
import FirestoreDataConverter = firestore.FirestoreDataConverter;
// import {DictionaryKeys} from "./Dictionary";

export type UserTypeProps = {
  index: number;
  name: string;
  givenCPM: number;
  weight: number;
  color?: Colors;
  share: number;
  minVote?: number;
};

export enum Colors {
  PLATINUM = "Platinum",
  GOLD = "Gold",
  SILVER = "Silver",
}

export type UserProps = {
  uid?: string;
  paid?: boolean;
  userName?: string;
  displayName?: string;
  address?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  country?: string;
  children: string[];
  status?: UserTypeProps;
  parent?: string;
  mfa: boolean;
  voteStatistics?: VoteStatistics;
  leader?: string[];
  subscribers?: string[];
  favorites: string[];
  token?: string;
  wallet?: string;
  rewardStatistics?: RewardStatistics;
  firstTimeLogin?: boolean;
  refereeScrore?: number;
  googleAuthenticatorData?: any;
  voteValue?: number;
  lastVoteTime?: number;
  wellDAddress?: wellDAddressType;
  referalReceiveType?: referalReceiveType;
  foundationData?: any;
  isUserUpgraded?: any;
};

export type wellDAddressType = [];

export type referalReceiveType = {
  name: string;
  amount: string;
  days: string;
  limitType: string;
};

export type RewardStatistics = {
  total: number;
  claimed: number;
  cards: string[];
  extraVote: number;
  diamonds: number;
};

export type VoteStatistics = {
  total: number;
  successful: number;
  score: number;
  rank: number;
  commission: number;
  pax: number;
};

export const userConverter: FirestoreDataConverter<UserProps> = {
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): UserProps {
    const data = snapshot.data() || {};
    return data as UserProps;
  },
  toFirestore(modelObject: UserProps): FirebaseFirestore.DocumentData {
    return modelObject;
  },
};

export const userTypeConverter: FirestoreDataConverter<{
  userTypes: UserTypeProps[];
}> = {
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): {
    userTypes: UserTypeProps[];
  } {
    const data = snapshot.data() || {};
    return data as { userTypes: UserTypeProps[] };
  },
  toFirestore(modelObject: {
    userTypes: UserTypeProps[];
  }): FirebaseFirestore.DocumentData {
    return modelObject;
  },
};

export const defaultUserType = {};
// export const defaultUserType: UserTypeProps = {
//   color: Colors.SILVER,
//   givenCPM: 1,
//   index: 0,
//   name: DictionaryKeys.SPEAKER,
//   weight: 1,
//   share: 35,
//   minVote: 20,
// };

export const isAdmin: (user: string) => Promise<boolean> = async (
  user: string
) => {
  try {
    const admins = await firestore().collection("settings").doc("admins").get();
    return !!admins.data()?.admins.includes(user);
  } catch (e) {
    console.log(e);
    return false;
  }
};

