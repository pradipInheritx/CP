import React from "react";
import {NotificationProps, userConverter, UserProps} from "../common/models/User";
import { User as AuthUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, functions } from "../firebase";
import { VoteResultProps } from "../common/models/Vote";
import { httpsCallable } from "firebase/functions";

export type UserContextProps = {
  userInfo?: UserProps;
  user?: AuthUser;
  setUser: (user?: AuthUser) => void;
  setUserInfo: (user?: UserProps) => void;
  votesLast24Hours: VoteResultProps[];
  setVotesLast24Hours: (votes: VoteResultProps[]) => void;
  admin?: boolean;
  setAdmin: (a: boolean) => void;
  displayName: string;
  setDisplayName: (d: string) => void;
  notifications: NotificationProps[];
  setNotifications: (notifications: NotificationProps[]) => void;
};

const FollowerContext = React.createContext({} as UserContextProps);

const observeTopics = httpsCallable(functions, "observeTopics");

// export const getFollowerInfo: (id?:string) => Promise<UserProps> = async (
//   id
// ) => {
//   if (id) {
//     const ref = doc(db, "users", id);
//     const userinfo = await getDoc<UserProps>(ref);
//     const info = userinfo.data();
//     if (info?.leader) {
//       observeTopics({ leaders: info.leader }).then(() => void 0);
//     }
//     return info || ({} as UserProps);
//   }

//   return {} as UserProps;
// };

export const getFollowerInfo = async (id?: string) => {
  // const FollowerDetails=[]
  if (id) {

    
    const ref = doc(db, "users", id);

    const userinfo = await getDoc(ref);

    
    // FollowerDetails.push(userinfo.data()) 

    // const info = userinfo.data();

    // return info;
    // if (info?.leader) {
    //   observeTopics({ leaders: info.leader }).then(() => void 0);
    // }
    // return info || ({} as UserProps);
  }

  // return FollowerDetails
}

export const saveUsername = async (uid: string, displayName: string,avatar:string) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { displayName, avatar }, { merge: true });
};


export default FollowerContext;

FollowerContext.displayName = "User";
