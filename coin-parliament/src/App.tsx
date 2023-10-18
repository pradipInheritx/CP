/** @format */

import React, { useCallback, useEffect, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import UserContext, { getUserInfo, saveUsername } from "./Contexts/User";
import FollowerContext, { getFollowerInfo } from "./Contexts/FollowersInfo";
import { texts } from './Components/LoginComponent/texts'
import { NotificationProps, UserProps } from "./common/models/User";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  Link,
  Navigate,
  Route,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { toast, ToastContainer, Zoom } from "react-toastify";
import Home from "./Pages/Home";
import Profile, { ProfileTabs } from "./Pages/Profile";
import FollowerProfile, { FollowerProfileTabs } from "./Pages/FollowerProfile";
import Header from "./Components/Header/Header";
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
import { auth, V2EParliament, db, functions, messaging } from "./firebase";
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
import CardShow from "./Components/Pairs/CardShow";
import SinglePair from "./Pages/SinglePair";
import { ENGLISH, translations } from "./common/models/Dictionary";
import { getKeyByLang, getLangByKey } from "./common/consts/languages";
import { Form } from "react-bootstrap";
import { rest, ws } from "./common/models/Socket";
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
import { myPages, quotes } from "./common/consts/contents";
import Notifications from "./Components/Profile/Notifications";
import Background from "./Components/Background";
import Spinner from "./Components/Spinner";
import Button from "./Components/Atoms/Button/Button";
import FirstTimeAvatarSelection from "./Components/LoginComponent/FirstTimeAvatarSelection";
// import Wallet from "./Components/Profile/Wallet";
import Wallet from './Components/Profile/ Wallet/Wallet';
import { pwaInstallHandler } from 'pwa-install-handler'
import Login2fa from "./Components/LoginComponent/Login2fa";
import TermsAndConditions from "./Pages/TermsAndConditions";
import GenericLoginSignup from "./Components/GenericSignup/GenericLoginSignup";
import ProtectedRoutes from "routes/ProtectedRoutes";
import PageNotFound from "Pages/PageNotFound";
import Routes from "routes/Routes";

const sendPassword = httpsCallable(functions, "sendPassword");
const localhost = window.location.hostname === "localhost";
// let userData=false
// const request = indexedDB.open("firebaseLocalStorageDb");
// request.onerror = (event) => {
//   console.error("Why didn't you allow my web app to use IndexedDB?!");
// };
// request.onsuccess = (event) => {
// //  @ts-ignore

//   const db = event?.target?.result
//   db
//   .transaction("firebaseLocalStorage")
//   .objectStore("firebaseLocalStorage").getAll().onsuccess = (event:any) => {
//     userData=event.target.result[0]?.value?.uid
//     console.log('Got all customers:', event.target.result[0]?.value?.uid);

//   }
// //   .get("444-44-4444").onsuccess = (event) => {
// //   console.log(`Name for SSN 444-44-4444 is ${event.target.result.name}`);
// // };
// };

function App() {
  const location = useLocation();
  const search = location.search;
  const pathname = location.pathname;
  const langDetector = useRef(null);
  let navigate = useNavigate();
  const { width } = useWindowSize();
  // const scrollPosition = useScrollPosition();
  const [modalOpen, setModalOpen] = useState(false);
  const [displayFullscreen, setDisplayFullscreen] = useState('none')

  // fullscreen mode
  useEffect(() => {
    const modal = document.getElementById("fullscreen-modal");
    window.addEventListener('load', () => {
      setDisplayFullscreen('block')
    });
  }, [])
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  // @ts-ignore
  const fullscreenEnabled = document.fullscreenEnabled || document?.webkitFullscreenEnabled || document?.mozFullScreenEnabled || document?.msFullscreenEnabled;

  const handleClick = () => {

    setDisplayFullscreen('none')
    if (isMobile && fullscreenEnabled) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
      // @ts-ignore
      else if (elem?.webkitRequestFullscreen) {
        // @ts-ignore
        elem?.webkitRequestFullscreen();
      }
      // @ts-ignore 
      else if (elem?.mozRequestFullScreen) {
        // @ts-ignore
        elem?.mozRequestFullScreen();
      }
      // @ts-ignore
      else if (elem?.msRequestFullscreen) {
        // @ts-ignore
        elem?.msRequestFullscreen();
      }
    }
  }
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
    if ('serviceWorker' in navigator) {
      navigator?.serviceWorker?.addEventListener("message", (message) => {
        const {
          notification: { body, title },
        } = message.data["firebase-messaging-msg-data"] as {
          notification: { body: string; title: string };
        };

        // showToast(
        //   <div>
        //     <h5>{title}</h5>
        //     <p>{body}</p>
        //   </div>
        // );
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
  // const [allCoins, setAllCoins] = useState<string[]>(getAllCoins());

  // const [allPairs, setAllPairs] = useState<Array<string[]>>([]);
  const [allPairs, setAllPairs] = useState<Array<string[]>>([["BTC", "ETH"], ["BTC", "ETH"], ["BTC", "ETH"],]);
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
  // const [coins, setCoins] = useState<{ [symbol: string]: Coin }>(
  //   getCoins() as { [symbol: string]: Coin }
  // );
  const [coins, setCoins] = useState<{ [symbol: string]: Coin }>(
    {
      DEMO: {
        id: 4,
        name: "Cardano",
        price: 0.2738,
        symbol: "ADA",
        trend: 2.11,
      },
      DEMO2: {
        id: 4,
        name: "Cardano",
        price: 0.2738,
        symbol: "ADA",
        trend: 2.11,
      },

      DEMO3: {
        id: 4,
        name: "Cardano",
        price: 0.2738,
        symbol: "ADA",
        trend: 2.11,
      },
      DEMO4: {
        id: 4,
        name: "Cardano",
        price: 0.2738,
        symbol: "ADA",
        trend: 2.11,
      },
      DEMO5: {
        id: 4,
        name: "Cardano",
        price: 0.2738,
        symbol: "ADA",
        trend: 2.11,
      },
      DEMO6: {
        id: 4,
        name: "Cardano",
        price: 0.2738,
        symbol: "ADA",
        trend: 2.11,
      }
    }
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
    // "3"
  );
  const [timeframes, setTimeframes] = useState<TimeFrame[]>([]);
  const [voteRules, setVoteRules] = useState<VoteRules>({} as VoteRules);
  const [languages, setLanguages] = useState<string[]>([ENGLISH]);
  const [rtl, setRtl] = useState<string[]>([]);
  const [admin, setAdmin] = useState<boolean | undefined>(undefined);
  const [remainingTimer, setRemainingTimer] = useState(0)
  const [followerUserId, setFollowerUserId] = useState<string>('')
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
  // useEffect(() => {
  //   const isMFAPassed = window.localStorage.getItem('mfa_passed')
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
    if (user?.email && userInfo?.displayName === undefined) {
      setLoader(true);
    } else {
      // setTimeout(() => {
      setLoader(false);
      // }, 2000);
    }
  }, [user, userInfo]);


  const updateUser = useCallback(async (user?: User) => {
    setUser(user);

    const info = await getUserInfo(user);

    try {
      const documentRef = V2EParliament.firestore().collection('users').doc(user?.uid);
      const doc = await documentRef.get();
      if (doc.exists) {
        // @ts-ignore
        setUserInfo(doc.data());
      }
    } catch (error) { }
    // setUserInfo(info);
    setDisplayName(info.displayName + "");
  }, []);



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

  console.log('fmctoken', fcmToken)
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


  useEffect(() => {
    const auth = getAuth();

    // if (!firstTimeLogin) {
    onAuthStateChanged(auth, async (user: User | null) => {
      setAuthStateChanged(true);
      if (
        user?.emailVerified ||
        user?.providerData[0]?.providerId === "facebook.com"
      ) {
        setLoginRedirectMessage("");


        // await updateUser(user);
        setUserUid(user?.uid);
        onSnapshot(doc(db, "users", user.uid), async (doc) => {
          await setUserInfo(doc.data() as UserProps);
          setDisplayName((doc.data() as UserProps).displayName + "");
        });

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
        // await updateUser();
      }
    });
    // }
  }, [user, fcmToken, coins, JSON.stringify(auth?.currentUser)]);

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
  useEffect(() => {
    if (pathname.toLowerCase().includes('login')) {
      setLogin(true);
    }
  }, [pathname]);
  const [searchParams] = useSearchParams();
  useEffect(() => {
    let refer = searchParams.get('refer');
    if (refer) {
      localStorage.setItem('parentEmail', refer);
    } else {
      localStorage.removeItem('parentEmail');
    }
  }, []);
  // console.log(auth?.currentUser, userInfo, loader, 'pkk');

  return loader ? (
    <Spinner />
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
                setLoader,
                firstTimeAvatarSlection,
                setFirstTimeAvatarSelection,
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

                        {/* <Background pathname={pathname} /> */}
                        <AppContainer
                          fluid
                          pathname={pathname}
                          login={login || firstTimeLogin ? "true" : "false"}
                        // width={width}
                        >


                          {(user || userInfo?.uid) && localStorage.getItem('mfa_passed') === 'true' && (
                            <Login2fa
                              setLogin={setLogin}
                              setMfaLogin={setMfaLogin}
                            />
                          )}

                          <Container
                            fluid
                            style={{
                              background: "#160133",
                              whiteSpace: "normal",
                              wordWrap: "break-word",
                              flexGrow: 1,
                              padding: '0px 0px 120px 0px'
                            }}
                          >
                            <Header />
                            <Routes>
                              <Route path='/login' element={!auth?.currentUser ?
                                <LoginAndSignup
                                  {...{
                                    authProvider: LoginAuthProvider,
                                    loginAction: LoginRegular,
                                    signupAction: SignupRegular,
                                  }}
                                /> : <Navigate to="/" />
                              } />
                              <Route path='/sign-up' element={!auth?.currentUser ? <GenericLoginSignup authProvider={LoginAuthProvider} /> : <Navigate to="/" />} />
                              <Route path="/" element={<ProtectedRoutes />}>
                                <Route path='/' element={<Home />} />
                                <Route path={'profile/share'} element={<Pool />} />
                                <Route path={ProfileTabs.profile} element={<Profile />} >
                                  <Route path={'/profile'} element={<Navigate to={'/profile/edit'} />} />
                                  <Route path={ProfileTabs.edit} element={<PersonalInfo />} />
                                  <Route path={ProfileTabs.password} element={<Security />} />
                                  <Route path={ProfileTabs.wallet} element={<Wallet />} />
                                </Route>
                              </Route>
                            </Routes>
                          </Container>
                          <Footer />
                        </AppContainer>
                      </>
                    )}
                  <ToastContainer enableMultiContainer containerId='toast' limit={1} />
                  <ToastContainer enableMultiContainer containerId='modal' />
                  {modalOpen && <div className='fade modal-backdrop show' />}
                </UserContext.Provider>
              </ContentContext.Provider>
            </AppContext.Provider>
          </ManagersContext.Provider>
        </NotificationContext.Provider>
      )
      }
      {
        !enabled && (
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
        )
      }
    </div >
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
