import React from "react";
import { NotificationProps, userConverter, UserProps } from "../common/models/User";
import { User as AuthUser } from "firebase/auth";
import { doc, Firestore, getDoc, setDoc } from "firebase/firestore";
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
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { displayName, /* avatar */ }, { merge: true });
};

export const saveUserData = async (uid: string, database: Firestore, data: { [key: string]: any }) => {
  let userData: { [key: string]: string } = {};
  Object.keys(data).map((value) => {
    if (data[value]) {
      userData = { ...userData, [value]: data[value] }
    }
  });
  if (uid) {
    const userRef = doc(database, "users", uid);
    await setDoc(userRef, userData, { merge: true });
  }
};

export const saveFoundation = async (uid: string, foundationName: string) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, { foundationName }, { merge: true });
};

export default UserContext;

UserContext.displayName = "User";
