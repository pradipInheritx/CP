/** @format */

import { Button, Container, Form, Modal, Navbar } from "react-bootstrap";
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
import styled from "styled-components";
import { isV1 } from "./App/App";
import { useWindowSize } from "../hooks/useWindowSize";
import UserCard from "./Profile/UserCard";
import ImageTabs from "./Profile/ImageTabs";
import Avatars, { AvatarType } from "../assets/avatars/Avatars";
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
import CoinsContext, { follow } from "../Contexts/CoinsContext";
import { toFollow } from "../common/models/User";
import "./styles.css";
import { handleSoundClick } from "../common/utils/SoundClick";

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
  Gallery='Album'
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

const MenuContainer = styled(Menu)``;

const Header = ({
  title,
  logo = true,
  pathname,
  remainingTimer
}: {
  title?: React.ReactNode;
  logo?: boolean;
  pathname: string;
  remainingTimer:number;
}) => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [mounted, setMounted] = useState(false);
  const { width } = useWindowSize();
  const desktop = width && width > 979;

  
 
  const { languages, setLang, setLogin, setSignup, setMenuOpen } =
    useContext(AppContext);
  const { pages } = useContext(ContentContext);
  const { votesLast24Hours, userInfo } = useContext(UserContext);
  const { VoteRulesMng } = useContext(ManagersContext);
  const { voteRules,followerUserId,login } = useContext(AppContext);
  const translate = useTranslation();
  const [voteNumber, setVoteNumber] = useState(0)
  const [votingTimer, setVotingTimer] = useState(0)
  const[followerInfo,setFollowerInfo]=useState<any>()
  const [followUnfollow, setFollowUnfollow] = useState<any>(false)
  const [show, setShow] = useState(false);
  const { leaders } = useContext(CoinsContext);
  var urlName = window.location.pathname.split('/');
  const followerPage = urlName.includes("followerProfile")
  const pageTrue = urlName.includes("pairs") || urlName.includes("coins")
  // const urlname = location.pathname;

  
  const getFollowerData =()=>{
  
      const getCollectionType = firebase
          .firestore()
          .collection("users")
          .where("uid", "==", followerUserId)
        getCollectionType.get()
        .then((snapshot) => {          
        snapshot.docs?.map(doc=>setFollowerInfo(doc.data()))
        }).catch((error) => {
        console.log(error,"error");
        });    
  }
  
  useEffect(() => {
    getFollowerData()  
  }, [followerUserId])
  
  useEffect(() => {
    if (voteNumber == 0 && votingTimer  && pageTrue && urlName.length>2) {
      
      setShow(true) 
    } else {
      setShow(false) 
    }
    
  },[voteNumber , votingTimer])



  useEffect(() => {
  
  setVotingTimer(remainingTimer,)
 
}, [remainingTimer])
  useEffect(() => {
    if (pages) {
      setMounted(true);
    }
  }, [pages]);

  useEffect(() => {
    const voted=Number(votesLast24Hours.length) <Number(voteRules?.maxVotes)? Number(votesLast24Hours.length):Number(voteRules?.maxVotes)
    // @ts-ignore
    setVoteNumber(Number(voteRules?.maxVotes)  + Number(userInfo?.rewardStatistics?.extraVote)  - Number(voted) || 0)
console.log('votenumber',voteNumber, Number(voted))
  }, [voteRules?.maxVotes ,userInfo?.rewardStatistics?.extraVote,votesLast24Hours.length]);

  const onSelect = (eventKey: string | null) => {
    handleSoundClick()
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
  
  
  const handleClose = () => {
    setShow(false)
  
  };
  

  return (
    <div>
      <div className='' style={{ background: "none !important" }}>
        <MenuContainer
          pathname={pathname}
          onSelect={onSelect}
          items={[
            {
              href: "/",
              label: "Home",
            },
            {
              href: "/coins",
              label: "Coin Vote",
            },
            {
              href: "/pairs",
              label: "Pairs Vote",
            },
            {
              href: "/influencers",
              label: "Top Influencers",
            },
            {
              href: "/nftAlbum",
              label: "Album",
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
              label: "Become A Member",
            },
          ].map((i) => (i ? i : undefined))}
        >        
          {/* {for center modile size} */}

          {!desktop && (
            <div className='' style={{ width: "75%" }}>
              <div className='d-flex w-100 '>
                {user?.uid && !login  ? (
                  <div
                    className='d-flex w-100'
                    style={{ position: "relative" }}
                  >
                    <div
                      className=''
                      onClick={() => navigate("/profile/mine")}
                      style={{
                        position: "absolute",
                        // marginLeft: "15px",
                        marginTop: "7px",
                        
                        cursor:"pointer"
                      }}
                    >
                      {/* {userInfo?.avatar && ( */}
                        <Avatars
                          type={followerPage && followerInfo != "" ?  followerInfo?.avatar || "Founder" as AvatarType  : userInfo?.avatar as AvatarType}
                          style={{
                            width: "45px",
                            boxShadow: "1px 0px 5px #6352E8",
                            // border: "1px solid #6352E8",
                            backgroundColor: "#6352E8",
                          }}
                        />
                      {/* )} */}
                    </div>
                    <div className='w-100 mt-3' style={{ marginLeft: "0px" }}>
                      <HeaderCenterMob className=''>
                        <div></div>
                        <div className='mt-1'>
                         
                          {/* @ts-ignore */}
                          
                          {/* // @ts-ignore */}
                          {/* {hours < 10 ? `0${hours}` : hours}: */}


                          {
                            followerPage && followerInfo != "" ? followerInfo?.displayName : !voteNumber && votingTimer ?
                            // @ts-ignore */
                                <div className="" style={{ marginLeft: '20px', marginTop: "0px",lineHeight: "90%" }}><Countdown daysInHours zeroPadTime={2} date={votingTimer}
                                  renderer={({ hours, minutes, seconds, completed }) => {
                                    return (
                                      <span className="text-uppercase" style={{color:'#6352e8',fontSize:'8px',fontWeight:100 ,lineHeight: "10%"}}>                            
                                        Wait {" "}
                                        {hours < 1 ? null : `${hours} :` }
                                        {minutes < 10 ? `0${minutes}` : minutes}:
                                        {seconds < 10 ? `0${seconds}` : seconds} for {Number(voteRules?.maxVotes)} votes 
                                        <br />
                                         or buy extra votes now.
                                      </span>
                                    );
                          
                                  }}
                         
                                /></div>
                                :
                                <>
                                  <span
                                    style={{
                                      color: "#6352E8",
                                    }}
                                  >
                            
                                    {voteNumber > 0 ? voteNumber : 0} votes left
                                  </span>
                                </>}
                        </div>
                        
                        {followerPage && followerInfo != "" ?
                        <Form.Check.Label
                              style={{ cursor: "pointer" }}
                              // htmlFor={id || name}
                              className="mt-1"
                            bsPrefix="label"
                            onClick={ async () =>
                            {
                              setFollowUnfollow(!followUnfollow) 
                              console.log('folower',followerInfo)
                              const ll = leaders.find((l) => l.userId === followerInfo?.uid);
                              if (user && ll) {
                               
                                await follow(ll, user, !followUnfollow);
                              }
                              // @ts-ignore
                            //  await follow(followerInfo , user, checkFollow )
                            }
                            
                            }
                            >
                              {/* {checked && iconOn}
                              {!checked && iconOff} */}
                            {followUnfollow == true ?  <Following/> :  <AddFollower/>}
                        </Form.Check.Label>
                          :
                        <PlusButtonMob onClick={() => navigate("/votingbooster")}>
                          <span>+</span>
                        </PlusButtonMob> 

                        }
                      </HeaderCenterMob>
                      <div
                        className='w-25'
                        style={{ marginLeft: "45px", marginTop: "5px" }}
                      >
                        {/* <p>{"unique_Username"}</p> */}

                        {followerPage && followerInfo != ""?  <></> :<span className='mb-1 d-block' style={{ fontSize: "13px" }}>{`${
                         userInfo?.displayName && userInfo?.displayName
                        }`}</span>}
                        {/* <br /> */}
                        <MemberText>
                          {/* {translate(followerInfo != ""? followerInfo?.status?.name :userInfo?.status?.name || "")} */}
                          {followerPage && followerInfo != ""? followerInfo?.status?.name :userInfo?.status?.name || ""}
                        </MemberText>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='w-100'></div>
                )}
                <div className='mt-2'>
                  <Title style={{ width: pathname === "/" ? "" : "" }} onClick={handleSoundClick}>
                    {mounted ? title : ""}
                  </Title>
                </div>
              </div>
            </div>
          )}

          {/* {for center web size} */}

          {logo ? (
            <div
              style={{
                flexBasis: "100%",
                textAlign: "center",
                // width: desktop ? "25%" : (pathname === "/" ? "75%" : "25%"),
                // textAlign: desktop ? undefined : "center",
              }}
            >
              <div className='d-flex '>
                {user?.uid && !login? (
                  <div
                    className='d-flex   w-25 mx-auto '
                    style={{ position: "relative", height: "50px" }}
                  >
                    <div
                      className=''
                      onClick={() => navigate("/profile/mine")}
                      style={{
                        position: "absolute",
                        marginLeft: "90px",
                        // marginTop: "px",
                        cursor:"pointer"
                      }}
                    >
                      {/* {userInfo?.avatar && ( */}
                        <Avatars
                          // type={userInfo?.avatar as AvatarType}
                          type={ followerPage && followerInfo != ""?  followerInfo?.avatar || "Founder" as AvatarType : userInfo?.avatar as AvatarType}
                          style={{
                            width: "60px",
                            boxShadow: "1px 0px 5px #6352E8",
                            backgroundColor: "#6352E8",
                          }}
                        />
                      {/* )} */}
                    </div>
                    <div className='w-100 '>
                      <HeaderCenter className=''>
                        <div></div>
                        <p className='ml-5'>
                       { followerPage && followerInfo != "" ? followerInfo?.displayName :!voteNumber && votingTimer ?
                          // @ts-ignore
                         <span style={{marginLeft:'20px'}}> <Countdown date={votingTimer} 
                         renderer={({ hours, minutes, seconds, completed }) => {
                        
                          return (
                            <span className="text-uppercase" style={{color:'#6352e8',fontSize:'10px',fontWeight:400}}>
                              {/* {hours < 10 ? `0${hours}` : hours}: */}
                              Wait {" "}
                              {hours < 1 ? null : `${hours} :` }
                              {minutes < 10 ? `0${minutes}` : minutes}:
                              {seconds < 10 ? `0${seconds}` : seconds} for {Number(voteRules?.maxVotes)} votes 
                              <p style={{marginLeft:'30px'}}> or buy extra votes now.</p>
                            </span>
                          );
                        
                      }}
                         /></span>
                        :
                        <> 
                          <span
                            style={{
                              color: "#6352E8",
                            }}
                          >
                            {/* {Number(voteRules?.maxVotes) ||
                              0 +
                                // @ts-ignore
                                Number(userInfo?.rewardStatistics?.extraVote) ||
                              0 - Number(votesLast24Hours.length) ||
                              0} */}
                            {voteNumber>0? voteNumber:0} votes left
                          </span></>}
                        </p>
                        {followerPage && followerInfo != "" ?
                        <Form.Check.Label
                        className=""
                              style={{ cursor: "pointer" }}
                              // htmlFor={id || name}
                              // className={className}
                            bsPrefix="label"
                            onClick={ async () =>
                              {
                                setFollowUnfollow(!followUnfollow) 
                                console.log('folower',followerInfo)
                                const ll = leaders.find((l) => l.userId === followerInfo?.uid);
                                if (user && ll) {
                                 
                                  await follow(ll, user, !followUnfollow);
                                }
                                // @ts-ignore
                              //  await follow(followerInfo , user, checkFollow )
                              }
                              
                              }
                            >
                              {/* {checked && iconOn}
                              {!checked && iconOff} */}
                            {followUnfollow == true ?  <Following/> :  <AddFollower/>}
                        </Form.Check.Label>
                          :
                        <PlusButton onClick={() => navigate("/votingbooster")}>
                          <span>+</span>
                        </PlusButton> 

                        }
                      </HeaderCenter>
                      <div
                        className=''
                        style={{
                          width: "50%",
                          marginLeft: "150px",
                          marginTop: "5px",
                          textAlign: "left",
                          fontWeight: "100px",
                        }}
                      >
                        {followerPage && followerInfo != ""?  <></> :<span className='mb-1 d-block' style={{ fontSize: "13px" }}>{`${
                         userInfo?.displayName && userInfo?.displayName
                        }`}</span>}

                        <MemberText>
                          {followerPage && followerInfo != ""? followerInfo?.status?.name :userInfo?.status?.name || ""}
                        </MemberText>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='w-100'></div>
                )}
                <Navbar.Brand as={Link} to='/' onClick={handleSoundClick}>
                  <img src={BigLogo} alt='' />
                </Navbar.Brand>
              </div>
            </div>
          ) : (
            <div style={{ width: "25%" }}>&nbsp;</div>
          )}
          {/* {desktop && <Title style={{flexBasis: "50%", textAlign: "center"}}>{mounted ? title : ""}</Title>} */}
          <div>
            {/* <Button variant="primary" onClick={handleShow}>
        Launch static backdrop modal
      </Button> */}                            
            <Modal
        dialogClassName="modal-35w"
        show={show}
                onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
              centered
              style={{ opacity: 1 }}
              className="borderColor"
              // animation={false}
            >             
              {/* <Modal.Header>

              </Modal.Header> */}
              <div className="d-flex justify-content-end">
                <button type="button" className="btn-close " aria-label="Close" onClick={()=>{
                  setShow(false)
                  }}></button>
                </div>
              <Modal.Body>
                              
                {/* <hr /> */}
                <p className="text-uppercase"> Out of votes? </p> <Link className="text-uppercase" to="/votingbooster" onClick={() => {                  
                  // navigate("/votingbooster")
                  setShow(false)
                }} >Buy</Link> {"extra votes now or wait,".toUpperCase()} <span className="text-uppercase">
                   {/* @ts-ignore */}
                  <Countdown date={votingTimer} 
                         renderer={({ hours, minutes, seconds, completed }) => {                        
                          return (
                            <span >
                              {/* {hours < 10 ? `0${hours}` : hours}: */}
                              {Number(voteRules?.maxVotes)} votes in {' '}
                              {hours < 1 ? null : `${hours} :` }
                              {minutes < 10 ? `0${minutes}` : minutes}:
                              {seconds < 10 ? `0${seconds}` : seconds}
                            </span>
                          );
                        
                      }}
                      /></span>
              </Modal.Body>                    
      </Modal>
          </div>
        </MenuContainer>
      </div>
    </div>
  );
};


export default Header;
