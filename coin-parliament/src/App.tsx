/** @format */

import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import UserContext, { getUserInfo, saveDisplayName, saveUsername } from "./Contexts/User";
// import FollowerContext, { getFollowerInfo } from "./Contexts/FollowersInfo";
import { texts } from './Components/LoginComponent/texts'
import { NotificationProps, UserProps } from "./common/models/User";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { toast, ToastContainer, Zoom } from "react-toastify";
import Home from "./Pages/Home";
import Profile, { ProfileTabs } from "./Pages/Profile";
import FollowerProfile, { FollowerProfileTabs } from "./Pages/FollowerProfile";
import Header from "./Components/Header";
import NotificationContext, { ToastType } from "./Contexts/Notification";
import CoinsContext, { Leader, Totals } from "./Contexts/CoinsContext";
import SingleCoin from "./Pages/SingleCoin";
import {
  Coin,
  DBCoin,
  DBPair,
  formatCurrency,
  getAllCoins,
  getCoins,
  precision,
  saveAllCoins,
  // saveCoins,
} from "./common/models/Coin";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db, firestore, functions, messaging } from "./firebase";
import Admin from "./Pages/Admin";
import { GetVotesResponse, TimeFrame, VoteResultProps } from "./common/models/Vote";
import AppContext, {
  AppStats,
  CPMSettings,
  PaxData,
  VoteRules,
} from "./Contexts/AppContext";
import isNumber from "lodash/isNumber";
import {
  defaultUserType,
  UserTypeProps,
  validateTotalShare,
} from "./common/models/UserType";
import ManagersContext from "./Contexts/ManagersContext";
import CPMSettingsManager from "./managers/CPMSettingsManager";
import VoteRulesManager from "./managers/VoteRulesManager";
import TimeframesManager from "./managers/TimeframesManager";
import UserTypeManager from "./managers/UserTypeManager";
import CoinMain from "./Pages/CoinMain";
import firebase from "firebase/compat/app";
import PairsMain from "./Pages/PairsMain";
import SinglePair from "./Pages/SinglePair";
import { ENGLISH, translations } from "./common/models/Dictionary";
import { getKeyByLang, getLangByKey } from "./common/consts/languages";
import { getToken } from "firebase/messaging";
import { Form, ListGroup } from "react-bootstrap";
import { rest } from "./common/models/Socket";
import { httpsCallable } from "firebase/functions";
import ContentContext, { ContentPage } from "./Contexts/ContentContext";
import Content from "./Pages/Content";
import LoginAndSignup from "./Components/LoginComponent/LoginAndSignup";
import GenericLoginSignup from "./Components/GenericSignup/GenericLoginSignup";
import {
  LoginAuthProvider,
  LoginRegular,
  Logout,
  SignupRegular,
} from "./common/models/Login";
import FirstTimeLogin from "./Components/LoginComponent/FirstTimeLogin";
import { generateUsername } from "./common/utils/strings";
import { intersection } from "lodash";
import Logo, { Size } from "./Components/Atoms/Logo";
import {
  AppContainer,
  getSubdomain,
  HomeContainer,
  isV1,
} from "./Components/App/App";
import Influencers from "./Pages/Influencers";
import NFTGallery from "./Pages/NFTGallery";
import NFTGalleryType from "./Pages/NFTGalleryType";
import Footer from "./Components/Footer";
import PersonalInfo from "./Components/Profile/PersonalInfo";
import Security from "./Components/Profile/Security";
import Mine from "./Components/Profile/Mine";
import Follow from "./Components/Profile/Follow";
import Pool from "./Components/Profile/Pool";
import { useWindowSize } from "./hooks/useWindowSize";
import Votes from "./Components/Profile/voteHistory/Votes";
import { ToastContent, ToastOptions } from "react-toastify/dist/types";
import FAQ from "./Pages/FAQ";
import styled, { createGlobalStyle } from "styled-components";
import { myPages, quotes } from "./common/consts/contents";
import Notifications from "./Components/Profile/Notifications";
import Background from "./Components/Background";
import Spinner from "./Components/Spinner";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
// import useScrollPosition from "./hooks/useScrollPosition";
import Button from "./Components/Atoms/Button/Button";
import FirstTimeAvatarSelection from "./Components/LoginComponent/FirstTimeAvatarSelection";
// import FirstTimeFoundationSelection from "./Components/LoginComponent/FirstTimeFoundationSelection";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import UpgradePage from "./Components/Profile/UpgradePage";
import UpgradePageCopy from "./Components/Profile/UpgradePageCopy";
import VotingBoosterCopy from "./Components/Profile/VotingBoosterCopy";
import ProfileNftGallery from "./Pages/ProfileNftGallery";
import GameRule from "./Pages/GameRule";
import Ambassador from "./Pages/Ambassador/Ambassador";
import Foundations from "./Pages/Foundations";
import ProfileNftGalleryType from "./Pages/ProfileNftGalleryType";
import SingalCard from "./Pages/SingalCard";
import FwMine from "./Components/FollowerProfile/FwMine";
import FwFollow from "./Components/FollowerProfile/FwFollow";
import FwVotes from "./Components/FollowerProfile/voteHistory/FwVotes";
import FwPool from "./Components/FollowerProfile/FwPool";
import FwProfileNftGallery from "./Pages/FwProfileNftGallery";
import FwProfileNftGalleryType from "./Pages/FwProfileNftGalleryType";
import Wallet from "./Components/Profile/Wallet/Wallet";
import { pwaInstallHandler } from 'pwa-install-handler'
// import GoogleAuthenticator from "./Components/Profile/GoogleAuthenticator";
import Login2fa from "./Components/LoginComponent/Login2fa";
// import { handleSoundClick } from "./common/utils/SoundClick";
// import createFastContext from "./hooks/createFastContext";
import TermsAndConditions from "./Pages/TermsAndConditions";
import { VoteContext, VoteContextType, VoteDispatchContext, VoteProvider } from "Contexts/VoteProvider";
import { vote } from "common/models/canVote.test";
// import { setTimeout } from "timers";
import ModalForResult from "Pages/ModalForResult";
import { CompletedVotesContext, CompletedVotesDispatchContext } from "Contexts/CompletedVotesProvider";
import { CurrentCMPContext, CurrentCMPDispatchContext } from "Contexts/CurrentCMP";
import CoinsList from "Components/Profile/Payment/CoinsList";

import PaymentFun from "Components/Profile/Payment/PaymentFun";
import PaymentHistory from "Components/Profile/Payment/PaymentHistory";
import { VoteEndCoinPriceContext, VoteEndCoinPriceType } from "Contexts/VoteEndCoinPrice";
import Complete100CMPModal from "Components/Complete100CMPModal";
import { request } from "http";
import VotingBooster from "Components/Profile/VotingBooster";
import { LessTimeVoteDetailContext, LessTimeVoteDetailDispatchContext } from "Contexts/LessTimeVoteDetails";
import Swal from "sweetalert2";
import SelectBio from "Components/LoginComponent/SelectBio";
import axios from "axios";
import { afterpaxDistributionToUser } from "common/utils/helper";
import SingleCardDetails from "Pages/album/SingleCardDetails";
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react'
import { ethers } from "ethers";

const projectId = '1556d7953ee6f664810aacaad77addb1'
const mainnet = [
  {
    chainId: 1,
    name: 'Ethereum',
    currency: 'ETH',
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://cloudflare-eth.com'
  },
  {
    chainId: 56,
    name: 'BNB Chain',
    currency: 'BNB',
    explorerUrl: 'https://bscscan.com/',
    rpcUrl: 'https://bsc-dataseed.binance.org/'
  },
  {
    chainId: 137,
    name: 'Polygon Mainnet',
    currency: 'MATIC',
    explorerUrl: 'https://polygonscan.com',
    rpcUrl: 'https://polygon-mainnet.infura.io'
  },
  {
    chainId: 11155111,
    name: 'Sepolia Test Netwok',
    currency: 'SepoliaETH',
    explorerUrl: ' https://sepolia.etherscan.io/',
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/[YOUR-API-KEY]'
  }

]

// 3. Create modal
const metadata = {
  name: 'Coin parliament',
  description: 'Coin parliament',
  url: 'https://coinparliamentstaging.firebaseapp.com',
  icons: ['https://coinparliament.com/static/media/logoiconxbig2.7f0c3f73.png']
}

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: mainnet,
  projectId,
  themeVariables: {
    // '--w3m-color-mix': '#160133',
    // '--w3m-color-mix-strength': 40,
    '--w3m-z-index':1000
  }
})
// import FoundationData from "Components/Profile/FoundationData";

// import CoinsListDesgin from "Components/Profile/CoinsList";
const getVotesFunc = httpsCallable<{ start?: number; end?: number; userId: string }, GetVotesResponse>(functions, "getVotes");
const getPriceCalculation = httpsCallable(functions, "getOldAndCurrentPriceAndMakeCalculation");
const sendPassword = httpsCallable(functions, "sendPassword");
const localhost = window.location.hostname === "localhost";
let ws: any;
let socket: any;

export const BackDiv = styled.div`
// position:fixed;
// border:1px solid red;
// width:100%;
// height:150vh;
// background:"red";
`;


function App() {
  document.body.classList.add('bg-Change');

  // document.body.style.zIndex = "400";
  const location = useLocation();
  const search = location.search;
  const pathname = location.pathname;
  const langDetector = useRef(null);
  let navigate = useNavigate();
  const { width } = useWindowSize();
  const [voteNumberEnd, setvoteNumberEnd] = useState<any>(0)
  // const scrollPosition = useScrollPosition();
  const [modalOpen, setModalOpen] = useState(false);
  const checkAndUpdateRewardTotal = httpsCallable(functions, "checkAndUpdateRewardTotal");
  useEffect(() => {
    const urlpath = window.location.pathname
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    console.log('scrollUp ');

    if ((urlpath != "/upgrade") && (urlpath != "/votingbooster") && (urlpath != "/paymentList") && (urlpath != "/votepayment")) {
      console.log("yes i am working")
      localStorage.removeItem("PayAmount");
    }
  }, [JSON.stringify(location.pathname)]);

  // console.log("for commit")
  const showModal = useCallback(
    (
      content: ToastContent,
      options: ToastOptions | undefined = {
        position: "top-center",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: false,
        closeButton: true,
        draggable: false,
        progress: undefined,
        containerId: "modal",
        transition: Zoom,
        onOpen: () => setModalOpen(true),
        onClose: () => setModalOpen(false),
      }
    ) => {
      toast(content, options);
    },
    []
  );



  useEffect(() => {

    if ('serviceWorker' in navigator) {
      console.log("Navigator service worker is supported");
      navigator.serviceWorker.addEventListener("message", (message) => {
        const { notification: { body, title, } } = message.data["firebase-messaging-msg-data"];
        console.log(message.data, "checknotification")
        //   showToast(
        //   <div>
        //     <h5>{title}</h5>
        //     <p>{body}</p>
        //   </div>
        // );      
        const typeName = { ...message.data["firebase-messaging-msg-data"]?.notification }

        // if (typeName?.title.includes("-")) {

        //   const getPairName = typeName?.title.split(" ")
        //   const FinalName = getPairName[getPairName.length - 1]          
        //   window.location.href = `https://coinparliamentstaging.firebaseapp.com/pairs/${FinalName}`;
        //   // const makeUrl = `https://coinparliamentstaging.firebaseapp.com/pairs/${FinalName}`;          
        //   // console.log(makeUrl,"checkcoinpair")
        // }
        // else if (!typeName?.title.includes("-") && !typeName?.title.includes("mine")) {
        //   const getCoinName = typeName?.title.split(" ")
        //   const FinalName=getCoinName[getCoinName.length-1]          
        //   window.location.href = `https://coinparliamentstaging.firebaseapp.com/coins/${FinalName}`;
        //   // const makeUrl = `https://coinparliamentstaging.firebaseapp.com/coins/${FinalName}`;
        //   // console.log(makeUrl,"checkcoinpair")
        // }
        // else if (typeName?.title.includes("mine")) {          
        //   window.location.href = 'https://coinparliamentstaging.firebaseapp.com/profile/mine';
        // }
        // else{          
        //   window.location.href = 'https://coinparliamentstaging.firebaseapp.com/';
        // }
      });
    }
  }, []);

  useEffect(() => {
    const body = document.querySelector("body") as HTMLBodyElement;
    const classes = pathname
      .slice(1)
      .split("/")
      .filter((c) => c);
    body.classList.remove(...Array.from(body.classList));
    if (
      intersection(classes, ["coins", "pairs"]).length &&
      classes.length > 1
    ) {
      classes.push("single");
    }
    classes.forEach((c) => body.classList.add(c.toLowerCase()));
  }, [pathname]);
  const [allCoins, setAllCoins] = useState<string[]>(getAllCoins());
  const [changePrice, setChangePrice] = useState<any>(0);
  const [allPairs, setAllPairs] = useState<Array<string[]>>([]);
  const [appStats, setAppStats] = useState<AppStats>({} as AppStats);
  const [paxData, setPaxData] = useState<PaxData>({} as PaxData);
  const [authStateChanged, setAuthStateChanged] = useState(false);
  const [allButtonTime, setAllButtonTime] = useState<any>([]);
  const [allPariButtonTime, setAllPariButtonTime] = useState<any>([]);
  const [singalCardData, setSingalCardData] = useState<any>([]);
  const [nftAlbumData, setNftAlbumData] = useState<any>();
  const [forRun, setForRun] = useState<any>(0);
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [pages, setPages] = useState<ContentPage[] | undefined>(myPages);
  const [socketConnect, setSocketConnect] = useState<any>(false)
  const [backgrounHide, setBackgrounHide] = useState<any>(false)
  const [transactionId, setTransactionId] = useState({});
  const [withLoginV2e, setWithLoginV2e] = useState(false)
  const [paxDistribution, setPaxDistribution] = useState(0)
  const [addPaxWalletPop, setAddPaxWalletPop] = useState(false)
  const [walletTab, setWalletTab] = useState("Balance")
  // @ts-ignore  
  const getCoinPrice = localStorage.getItem('CoinsPrice') ? JSON.parse(localStorage.getItem('CoinsPrice')) : {}
  const [localPrice, setLocalPrice] = useState<any>(getCoinPrice)
  const [coins, setCoins] = useState<{ [symbol: string]: Coin }>(socketConnect ? getCoins() as { [symbol: string]: Coin } : localPrice);

  const [myCoins, setMyCoins] = useState<{ [symbol: string]: Coin }>(
    getCoins() as { [symbol: string]: Coin }
  );
  let params = useParams();
  const [symbol1, symbol2] = (params?.id || "").split("-");
  const [loader, setLoader] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);
  const [firstTimeLogin, setFirstTimeLogin] = useState(false);
  const [showMenubar, setShowMenuBar] = useState(false);
  const [user, setUser] = useState<User>();
  const [userInfo, setUserInfo] = useState<UserProps>();
  const [displayName, setDisplayName] = useState<string>("");
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileTab, setProfileTab] = useState(ProfileTabs.profile);
  const [firstTimeAvatarSlection, setFirstTimeAvatarSelection] =
    useState(false);
  const [selectBioEdit, setSelectBioEdit] = useState(false);
  const [firstTimeFoundationSelection, setFirstTimeFoundationSelection] =
    useState(false);
  const [loginRedirectMessage, setLoginRedirectMessage] = useState("");
  const [userUid, setUserUid] = useState("");
  const [chosenUserType, setChosenUserType] = useState<string>("");
  const [lang, setLang] = useState<string>(
    getLangByKey(new URLSearchParams(search).get("lang") + "")
  );
  const [totals, setTotals] = useState<{ [key: string]: Totals }>(
    {} as { [key: string]: Totals }
  );
  const [timeframes, setTimeframes] = useState<TimeFrame[]>([]);
  const [voteRules, setVoteRules] = useState<VoteRules>({} as VoteRules);
  const [languages, setLanguages] = useState<string[]>([ENGLISH]);
  const [rtl, setRtl] = useState<string[]>([]);
  const [admin, setAdmin] = useState<boolean | undefined>(undefined);
  const [remainingTimer, setRemainingTimer] = useState(0)
  const [followerUserId, setFollowerUserId] = useState<string>('')
  const [showBack, setShowBack] = useState<any>(false)
  const [showReward, setShowReward] = useState<any>(0)
  const [inOutReward, setInOutReward] = useState<any>(0)
  const [headerExtraVote, setHeaderExtraVote] = useState<number>(0)
  const [rewardExtraVote, setRewardExtraVote] = useState<number>(0)
  const [afterVotePopup, setAfterVotePopup] = useState<any>(false)
  const [isVirtualCall, setIsVirtualCall] = useState<any>(false)
  const [avatarImage, setAvatarImage] = useState<any>(null)
  const [albumOpen, setAlbumOpen] = useState<any>("")
  const localID = localStorage.getItem("userId") || false;
  const [isWLDPEventRegistered, setIsWLDPEventRegistered] = useState<boolean>(false);
  // const [localID, setLocalID] = useState<any>(

  // )  

  const [CPMSettings, setCPMSettings] = useState<CPMSettings>(
    {} as CPMSettings
  );
  const [votesLast24Hours, setVotesLast24Hours] = useState<VoteResultProps[]>(
    []
  );
  const [userTypes, setUserTypes] = useState<UserTypeProps[]>([
    defaultUserType,
  ] as UserTypeProps[]);
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);
  const [pwaPopUp, setPwaPopUp] = useState('block')
  const [mfaLogin, setMfaLogin] = useState(false)
  const [allCoinsSetting, setAllCoinsSetting] = useState([])

  // console.log(coins, "allcoinsCheck")

  const Coinkeys = Object.keys(coins && coins) || []

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      console.log("we are being triggered :D");
      setSupportsPWA(true);
      setPromptInstall(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("transitionend", handler);
  }, []);
  // @ts-ignore
  // 2fa problem solve
  // useEffect(() => {
  //   const isMFAPassed = localStorage.getItem('mfa_passed')
  //   if (isMFAPassed == 'true' && !login) {

  //     console.log('2faCalled')
  //     // @ts-ignore
  //     Logout(setUser)
  //   }
  // }, [])

  const onClick = (evt: any) => {
    // evt.preventDefault();
    console.log('not supported', promptInstall)
    if (!promptInstall) {
      return;
    }
    // @ts-ignore
    else promptInstall.prompt();
  };
  if (!supportsPWA) {
    console.log('not supported')
  }
  useEffect(() => {
    if (user?.email && userInfo?.displayName === undefined && !login) {
      setLoader(true);
      //   .get("444-44-4444").onsuccess = (event) => {
      //   console.log(`Name for SSN 444-44-4444 is ${event.target.result.name}`);
      // };

      // setLoader(true);
    } else {
      // setTimeout(() => {
      setLoader(false);
      // }, 2000);
    }
  }, [user, userInfo]);

  const updateUser = useCallback(async (user?: User) => {
    setUser(user);
    const info = await getUserInfo(user);
    console.log("i am working")
    setUserInfo(info);
    setDisplayName(info.displayName + "");   
  }, []);


  // const FollowerData = async(id:any) => {     
  //   const Followerinfo =  await getFollowerInfo(id);
  //   return Followerinfo
  // }

  // console.log(remainingTimer, "remainingTimer")
  // console.log(firstTimeAvatarSlection, "firstTimeAvatarSlectionapp")

  useEffect(() => {
    if (user?.email && userInfo?.displayName === undefined && !login) {
      setLoader(true);
    } else {
      setTimeout(() => {
        setLoader(false);
      }, 2000);
    }
  }, [user, userInfo]);
  useEffect(() => {
    const refer = new URLSearchParams(search).get("refer");
    if (refer && !user) {
      setLogin(false);
      setSignup(false);
    } else {
      const isMFAPassed = window.localStorage.getItem('mfa_passed')
      if (!user && isMFAPassed !== 'true') {
        console.log('2faCalled3')
        setLogin(false);
        setSignup(false);
      }
    }
    if (auth?.currentUser) {
      setLogin(false);
    }
  }, [location, search, JSON.stringify(auth?.currentUser)]);

  // useEffect(() => {
  //   if (!user) {
  //     navigate("/", {replace: true});
  //   }
  // }, [user]);

  useEffect(() => {

    // @ts-ignore

    if ((user && userInfo && userInfo?.displayName === "" && userUid) || userInfo?.firstTimeLogin) {
      setFirstTimeLogin(true);
      setShowMenuBar(true)
    }

  }, [userInfo]);

  useEffect(() => {
    pwaInstallHandler.addListener((canInstall) => {
      canInstall ? setPwaPopUp('block') : setPwaPopUp('none')
    })
  }, [])



  useEffect(() => {
    setMounted(true);
  }, [firstTimeLogin]);

  const [fcmToken, setFcmToken] = useState<string>("");
  const CPMSettingsMng = new CPMSettingsManager(CPMSettings, setCPMSettings);
  const VoteRulesMng = new VoteRulesManager(voteRules, setVoteRules);
  const TimeframesMng = new TimeframesManager(timeframes, setTimeframes);
  const UserTypeMng = new UserTypeManager(userTypes, setUserTypes);




  if (langDetector.current) {
    (langDetector?.current as unknown as HTMLInputElement)?.addEventListener(
      "change",
      (event) => {
        const target = event.target as HTMLInputElement;
        setLang(
          getLangByKey(new URLSearchParams(search).get("lang") || target.value)
        );
      }
    );
  }

  // useEffect(() => {
  //   if (backgrounHide) {
  //     window.scrollTo({
  //       top: 500,
  //       behavior: 'smooth',
  //     });
  //   }
  // }, [backgrounHide])

  useEffect(() => {
    getMessageToken();
  }, [userInfo]);
  const getMessageToken = async () => {
    const messagingResolve = await messaging;
    if (messagingResolve) {
      getToken(messagingResolve, {
        vapidKey: process.env.REACT_APP_FIREBASE_MESSAGING_VAPID_KEY,
      }).then((token) => {
        setFcmToken(token);
        console.log('token', token);
      }).catch((e) => {
        console.log('token', e);
      });
    }
  }



  useEffect(() => {
    const localStorageLang = localStorage.getItem("lang");
    if (localStorageLang && languages.includes(localStorageLang)) {
      setMounted(true);
    }
  }, [languages]);
  // console.log('user', userInfo)
  useEffect(() => {
    if (user?.uid) {
      setDoc(doc(db, "users", user?.uid), { lang }, { merge: true }).then(
        void 0
      );

      localStorage.setItem("lang", lang);
    }
  }, [lang, user?.uid]);

  // const isAdmin = useCallback(async (uid?: string) => {
  //   if (uid) {
  //     const func = httpsCallable(functions, "isAdmin");
  //     return !!(await func({ user: uid })).data;
  //   }
  // }, []);

  // useEffect(() => {
  //   isAdmin(user?.uid).then((newAdmin) => setAdmin(newAdmin));
  // }, [user?.uid, isAdmin]);

  const getCoinData = async () => {
    const coinData = doc(db, "stats", "coins");
    try {
      const userDocSnapshot = await getDoc(coinData);

      if (userDocSnapshot.exists()) {
        setCoins(userDocSnapshot.data());
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.error("Error getting document:", error);
    }
  }

  useEffect(() => {
    onSnapshot(doc(db, "stats", "leaders"), (doc) => {
      setLeaders((doc.data() as { leaders: Leader[] })?.leaders || []);

    });

    onSnapshot(
      query(
        collection(db, "notifications"),
        where("user", "==", user?.uid || "")
      ),
      (querySnapshot) => {
        setNotifications(
          querySnapshot.docs.map((doc) => {

            return doc.data() as NotificationProps;
          })
        );
      }
    );

    onSnapshot(doc(db, "stats", "totals"), (doc) => {
      setTotals((doc.data() || {}) as { [key: string]: Totals });
    });

    onSnapshot(doc(db, "settings", "timeframes"), (doc) => {
      setTimeframes(
        ((doc.data() as { timeframes: TimeFrame[] }) || {}).timeframes || []
      );
    });

    onSnapshot(doc(db, "settings", "userTypes"), (doc) => {
      const u = (
        (doc.data() || {
          userTypes: [defaultUserType],
        }) as { userTypes: UserTypeProps[] }
      ).userTypes;

      setUserTypes(u);
    });

    onSnapshot(doc(db, "settings", "settings"), (doc) => {
      setVoteRules(
        ((doc.data() || {}) as { voteRules: VoteRules }).voteRules || {}
      );
      setCPMSettings(
        ((doc.data() || {}) as { CPMSettings: CPMSettings }).CPMSettings || {}
      );
    });

    onSnapshot(doc(db, "settings", "languages"), (doc) => {
      const u = (
        (doc.data() || {
          languages: [ENGLISH],
        }) as { languages: string[] }
      ).languages;

      setLanguages(u);
    });

    onSnapshot(doc(db, "settings", "rtl"), (doc) => {
      const r = (
        (doc.data() || {
          rtl: [],
        }) as { rtl: string[] }
      ).rtl;

      setRtl(r);
    });

    onSnapshot(collection(db, "translations"), (querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        translations.set(doc.id, doc.data());
      });
    });

    // onSnapshot(doc(db, "stats", "coins"), (doc) => {

    //   const newAllCoins = (doc.data() as { [key: string]: Coin }) || {};
    //   setCoins(newAllCoins);
    //   // console.log('allcoins',coins)
    //   // saveCoins(newAllCoins);
    // }); 

    // const coinData = firebase
    //   .firestore()
    //   .collection("stats").doc('coins')
    // coinData.get()
    //   .then((snapshot: any) => {
    //     //  console.log('allcoin',snapshot.data())
    //     setCoins(snapshot.data());
    //   });
    getCoinData();

    onSnapshot(doc(db, "stats", "app"), (doc) => {
      setAppStats(doc.data() as AppStats);
    });

    onSnapshot(doc(db, "settings", "paxData"), (doc) => {
      setPaxData(doc.data() as PaxData);
    });

    onSnapshot(doc(db, "settings", "coins"), (doc) => {
      const newAllCoins = (
        ((doc.data() as { coins: DBCoin[] }) || {}).coins || []
      )
        .sort((a, b) => Number(a.id) - Number(b.id))
        .map((c) => c.symbol);
      const newAllCoinsData = (
        ((doc.data() as { coins: DBCoin[] }) || {}).coins || []
      )
        .sort((a, b) => Number(a.id) - Number(b.id))
        .map((c) => c);
      saveAllCoins(newAllCoins);
      setAllCoins(newAllCoins);
      // @ts-ignore
      setAllCoinsSetting(newAllCoinsData)
    });

    onSnapshot(doc(db, "settings", "pairs"), (doc) => {
      setAllPairs(
        (((doc.data() as { pairs: DBPair[] }) || {}).pairs || [])
          .sort((a, b) => Number(a.id) - Number(b.id))
          .map((p) => {
            return [p.symbol1, p.symbol2];
          })
      );
    });

    axios.post("https://us-central1-votetoearn-9d9dd.cloudfunctions.net/getCurrentPaxDistribution", {      
        data: {}      
    }).then((res) => {
      console.log(res.data.result, "resultdata")
      setPaxDistribution(res.data.result.paxDistribution)
    }).catch((err) => {
      console.log(err,"resultdata")      
    })
  }, [user?.uid]);

  window.onbeforeunload = function () {
    //  localStorage.clear();
    const allCoinPrice = coins
    localStorage.setItem('CoinsPrice', JSON.stringify(allCoinPrice));
  }

  useEffect(() => {
    const auth = getAuth();
    if (!firstTimeLogin) {

      onAuthStateChanged(auth, async (user: User | null) => {
        setAuthStateChanged(true);
        console.log('provider', user?.providerData[0]?.providerId)
        if (
          user?.emailVerified ||
          user?.providerData[0]?.providerId === "facebook.com"
        ) {
          // setLogin(false);
          // setSignup(false);
          setLoginRedirectMessage("");
          await updateUser(user);
          setUserUid(user?.uid);

          localStorage.setItem("userId", user.uid)

          onSnapshot(doc(db, "users", user.uid), async (doc) => {
            await setUserInfo(doc.data() as UserProps);
            setDisplayName((doc.data() as UserProps).displayName + "");
          });
          // const votesLast24HoursRef = firebase
          //   .firestore()
          //   .collection("votes")
          //   .where("userId", "==", user.uid)
          //   .where("voteTime", ">=", Date.now() - 24 * 60 * 60 * 1000)
          //   .where("voteTime", "<=", Date.now());
          //   console.log('extravote11',votesLast24HoursRef)
          //   await votesLast24HoursRef.onSnapshot((snapshot) => {
          //     console.log('extravote1')
          //     setVotesLast24Hours(
          //       snapshot.docs.map((doc) => doc.data() as unknown as VoteResultProps),
          //     );
          //   });

          console.log(auth, "getauth", fcmToken)
          try {
            if (fcmToken) {
              try {
                await setDoc(
                  doc(db, "users", user.uid),
                  { token: fcmToken },
                  { merge: true }
                );
                // console.log("push enabled");
              } catch (e) {
                console.log(e);
              }
            }
          } catch (e) {
            console.log("An error occurred while retrieving token. ", e);
          }
        } else {
          await updateUser();

        }
      });
    }
  }, [user, fcmToken, coins]);
  // useEffect(() => {
  //   auth.signOut();
  // }, []);


//   useEffect(() => {

//     if (user?.uid) {
// console.log()
//       const currentTime = firebase.firestore.Timestamp.fromDate(new Date());
//       // const last24Hour = currentTime.toMillis() - 24 * 60 * 60 * 1000;
//       const last24Hour = currentTime.toMillis() - voteRules.timeLimit * 1000;

//       const votesLast24HoursRef = firebase
//         .firestore()
//         .collection("votes")
//         .where("userId", "==", user?.uid)
//         .where("voteTime", ">=", last24Hour)
//         .where("voteTime", "<=", Date.now());
//       votesLast24HoursRef.get()
//         .then((snapshot) => {
//           setVotesLast24Hours(snapshot.docs.map((doc) => doc.data() as unknown as VoteResultProps));
//           const data = snapshot.docs.map((doc) => doc.data() as unknown as VoteResultProps)         
//         })
//         .catch((error) => {
//           console.log('extravoteError', error);
//         });
//     }


//   }, [userInfo?.voteStatistics?.total])
  // console.log('usermfa', userInfo)
  const fetchVotesLast24Hours = async () => {
    console.log(voteNumberEnd, user?.uid, userInfo?.lastVoteTime, "userInfo?.lastVoteTime")
    if (voteNumberEnd == 0 && user?.uid && userInfo?.lastVoteTime) {
      // @ts-ignore
      let remaining = (userInfo?.lastVoteTime + voteRules.timeLimit * 1000) - Date.now();
      // @ts-ignore
      setRemainingTimer(userInfo?.lastVoteTime + voteRules.timeLimit * 1000)
      console.log(remaining, "remaining")
      setTimeout(() => {        
        const userDocRef = doc(firestore, 'users', user?.uid);
        try {
          setDoc(userDocRef, {
            voteValue: voteRules?.maxVotes,
            lastVoteTime: 0
          }, { merge: true });
        } catch (error) {
          console.error('Error updating user data:', error);
        }
      }, remaining);

      // const currentTime = firebase.firestore.Timestamp.fromDate(new Date());
      const currentTime = Timestamp.fromDate(new Date());
      
      // const last24Hour = currentTime.toMillis() - 24  60  60 * 1000;
      const last24Hour = currentTime.toMillis() - voteRules.timeLimit * 1000;
      // const votesLast24HoursRef = firebase
      //   .firestore()
      //   .collection("votes")
      //   .where("userId", "==", user?.uid)
      //   .where("voteTime", ">=", last24Hour)
      //   .where("voteTime", "<=", Date.now());
      // votesLast24HoursRef.get()
      //   .then((snapshot) => {
      //     console.log(voteNumberEnd)
      //     console.log("i am working ")
      //     setVotesLast24Hours(snapshot.docs.map((doc) => doc.data() as unknown as VoteResultProps));
      //     const data = snapshot.docs.map((doc) => doc.data() as unknown as VoteResultProps)
      //     // @ts-ignore
      //   }).catch((error) => {
      //     console.log('extravoteError', error);
      //   });
    
      const votesCollectionRef = collection(firestore, 'votes');    
      try {
        const q = query(
          votesCollectionRef,
          where('userId', '==', user?.uid),
          where('voteTime', '>=', last24Hour),
          where('voteTime', '<=', Date.now())
        );

        const querySnapshot = await getDocs(q);

        setVotesLast24Hours(
          querySnapshot.docs.map((doc:any) => doc.data() as unknown as VoteResultProps)
        );
        // If you need the data separately
        const data = querySnapshot.docs.map((doc:any) => doc.data() as unknown as VoteResultProps);
        console.log(data);
      } catch (error) {
        console.error('Error fetching votes in the last 24 hours:', error);
      }
    
    }
  };
  useEffect(() => {
    if (user?.uid) {      
      fetchVotesLast24Hours()
    }
  }, [voteNumberEnd, userInfo?.lastVoteTime])


  useEffect(() => {
    const html = document.querySelector("html") as HTMLElement;
    const key = getKeyByLang(lang);
    html.setAttribute("lang", key);
    if (rtl.includes(lang)) {
      html.setAttribute("dir", "rtl");
    } else {
      html.removeAttribute("dir");
    }
  }, [lang, rtl, user?.uid]);

  const [enabled, enable] = useState(true);
  const [password, setPassword] = useState("");
  function connect() {
    if (Object.keys(coins).length === 0) return
    console.log('Browser window called')
    ws = new WebSocket('wss://stream.binance.com:9443/ws');
    console.log('websocket connected first time')
    const coinTikerList = Object.keys(coins).map(item => `${item.toLowerCase()}usdt@ticker`)
    ws.onopen = () => {
      console.log('WebSocket Open');
      setSocketConnect(true)
      ws.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: coinTikerList,
        id: 1
      }));
    };
    var userAgent = navigator.userAgent.toLowerCase();
    const isInstagramAvailable = /iphone/.test(userAgent);
    
    console.log(userAgent,"isInstagramAvailable")
    ws.onclose = (event: any) => {
      if (isInstagramAvailable) {
        console.log("reloadtrue")
        // window.location.reload()
        connect()
      }
      setSocketConnect(false);
      console.log('WebSocket connection closed', event);
      if (event.code !== 1000) {
        console.log('WebSocket Attempting to reconnect in 5 seconds...');
        setTimeout(() => {
          connect();
        }, 5000);
      }
    };

    ws.onerror = () => {
      // if (!login) window.location.reload()
      console.log('WebSocket connection occurred');
    };

    socket = new WebSocket('wss://stream.crypto.com/v2/market');
    socket.onopen = () => {
      console.log('WebSocket Open');
      const req = {
        id: 1,
        method: 'subscribe',
        params: {
          channels: ['ticker.CRO_USDT'],
        },
      };
      socket.send(JSON.stringify(req));
    };         
    socket.onclose = (event: any) => {
      if (isInstagramAvailable) {
        console.log("reloadtrue")
        // window.location.reload()
        connect()
      }
      console.log('WebSocket connection closed crypto', event);
      if (event.code !== 1000) {
        console.log('WebSocket Attempting to reconnect in 5 seconds... crypto');
        setTimeout(() => {
          connect();
        }, 5000);
      }
    };

    socket.onerror = () => {
      // if (!login) window.location.reload()
      console.log('WebSocket connection occurred crypto');
    };

    const timeout = 30000; // 30 seconds
    let timeoutId: any;
    const checkConnection = () => {
      if (ws.readyState !== WebSocket.OPEN || socket.readyState !== WebSocket.OPEN) {
        console.log('WebSocket connection timed out');
        clearInterval(timeoutId);
        connect();
      }
    };
    timeoutId = setInterval(checkConnection, timeout);

  }
  useEffect(() => {

    connect();
    return () => {
      console.log('close websocket connection');

      if (ws) ws.close();
      if (socket) socket.close();
      window.localStorage.removeItem('firstTimeloading')
    };
  }, [Object.keys(coins).length]);
  // useEffect(() => {
  //   window.addEventListener("focus", () => socket.connect());

  //   return () => {

  //   }
  // }, [])
  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    }
  }, []);

  const handleVisibilityChange = () => {
    const isIPhone = /iPhone/i.test(navigator.userAgent);

    if (isIPhone) {
      console.log('This is an iPhone');
    } else {
      console.log('This is not an iPhone');
    }
    if (document.hidden) {
      console.log("Browser window is minimized");
      // ws.close();
      // socket.close();
    } else {
      connect();
      console.log("Browser window is not minimized");
    }
  }
  const checkprice = async (vote: any) => {
    console.log(vote, "checkAllvote")
    const voteCoins = vote?.coin.split("-");
    const coin1 = `${voteCoins[0] ? voteCoins[0].toLowerCase() || "" : ""}`
    const coin2 = `${voteCoins[1] ? voteCoins[1].toLowerCase() || "" : ""}`
    const data = await getPriceCalculation({
      coin1: `${coin1 != "" ? coin1 + "usdt" : ""}`,
      coin2: `${coin2 != "" ? coin2 + "usdt" : ""}`,
      voteId: vote?.id,
      voteTime: vote?.voteTime,
      valueVotingTime: vote?.valueVotingTime,      
      // valueExpirationTimeOfCoin1: vote?.valueVotingTime[0] || null,
      // valueExpirationTimeOfCoin2: vote?.valueVotingTime[1] || null,
      expiration: vote?.expiration,
      timestamp: Date.now(),
      userId: vote?.userId
    }).then((data: any) => {
      const raw = {
        userId: vote?.userId
      }
      checkAndUpdateRewardTotal(raw).then((res) => {
        console.log(res.data, "checkAndUpdateRewardTotal")
      }).catch((error) => {
        console.log(error, "checkAndUpdateRewardTotal")
      })
      console.log('success')
      // if(data.data==null){
      //     getVotes(index).then(void 0);     
      // }
    }).catch((err: any) => {
      const raw = {
        userId: vote?.userId
      }
      checkAndUpdateRewardTotal(raw).then((res) => {
        console.log(res.data, "checkAndUpdateRewardTotal")
      }).catch((error) => {
        console.log(error, "checkAndUpdateRewardTotal")
      })
      if (err && err.message) {
        console.log(err.message);
      }
    })
  }
  const getVotes = useCallback(
    async () => {
      if (user?.uid) {
        const newVotes = await getVotesFunc({
          userId: user?.uid,
        });

        // @ts-ignore
        let result = JSON.parse(newVotes?.data)
        if (newVotes?.data) {

          const { coins, pairs } = result

          let AllCoins = coins?.votes.filter((item: any) => {
            if (item.expiration < Date.now() && item.success == undefined) {

              return item
            }
          })

          let AllPairs = pairs?.votes.filter((item: any) => {
            if (item.expiration < Date.now() && item.success == undefined) {

              return item
            }
          })

          let allCoinsPair = [...AllCoins, ...AllPairs]
          let promiseArray: any = []
          if (allCoinsPair.length > 0) {
            allCoinsPair?.forEach((voteItem: any) => {
              promiseArray.push(checkprice(voteItem))
              // checkprice(voteItem);
            })
          }

          console.log('promisearray', promiseArray, allCoinsPair)
          if (!promiseArray?.length) return
          Promise.all(promiseArray)
            .then(responses => {
              getVotes().then(void 0);
              //  return Promise.all(responses)
            })
            .catch(error => {
              console.error('promiseAll', error);
            });
        }
      }
    },
    [user?.uid]
  );
  useEffect(() => {
    if (user?.uid) {
      getVotes().then(void 0);
    }
  }, [user?.uid]);

  /// show 100 CMP complete modal
  const [completedVoteCMP, setCompletedVoteCMP] = useState<number>(0);
  const [showComplete100CMP, setShowComplete100CMP] = useState(false);
  ///show 100 CMP complete modal

  ///start vote result //
  const voteDetails = useContext(VoteContext);
  const setVoteDetails = useContext(VoteDispatchContext);

  const completedVotes = useContext(CompletedVotesContext);
  const setCompletedVotes = useContext(CompletedVotesDispatchContext);

  const getPriceCalculation = httpsCallable(functions, "getOldAndCurrentPriceAndMakeCalculation");  
  const getResultAfterVote = httpsCallable(functions, "getResultAfterVote");
  // const [lessTimeVoteDetails, setLessTimeVoteDetails] = useState<VoteResultProps | undefined>();
  const lessTimeVoteDetails = useContext(LessTimeVoteDetailContext);
  const setLessTimeVoteDetails = useContext(LessTimeVoteDetailDispatchContext);
  const setCurrentCMP = useContext(CurrentCMPDispatchContext);
  const currentCMP = useContext(CurrentCMPContext);
  const voteEndCoinPrice = useContext(VoteEndCoinPriceContext);

  
  useEffect(() => {
    if (completedVotes.length > 0 && !voteDetails.openResultModal) {
      Swal.close();
      setVoteDetails((prev: VoteContextType) => {
        return {
          ...prev,
          lessTimeVote: completedVotes[0],
          openResultModal: true
        }
      });
      setCurrentCMP((completedVotes[0]?.score || 0) + parseFloat(localStorage.getItem(`${user?.uid}_newScores`) || '0'));
      if (!pathname.toLowerCase().includes(`profile/mine`)) {
        localStorage.setItem(`${user?.uid}_newScores`, `${(completedVotes[0]?.score || 0) + parseFloat(localStorage.getItem(`${user?.uid}_newScores`) || '0')}`);
      }
      setCompletedVoteCMP((completedVotes[0]?.score || 0));
    }
  }, [completedVotes, voteDetails.openResultModal]);

  useEffect(() => {
    let tempTessTimeVote: VoteResultProps | undefined;
    Object.keys(voteDetails?.activeVotes).map((value) => {
      if (!tempTessTimeVote || tempTessTimeVote.expiration > voteDetails?.activeVotes[value]?.expiration) {
        tempTessTimeVote = voteDetails?.activeVotes[value];
      }
      return {};
    });
    if (tempTessTimeVote && lessTimeVoteDetails?.voteId !== tempTessTimeVote.voteId && !pathname.includes('profile/mine')) {
      setLessTimeVoteDetails(tempTessTimeVote);
      timeEndCalculation(tempTessTimeVote);
      // setCalculateVote(false);
    }
  }, [JSON.stringify(voteDetails?.activeVotes), pathname]);
  const voteImpact = useRef<{
    timeFrame: number,
    impact: null | number
  }>({
    timeFrame: 0,
    impact: null
  });
  const latestVote = useRef<VoteContextType>();
  const latestCoinsPrice = useRef<VoteEndCoinPriceType>({});
  const latestUserInfo = useRef<UserProps | undefined>();
  const pathNameRef = useRef<string>();
  useEffect(() => {
    pathNameRef.current = pathname;
  }, [pathname])
  useEffect(() => {
    latestCoinsPrice.current = voteEndCoinPrice;
  }, [voteEndCoinPrice]);
  useEffect(() => {
    voteImpact.current = voteDetails.voteImpact;
    latestVote.current = voteDetails;
  }, [voteDetails]);


  const getCalculateDiffBetweenCoins = (valueVotingTime: any, valueExpirationTime:any, direction: number) => {

    const firstCoin = (((valueExpirationTime[0] - valueVotingTime[0]) * 100) / valueVotingTime[0]);
    const secondCoin = (((valueExpirationTime[1] - valueVotingTime[1]) * 100) / valueVotingTime[1]);
    const difference = (direction === 0 ? (firstCoin) - (secondCoin) : (secondCoin) - (firstCoin)).toFixed(4);
    return {
      firstCoin: firstCoin.toFixed(4) || '0',
      secondCoin: secondCoin.toFixed(4) || '0',
      difference: difference || '0'
    }
  }

  const timeEndCalculation = (lessTimeVote: VoteResultProps) => {
    if (lessTimeVote) {
      // let exSec = new Date(-).getSeconds();
      // current date
      let current = new Date();
      // voteTime date
      let voteTime = new Date(lessTimeVote?.expiration);      
      // finding the difference in total seconds between two dates      
      let second_diff = (voteTime.getTime() - current.getTime()) / 1000;
      const timer = setTimeout(async () => {
        const coin = lessTimeVote?.coin.split('-') || [];
        const coin1 = `${coins && lessTimeVote?.coin[0] ? coins[coin[0]]?.symbol?.toLowerCase() || "" : ""}`;
        const coin2 = `${coins && coin?.length > 1 ? coins[coin[1]]?.symbol?.toLowerCase() || "" : ""}`;
        const ExpriTime = [latestCoinsPrice.current[`${lessTimeVote?.coin.toUpperCase()}_${lessTimeVote?.timeframe?.seconds}`].coin1 || null,latestCoinsPrice.current[`${lessTimeVote?.coin.toUpperCase()}_${lessTimeVote?.timeframe?.seconds}`].coin2 || null,]

        const getValue = coin2 != "" && await getCalculateDiffBetweenCoins(lessTimeVote?.valueVotingTime, ExpriTime, lessTimeVote.direction)         
        // @ts-ignore
        var StatusValue = coin2 != "" ? getValue?.difference < 0 ? 0 : getValue?.difference == 0 ?2: 1 : voteImpact.current?.impact;

        console.log(StatusValue, 'StatusValue');
        if (pathNameRef.current?.includes('profile/mine')) {
          return
        }
        console.log(voteNumberEnd,"voteNumberEnd")
        const request = {
          ...{
            coin1: `${coin1 != "" ? coin1 + "usdt" : ""}`,
            coin2: `${coin2 != "" ? coin2 + "usdt" : ""}`,
            voteId: lessTimeVote?.id,
            voteTime: lessTimeVote?.voteTime,
            valueVotingTime: lessTimeVote?.valueVotingTime,
            expiration: lessTimeVote?.expiration,
            timestamp: Date.now(),
            userId: lessTimeVote?.userId,                                          
            paxDistributionToUser: {
              userId: lessTimeVote?.userId,
              currentPaxValue: Number(paxDistribution),
              isUserUpgraded: userInfo?.isUserUpgraded == true ? true : false,
              mintForUserAddress: userInfo?.paxAddress?.address || "",
              eligibleForMint: userInfo?.paxAddress?.address ? true : false
            }
          }, ...(
            (pathname.includes(lessTimeVote?.coin) && lessTimeVote?.timeframe.index === voteImpact.current?.timeFrame && voteImpact.current?.impact !== null) ?
              {
                status: StatusValue,
                valueExpirationTimeOfCoin1: latestCoinsPrice.current[`${lessTimeVote?.coin.toUpperCase()}_${lessTimeVote?.timeframe?.seconds}`].coin1 || null,
                valueExpirationTimeOfCoin2: latestCoinsPrice.current[`${lessTimeVote?.coin.toUpperCase()}_${lessTimeVote?.timeframe?.seconds}`].coin2 || null,
              }
              :
              {}
          )
        }
        console.log(lessTimeVote, "ChecklessTimeVote")
        await getResultAfterVote(request).then(async (response) => {
        
          console.log(response?.data, "response?.data?.result?")
          // @ts-ignore
          // if (response?.data?.paxDistributionToUser && response?.data?.paxDistributionToUser?.status == true) {
          // afterpaxDistributionToUser(paxDistribution)
          // }

          console.log(latestUserInfo.current, 'latestUserInfo.current');
          getPriceCalculation(request).then(() => { 

            const raw = {
              userId: lessTimeVote?.userId
            }
            checkAndUpdateRewardTotal(raw).then((res) => {
              console.log(res.data, "checkAndUpdateRewardTotal")
            }).catch((error) => {
              console.log(error, "checkAndUpdateRewardTotal")
            })
          }).catch(() => { });
          // if (latestUserInfo && (latestUserInfo.current?.rewardStatistics?.total || 0) > (latestUserInfo.current?.rewardStatistics?.claimed || 0)) {
          //   await claimReward({ uid: user?.uid, isVirtual: true }).then(() => { }).catch(() => { });
          // }

          // afterpaxDistributionToUser(paxDistribution)
          
          if (response?.data && Object.keys(response.data).length > 0) {
            const res: VoteResultProps = response!.data as VoteResultProps;
            // @ts-ignore
            if ((!!latestVote?.current?.activeVotes[`${res?.coin}_${res?.timeframe.seconds}`])) {
              setCompletedVotes((prev: VoteResultProps[]) => {
                return [
                  ...prev.filter(value => value.voteId != res.voteId),
                  { ...res, voteType: coin.length > 1 ? 'pair' : 'coin' }
                ]
              });
            }
          }
        }).catch(err => {
          if (err && err.message) {
            console.log(err.message);
          }
        });
      }, (((second_diff || 0) * 1000)));
      return () => clearTimeout(timer);
      // }
    }
  }
  const claimReward = httpsCallable(functions, "claimReward");
  
  const paxDistributionOnClaimReward = httpsCallable(functions, "paxDistributionOnClaimReward");

  useEffect(() => {
      

    if ((userInfo?.rewardStatistics?.total || 0) > (userInfo?.rewardStatistics?.claimed || 0) && !isVirtualCall) {
      console.log("i am calling again");
      claimReward({
        uid: user?.uid,isVirtual: true}).then(() => {        
      }).catch(() => { });
      
      // paxDistributionOnClaimReward({
      //   paxDistributionToUser: {
      //     userId: userInfo?.uid,
      //     currentPaxValue: Number(paxDistribution),
      //     isUserUpgraded: userInfo?.isUserUpgraded == true ? true : false,
      //     mintForUserAddress: userInfo?.paxAddress?.address || "",
      //     eligibleForMint: userInfo?.paxAddress?.address ? true : false
      //   }      
      // }).then((res) => { 
      //   console.log(res?.data, "resdata")
      //   // @ts-ignore
      //   if (res?.data?.getResultAfterSentPaxToUser?.status) {
      //     afterpaxDistributionToUser(paxDistribution)
      //   }
      //   // afterpaxDistributionToUser(paxDistribution)
      // }).catch(() => { });
      
    }
    latestUserInfo.current = userInfo;
  }, [JSON.stringify(userInfo?.rewardStatistics?.total), JSON.stringify(userInfo?.rewardStatistics?.claimed), isVirtualCall]);

  ///END vote result //


  // login user using token
  const [searchParams] = useSearchParams();
  useEffect(() => {
    let token = searchParams.get('token');
    if (token) {
      firebase.auth().signInWithCustomToken(token)
        .then((userCredential) => {
          // User is signed in
          const user = userCredential.user;
          if (user && !user?.emailVerified) {
            auth.signOut();
            showToast("Please verify your email address.", ToastType.ERROR);
          }
          console.log('Custom token sign-in success: authenticated', user);
          navigate('/');
        })
        .catch((error) => {
          // Handle sign-in errors
          console.error('Custom token sign-in error: authenticated', error);
        });
    }
  }, [searchParams]);

  const isIPhone = /iPhone/i.test(navigator.userAgent);
  useEffect(() => {
    if (isIPhone) {
      // Show the popup for iPhones in Safari
      setPwaPopUp('block');
    } else {
      // Hide the popup for other devices or browsers
      setPwaPopUp('none');
    }
  }, []);



  return loader ? (
    <div
      className='d-flex justify-content-center align-items-center'
      style={{ height: "100vh", width: "100vw", color: "white" }}
    >
      <Spinner />
    </div>
  ) : (
    <BackDiv
        style={{
                
        // transform: "scale(4.3)",
        // backgroundColor: "rgba(0,0,0,0.5)",
      }}
      >  

        {!login &&
          !firstTimeAvatarSlection &&
          !firstTimeFoundationSelection && !selectBioEdit && localStorage.getItem('mfa_passed') != 'true' &&
        <div className='pwaPopup' style={{ display: pwaPopUp }}>
          <span>{isIPhone && ( 
          <>
          Click on{" "}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24" width="24" id="upload" fill="blue"><path d="M9.71,6.71,11,5.41V17a1,1,0,0,0,2,0V5.41l1.29,1.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42l-3-3a1,1,0,0,0-1.42,0l-3,3A1,1,0,0,0,9.71,6.71ZM18,9H16a1,1,0,0,0,0,2h2a1,1,0,0,1,1,1v7a1,1,0,0,1-1,1H6a1,1,0,0,1-1-1V12a1,1,0,0,1,1-1H8A1,1,0,0,0,8,9H6a3,3,0,0,0-3,3v7a3,3,0,0,0,3,3H18a3,3,0,0,0,3-3V12A3,3,0,0,0,18,9Z"></path></svg>
           {" "}to Add to Home Screen
          </>
        )}
          {!isIPhone && texts.InstallCoinParliament}
          </span>
          
          {/* "Add to Home Screen" : texts.InstallCoinParliament}</span> */}
          {!isIPhone &&
          <button
            className="link-button"
            id="setup_button"
            aria-label="Install app"
            title="Install app"
            onClick={onClick}
            style={{ zIndex: 99999 }}
          >
            {texts.Install}
          </button>}
          <span
            className="link-button"
            id="setup_button"
            aria-label="Install app"
            title="Install app"
            onClick={e => setPwaPopUp('none')}
            style={{ zIndex: 99999, position: 'absolute', top: '5px', right: '10px', fontSize: '18px', cursor: "pointer" }}
          >
            x
            </span>
           
        </div>}
      <div>
        {enabled && (
          <NotificationContext.Provider
            value={{
              showToast,
              showModal,
            }}
          >
            <Form.Control
              type='hidden'
              id='lang-detector'
              ref={langDetector}
              onChange={(e) => {

                // console.log(e.target.value)
              }
              }
            />
            <ManagersContext.Provider
              value={{
                CPMSettingsMng,
                VoteRulesMng,
                TimeframesMng,
                UserTypeMng,
              }}
            >
              <AppContext.Provider
                  value={{
                    addPaxWalletPop,
                    setAddPaxWalletPop,
                    walletTab,
                    setWalletTab,
                    avatarImage,
                    setAvatarImage,
                    selectBioEdit,
                    setSelectBioEdit,
                    isVirtualCall, 
                    setIsVirtualCall,
                  withLoginV2e,
                  setWithLoginV2e,
                  transactionId,
                  setTransactionId,
                  setBackgrounHide,
                  backgrounHide,
                  voteNumberEnd,
                  setvoteNumberEnd,
                  albumOpen,
                  setAlbumOpen,
                  afterVotePopup,
                  setAfterVotePopup,
                  rewardExtraVote,
                  setRewardExtraVote,
                  headerExtraVote,
                  setHeaderExtraVote,
                  inOutReward,
                  setInOutReward,
                  showReward,
                  setShowReward,
                  showBack,
                  setShowBack,
                  followerUserId,
                  setFollowerUserId,
                  singalCardData,
                  setSingalCardData,
                  remainingTimer,
                  setNftAlbumData,
                  nftAlbumData,
                  setAllPariButtonTime,
                  allPariButtonTime,
                  allButtonTime,
                  forRun,
                  setForRun,
                  setAllButtonTime,
                  chosenUserType,
                  setChosenUserType,
                  setLoginRedirectMessage,
                  loginRedirectMessage,
                  paxData,
                  setPaxData,
                  appStats,
                  setAppStats,
                  authStateChanged,
                  login,
                  setLogin,
                  profileTab,
                  setProfileTab,
                  signup,
                  setSignup,
                  firstTimeLogin,
                  setFirstTimeLogin,
                  showMenubar,
                  setShowMenuBar,
                  firstTimeAvatarSlection,
                  setFirstTimeAvatarSelection,
                  menuOpen,
                  setMenuOpen,
                  fcmToken,
                  setFcmToken,
                  lang,
                  setLang,
                  rtl,
                  setRtl,
                  languages,
                  setLanguages,
                  translations,
                  isWLDPEventRegistered,
                  setIsWLDPEventRegistered,
                  setTranslations: (newTranslations) => {
                    newTranslations = new Map(newTranslations);
                    translations.clear();
                    newTranslations.forEach(async (value, key) => {
                      translations.set(key, value);
                      await setDoc(doc(db, "translations", key), value);
                    });
                  },
                  userTypes,
                  setUserTypes: async (u: UserTypeProps[]) => {
                    u = UserTypeMng.setter(u);
                    if (validateTotalShare(u)) {
                      await setDoc(
                        doc(db, "settings", "userTypes"),
                        {
                          userTypes: u,
                        },
                        { merge: true }
                      );
                    } else {
                      if (u.every((uu) => uu.share)) {
                        showToast(texts.Total100, ToastType.ERROR);
                      }
                    }
                  },
                  CPMSettings,
                  setCPMSettings: async (settings: CPMSettings) => {
                    settings = CPMSettingsMng.setter(settings);
                    await setDoc(
                      doc(db, "settings", "settings"),
                      {
                        voteRules: voteRules || {},
                        CPMSettings: settings,
                      },
                      { merge: true }
                    );
                  },
                  voteRules,
                  setVoteRules: async (rules: VoteRules) => {
                    rules = VoteRulesMng.setter(rules);
                    await setDoc(
                      doc(db, "settings", "settings"),
                      {
                        voteRules: rules,
                        CPMSettings: CPMSettings || {},
                      },
                      { merge: true }
                    );
                  },
                  timeframes,
                  setTimeframes: async (t: TimeFrame[]) => {
                    t = TimeframesMng.setter(t);
                    await setDoc(
                      doc(db, "settings", "timeframes"),
                      {
                        timeframes: t.filter(
                          (tt) => isNumber(tt.index) && tt.seconds && tt.name
                        ),
                      },
                      { merge: true }
                    );
                  },
                }}
              >
                <ContentContext.Provider
                  value={{
                    pages,
                    setPages,
                    quotes,
                  }}
                >
                  <CoinsContext.Provider
                    value={{
                      allCoinsSetting,
                      changePrice,
                      setChangePrice,
                      ws,
                      socket,
                      socketConnect,
                      rest,
                      coins,
                      setCoins,
                      myCoins,
                      setMyCoins,
                      leaders,
                      setLeaders,
                      totals,
                      setTotals,
                      allCoins,
                      allPairs,
                    }}
                  >
                    <UserContext.Provider
                      value={{
                        notifications,
                        setNotifications,
                        admin,
                        setAdmin,
                        user,
                        userInfo,
                        displayName,
                        setDisplayName,
                        setUser: updateUser,
                        setUserInfo,
                        votesLast24Hours,
                        setVotesLast24Hours,
                      }}
                    >
                      {/* <VoteProvider> */}
                      {getSubdomain() === "admin" && user && <Admin />}
                      {(getSubdomain() !== "admin" ||
                        (getSubdomain() === "admin" && !user)) && (
                          <>
                            <Background pathname={pathname} />
                            <AppContainer
                              fluid
                              pathname={pathname}
                              login={login || firstTimeLogin ? "true" : "false"}
                            >
                              
                              <Header
                                remainingTimer={remainingTimer}
                                setMfaLogin={setMfaLogin}
                                logo={
                                  (login && window.screen.width > 979) ||
                                  window.screen.width > 979
                                }
                                pathname={pathname}
                                title={
                                  // pathname !== "/" && !login ? (
                                  //   <H1 style={{color: "var(--white)"}}>
                                  //     {pathname !== "/login" && pathname !== "/signup" && fixTitle(
                                  //       getTitle(
                                  //         pages?.find((p) => p.slug === pathname.slice(1))
                                  //           ?.title || pathname.slice(1),
                                  //         lang,
                                  //       ),
                                  //       pathname,
                                  //     )}
                                  //   </H1>
                                  // ) : (
                                  <HomeContainer
                                    className='d-flex flex-column justify-content-center align-items-center p-0'
                                    width={width}
                                  >
                                    <div
                                      className='mb-2 d-flex align-items-center'
                                      style={{
                                        flexFlow:
                                          width && width > 979 ? "row" : "column",
                                        justifyContent:
                                          width && width > 979
                                            ? "center"
                                            : "center",
                                        width: width && width > 979 ? 233 : "auto",
                                      }}
                                    >
                                      <Link to={"/"} className="">
                                        {window.screen.width < 979 && (
                                          <Logo
                                            size={
                                              width && width > 979
                                                ? Size.XSMALL
                                                : Size.XSMALL
                                            }
                                          />
                                        )}

                                      </Link>
                                    </div>
                                  </HomeContainer>
                                }
                              />

                              {user && firstTimeLogin && (
                                <FirstTimeLogin
                                  setFirstTimeAvatarSelection={
                                    setFirstTimeAvatarSelection
                                  }
                                  generate={generateUsername}
                                  
                                  saveUsername={async (username:any, DisplayName:any) => {
                                    if (user?.uid) {
                                      await saveUsername(user?.uid, username, "");
                                      await saveDisplayName(user?.uid, DisplayName, "");
                                      setFirstTimeAvatarSelection(true);
                                      // setFirstTimeFoundationSelection(true);
                                      setFirstTimeLogin(false);
                                    }
                                  }}                                  
                                />
                              )}

                              {!firstTimeLogin && firstTimeAvatarSlection && (
                                <FirstTimeAvatarSelection
                                  user={user}
                                  setFirstTimeAvatarSelection={
                                    setFirstTimeAvatarSelection
                                  }
                                  setSelectBioEdit={
                                    setSelectBioEdit
                                  }
                                />
                              )}
                              
                              {!firstTimeLogin && !firstTimeAvatarSlection && selectBioEdit && (
                                <SelectBio
                                  userData={user}
                                  setSelectBioEdit={
                                    setSelectBioEdit
                                  }
                                  // setFirstTimeAvatarSelection={
                                  //   setFirstTimeAvatarSelection
                                  // }
                                />
                              )}
                              {/* {!firstTimeAvatarSlection &&
                            firstTimeFoundationSelection && (
                              <FirstTimeFoundationSelection
                                user={user}
                                setFirstTimeFoundationSelection={
                                  setFirstTimeFoundationSelection
                                }
                              />
                            )} */}
                              {!firstTimeLogin && (
                                <>
                                  {!user && login && !mfaLogin && (
                                    <LoginAndSignup
                                      {...{
                                        authProvider: LoginAuthProvider,
                                        loginAction: LoginRegular,
                                        signupAction: SignupRegular,
                                      }}
                                    />
                                  )}
                                  {/* {(user || userInfo?.uid) && login && (
                                    <Login2fa
                                      setLogin={setLogin}
                                      setMfaLogin={setMfaLogin}
                                    />
                                  )} */}
                                  {(user || userInfo?.uid) && localStorage.getItem('mfa_passed') === 'true' && (
                                    <Login2fa
                                      setLogin={setLogin}
                                      setMfaLogin={setMfaLogin}
                                    />
                                  )}
                                  {(
                                    !login &&
                                    !firstTimeAvatarSlection &&
                                    !firstTimeFoundationSelection && !selectBioEdit && localStorage.getItem('mfa_passed') != 'true') && (
                                      <>
                                        <Container
                                          fluid
                                          style={{
                                            background:
                                              pathname == "/" ? "#160133" : "",
                                            whiteSpace: "normal",
                                            wordWrap: "break-word",
                                            minHeight:
                                              window.screen.width < 979
                                                ? "89vh"
                                                : "92vh",
                                            // padding: `${pathname === "/" ? 120 : 84}px 0 109px`,
                                            padding: `${pathname === "/" ? 160 : 120
                                              }px 0 0`,
                                            // transformStyle: "flat",
                                            // transform: `${backgrounHide ? "scale(1.5)" : "scale(1)"}`,
                                            transform: `${backgrounHide ? `${window.screen.width > 767 ? "scale(3)" : "scale(1.5)"}` : "scale(1)"}`,
                                            transformOrigin: `${backgrounHide ? `${window.screen.width > 767 ? "35% 50%" : "50% 90%"}` : ""}`,
                                            transition: `${backgrounHide ? "all 3s" : ""}`,

                                          }}
                                        >                                          
                                          <Routes>
                                            <Route path='/' element={

                                              <Home />} />
                                            <Route path='/firebase-messaging-sw.js' element={<Home />} />
                                            <Route
                                              path='coins'
                                              element={<CoinMain />}
                                            />
                                            {/* <Route
                                              path='nftAlbum'
                                              element={<NFTGallery />}
                                            /> */}
                                            <Route
                                              path='nftAlbum'
                                              element={<NFTGallery />}
                                            />
                                            <Route
                                              path='nftAlbum/:type'
                                              element={<NFTGalleryType />}
                                            />
                                            <Route
                                              path='singalCard/:type/:id'
                                              element={<SingalCard />}
                                            />
                                            <Route
                                            path='singlecarddetails/:type/:id'
                                            element={<SingleCardDetails />}
                                            />
                                            <Route
                                              path='coins/:id'
                                              element={<SingleCoin />}
                                            />
                                            <Route
                                              path='pairs'
                                              element={<PairsMain />}
                                            />
                                            <Route
                                              path='pairs/:id'
                                              element={<SinglePair />}
                                            />
                                            <Route
                                              path={ProfileTabs.profile}
                                              element={<Profile />}

                                            >
                                              <Route
                                                path={ProfileTabs.edit}

                                                element={<PersonalInfo />}
                                              />
                                              <Route
                                                path={ProfileTabs.history}

                                                element={<PaymentHistory />}
                                              />
                                            {/* <Route
                                              path={ProfileTabs.foundationshow}

                                                element={<FoundationData />}
                                              /> */}
                                              <Route
                                                path={ProfileTabs.password}
                                                element={<Security />}
                                              />
                                              <Route
                                                path={
                                                  ProfileTabs.wallet
                                                }
                                                element={<Wallet />}
                                              />


                                              {!isV1() && (
                                                <Route
                                                  path={ProfileTabs.mine}
                                                  element={<Mine />}
                                                />
                                              )}
                                              <Route
                                                path={ProfileTabs.followers}
                                                element={<Follow />}
                                              />
                                              <Route
                                                path={ProfileTabs.votes}
                                                element={<Votes />}
                                              />
                                              <Route
                                                path={ProfileTabs.share}
                                                element={<Pool />}
                                              />
                                              <Route
                                                path={ProfileTabs.notifications}
                                                element={<Notifications />}
                                              />
                                              <Route
                                                path={
                                                  ProfileTabs.ProfileNftGallery
                                                }
                                                element={<ProfileNftGallery />}
                                              />
                                              <Route
                                                path={
                                                  ProfileTabs.ProfileNftGalleryType
                                                }
                                                element={<ProfileNftGalleryType />}
                                              />

                                            </Route>
                                            {/* Fowller component  start*/}
                                            <Route
                                              path={FollowerProfileTabs.FollowerProfile}
                                              element={<FollowerProfile />}
                                            >
                                              {!isV1() && (
                                                <Route
                                                  path={FollowerProfileTabs.mine}
                                                  element={<FwMine />}
                                                />
                                              )}

                                              <Route
                                                path={FollowerProfileTabs.followers}
                                                element={<FwFollow />}
                                              />
                                              <Route
                                                path={FollowerProfileTabs.votes}
                                                element={<FwVotes />}
                                              />
                                              <Route
                                                path={FollowerProfileTabs.share}
                                                element={<FwPool />}
                                              />
                                              <Route
                                                path={
                                                  FollowerProfileTabs.ProfileNftGallery
                                                }
                                                element={<FwProfileNftGallery />}
                                              />
                                              <Route
                                                path={
                                                  FollowerProfileTabs.ProfileNftGalleryType
                                                }
                                                element={<FwProfileNftGalleryType />}
                                              />
                                            </Route>

                                            {/* Fowller component  end*/}
                                            <Route
                                              path='/upgrade'

                                              element={<UpgradePageCopy />}
                                            />
                                            {/* <Route
                                              path='/paymentList'
                                              element={<CoinsList />}
                                          /> */}

                                            <Route path='/paymentList'
                                              // element={user && userInfo?.uid ? <CoinsList /> : <Navigate to="/" />}
                                              element={

                                                <PaymentFun
                                                  isVotingPayment={false}
                                                />
                                              }
                                            />
                                            <Route path='/VotePayment'
                                              // element={user && userInfo?.uid ? <CoinsList /> : <Navigate to="/" />}
                                              element={<PaymentFun
                                                isVotingPayment={true}
                                              />}
                                            />
                                            <Route
                                              path='/votingbooster'
                                              element={<VotingBoosterCopy />}
                                            />
                                            <Route
                                              path='influencers'
                                              element={<Influencers />}
                                            />

                                            {/* <Route path="signup" element={<LoginAndSignup/>}/> */}
                                          <Route path='knowledgehub' element={<FAQ />} />
                                            <Route
                                              path='about'
                                              element={<About />}
                                            />
                                            <Route
                                              path='gamerule'
                                              element={<GameRule />}
                                            />
                                            <Route
                                              path='Ambassador'
                                              element={<Ambassador />}
                                            />
                                            <Route
                                              path='foundations'
                                              element={<Foundations />}
                                            />
                                            <Route
                                              path='contact'
                                              element={<Contact />}
                                            />
                                            <Route
                                              path='privacy'
                                              element={<PrivacyPolicy />}
                                            />
                                            <Route
                                              path='/terms-and-condition'
                                              element={<TermsAndConditions />}
                                            />
                                            {localhost && user && (
                                              <Route
                                                path='admin'
                                                element={<Admin />}
                                              />
                                            )}
                                            {pages
                                              ?.filter((p) => p.title !== "x")
                                              .map((page, u) => (
                                                <Route
                                                  key={u}
                                                  path={page.slug}
                                                  element={<Content />}
                                                />
                                              ))}

                                            <Route path='*' element={<Content />} />


                                            {<Route path='/generic-signup' element={
                                              !user && !localID ?
                                                <GenericLoginSignup />
                                                : <Navigate to="/" />
                                            } />}

                                          </Routes>
                                        </Container>
                                        <Footer />
                                      </>
                                    )}
                                </>
                              )}
                            </AppContainer>
                          </>
                        )}
                      <ToastContainer enableMultiContainer containerId='toast' limit={1} />
                      <ToastContainer enableMultiContainer containerId='modal' />
                      {modalOpen && <div className='fade modal-backdrop show' />}
                      {/* //vote result modal */}
                      {/* @ts-ignore */}
                      {voteDetails?.lessTimeVote && !pathname.toLowerCase().includes(`profile/mine`) && user && <ModalForResult
                        popUpOpen={voteDetails.openResultModal}
                        vote={voteDetails?.lessTimeVote}
                        type={voteDetails?.lessTimeVote?.voteType || 'coin'}
                        setLessTimeVoteDetails={setLessTimeVoteDetails}
                        setShowComplete100CMP={setShowComplete100CMP}
                        currentCMP={completedVoteCMP}
                      />}
                      {/* complete 100 cmp notify  */}
                      <Complete100CMPModal setCurrentCMP={setCompletedVoteCMP} showComplete100CMP={showComplete100CMP} setShowComplete100CMP={setShowComplete100CMP} />
                    </UserContext.Provider>
                  </CoinsContext.Provider>
                </ContentContext.Provider>
              </AppContext.Provider>
            </ManagersContext.Provider>
          </NotificationContext.Provider>
        )}
        {!enabled && (
          <Container>
            <Form
              onSubmit={async (e) => {
                e.preventDefault();
                const resp = await sendPassword({ password });
                // console.log(resp.data);
                if (resp.data === true) {
                  enable(true);
                }
              }}
            >
              <Form.Group className='mb-3' controlId='formBasicPassword'>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Password'
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Button type='submit'>Submit</Button>
            </Form>
          </Container>
        )}
      </div>
    </BackDiv>
  );
}

export default App;
export const showToast = (
  content: ToastContent,
  type?: ToastType,
  options: ToastOptions | undefined = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    containerId: "toast",
  }
) => {
  toast.dismiss();
  toast.clearWaitingQueue();
  switch (type) {
    case ToastType.ERROR:
      toast.error(content, options);
      break;
    case ToastType.INFO:
      toast.info(content, options);
      break;
    default:
      toast.success(content, options);
  }
};