import {firestore} from "firebase-admin";
import { paginate, queryParams } from ".././helpers/commonFunction.helper";
import FirestoreDataConverter = firestore.FirestoreDataConverter;
const _ = require("lodash");
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
  displayName?: string;
  address?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
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
  foundationName?: string;
  createdAt?:number;
  updatedAt?:number;
  lastLoginTime?:number;
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

export async function getAllUsers({ pageNumber, limit, sortBy, search }: queryParams) {
  let array = await getAllUsersData();
  console.log("array---",array)

  // Sort by any field of users collection
  if (sortBy) {
    let parts = sortBy.split(':');
    let sortByField = parts[0];
    let sortOrder = parts[1];
    array = _.orderBy(array, sortByField, sortOrder);
  }

  // Pagination implemented
  if (pageNumber && limit) {
    array = paginate(array, limit, pageNumber);
  }

  // Search on firstName, lastName or email
  if (search) {
    array = array.filter(( item:any ) =>{ return item.firstName == search 
      || item.lastName == search 
      || item.displayName == search 
      || item.email == search
    });
    // array.
    // return { data: array, totalUsers: array.length };
  }

  const finalUserResponse : any = array.map((item:any) => {
    return {
      firstName: item.firstName,
      lastName: item.lastName,
      userName: item.displayName,
      email: item.email,
      status: 1, // Currently keeping 1 = Active By default. will change to dynamic later
      memberType: item.status?.name ? item.status.name : "",
      paid: item.paid
    }
  })
  console.log("finalUserResponse---",finalUserResponse, "length---",finalUserResponse.length)
  return { data: finalUserResponse, totalUsers: finalUserResponse.length };
}

// get collection data by document id
async function getUserDetailsById(uid: any) {
  const collectionData = await firestore()
      .collection("users")
      .doc(uid)
      .get();
  return collectionData.data();
}

// get collection data by document id
async function getAllUsersData() {
  let users = await firestore().collection("users").get();
  let array: any = [];
  users.forEach(( item:any ) => {
    array.push(item.data());
  });
  return array;
}

export const getUserDetails: (
  uid: string
) => { [key: string]: any } = async (uid: string) => {
  const user:any = await getUserDetailsById(uid);

  // Finding parent of the user
  let allUsers = await getAllUsersData();
  const parent:any = allUsers.find((item:any) => {
    return item.children?.length && item.children.includes(uid);
  })

  return {
    "userId": user.uid,
    "userName": user.displayName,
    "address": user.address,
    "firstName": user.firstName,
    "lastName": user.lastName,
    "email": user.email,
    "avatar": user.avatar,
    "phone": user.phone,
    "country": user.country,
    "status": 1,
    "parent": {
      "id": parent.uid,
      "username": parent.displayName,
      "firstName": parent.firstName,
      "lastName": parent.lastName
    },
    "uniqueRefferalLink": "",
    "noOfChildren": user.children.length,
    "foundationName": user.foundationName,
    "registrationTime": user.createdAt,
    "lastLoginTime": user.lastLoginTime,
    "plan": user.paid ? "Miner Voting Pass" : "Free Voting Pass"
  }
}