/** @format */

import { Button, Container, Form, Modal, Navbar } from "react-bootstrap";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import UserContext, { getUserInfo } from "../Contexts/User";
import { Logout } from "../common/models/Login";
import AppContext from "../Contexts/AppContext";
import ContentContext from "../Contexts/ContentContext";
import Menu, { convertPageToMenuItem } from "./Menu";
import { ProfileTabs } from "../Pages/Profile";
import Logo, { Size } from "./Atoms/Logo";
import styled, { css } from "styled-components";
import { isV1 } from "./App/App";
import { useWindowSize } from "../hooks/useWindowSize";
import UserCard from "./Profile/UserCard";
import ImageTabs from "./Profile/ImageTabs";
import Avatars, { AvatarType, defaultAvatar } from "../assets/avatars/Avatars";
import { translate, useTranslation } from "../common/models/Dictionary";
import BigLogo from "../assets/svg/logoiconx2.png";
import ManagersContext from "../Contexts/ManagersContext";
import Countdown from "react-countdown";
import { getFollowerInfo } from "../Contexts/FollowersInfo";

import { doc, getDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { db, functions } from "../firebase";
import firebase from "firebase/compat";
import AddFollower from "./icons/AddFollower";
import Following from "./icons/Following";
import CoinsContext, { Leader, follow } from "../Contexts/CoinsContext";
import { toFollow } from "../common/models/User";
import "./styles.css";
import { claimRewardSound, handleExtraVote, handleSoundClick, handleSoundWinCmp } from "../common/utils/SoundClick";
import CountUp from "react-countup";
import { Other } from "Pages/SingleCoin";
import { VoteContext } from "Contexts/VoteProvider";

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

const I = styled.i`
  border-radius: 50%;
  font-size: 13px;  
position: absolute;
  font-weight: 300;
//   top:-27px;
//   left:180px;
//   color: #6352e8;
  color: white;
//   width: 16px;
//   height: 16px;
  text-align: center;
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
	setMfaLogin 
}: {
	title?: React.ReactNode;
	logo?: boolean;
	pathname: string;
		remainingTimer: number;
	setMfaLogin:any,
}) => {
	const navigate = useNavigate();
	const { user, setUser } = useContext(UserContext);
	const [mounted, setMounted] = useState(false);
	const { width } = useWindowSize();
	const desktop = width && width > 979;


	const { languages, setLang, setLogin, setSignup, setMenuOpen, setShowBack, showMenubar, avatarImage, setAvatarImage } = useContext(AppContext);
	const { pages } = useContext(ContentContext);
	const { votesLast24Hours, userInfo } = useContext(UserContext);
	const { VoteRulesMng } = useContext(ManagersContext);
	const { voteRules, login, showReward, setShowReward, headerExtraVote, setHeaderExtraVote, inOutReward, setInOutReward, afterVotePopup, setAfterVotePopup, setvoteNumberEnd, rewardExtraVote } = useContext(AppContext);
	// console.log(showReward,inOutReward,"inOutReward")
	const followerUserId = localStorage.getItem("followerId")
	const translate = useTranslation();
	const [voteNumber, setVoteNumber] = useState(0)
	const [cmpModalOpen, setCmpModalOpen] = useState(false)

	const [votingTimer, setVotingTimer] = useState(0)
	const [followerInfo, setFollowerInfo] = useState<any>()
	const [followUnfollow, setFollowUnfollow] = useState<any>(false)
	const [scrollUp, setScrollUp] = useState<any>(false)
	const [textBlink, setTextBlink] = useState<any>(false)
	const [show, setShow] = useState(false);
	const { leaders } = useContext(CoinsContext);

	var urlName = window.location.pathname.split('/');
	const followerPage = urlName.includes("followerProfile")
	const votingboosterPage = urlName.includes("votingbooster")
	const pageTrue = urlName.includes("pairs") || urlName.includes("coins")
	const [tooltipShow, setTooltipShow] = React.useState(false);
	const MyPath = window.location.pathname;
	const score = (userInfo?.voteStatistics?.score || 0) - ((userInfo?.rewardStatistics?.total || 0) * 100);

	const voteDetails = useContext(VoteContext);
	// useEffect(() => {
	// 	if (score > 99.98 && MyPath !== "/profile/mine") {
	// 		setCmpModalOpen(true)

	// 	}
	// 	if (MyPath == "/profile/mine") {
	// 		setCmpModalOpen(false)

	// 	}
	// }, [score]);

	// console.log(urlName,"checkurlName")
	const prevCountRef = useRef(voteNumber)

	const getFollowerData = () => {

		const getCollectionType = firebase
			.firestore()
			.collection("users")
			.where("uid", "==", followerUserId)
		getCollectionType.get()
			.then((snapshot) => {
				snapshot.docs?.map(doc => setFollowerInfo(doc.data()))
			}).catch((error) => {
				console.log(error, "error");
			});
	}	

	useEffect(() => {
		getFollowerData()
	}, [followerUserId])

	useEffect(() => {
		// @ts-ignore
		if (userInfo?.leader?.includes(followerUserId)) {
			setFollowUnfollow(true)
		}
		else {
			setFollowUnfollow(false)
		}
	}, [followerUserId, userInfo]);
	useEffect(() => {
		if (voteNumber == 0 && votingTimer && pageTrue && urlName.length > 2 && user?.uid && !login && Object.keys(voteDetails?.activeVotes).length == 0 && voteDetails?.voteNot == 0) {
			// setTimeout(() => {
			// setShow(true);
			// setAfterVotePopup(true);
			// }, 1000);
		} else {
			setAfterVotePopup(false);
			// setShow(false)
		}
	}, [voteNumber, /* votingTimer, */ voteDetails])




	useEffect(() => {

		setVotingTimer(remainingTimer);

	}, [remainingTimer])
	useEffect(() => {
		if (pages) {
			setMounted(true);
		}
	}, [pages]);

	useEffect(() => {
		setVoteNumber(Number(userInfo?.voteValue || 0) + Number(userInfo?.rewardStatistics?.extraVote || 0) - (headerExtraVote.collect == false ? headerExtraVote?.vote : 0));		
		// @ts-ignore
		setvoteNumberEnd(Number(userInfo?.voteValue));
		// @ts-ignore
		console.log(userInfo?.rewardStatistics?.extraVote, "userInfo")
		prevCountRef.current = voteNumber;
		// console.log('votenumber',voteNumber, Number(voted))
		// @ts-ignore
	}, [userInfo?.voteValue, userInfo?.rewardStatistics?.extraVote, headerExtraVote?.vote]);
	// console.log(voteRules?.maxVotes, userInfo?.rewardStatistics?.extraVote, votesLast24Hours, headerExtraVote ,"allvotetype")
	console.log(headerExtraVote, voteNumber, "headerExtraVote")

	const onSelect = (eventKey: string | null) => {		
		// handleSoundClick()
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
						navigate("/")
						setLogin(true);
						// console.log("i am working error")	
						localStorage.removeItem("userId")
					})
					.catch((error) => {
						navigate("/")
						setLogin(true);
						localStorage.removeItem("userId")
						const errorMessage = error.message;

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
		setAfterVotePopup(false);
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
			{/* {for center modile size} */}

			{!desktop && (
				<div className='' style={{ width: "75%" }}>
					<div className='d-flex w-100  '>
						<ForZoom {...{ showReward, inOutReward }} className="w-100"
						>
							{user?.uid && !login ? (
								<div
									className="d-flex"
									style={{
										position: "relative",
										width: `${showReward == 2 && inOutReward == 2 ? "220px" : "100%"}`,
										transform: `${showReward == 2 && inOutReward == 2 ? "scale(1.3)" : ""}`,
										transformOrigin: `${showReward == 2 && inOutReward == 2 ? "40% 0%" : ""}`,
										transition: `${showReward == 2 && inOutReward == 2 ? "transform 3s ease" : ""}`,
										// transformOrigin: `${window.screen.width > 767 ? "60% 0%" : "40% 0%"}`,

									}}
								>
									<div className='' onClick={() => {
										if (!showMenubar && !followerPage) navigate("/profile/mine")
									}
									}
										style={{
											position: "absolute",
											marginTop: "7px",
											cursor: "pointer"
										}}
									>
										<Avatars
											type={followerPage && followerInfo != "" ? followerInfo?.avatar || defaultAvatar as AvatarType : (avatarImage || userInfo?.avatar || defaultAvatar) as AvatarType}
											style={{
												width: "45px",
												height: "45px",
												// border: "1px solid #6352E8",
												// @ts-ignore
												boxShadow: `${(userInfo?.isUserUpgraded && !followerPage) ? "1px 0px 5px #ffd700" : "1px 0px 5px #6352E8"}`, backgroundColor: `${(userInfo?.isUserUpgraded && !followerPage) ? "#ffd700" : "#6352E8"}`,
											}}
										/>
									</div>
									<div className='w-100 mt-3' style={{ marginLeft: "0px" }}>
										<HeaderCenterMob className='border'>
											<div></div>
											<div className='mt-1'>
												{
													followerPage && followerInfo != "" ? followerInfo?.displayName :
														(!voteNumber && votingTimer && !!new Date(votingTimer).getDate()) ?
															// @ts-ignore */
															<div style={{ marginLeft: '20px', marginTop: "5px", lineHeight: "90%", textAlign: 'center', }}>
																{/* @ts-ignore */}
																<Countdown daysInHours zeroPadTime={2} date={votingTimer}
																	renderer={({ hours, minutes, seconds, completed }) => {
																		return (
																			<span style={{ color: '#6352e8', fontSize: window.screen.width <= 340 ? '0.7889em' : '12px', fontWeight: 100, lineHeight: "10%", }}>
																				{/* Wait {" "} */}
																				{Number(voteRules?.maxVotes)} Votes in{" "}
																				{hours < 1 ? null : `${hours}:`}
																				{minutes < 10 ? `0${minutes}` : minutes}:
																				{seconds < 10 ? `0${seconds}` : seconds}
																				{/* for {Number(voteRules?.maxVotes)} votes <br /> or buy extra votes now. */}
																			</span>
																		);

																	}}

																/>
															</div>
															:
															<span style={{ color: "#6352E8", marginLeft: "10px", fontSize: window.screen.width <= 340 ? '0.7889em' : '12px' }}>
																{(MyPath == "/profile/mine" && inOutReward === 2) ?
																	<CountUp useEasing={false} className={textBlink ? "HeaderText " : ""} start={voteNumber || 0 - (headerExtraVote?.vote || 0)} end={(voteNumber || 0) + (headerExtraVote?.vote || 0)} duration={rewardExtraVote < 10 ? rewardExtraVote : 10} delay={2}
																		onStart={() => {
																			// handleExtraVote.play()
																			setTimeout(() => {
																				setTextBlink(true)
																			}, 3000);
																		}}
																		onEnd={() => {
																			setTextBlink(false)
																			handleExtraVote.pause()
																			setInOutReward((prev: number) => {
																				// return prev == 2 ? 3 : prev
																				claimRewardSound.play();
																				return 3
																			});
																			if (headerExtraVote != 0) {
																				setShowReward((prev: number) => {
																					return 3;
																				});
																			}
																			setHeaderExtraVote({
																				vote: 0,
																				collect: false
																			});
																			// setHeaderExtraVote((prev: number) => {
																			// 	if (prev != 0) {
																			// 		setShowReward((prev: number) => {
																			// 			// return prev == 2 ? 3 : prev
																			// 			return 3;
																			// 		})
																			// 	}
																			// 	return prev
																			// })
																		}
																		}
																	/> :
																	Number(voteNumber && voteNumber)
																	// + (headerExtraVote?.collect ? headerExtraVote?.vote : 0)
																}

																{" "}
																votes left
															</span>
												}
											</div>
											{followerPage && followerInfo != "" ?
												<Form.Check.Label
													style={{ cursor: "pointer" }}
													// htmlFor={id || name}
													className="mt-1"
													bsPrefix="label"
													onClick={async () => {
														setFollowUnfollow(!followUnfollow)
														// console.log('folower',followerInfo)
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
													{followUnfollow == true ? <Following /> : <AddFollower />}
												</Form.Check.Label>
												:
												<PlusButtonMob onClick={() => {
													if (!showMenubar) {
														handleSoundClick()
														navigate("/votingbooster")
													}
												}}
												>
													<span
														className={`${voteNumber == 0 && votingTimer && user?.uid && !login && !votingboosterPage && "HeaderText"}`}
													>+</span>
												</PlusButtonMob>

											}
										</HeaderCenterMob>
										<div
											className=''
											style={{ marginLeft: "45px", marginTop: "5px" }}
										>
											{/* <p>{"unique_Username"}</p> */}

											{
												(followerPage && followerInfo != "") ?
													<></> :
													<span className='mb-1 d-block' style={{ fontSize: "13px" }}>
														{`${(userInfo?.displayName /* && !userInfo.firstTimeLogin */) ? userInfo?.displayName : ''}`}
													</span>
											}											
											{!!followerInfo && <div className="d-flex"
											>
												{(!!followerInfo?.status?.name && followerPage) && <MemberText>{followerInfo?.status?.name}</MemberText>}
												{
													(!!followerInfo?.bio && followerPage) && <>
														<div className='mx-2 '>
															<I className='bi bi-info-circle'
																onMouseDown={(e) => {
																	setTooltipShow(false)
																}}
																onMouseUp={(e) => {
																	setTooltipShow(true)
																}}
																onMouseEnter={() => setTooltipShow(true)}
																onMouseLeave={() => setTooltipShow(false)}
															></I>
														</div>
														{
															tooltipShow &&
															<div
																style={{
																	position: 'fixed',
																}}
															>
																<div className="newtooltip"
																	style={{
																		// right: "0%",
																		width: "270px",
																		top: "25px",
																		left:"-70px"
																		// marginLeft: `${window.screen.width > 767 ? "2.50%" : ""}`,
																		// marginTop: `${window.screen.width > 767 ? "10%" : "1%"}`,
																		// zIndex:3000
																	}}
																>
																	{/* <p>Your CMP count</p> */}
																		<p className="mt-1 text-end lh-base">{followerInfo?.bio}</p>																	
																</div>
															</div>
														}
													</>
												}
											</div>}
											{(!!userInfo?.status?.name && !followerPage) && <MemberText>{userInfo?.status?.name}</MemberText>}

										</div>
									</div>
								</div>
							) : (
								<div className='w-100'></div>
							)}
						</ForZoom>
						{showReward == 2 && window.screen.width < 767 && <div className="w-100"></div>}
						<div className='mt-2'>
							<Title
							// style={{ width: pathname === "/" ? "" : "" }}
							// onClick={handleSoundClick}
							// className="border"
							>
								{mounted ? title : ""}
							</Title>
						</div>
					</div>
				</div>
			)}

			{/* {for center web size} */}
			{console.log(window.screen.width,"window.screen.width")}
			{logo ? (
				<div
					style={{
						flexBasis: `${window.screen.width < 979 ?"80%":"100%"}`,
						textAlign: "center",						
						// transform: `${inOutReward == 2 && showReward == 2 ?"scale(1.5)":""}`,
						// transformOrigin: `${inOutReward == 2 && showReward == 2 ? "50% -10 %" : ""}`,				
						// transition: `${backgrounHide ? "all 3s" : ""}`,      
					}}
				>
					<div className='d-flex'>
						<ForZoom  {...{ showReward, inOutReward }} className="flex-fill d-flex" /* className="w-100" */
							style={{
								// transform: `${showReward == 2 && inOutReward == 2 ? "scale(1.5)" : ""}`,
								// transformOrigin: `${showReward == 2 && inOutReward == 2 ? "55% 0%" : ""}`,
								// transformOrigin: `${window.screen.width > 767 ? "60% 0%" : "40% 0%"}`,								
							}}
						>
							{(user?.uid && !login) && (
								<div className='d-flex mx-auto w-auto '
									style={{
										position: "relative",
										height: "50px",
										transform: `${showReward == 2 && inOutReward == 2 ? "scale(1.5)" : ""}`,
										transformOrigin: `${showReward == 2 && inOutReward == 2 ? "55% 0%" : ""}`,
										transition: `${showReward == 2 && inOutReward == 2 ? "transform 3s ease" : ""}`,
									}}>
									<div onClick={() => {
										if (!showMenubar && !followerPage) navigate("/profile/mine")
									}}

										style={{
											position: "absolute",
											marginLeft: "90px",
											cursor: "pointer"
										}}
									>
										<Avatars
											type={followerPage && followerInfo != "" ? followerInfo?.avatar || defaultAvatar as AvatarType : (avatarImage || userInfo?.avatar || defaultAvatar) as AvatarType}
											style={{
												width: "60px",
												height: "60px",
												// @ts-ignore
												boxShadow: `${(userInfo?.isUserUpgraded && !followerPage) ? "1px 0px 5px #ffd700" : "1px 0px 5px #6352E8"}`, backgroundColor: `${(userInfo?.isUserUpgraded && !followerPage) ? "#ffd700" : "#6352E8"}`,
												// boxShadow: "1px 0px 5px #6352E8",
												// backgroundColor: "#6352E8",
											}}
										/>
									</div>
									<div className='w-100'>
										<HeaderCenter className='d-flex justify-content-between' style={{ width: '16em' }}>
											{followerPage && followerInfo != "" ?
												<>
													<span className=""
														style={{
															marginLeft: "40px"
														}}
													>

														{followerInfo?.displayName}
													</span>
												</>

												:
												(!voteNumber && votingTimer && !!new Date(votingTimer).getDate()) ?
													// @ts-ignore
													<>
														{/* @ts-ignore */}
														<Countdown date={votingTimer}
															renderer={({ hours, minutes, seconds, completed }) => {
																return (
																	<span style={{ color: '#6352e8', fontSize: '12px', fontWeight: 400, paddingLeft: '3.2em' }}>
																		{Number(voteRules?.maxVotes)} Votes in {" "}
																		{hours < 1 ? null : `${hours}:`}
																		{minutes < 10 ? `0${minutes}` : minutes}:
																		{seconds < 10 ? `0${seconds}` : seconds}
																		{/* for {Number(voteRules?.maxVotes)} votes or buy extra votes now. */}
																	</span>
																);

															}}
														/>
													</>
													:
													<p className='' style={{ marginRight: '1em' }}>
														<span
															style={{
																color: "#6352E8",
																marginLeft: "40px",
																fontSize: window.screen.width <= 340 ? '0.7889em' : '12px'
															}}
														>
															{/* reward modal 4 */}
															{(MyPath == "/profile/mine" && inOutReward === 2) ?
																<CountUp useEasing={false} className={textBlink ? "HeaderText" : ""} start={voteNumber || 0 - (headerExtraVote?.vote || 0)} end={(voteNumber || 0) + (headerExtraVote?.vote || 0)} duration={rewardExtraVote < 10 ? rewardExtraVote : 10} delay={2}
																	onStart={() => {
																		// handleExtraVote.play()
																		setTimeout(() => {
																			setTextBlink(true)
																		}, 3000);
																	}}
																	onEnd={() => {
																		setTextBlink(false)
																		handleExtraVote.pause()

																		setInOutReward((prev: number) => {
																			// return prev == 2 ? 3 : prev
																			claimRewardSound.play();
																			return 3
																		});
																		if (headerExtraVote != 0) {
																			setShowReward((prev: number) => {
																				return 3;
																			});
																		}

																		setHeaderExtraVote({
																			vote: 0,
																			collect: false
																		});

																		// setHeaderExtraVote((prev: number) => {
																		// 	if (prev != 0) {
																		// 		setShowReward((prev: number) => {
																		// 			// return prev == 2 ? 3 : prev
																		// 			return 3;
																		// 		})
																		// 	}
																		// 	return prev
																		// })

																	}
																	}
																/> :
																Number(voteNumber && voteNumber)
																// + (headerExtraVote?.collect ? headerExtraVote?.vote : 0)
															}
															{" "}
															votes left
														</span>
													</p>
											}
											{
												<div style={{ marginRight: '1em' }}>
													{followerPage && followerInfo != "" ?
														<Form.Check.Label
															className=""
															style={{ cursor: "pointer" }}

															bsPrefix="label"
															onClick={async () => {
																setFollowUnfollow(!followUnfollow)
																const ll = leaders.find((l) => l.userId === followerInfo?.uid);
																if (user && ll) {

																	await follow(ll, user, !followUnfollow);
																}
															}
															}
														>
															{followUnfollow == true ? <Following /> : <AddFollower />}
														</Form.Check.Label>
														:
														<PlusButton onClick={() => {

															if (!showMenubar) {
																handleSoundClick()
																navigate("/votingbooster")
															}
															// handleSoundClick()
															// navigate("/votingbooster")
														}}>
															<span
																className={`${voteNumber == 0 && votingTimer && user?.uid && !login && !votingboosterPage && "HeaderText"}`}
															>+</span>
														</PlusButton>}
												</div>

											}
										</HeaderCenter>
										{
											// !(followerPage && followerInfo != "") &&
											<div
												className=''
												style={{ width: "50%", marginLeft: "150px", marginTop: "5px", textAlign: "left", fontWeight: "100px", }}												
											>
												{/* {userInfo?.displayName &&
													<span className='mb-1 d-block' style={{ fontSize: "13px" }}>
														{userInfo?.displayName && userInfo?.displayName}
													</span>
												}													 */}
												{
													(followerPage && followerInfo != "") ?
														<></> :
														<span className='mb-1 d-block' style={{ fontSize: "13px" }}>
															{`${(userInfo?.displayName /* && !userInfo?.firstTimeLogin */) ? userInfo?.displayName : ''}`}
														</span>
												}
												{!!followerInfo && <div className="d-flex"													
												>												
													{(!!followerInfo?.status?.name && followerPage) && <MemberText>{followerInfo?.status?.name}</MemberText>}
													{
														(!!followerInfo?.bio && followerPage) && <>
															<div className='mx-2 '>
																<I className='bi bi-info-circle'
																	onMouseDown={(e) => {
																		setTooltipShow(false)
																	}}
																	onMouseUp={(e) => {
																		setTooltipShow(true)
																	}}
																	onMouseEnter={() => setTooltipShow(true)}
																	onMouseLeave={() => setTooltipShow(false)}
																></I>
															</div>
															{
																tooltipShow &&
																<div
																	style={{
																			position: 'fixed',
																	}}
																>
																	<div className="newtooltip"
																		style={{
																			// right: "0%",
																			width:"300px",
																			top:"25px",
																			// marginLeft: `${window.screen.width > 767 ? "2.50%" : ""}`,
																			// marginTop: `${window.screen.width > 767 ? "10%" : "1%"}`,
																			// zIndex:3000
																		}}
																	>
																		{/* <p>Your CMP count</p> */}
																			<p className="mt-1 text-end lh-base">{followerInfo?.bio}</p>																		
																	</div>
																</div>
															}
														</>
													}
												</div>}
												
												{(!!userInfo?.status?.name && !followerPage) && <MemberText>{userInfo?.status?.name}</MemberText>}
											</div>
										}

									</div>
								</div>
							)}
						</ForZoom>
						{showReward == 2 && inOutReward == 2 && window.screen.width > 767 && <div className='w-100'></div>}
						<Navbar.Brand as={Link} to='/'>
							<img src={BigLogo} alt='' />
						</Navbar.Brand>
					</div>
				</div>
			) : (
				<div style={{ width: "25%" }}>&nbsp;</div>
			)}
			<div>
				<Modal
					dialogClassName="modal-35w"
					show={/* show */afterVotePopup}
					size="lg"
					onHide={handleClose}
					aria-labelledby="contained-modal-title-vcenter"
					centered
					style={{ opacity: 1, zIndex: 9999, }}
					className="borderColor"
					// animation={false}
					backdrop="static"
					contentClassName={window.screen.width <= 750 ? "w-100" : 'w-auto'}
				>
					{/* <Modal.Header>

              </Modal.Header> */}
					<div className="d-flex justify-content-between">
						<div className="d-flex flex-grow-1 justify-content-center">
							<p className="text-uppercase text-center" > Out of votes? &nbsp;
								{/* <span onClick={() => {
									setShow(false)
									setAfterVotePopup(false);
									navigate('/votingbooster');
								}} style={{ fontSize: '1.5em', textDecoration: 'none', color: '#775cff' }}>+</span> */}

							</p>
							<PlusButton className="d-flex justify-content-center" style={{ padding: '1px', fontSize: '17px' }} onClick={() => {
								setShow(false);
								setAfterVotePopup(false);
								if (!showMenubar) {
									handleSoundClick()
									navigate("/votingbooster")
								}
								// handleSoundClick()
								// navigate("/votingbooster")
							}}>
								<span
									className={`text-center HeaderText`}
								>+</span>
							</PlusButton>
						</div>
						<div className="d-flex justify-content-end">
							<button type="button" className="btn-close " aria-label="Close" onClick={() => {
								setShow(false)
								setAfterVotePopup(false)
							}}></button>
						</div>
					</div>
					<Modal.Body>

						{/* <hr /> */}

						<div className="text-center">
							WAIT <span className="text-uppercase">
								{/* @ts-ignore */}
								{!!new Date(votingTimer).getDate() && <Countdown date={votingTimer}
									renderer={({ hours, minutes, seconds, completed }) => {
										return (
											<span >
												{hours < 1 ? null : `${hours}:`}
												{minutes < 10 ? `0${minutes}` : minutes}:
												{seconds < 10 ? `0${seconds}` : seconds}
											</span>
										);

									}}
								/>}
							</span> FOR {Number(voteRules?.maxVotes)} VOTES OR{window.screen.width < 465 ? <br /> : <>&nbsp;</>}
							<Link style={{ color: "#160133", textDecoration: 'none' }} className="text-uppercase" to="/votingbooster" onClick={() => {
								handleSoundClick()
								navigate("/votingbooster")
								setShow(false)
								setAfterVotePopup(false)
							}} >Buy Extra votes</Link>
						</div>
					</Modal.Body>
				</Modal>
			</div>
			{/* <div>
				<Modal show={cmpModalOpen} onHide={() => setCmpModalOpen(false)}
					backdrop="static"
					aria-labelledby="contained-modal-title-vcenter"
					centered
				>
					<div className="d-flex justify-content-end">
						<button type="button" className="btn-close " aria-label="Close" onClick={() => setCmpModalOpen(false)}></button>
					</div>
					<Modal.Body>
						<p className="text-center">Congratulations 🎉</p>
						<p className="text-center"> You've reached your  goal! </p>
						<div className='py-2  d-flex  justify-content-center'>
							<span style={{ textDecoration: 'none', cursor: 'pointer' }}
								onClick={() => {
									setCmpModalOpen(false)
									navigate('/profile/mine');
									setShowBack(true);
								}}
							>
								<Other>{("CHECK IT OUT")}</Other>
							</span>
						</div>

					</Modal.Body>

				</Modal>
			</div> */}
		</MenuContainer >

	);
};


export default Header;
