/** @format */

import React, { useCallback, useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import UserContext, { getUserInfo, saveUsername } from "./Contexts/User";
import { NotificationProps, UserProps } from "./common/models/User";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { toast, ToastContainer, Zoom } from "react-toastify";
import Home from "./Pages/Home";
import Profile, { ProfileTabs } from "./Pages/Profile";
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
  saveCoins,
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
import { TimeFrame, VoteResultProps } from "./common/models/Vote";
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
import { Form } from "react-bootstrap";
import { rest, ws } from "./common/models/Socket";
import { httpsCallable } from "firebase/functions";
import ContentContext, { ContentPage } from "./Contexts/ContentContext";
import Content from "./Pages/Content";
import LoginAndSignup from "./Components/LoginComponent/LoginAndSignup";
import {
  LoginAuthProvider,
  LoginRegular,
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
import { myPages, quotes } from "./common/consts/contents";
import Notifications from "./Components/Profile/Notifications";
import Background from "./Components/Background";
import Spinner from "./Components/Spinner";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import useScrollPosition from "./hooks/useScrollPosition";
import Button from "./Components/Atoms/Button/Button";
import FirstTimeAvatarSelection from "./Components/LoginComponent/FirstTimeAvatarSelection";
import FirstTimeFoundationSelection from "./Components/LoginComponent/FirstTimeFoundationSelection";
import PrivacyPolicy from "./Pages/PrivacyPolicy";
import UpgradePage from "./Components/Profile/UpgradePage";
import VotingBooster from "./Components/Profile/VotingBooster";
import ProfileNftGallery from "./Pages/ProfileNftGallery";
import GameRule from "./Pages/GameRule";
import ProfileNftGalleryType from "./Pages/ProfileNftGalleryType";
import SingalCard from "./Pages/SingalCard";


const sendPassword = httpsCallable(functions, "sendPassword");
const localhost = window.location.hostname === "localhost";

function App() {
  const location = useLocation();
  const search = location.search;
  const pathname = location.pathname;
  const langDetector = useRef(null);
  let navigate = useNavigate();
  const { width } = useWindowSize();
  const scrollPosition = useScrollPosition();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
      // console.log("scrollTo");
}, [pathname])

  const showToast = useCallback(
    (
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
    },
    []
  );

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
    if('serviceWorker' in navigator) {
    navigator?.serviceWorker?.addEventListener("message", (message) => {
      const {
        notification: { body, title },
      } = message.data["firebase-messaging-msg-data"] as {
        notification: { body: string; title: string };
      };
      showToast(
        <div>
          <h5>{title}</h5>
          <p>{body}</p>
        </div>
      );
    });
  }
  });
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
  const [nftAlbumData, setNftAlbumData] = useState<any>();
  const [forRun, setForRun] = useState<any>(0);
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [pages, setPages] = useState<ContentPage[] | undefined>(myPages);
  const [coins, setCoins] = useState<{ [symbol: string]: Coin }>(
    getCoins() as { [symbol: string]: Coin }
  );
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
  const [remainingTimer,setRemainingTimer]=useState(0)
  const [CPMSettings, setCPMSettings] = useState<CPMSettings>(
    {} as CPMSettings
  );
  const [votesLast24Hours, setVotesLast24Hours] = useState<VoteResultProps[]>(
    []
  );
  const [userTypes, setUserTypes] = useState<UserTypeProps[]>([
    defaultUserType,
  ] as UserTypeProps[]);

  const updateUser = useCallback(async (user?: User) => {
    setUser(user);
    const info = await getUserInfo(user);
    setUserInfo(info);
    setDisplayName(info.displayName + "");
  }, []);
  useEffect(() => {
    if (user?.email && userInfo?.displayName === undefined) {
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
      setLogin(true);
      setSignup(true);
    } else {
      setLogin(false);
      setSignup(false);
    }
  }, [location, search, user]);

  // useEffect(() => {
  //   if (!user) {
  //     navigate("/", {replace: true});
  //   }
  // }, [user]);

  useEffect(() => {
    if (user && userInfo && userInfo?.displayName === "" && userUid) {
      setFirstTimeLogin(true);
    }
  }, [userInfo]);

  useEffect(() => {
    setMounted(true);
  }, [firstTimeLogin]);
console.log('extravote', votesLast24Hours)
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
    getToken(messaging, {
      vapidKey: process.env.REACT_APP_FIREBASE_MESSAGING_VAPID_KEY,
    }).then((token) => setFcmToken(token));
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

  const isAdmin = useCallback(async (uid?: string) => {
    if (uid) {
      const func = httpsCallable(functions, "isAdmin");
      return !!(await func({ user: uid })).data;
    }
  }, []);

  useEffect(() => {
    isAdmin(user?.uid).then((newAdmin) => setAdmin(newAdmin));
  }, [user?.uid, isAdmin]);

  useEffect(() => {
    onSnapshot(doc(db, "stats", "leaders"), (doc) => {
      setLeaders((doc.data() as { leaders: Leader[] })?.leaders || []);
      console.log("livedata", doc.data());
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

    onSnapshot(doc(db, "stats", "coins"), (doc) => {
      const newAllCoins = (doc.data() as { [key: string]: Coin }) || {};
      // setChangePrice(changePrice + 1)
      setCoins(newAllCoins);
      saveCoins(newAllCoins);
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
      
      saveAllCoins(newAllCoins);
      setAllCoins(newAllCoins);
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
  console.log("user", userInfo);
  useEffect(() => {
    const auth = getAuth();

    if (!firstTimeLogin) {
      onAuthStateChanged(auth, async (user: User | null) => {
        setAuthStateChanged(true);
        if (
          user?.emailVerified ||
          user?.providerData[0]?.providerId === "facebook.com"
        ) {
          setLogin(false);
          setSignup(false);
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
         

          try {
            if (fcmToken) {
              try {
                await setDoc(
                  doc(db, "users", user.uid),
                  { token: fcmToken },
                  { merge: true }
                );
                console.log("push enabled");
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
  
useEffect(() => {
  
  if(user?.uid){
   
  const currentTime = firebase.firestore.Timestamp.fromDate(new Date());
// const last24Hour = currentTime.toMillis() - 24 * 60 * 60 * 1000;
const last24Hour = currentTime.toMillis() - voteRules.timeLimit * 1000;
console.log('timelimit',voteRules.timeLimit)
const votesLast24HoursRef = firebase
            .firestore()
            .collection("votes")
            .where("userId", "==", user?.uid)
            .where("voteTime", ">=", last24Hour)
            .where("voteTime", "<=", Date.now());
// console.log('extravote11',votesLast24HoursRef)
votesLast24HoursRef.get()
    .then((snapshot) => {
        setVotesLast24Hours(snapshot.docs.map((doc) => doc.data() as unknown as VoteResultProps));
        console.log('extravoteSuccess',snapshot.docs)
        const data = snapshot.docs.map((doc) => doc.data() as unknown as VoteResultProps)
      let remaining= (Math.min(...data.map((v) => v.voteTime)) + voteRules.timeLimit * 1000) -  Date.now();
  console.log('votingTimer2',remaining)
  setRemainingTimer((Math.min(...data.map((v) => v.voteTime)) + voteRules.timeLimit * 1000))
  setTimeout(() => {
    if(user?.uid){
      console.log('votingTimer2',remaining)
      const currentTime = firebase.firestore.Timestamp.fromDate(new Date());
    // const last24Hour = currentTime.toMillis() - 24 * 60 * 60 * 1000;
    const last24Hour = currentTime.toMillis() - voteRules.timeLimit * 1000;
    console.log('timelimit',voteRules.timeLimit)
    const votesLast24HoursRef = firebase
                .firestore()
                .collection("votes")
                .where("userId", "==", user?.uid)
                .where("voteTime", ">=", last24Hour)
                .where("voteTime", "<=", Date.now());
    // console.log('extravote11',votesLast24HoursRef)
    votesLast24HoursRef.get()
        .then((snapshot) => {
            setVotesLast24Hours(snapshot.docs.map((doc) => doc.data() as unknown as VoteResultProps));
            console.log('extravoteSuccess',snapshot.docs)
        })
        .catch((error) => {
            console.log('extravoteError',error);
        });
      }
  }, remaining);
    })
    .catch((error) => {
        console.log('extravoteError',error);
    });
  }
  
 
}, [userInfo?.voteStatistics?.total])

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

  return loader ? (
    <div
      className='d-flex justify-content-center align-items-center'
      style={{ height: "100vh", width: "100vw", color: "white" }}
    >
      <Spinner />
    </div>
  ) : (
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
            onChange={(e) => console.log(e.target.value)}
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
                      showToast("total share must be 100%", ToastType.ERROR);
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
                      changePrice,
                    setChangePrice,
                    ws,
                    rest,
                    coins,
                    setCoins,
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
                    {getSubdomain() === "admin" && user && <Admin />}
                    {(getSubdomain() !== "admin" ||
                      (getSubdomain() === "admin" && !user)) && (
                      <>
                        <Background pathname={pathname} />
                        <AppContainer
                          fluid
                          pathname={pathname}
                          login={login || firstTimeLogin ? "true" : "false"}
                          // width={width}
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
                                  <Link to={"/"}>
                                    {window.screen.width < 979 && (
                                      <Logo
                                        size={
                                          width && width > 979
                                            ? Size.XSMALL
                                            : Size.XSMALL
                                        }
                                      />
                                    )}
                                    {/* {scrollPosition >= positionBreakpoint && window.screen.width<979 &&<Logo
                                        size={Size.XSMALL}
                                      />} */}
                                  </Link>
                                  {
                                    // ((scrollPosition < positionBreakpoint) && (width && width < 979)) && <H1
                                    //   desktop={
                                    //     width && width > 979 ? "true" : "false"
                                    //   }
                                    //   className="mt-2"
                                    //   onClick={() => navigate("/", {replace: true})}
                                    // >
                                    //   {/* {!login && !firstTimeFoundationSelection && !firstTimeLogin &&!firstTimeAvatarSlection? capitalize(translate("coin parliament", lang)): null} */}
                                    // </H1>
                                  }
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
                                  setFirstTimeFoundationSelection(true);
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
                          {!firstTimeAvatarSlection &&
                            firstTimeFoundationSelection && (
                              <FirstTimeFoundationSelection
                                user={user}
                                setFirstTimeFoundationSelection={
                                  setFirstTimeFoundationSelection
                                }
                              />
                            )}
                          {!firstTimeLogin && (
                            <>
                              {!user && login && (
                                <LoginAndSignup
                                  {...{
                                    authProvider: LoginAuthProvider,
                                    loginAction: LoginRegular,
                                    signupAction: SignupRegular,
                                  }}
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
                                        padding: `${
                                          pathname === "/" ? 160 : 120
                                        }px 0 0`,
                                      }}
                                    >
                                      <Routes>
                                        <Route path='/' element={<Home />} />
                                        <Route
                                          path='coins'
                                          element={<CoinMain />}
                                        />
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
                                          <Route
                                            path={ProfileTabs.share}
                                            element={<Pool />}
                                          />
                                        </Route>
                                        <Route
                                          path='/upgrade'
                                          element={<UpgradePage />}
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
                                          path='contact'
                                          element={<Contact />}
                                        />
                                        <Route
                                          path='privacy'
                                          element={<PrivacyPolicy />}
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
                    <ToastContainer enableMultiContainer containerId='toast' />
                    <ToastContainer enableMultiContainer containerId='modal' />
                    {modalOpen && <div className='fade modal-backdrop show' />}
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
              console.log(resp.data);
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
  );
}

export default App;
