import React from "react";
import {TimeFrame} from "../common/models/Vote";
import {UserTypeProps} from "../common/models/UserType";
import {ProfileTabs} from "../Pages/Profile";

export type VoteRules = {
  maxVotes: number;
  givenCPM: number;
  CPMReturnSuccess: number;
  CPMReturnFailure: number;
  timeLimit:number;
};

export type CPMSettings = {
  signupReferral: number;
  pctReferralActivity: number;
  orderBookWeight: number;
};

export type AppStats = {
  totalVotes: number;
}

export type PaxData = {
  blocksGiven: number;
};

export type AppContextProps = {
  remainingTimer?:any;
  nftAlbumData: any;
  setNftAlbumData: any;
  allPariButtonTime: any;
  setAllPariButtonTime: any;
  allButtonTime:any;
  setForRun?:any;
  forRun?:any;
  setAllButtonTime:any;
  chosenUserType:string;
  setChosenUserType:(lang: string) => void;
  authStateChanged: boolean;
  timeframes: TimeFrame[];
  setTimeframes: (timeframes: TimeFrame[]) => void;
  lang: string;
  setLang: (lang: string) => void;
  voteRules: VoteRules;
  setVoteRules: (voteRules: VoteRules) => void;
  CPMSettings: CPMSettings;
  setCPMSettings: (CPMSettings: CPMSettings) => void;
  userTypes: UserTypeProps[];
  setUserTypes: (userTypes: UserTypeProps[]) => void;
  translations: Map<string, { [key: string]: string }>;
  setTranslations: (
    translations: Map<string, { [key: string]: string }>
  ) => void;
  languages: string[];
  setLanguages: (languages: string[]) => void;
  rtl: string[];
  setRtl: (rtl: string[]) => void;
  fcmToken: string;
  setFcmToken: (token: string) => void;
  login: boolean;
  setLogin: (l: boolean) => void;
  signup: boolean;
  setSignup: (s: boolean) => void;
  firstTimeLogin: boolean;
  setFirstTimeLogin: (s: boolean) => void;
  menuOpen: boolean;
  setMenuOpen: (o: boolean) => void;
  profileTab: ProfileTabs;
  setProfileTab: (s: ProfileTabs) => void;
  appStats: AppStats;
  setAppStats: (s: AppStats) => void;
  paxData: PaxData;
  setPaxData: (s: PaxData) => void;
  setLoginRedirectMessage:(s: string) => void;
                loginRedirectMessage:string;
};

const AppContext = React.createContext({} as AppContextProps);

export const getMenuItems = async () => {
  const url = `${process.env.REACT_APP_SITE_URL}wp-json/wp/v2/menu`;
  const response = await fetch(url);
  const items = await response.json();
  return JSON.stringify(Object.values(items));
};

export const getItems = () => {
  const items = JSON.parse(
    document.getElementById("menu_items")?.innerText || "[]"
  );

  return items
    .map((i: { url: any; guid: any; title: any }) => {
      const { url, guid = "" } = i;
      return url.replace(guid.replace(/\?p=\d+$/, ""), "").replace("/", "");
    })
    .filter((i: any) => i) as string[];
};

export const getTitles = () => {
  const items = JSON.parse(
    document.getElementById("menu_items")?.innerText || "[]"
  );

  return items.map((i: { url: any; guid: any; title: any }) => {
    return i.title;
  });
};

export default AppContext;

AppContext.displayName = "App";
