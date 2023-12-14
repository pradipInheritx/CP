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

const UserContext = React.createContext({} as UserContextProps);

const observeTopics = httpsCallable(functions, "observeTopics");

export const getUserInfo: (user?: AuthUser) => Promise<UserProps> = async (
  user
) => {
  if (user?.uid) {
    const ref = doc(db, "users", user?.uid).withConverter(userConverter);
    const userinfo = await getDoc<UserProps>(ref);
    const info = userinfo.data();
    if (info?.leader) {
      observeTopics({ leaders: info.leader }).then(() => void 0);
    }
    return info || ({} as UserProps);
  }

  return {} as UserProps;
};

export const saveUsername = async (uid: string, displayName: string, avatar: string) => {
  console.log("i am working name")
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { userName: displayName, /* avatar */ }, { merge: true });
};
export const saveDisplayName = async (uid: string, displayName: string, avatar: string) => {
  console.log("i am working name 2")
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { displayName, /* avatar */ }, { merge: true });
};

export const saveFoundation = async (uid: string, foundationName: string) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { foundationName }, { merge: true });
};

export default UserContext;

UserContext.displayName = "User";
