/** @format */

import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import UserContext, { getUserInfo, saveUsername } from "./Contexts/User";
// import FollowerContext, { getFollowerInfo } from "./Contexts/FollowersInfo";
import { texts } from './Components/LoginComponent/texts'
import { NotificationProps, UserProps } from "./common/models/User";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
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
  getAllCoins,
  getCoins,
  saveAllCoins,
  // saveCoins,
} from "./common/models/Coin";
import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db, functions, messaging } from "./firebase";
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
import firebase from "firebase/compat";
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
import Votes from "./Components/Profile/Votes";
import { ToastContent, ToastOptions } from "react-toastify/dist/types";
import FAQ from "./Pages/FAQ";
import styled from "styled-components";
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
import VotingBooster from "./Components/Profile/VotingBooster";
import ProfileNftGallery from "./Pages/ProfileNftGallery";
import ProfileNftGalleryCopy from "./Pages/ProfileNftGalleryCopy";
import GameRule from "./Pages/GameRule";
import Partners from "./Pages/Partners";
import Foundations from "./Pages/Foundations";
import ProfileNftGalleryType from "./Pages/ProfileNftGalleryType";
import SingalCard from "./Pages/SingalCard";
import FwMine from "./Components/FollowerProfile/FwMine";
import FwFollow from "./Components/FollowerProfile/FwFollow";
import FwVotes from "./Components/FollowerProfile/FwVotes";
import FwPool from "./Components/FollowerProfile/FwPool";
import FwProfileNftGallery from "./Pages/FwProfileNftGallery";
import FwProfileNftGalleryType from "./Pages/FwProfileNftGalleryType";
import Wallet from "./Components/Profile/Wallet";
import { pwaInstallHandler } from 'pwa-install-handler'
// import GoogleAuthenticator from "./Components/Profile/GoogleAuthenticator";
import Login2fa from "./Components/LoginComponent/Login2fa";
// import { handleSoundClick } from "./common/utils/SoundClick";
// import createFastContext from "./hooks/createFastContext";
import TermsAndConditions from "./Pages/TermsAndConditions";
import { VoteContext, VoteContextType, VoteDispatchContext, VoteProvider } from "Contexts/VoteProvider";
import { vote } from "common/models/canVote.test";
import { setTimeout } from "timers";
import NFTGalleryCopy from "Pages/NFTGalleryCopy";
import FwProfileNftGalleryCopy from "Pages/FwProfileNftGalleryCopy";
import ModalForResult from "Pages/ModalForResult";
import { CompletedVotesContext, CompletedVotesDispatchContext } from "Contexts/CompletedVotesProvider";
import { CurrentCMPDispatchContext } from "Contexts/CurrentCMP";
import CoinsList from "Components/Profile/CoinsList";

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
  //   const [displayFullscreen,setDisplayFullscreen]=useState('none')
  // // fullscreen mode
  // useEffect(() => {
  // window.addEventListener('load', () => {
  //   setDisplayFullscreen('block')
  // });
  // }, [])
  // const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  // // @ts-ignore
  // const fullscreenEnabled = document.fullscreenEnabled || document?.webkitFullscreenEnabled || document?.mozFullScreenEnabled || document?.msFullscreenEnabled;

  // const handleClick=()=>{
  //   setDisplayFullscreen('none')
  //   if (isMobile && fullscreenEnabled) {
  //     const elem = document.documentElement;
  //     if (elem.requestFullscreen) {
  //       elem.requestFullscreen();
  //     }
  //     // @ts-ignore
  //     else if (elem?.webkitRequestFullscreen) {
  //        // @ts-ignore
  //       elem?.webkitRequestFullscreen();
  //     }
  //      // @ts-ignore
  //     else if (elem?.mozRequestFullScreen) {
  //        // @ts-ignore
  //       elem?.mozRequestFullScreen();
  //     }
  //      // @ts-ignore
  //      else if (elem?.msRequestFullscreen) {
  //         // @ts-ignore
  //       elem?.msRequestFullscreen();
  //     }
  //   }
  // }


  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

  }, [pathname])


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
        showToast(
          <div>
            <h5>{title}</h5>
            <p>{body}</p>
          </div>
        );
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
  const [user, setUser] = useState<User>();
  const [userInfo, setUserInfo] = useState<UserProps>();
  const [displayName, setDisplayName] = useState<string>("");
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileTab, setProfileTab] = useState(ProfileTabs.profile);
  const [firstTimeAvatarSlection, setFirstTimeAvatarSelection] =
    useState(false);
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
  const [albumOpen, setAlbumOpen] = useState<any>("")

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

  console.log(coins, "allcoinsCheck")

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
  useEffect(() => {
    const isMFAPassed = window.localStorage.getItem('mfa_passed')
    if (isMFAPassed == 'true' && !login) {

      console.log('2faCalled')
      // @ts-ignore
      Logout(setUser)
    }
  }, [])

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
    setUserInfo(info);
    setDisplayName(info.displayName + "");
  }, []);


  // const FollowerData = async(id:any) => {     
  //   const Followerinfo =  await getFollowerInfo(id);
  //   return Followerinfo
  // }

  console.log(remainingTimer, "remainingTimer")

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
    // const buttons = document.getElementsByTagName('button');
    // console.log('buttondata',buttons);
    // for (let i = 0; i < buttons.length; i++) {
    //   buttons[i].addEventListener('click', handleSoundClick);
    // }

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
    // return () => {
    //   for (let i = 0; i < buttons.length; i++) {
    //     buttons[i].removeEventListener('click', handleSoundClick);
    //   }
    // }
  }, [location, search]);

  // useEffect(() => {
  //   if (!user) {
  //     navigate("/", {replace: true});
  //   }
  // }, [user]);

  useEffect(() => {

    // @ts-ignore
    if ((user && userInfo && userInfo?.displayName === "" && userUid) || userInfo?.firstTimeLogin) {
      setFirstTimeLogin(true);
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



  useEffect(() => {
    Notification.requestPermission()
      .then((permission) => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
          // Get the device token to send messages to individual devices
          getToken(messaging, {
            vapidKey: process.env.REACT_APP_FIREBASE_MESSAGING_VAPID_KEY,
          }).then((token) => {
            setFcmToken(token)
          }).catch((e) => {
            console.log('hello', e);
          });
        } else {
          console.log("Notification permission denied.");
          return null;
        }
      }).catch((error) => {
        console.error("Error getting notification permission:", error);
      });

  }, []);




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
            console.log(doc.data(), ".data")
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
    const coinData = firebase
      .firestore()
      .collection("stats").doc('coins')
    coinData.get()
      .then((snapshot: any) => {
        //  console.log('allcoin',snapshot.data())
        setCoins(snapshot.data());
      });

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
            console.log("An error occurred while retrieving token. pkkkkkkkkk ", e);
          }
        } else {
          await updateUser();
        }
      });
    }
  }, [user, fcmToken, coins]);

  useEffect(() => {

    if (user?.uid) {

      const currentTime = firebase.firestore.Timestamp.fromDate(new Date());
      // const last24Hour = currentTime.toMillis() - 24 * 60 * 60 * 1000;
      const last24Hour = currentTime.toMillis() - voteRules.timeLimit * 1000;

      const votesLast24HoursRef = firebase
        .firestore()
        .collection("votes")
        .where("userId", "==", user?.uid)
        .where("voteTime", ">=", last24Hour)
        .where("voteTime", "<=", Date.now());
      votesLast24HoursRef.get()
        .then((snapshot) => {
          setVotesLast24Hours(snapshot.docs.map((doc) => doc.data() as unknown as VoteResultProps));
          const data = snapshot.docs.map((doc) => doc.data() as unknown as VoteResultProps)
          // let remaining = (Math.min(...data.map((v) => v.voteTime)) + voteRules.timeLimit * 1000) - Date.now();
          // setRemainingTimer((Math.min(...data.map((v) => v.voteTime)) + voteRules.timeLimit * 1000))
          // console.log(voteRules.timeLimit, remaining, Date.now(), data, 'hello');

          // setTimeout(() => {
          //   if (user?.uid) {
          //     console.log('hello');

          //     const currentTime = firebase.firestore.Timestamp.fromDate(new Date());
          //     // const last24Hour = currentTime.toMillis() - 24 * 60 * 60 * 1000;
          //     const last24Hour = currentTime.toMillis() - voteRules.timeLimit * 1000;

          //     const votesLast24HoursRef = firebase
          //       .firestore()
          //       .collection("votes")
          //       .where("userId", "==", user?.uid)
          //       .where("voteTime", ">=", last24Hour)
          //       .where("voteTime", "<=", Date.now());
          //     // console.log('extravote11',votesLast24HoursRef)
          //     votesLast24HoursRef.get()
          //       .then((snapshot) => {
          //         setVotesLast24Hours(snapshot.docs.map((doc) => doc.data() as unknown as VoteResultProps));

          //       })
          //       .catch((error) => {
          //         console.log('extravoteError', error);
          //       });
          //   }
          // }, remaining);
        })
        .catch((error) => {
          console.log('extravoteError', error);
        });
    }


  }, [userInfo?.voteStatistics?.total])
  console.log('usermfa', userInfo)
  useEffect(() => {
    if (user?.uid && voteNumberEnd == 0) {
      const currentTime = firebase.firestore.Timestamp.fromDate(new Date());
      // const last24Hour = currentTime.toMillis() - 24  60  60 * 1000;
      const last24Hour = currentTime.toMillis() - voteRules.timeLimit * 1000;

      const votesLast24HoursRef = firebase
        .firestore()
        .collection("votes")
        .where("userId", "==", user?.uid)
        .where("voteTime", ">=", last24Hour)
        .where("voteTime", "<=", Date.now());
      votesLast24HoursRef.get()
        .then((snapshot) => {
          setVotesLast24Hours(snapshot.docs.map((doc) => doc.data() as unknown as VoteResultProps));
          const data = snapshot.docs.map((doc) => doc.data() as unknown as VoteResultProps)
          let remaining = (Math.min(...data.map((v) => v.voteTime)) + voteRules.timeLimit * 1000) - Date.now();
          setRemainingTimer((Math.min(...data.map((v) => v.voteTime)) + voteRules.timeLimit * 1000))
          // console.log(remaining ,"allremaining")
          setTimeout(() => {
            const usereData = firebase
              .firestore()
              .collection("users")
              .doc(user?.uid)
              .set({ "voteValue": voteRules?.maxVotes }, { merge: true });
          }, remaining);
        }).catch((error) => {
          console.log('extravoteError', error);
        });
    }

  }, [voteNumberEnd])


  // useEffect(() => {
  //   if (user?.uid && voteNumberEnd==0) { 
  //     const currentTime = firebase.firestore.Timestamp.fromDate(new Date());

  //       const last24Hour = currentTime.toMillis() - voteRules.timeLimit * 1000;

  //       const votesLast24HoursRef = firebase
  //         .firestore()
  //         .collection("votes")
  //         .where("userId", "==", user?.uid)
  //         .where("voteTime", ">=", last24Hour)
  //         .where("voteTime", "<=", Date.now());
  //       votesLast24HoursRef.get()
  //         .then((snapshot) => {

  //           const data = snapshot.docs.map((doc) => doc.data() as unknown as VoteResultProps)
  //           let remaining = (Math.min(...data.map((v) => v.voteTime)) + voteRules.timeLimit * 1000) - Date.now();

  //           setRemainingTimer((Math.min(...data.map((v) => v.voteTime)) + voteRules.timeLimit * 1000))

  //           setTimeout(() => {
  //             if (user?.uid) {
  //               console.log('hello');

  //               const currentTime = firebase.firestore.Timestamp.fromDate(new Date());

  //               const last24Hour = currentTime.toMillis() - voteRules.timeLimit * 1000;

  //               const votesLast24HoursRef = firebase
  //                 .firestore()
  //                 .collection("votes")
  //                 .where("userId", "==", user?.uid)
  //                 .where("voteTime", ">=", last24Hour)
  //                 .where("voteTime", "<=", Date.now());

  //               votesLast24HoursRef.get()
  //                 .then((snapshot) => {
  //                   setVotesLast24Hours(snapshot.docs.map((doc) => doc.data() as unknown as VoteResultProps));

  //                 })
  //                 .catch((error) => {
  //                   console.log('extravoteError', error);
  //                 });
  //             }
  //           }, remaining);
  
  //         })
  //         .catch((error) => {
  //           console.log('extravoteError', error);
  //         });
  //   }

  // }, [voteNumberEnd])


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

  // useEffect(() => {
  //   async function removeData() {
  //     const voteData = await firebase.firestore().collection('votes').where("userId", "==", "gK7iyJ8ysrSXQGKO4vch89WHPKh2").get();
  //     const batch = firebase.firestore().batch();
  //     voteData.forEach(doc => {
  //       batch.delete(doc.ref);
  //     });
  //     await batch.commit();

  //     console.log("User vote data deleted");
  //   }
  //   removeData()
  // }, [])



  function connect() {
    if (Object.keys(coins).length === 0) return
    console.log('Browser window called')
    ws = new WebSocket('wss://stream.binance.com:9443/ws');
    console.log('websocket connected first time')
    const coinTikerList = Object.keys(coins).map(item => `${item.toLowerCase()}usdt@ticker`)
    ws.onopen = () => {
      setSocketConnect(true)
      ws.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: coinTikerList,
        id: 1
      }));
    };

    socket = new WebSocket('wss://stream.crypto.com/v2/market');

    socket.onopen = () => {
      const req = {
        id: 1,
        method: 'subscribe',
        params: {
          channels: ['ticker.CRO_USDT'],
        },
      };
      socket.send(JSON.stringify(req));
    };
    ws.onclose = (event: any) => {
      if (!login) window.location.reload()
      console.log('WebSocket connection closed');
      if (event.code !== 1000) {
        console.log('WebSocket Attempting to reconnect in 5 seconds...');
        setTimeout(() => {
          connect();
        }, 5000);
      }
    };

    ws.onerror = () => {
      if (!login) window.location.reload()
      console.log('WebSocket connection occurred');
    };
    const timeout = 30000; // 30 seconds
    let timeoutId: any;
    const checkConnection = () => {
      if (ws.readyState !== WebSocket.OPEN) {
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
  // useEffect(() => {
  //   document.addEventListener("visibilitychange", handleVisibilityChange);
  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   }
  // }, []);

  // const handleVisibilityChange = () => {
  //   const isIPhone = /iPhone/i.test(navigator.userAgent);

  //   if (isIPhone) {
  //     console.log('This is an iPhone');
  //   } else {
  //     console.log('This is not an iPhone');
  //   }
  //   if (document.hidden) {
  //     console.log("Browser window is minimized");
  //     ws.close();
  //     socket.close();
  //   } else {
  //     connect();
  //     console.log("Browser window is not minimized");
  //   }
  // }
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
      console.log('success')
      // if(data.data==null){
      //     getVotes(index).then(void 0);     
      // }
    }).catch((err: any) => {
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

  ///start vote result //
  const voteDetails = useContext(VoteContext);
  const setVoteDetails = useContext(VoteDispatchContext);

  const completedVotes = useContext(CompletedVotesContext);
  const setCompletedVotes = useContext(CompletedVotesDispatchContext);

  const getPriceCalculation = httpsCallable(functions, "getOldAndCurrentPriceAndMakeCalculation");
  const [calculateVote, setCalculateVote] = useState<boolean>(true);
  const [lessTimeVoteDetails, setLessTimeVoteDetails] = useState<VoteResultProps | undefined>();
  const setCurrentCMP = useContext(CurrentCMPDispatchContext);


  useEffect(() => {
    if (completedVotes.length > 0 && !voteDetails.openResultModal) {
      if (!pathname.toLowerCase().includes(`profile/mine`)) {
        localStorage.setItem(`${user?.uid}_newScores`, `${(completedVotes[0]?.score || 0) + parseFloat(localStorage.getItem(`${user?.uid}_newScores`) || '0')}`);
      }
      setVoteDetails((prev: VoteContextType) => {
        return {
          ...prev,
          lessTimeVote: completedVotes[0],
          openResultModal: true
        }
      });
      setCurrentCMP((completedVotes[0]?.score || 0) /* + parseFloat(localStorage.getItem(`${user?.uid}_newScores`) || '0') */)
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
    if (tempTessTimeVote /* && lessTimeVoteDetails?.voteId !== tempTessTimeVote.voteId */ /* calculateVote */) {
      setLessTimeVoteDetails(tempTessTimeVote);
      timeEndCalculation(tempTessTimeVote);
      // setCalculateVote(false);
    }
  }, [voteDetails?.activeVotes]);
  const voteImpact = useRef<{
    timeFrame: number,
    impact: null | number
  }>({
    timeFrame: 0,
    impact: null
  });
  const latestVote = useRef<VoteContextType>();



  useEffect(() => {
    voteImpact.current = voteDetails.voteImpact;
    latestVote.current = voteDetails;
  }, [voteDetails]);
  const timeEndCalculation = (lessTimeVote: VoteResultProps) => {
    if (lessTimeVote) {

      console.log(completedVotes, voteDetails, lessTimeVote, 'pkkk');
      // let exSec = new Date(-).getSeconds();
      // current date
      let current = new Date();

      // voteTime date
      let voteTime = new Date(lessTimeVote?.expiration);

      // finding the difference in total seconds between two dates

      let second_diff = (voteTime.getTime() - current.getTime()) / 1000;
      // if (second_diff > 0) {
      const timer = setTimeout(async () => {
        const coin = lessTimeVote?.coin.split('-') || [];
        const coin1 = `${coins && lessTimeVote?.coin[0] ? coins[coin[0]]?.symbol?.toLowerCase() || "" : ""}`;
        const coin2 = `${coins && coin?.length > 1 ? coins[coin[1]]?.symbol?.toLowerCase() || "" : ""}`;

        console.log(coins[coin1.toUpperCase()]?.price, coins[coin2.toUpperCase()], coins, "coinsname")
        await getPriceCalculation({
          ...{
            coin1: `${coin1 != "" ? coin1 + "usdt" : ""}`,
            coin2: `${coin2 != "" ? coin2 + "usdt" : ""}`,
            voteId: lessTimeVote?.id,
            voteTime: lessTimeVote?.voteTime,
            valueVotingTime: lessTimeVote?.valueVotingTime,
            expiration: lessTimeVote?.expiration,
            timestamp: Date.now(),
            userId: lessTimeVote?.userId,

          }, ...(
            (pathname.includes(lessTimeVote?.coin) && lessTimeVote?.timeframe.index === voteImpact.current?.timeFrame && voteImpact.current?.impact !== null) ?
              {
                status: voteImpact.current?.impact,
                valueExpirationTimeOfCoin1: myCoins[coin1.toUpperCase()]?.price || null,
                valueExpirationTimeOfCoin2: myCoins[coin2.toUpperCase()]?.price || null,
              }
              :
              {}
          )
        }).then((response) => {
          if (response?.data && Object.keys(response.data).length > 0) {
            // setpopUpOpen(true);
            // setModalData(response!.data);
            // setLessTimeVote(undefined);
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
            // setModalData(response!.data);
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

  // useEffect(() => {
  // const coinData = firebase
  //   .firestore()
  //   .collection("settings").doc('settings')
  // coinData.get()
  //   .then((snapshot: any) => {
  //     console.log('hello', snapshot.data().voteRules.maxVotes)

  //     });
  // }, [])

  ///END vote result //

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
        // border: "1px solid red",
        // backgroundColor: "rgba(0,0,0,0.5)",
      }}
    >
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
                                  saveUsername={async (username) => {
                                    if (user?.uid) {
                                      await saveUsername(user?.uid, username, "");
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
                                  {(user || userInfo?.uid) && login && (
                                    <Login2fa
                                      setLogin={setLogin}
                                      setMfaLogin={setMfaLogin}
                                    />
                                  )}
                                  {!login &&
                                    !firstTimeAvatarSlection &&
                                    !firstTimeFoundationSelection && (
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
                                          }}
                                        >
                                          <div className='pwaPopup' style={{ display: pwaPopUp }}>
                                            <span>{texts.InstallCoinParliament}</span>
                                            <button
                                              className="link-button"
                                              id="setup_button"
                                              aria-label="Install app"
                                              title="Install app"
                                              onClick={onClick}
                                              style={{ zIndex: 99999 }}
                                            >
                                              {texts.Install}
                                            </button>
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
                                          </div>
                                          <Routes>
                                            <Route path='/' element={

                                              <Home />} />
                                            <Route path='/firebase-messaging-sw.js#' element={

                                              <Home />} />
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
                                              element={<NFTGalleryCopy />}
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
                                                element={<ProfileNftGalleryCopy />}
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
                                                element={<FwProfileNftGalleryCopy />}
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
                                              element={<UpgradePage />}
                                            />
                                            <Route
                                              path='/paymentList'
                                              element={<CoinsList />}
                                            />
                                            <Route
                                              path='/votingbooster'
                                              element={<VotingBooster />}
                                            />
                                            <Route
                                              path='influencers'
                                              element={<Influencers />}
                                            />

                                            {/* <Route path="signup" element={<LoginAndSignup/>}/> */}
                                            <Route path='faq' element={<FAQ />} />
                                            <Route
                                              path='about'
                                              element={<About />}
                                            />
                                            <Route
                                              path='gamerule'
                                              element={<GameRule />}
                                            />
                                            <Route
                                              path='partners'
                                              element={<Partners />}
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
                      {voteDetails?.lessTimeVote && user && <ModalForResult
                        popUpOpen={voteDetails.openResultModal}
                        vote={voteDetails?.lessTimeVote}
                        type={voteDetails?.lessTimeVote?.voteType || 'coin'}
                        setLessTimeVoteDetails={setLessTimeVoteDetails}
                      />}
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