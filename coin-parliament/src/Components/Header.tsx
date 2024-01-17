/** @format */

import { Container, Form, Navbar } from "react-bootstrap";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import UserContext from "../Contexts/User";
import { Logout } from "../common/models/Login";
import AppContext from "../Contexts/AppContext";
import ContentContext from "../Contexts/ContentContext";
import Menu, { convertPageToMenuItem } from "./Menu";
import { ProfileTabs } from "../Pages/Profile";
import Logo, { Size } from "./Atoms/Logo";
import { isV1 } from "./App/App";
import { useWindowSize } from "../hooks/useWindowSize";
import UserCard from "./Profile/UserCard";
import ImageTabs from "./Profile/ImageTabs";
import Avatars, { AvatarType, defaultAvatar } from "../assets/avatars/Avatars";
import { translate, useTranslation } from "../common/models/Dictionary";
import BigLogo from "../assets/svg/logoiconx2.svg";
import ManagersContext from "../Contexts/ManagersContext";
import Countdown from "react-countdown";
import { getFollowerInfo } from "../Contexts/FollowersInfo";

import { doc, getDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../firebase";
import firebase from "firebase/compat";
import AddFollower from "./icons/AddFollower";
import Following from "./icons/Following";
import { follow } from "../Contexts/CoinsContext";
import styled, { css } from "styled-components";

enum EventKeys {
  LOGIN = "login",
  LOGOUT = "logout",
  SIGNUP = "signup",
  ABOUT = "about",
  PROFILE = "profile",
  VOTES = "votes",
  NOTIFICATIONS = "notifications",
  PASSWORD = "password",
  EDIT = "edit",
  POOL_MINING = "pool",
  SHARE = "share",
  FOLLOWERS = "followers",
  Gallery = 'Album'
}

export const Title = styled.div`
  font: var(--font-style-normal) normal var(--font-weight-normal) 20px/18px
    var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  color: var(--white);
  text-align: left;
  opacity: 1;
  margin: 0;

  & h1 {
    text-align: center;
  }
`;

export const HeaderCenter = styled.div`
  background: white;
  color: #3712B3;
  width: 58%;
  height: 35px;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 5px;
  margin-left: 120px;
   border-radius 50px;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const HeaderCenterMob = styled.div` 
  background:white;
  color:#3712B3;
  width: 82%;
  height: 30px;
  
  margin-left:25px;
  border-radius 50px;
  display: flex;
  justify-content:space-around;
  // align-items: center;
`;
export const MemberText = styled.span`
  text-transform: uppercase;
  padding: 2px 10px 2px 10px;
  background: #d4d0f3;
  color: #6352e8;
  border-radius: 10px;
  font-size: 10px;
`;

export const PlusButton = styled.div`
  width: 27px;
  height: 27px;
  background: #6352e8;
  color: white;
  border-radius: 50px;
  padding-top: 3px;
  font-size: 15px;
  cursor: pointer;
`;
export const PlusButtonMob = styled.div`
  width: 27px;
  height: 27px;
  background: #6352e8;
  color: white;
  border-radius: 50px;
  padding: 3px 8px;
  margin-top:1px;
  font-size: 15px;
  cursor: pointer;
`;

type ZoomProps = {
  showReward?: number,
  inOutReward?: number,
};
const ZoomCss = css`
  opacity: 1;
  position: fixed;
  top:0;
  left:0;
  right:0;
  bottom:0;
  width: 100%;
  height: 100%;
  z-index:2200;
//   transition: opacity .3s;
  background-color: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  transition:  all 3s ease;
  `;
//   transform: ${window.screen.width > 767 ? "scale(3)" : "scale(1.5)"};
//   transformOrigin:${window.screen.width > 767 ?"35% 50%" :"50% 90%"};
// left: 50%;
// transform: translate(-50%, -20%);    


const ForZoom = styled.div`
 ${(props: ZoomProps) => `${props.showReward == 2 && props.inOutReward == 2 ? ZoomCss : ""}`} 
`;

export const OuterContainer = styled.div`
  background: ${window.screen.width < 979 ? "var(--color-d4d0f3)" : ""};
  position: relative;
  z-index: 0;
  padding-bottom: ${window.screen.width < 979 ? "100px" : ""};
`;

// export const CardContainer = styled.div`
//   ${Gradient2};
//   height: 127px;
//   padding: 0;
//   box-shadow: 0 3px 6px #00000029;
//   border-radius: 0 0 87px 0;
// `;

const MenuContainer = styled(Menu)`
border:1px solid red;
`;

const Header = ({
  title,
  logo = true,
  pathname,
  remainingTimer,
  setMfaLogin,
}: {
  title?: React.ReactNode;
  logo?: boolean;
  pathname: string;
  remainingTimer: number;
  setMfaLogin:any;
}) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [mounted, setMounted] = useState(false);
  const { width } = useWindowSize();
  const desktop = width && width > 979;



  const { languages, login, setLang, setLogin, setSignup, setMenuOpen } =
    useContext(AppContext);
  const { pages } = useContext(ContentContext);
  const { votesLast24Hours, userInfo } = useContext(UserContext);
  const { VoteRulesMng } = useContext(ManagersContext);
  const { voteRules, followerUserId } = useContext(AppContext);
  const translate = useTranslation();
  const [voteNumber, setVoteNumber] = useState(0)
  const [votingTimer, setVotingTimer] = useState(0)
  const [followerInfo, setFollowerInfo] = useState<any>()
  const [followUnfollow, setFollowUnfollow] = useState<any>(false)
  var urlName = window.location.pathname.split('/');
  const followerPage = urlName.includes("followerProfile")
  // const urlname = location.pathname;


  const getFollowerData = () => {

    // e4EgEKB7pMSU3sIBuoXb6k9pJfR2  
    // const DocumentType = firebase
    //   .firestore()
    //   .collection("votes")
    //   .doc('01Z9rbB0WNk8njwDGowp').delete().then((res)=>console.log('deleted'));
    const getCollectionType = firebase
      .firestore()
      .collection("users")
      .where("uid", "==", followerUserId)
    getCollectionType.get()
      .then((snapshot) => {
        // console.log("snapshot.docs",snapshot.docs.map((doc) => doc.data()));
        snapshot.docs?.map(doc => setFollowerInfo(doc.data()))
        // console.log('snapshot',snapshot.docs)
      }).catch((error) => {
        console.log(error, "error");
      });
  }

  useEffect(() => {
    getFollowerData()
  }, [followerUserId])

  // setTimeout(() => {
  //     getFollowerData()  
  //   }, 2000);

  // console.log(followerInfo,"followerInfo")

  useEffect(() => {

    setVotingTimer(remainingTimer,)

  }, [remainingTimer])
  useEffect(() => {
    if (pages) {
      setMounted(true);
    }
  }, [pages]);

  useEffect(() => {
    const voted = Number(votesLast24Hours.length) < Number(voteRules?.maxVotes) ? Number(votesLast24Hours.length) : Number(voteRules?.maxVotes)
    // @ts-ignore
    setVoteNumber(Number(voteRules?.maxVotes) + Number(userInfo?.rewardStatistics?.extraVote) - Number(voted) || 0)
    // @ts-ignore
    // console.log(Number(voteRules?.maxVotes) + Number(userInfo?.rewardStatistics?.extraVote) - Number(votesLast24Hours.length), "extraVote")
    // @ts-ignore
  }, [voteRules?.maxVotes, userInfo?.rewardStatistics?.extraVote, votesLast24Hours.length]);

  const onSelect = (eventKey: string | null) => {
    const auth = getAuth();

    switch (eventKey) {
      case EventKeys.LOGIN:
        setLogin(true);
        setSignup(false);
        break;
      case EventKeys.SIGNUP:
        setLogin(true);
        setSignup(true);
        break;
      case EventKeys.LOGOUT:
        signOut(auth)
          .then((res) => {
            // console.log("logout", res);
            Logout(setUser);
          })
          .catch((error) => {
            const errorMessage = error.message;
            console.log(errorMessage);
          });
        break;
      case EventKeys.EDIT:
        navigate(ProfileTabs.profile + "/" + ProfileTabs.edit, {
          replace: true,
        });
        break;
      case EventKeys.POOL_MINING:
        navigate(ProfileTabs.profile + "/" + ProfileTabs.mine, {
          replace: true,
        });
        break;
      case EventKeys.SHARE:
        navigate(ProfileTabs.profile + "/" + ProfileTabs.share, {
          replace: true,
        });
        break;
      case EventKeys.FOLLOWERS:
        navigate(ProfileTabs.profile + "/" + ProfileTabs.followers, {
          replace: true,
        });
        break;
      case EventKeys.PASSWORD:
        navigate(ProfileTabs.profile + "/" + ProfileTabs.password, {
          replace: true,
        });
        break;
      case EventKeys.Gallery:
        navigate(ProfileTabs.profile + "/" + ProfileTabs.ProfileNftGallery, {
          replace: true,
        });
        break;
      case EventKeys.NOTIFICATIONS:
        navigate(ProfileTabs.profile + "/" + ProfileTabs.notifications, {
          replace: true,
        });
        break;
      case EventKeys.VOTES:
        navigate(ProfileTabs.profile + "/" + ProfileTabs.votes, {
          replace: true,
        });
        break;
      default:
        if (eventKey && languages.includes(eventKey)) {
          setLang(eventKey);
        }
    }

    setMenuOpen(false);
  };
  return (

    <MenuContainer
      setMfaLogin={setMfaLogin}
      pathname={pathname}
      onSelect={onSelect}

      items={[
        {
          href: "/",
          label: "Home",
        },
        {
          href: "/pairs",
          label: "Pairs Vote",
        },
        {
          href: "/coins",
          label: "Coin Vote",
        },
        // {
        //   href: "/pairs",
        //   label: "Pairs Vote",
        // },
        {
          href: "/influencers",
          label: "Top Influencers",
        },
        {
          href: "/nftAlbum",
          label: "Wall Of Fame",
        },
        {
          label: "",
        },
        // user && {
        //   eventKey: EventKeys.VOTES,
        //   label: "Votes",
        // },
        // !isV1() &&
        //   user && {
        //     eventKey: EventKeys.POOL_MINING,
        //     label: "Pool Mining",
        //   },
        user && {
          eventKey: EventKeys.POOL_MINING,
          label: "My Account",
        },
        // user && {
        //   eventKey: EventKeys.FOLLOWERS,
        //   label: "Followers",
        // },
        user && {
          eventKey: EventKeys.EDIT,
          label: "My Profile",
        },
        user && {
          eventKey: EventKeys.Gallery,
          label: "My Album",
        },
        user && {
          eventKey: EventKeys.NOTIFICATIONS,
          label: "Notifications",
        },
        // user && {
        //   eventKey: EventKeys.PASSWORD,
        //   label: "Password",
        // },
        // user && {
        //   eventKey: EventKeys.EDIT,
        //   label: "My Profile",
        // },
        {
          label: "",
        },
        {
          label: "",
        },
        ...(pages || []).map(convertPageToMenuItem),
        {
          label: "-",
        },
        !user && {
          eventKey: EventKeys.LOGIN,
          label: "Login",
        },
        user && {
          eventKey: EventKeys.LOGOUT,
          label: "Logout",

        },
        !user && {
          eventKey: EventKeys.SIGNUP,
          label: "Join the parliament",
        },
      ].map((i) => (i ? i : undefined))}

    >

      {!desktop && (
        <div className='' style={{ width: "75%" }}>
          <div className='d-flex w-100  '>
            <ForZoom className="w-100"
            >
              {user?.uid && !login ? (
                <div
                  className="d-flex"
                  style={{
                    position: "relative",


                  }}
                >
                  <div className=''
                    style={{
                      position: "absolute",
                      marginTop: "7px",
                      cursor: "pointer"
                    }}
                  >
                    <Avatars
                      type={(userInfo?.avatar || defaultAvatar) as AvatarType}
                      style={{                        
                        width: "60px",
                        height: "60px",
                        boxShadow: `${"1px 0px 5px #6352E8"}`, backgroundColor: `${"#6352E8"}`,

                      }}
                    />
                  </div>
                  <div className='w-100 mt-3' style={{ marginLeft: "0px" }}>
                    <HeaderCenterMob className='border'>
                      <div></div>
                      <div className='mt-1'>
                        <span style={{ color: "#6352E8", marginLeft: "10px", fontSize: window.screen.width <= 340 ? '0.7889em' : '12px' }}>
                          {`${(userInfo?.displayName) ? userInfo?.displayName : ''}`}
                        </span>
                      </div>
                    </HeaderCenterMob>

                  </div>
                </div>
              ) : (
                <div className='w-100'></div>
              )}
            </ForZoom>

          </div>
        </div>
      )}

      {/* {for center web size} */}

      {logo ? (
        <div
          style={{
            flexBasis: "100%",
            textAlign: "center",
          }}
        >
          <div className='d-flex'>
            <ForZoom className="flex-fill d-flex"

            >
              {(user?.uid && !login) && (
                <div className='d-flex mx-auto w-auto '
                  style={{
                    position: "relative",
                    height: "50px",

                  }}>
                  <div

                    style={{
                      position: "absolute",
                      marginLeft: "90px",
                      cursor: "pointer"
                    }}
                  >
                    <Avatars
                      type={followerPage && followerInfo != "" ? followerInfo?.avatar || defaultAvatar as AvatarType : (userInfo?.avatar || defaultAvatar) as AvatarType}
                      style={{
                        width: "60px",
                        height: "60px",
                        boxShadow: `${"1px 0px 5px #6352E8"}`, backgroundColor: `${"#6352E8"}`,
                      }}
                    />
                  </div>
                  <div className='w-100'>
                    <HeaderCenter className='d-flex justify-content-between' style={{ width: '16em' }}>
                      <p className='' style={{ marginRight: '1em' }}>
                        <span
                          style={{
                            color: "#6352E8",
                            marginLeft: "40px",
                            fontSize: window.screen.width <= 340 ? '0.7889em' : '12px'
                          }}
                        >
                          {`${(userInfo?.displayName) ? userInfo?.displayName : ''}`}
                        </span>
                      </p>
                    </HeaderCenter>


                  </div>
                </div>
              )}
            </ForZoom>

          </div>
        </div>
      ) : (
        <div style={{ width: "25%" }}>&nbsp;</div>
      )}

    </MenuContainer >

  );
};

export default Header;
