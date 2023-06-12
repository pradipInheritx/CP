/** @format */

import { Button, Container, Form, Modal, Navbar } from "react-bootstrap";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import UserContext from "../Contexts/User";
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
import CountUp from "react-countup";

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
  height: 150vh;
  z-index:2200;
  // left: 50%;
  // transform: translate(-50%, -20%);    
  transition: opacity .3s;
  background-color: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
transition:  all 1s ease;

`;


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
	remainingTimer: number;
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
	const { voteRules, followerUserId, login, showReward, setShowReward, headerExtraVote, setHeaderExtraVote, inOutReward, setInOutReward, afterVotePopup, setAfterVotePopup } = useContext(AppContext);
	// console.log(showReward,inOutReward,"inOutReward")
	const translate = useTranslation();
	const [voteNumber, setVoteNumber] = useState(0)
	const [votingTimer, setVotingTimer] = useState(0)
	const [followerInfo, setFollowerInfo] = useState<any>()
	const [followUnfollow, setFollowUnfollow] = useState<any>(false)
	const [show, setShow] = useState(false);
	const { leaders } = useContext(CoinsContext);

	var urlName = window.location.pathname.split('/');
	const followerPage = urlName.includes("followerProfile")
	const pageTrue = urlName.includes("pairs") || urlName.includes("coins")

	const MyPath = window.location.pathname;




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
		if (voteNumber == 0 && votingTimer && pageTrue && urlName.length > 2 && user?.uid && !login) {

			setShow(true)
		} else {
			setShow(false)
		}

	}, [voteNumber, votingTimer, afterVotePopup])

	useEffect(() => {
		if (afterVotePopup) {
			setShow(true)
			// setAfterVotePopup(false)
		} else {
			setShow(false)
		}

	}, [afterVotePopup])



	useEffect(() => {

		setVotingTimer(remainingTimer);

	}, [remainingTimer])
	useEffect(() => {
		if (pages) {
			setMounted(true);
		}
	}, [pages]);

	useEffect(() => {
		const voted = Number(votesLast24Hours.length) < Number(voteRules?.maxVotes) ? Number(votesLast24Hours.length) : Number(voteRules?.maxVotes)
		// @ts-ignore
		setVoteNumber((Number(voteRules?.maxVotes) + Number(userInfo?.rewardStatistics?.extraVote) - Number(voted) || 0) - (headerExtraVote?.vote || 0))

		prevCountRef.current = voteNumber;


		// console.log('votenumber',voteNumber, Number(voted))
	}, [voteRules?.maxVotes, userInfo?.rewardStatistics?.extraVote, votesLast24Hours.length, headerExtraVote]);




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
				// console.log("i am working")
				signOut(auth)
					.then((res) => {
						Logout(setUser);
						setLogin(true);
					})
					.catch((error) => {
						// console.log("i am working error")
						setLogin(true);
						const errorMessage = error.message;
						// console.log(errorMessage,"i am working error");
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

		<MenuContainer
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
						<ForZoom {...{ showReward, inOutReward }} className="w-100">
							{user?.uid && !login ? (
								<div
									className="d-flex"
									style={{
										position: "relative",
										width: `${showReward == 2 && inOutReward == 2 ? "220px" : "100%"}`,
										transition: `width 1s ease;`
									}}
								>
									<div className='' onClick={() => navigate("/profile/mine")}
										style={{
											position: "absolute",
											marginTop: "7px",
											cursor: "pointer"
										}}
									>
										<Avatars
											type={followerPage && followerInfo != "" ? followerInfo?.avatar || "Founder" as AvatarType : userInfo?.avatar as AvatarType}
											style={{
												width: "45px",
												boxShadow: "1px 0px 5px #6352E8",
												// border: "1px solid #6352E8",
												backgroundColor: "#6352E8",
											}}
										/>
									</div>
									<div className='w-100 mt-3' style={{ marginLeft: "0px" }}>
										<HeaderCenterMob className=''>
											<div></div>
											<div className='mt-1'>
												{
													followerPage && followerInfo != "" ? followerInfo?.displayName :
														(!voteNumber && votingTimer && !!new Date(votingTimer).getDate()) ?
															// @ts-ignore */
															<div className="" style={{ marginLeft: '20px', marginTop: "0px", lineHeight: "90%" }}>
																{/* @ts-ignore */}
																<Countdown daysInHours zeroPadTime={2} date={votingTimer}
																	renderer={({ hours, minutes, seconds, completed }) => {
																		return (
																			<span className="text-uppercase" style={{ color: '#6352e8', fontSize: '8px', fontWeight: 100, lineHeight: "10%" }}>
																				Wait {" "}
																				{hours < 1 ? null : `${hours} :`}
																				{minutes < 10 ? `0${minutes}` : minutes}:
																				{seconds < 10 ? `0${seconds}` : seconds} for {Number(voteRules?.maxVotes)} votes
																				<br />
																				or buy extra votes now.
																			</span>
																		);

																	}}

																/>
															</div>
															:
															<span
																style={{
																	color: "#6352E8",
																	// zoom: `${showReward == 2 ? "150%" : ""}`
																	// fontSize:"11px",
																	marginLeft: "10px",
																}}
															>


																{MyPath == "/profile/mine" ?
																	<CountUp className={inOutReward == 2 && showReward == 2 ? "HeaderText" : ""} start={voteNumber || 0} end={(voteNumber || 0) + (headerExtraVote?.collect ? headerExtraVote?.vote : 0)} duration={3}
																		style={{
																			// fontSize: `${showReward == 2 && inOutReward == 2 ? "15px" : "11px"}`
																		}}

																		onEnd={() => {
																			setInOutReward((prev: number) => {
																				return prev == 2 ? 3 : prev
																			});
																			setHeaderExtraVote((prev: number) => {
																				if (prev != 0) {
																					setShowReward((prev: number) => {
																						return prev == 2 ? 3 : prev
																					})
																				}
																				return prev
																			})
																		}
																		}
																	/> :
																	// <CountUp start={prevCountRef.current} end={voteNumber && voteNumber} duration={3} />
																	voteNumber && voteNumber + (headerExtraVote?.collect ? headerExtraVote?.vote : 0)
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
													handleSoundClick()
													navigate("/votingbooster")
												}}>
													<span>+</span>
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
														{`${userInfo?.displayName ? userInfo?.displayName : ''}`}
													</span>
											}
											{(!!followerInfo?.status?.name || !!userInfo?.status?.name) && <MemberText>
												{!!followerInfo?.status?.name ? followerInfo?.status?.name : userInfo?.status?.name || ""}
											</MemberText>}
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

			{logo ? (
				<div

					style={{
						flexBasis: "100%",
						textAlign: "center",
						//  transform: `${showReward == 2 && "scale(1)"}`,
						//     marginTop: `${showReward == 2 && "50px"}`
						// width: desktop ? "25%" : (pathname === "/" ? "75%" : "25%"),
						// textAlign: desktop ? undefined : "center",
					}}
				>

					<div className='d-flex'>
						<ForZoom  {...{ showReward, inOutReward }} className="flex-fill d-flex" /* className="w-100" */>
							{(user?.uid && !login) && (
								<div className='d-flex mx-auto w-auto' style={{ position: "relative", height: "50px", }}>
									<div onClick={() => navigate("/profile/mine")} style={{
										position: "absolute",
										marginLeft: "90px",
										cursor: "pointer"
									}}
									>
										<Avatars
											type={followerPage && followerInfo != "" ? followerInfo?.avatar || "Founder" as AvatarType : userInfo?.avatar as AvatarType}
											style={{
												width: "60px",
												boxShadow: "1px 0px 5px #6352E8",
												backgroundColor: "#6352E8",
											}}
										/>
									</div>
									<div className='w-100'>
										<HeaderCenter className='d-flex justify-content-between' style={{ width: '16em' }}>
											<p className='' style={{ marginRight: '1em' }}>
												{followerPage && followerInfo != "" ? followerInfo?.displayName :
													(!voteNumber && votingTimer && !!new Date(votingTimer).getDate()) ?
														// @ts-ignore
														<span style={{ marginLeft: '20px' }}>
															{/* @ts-ignore */}
															<Countdown date={votingTimer}
																renderer={({ hours, minutes, seconds, completed }) => {

																	return (
																		<span className="text-uppercase" style={{ color: '#6352e8', fontSize: '9px', fontWeight: 400 }}>
																			{/* {hours < 10 ? `0${hours}` : hours}: */}
																			Wait {" "}
																			{hours < 1 ? null : `${hours} :`}
																			{minutes < 10 ? `0${minutes}` : minutes}:
																			{seconds < 10 ? `0${seconds}` : seconds} for {Number(voteRules?.maxVotes)} votes
																			<p style={{ marginLeft: '30px' }}> or buy extra votes now.</p>
																		</span>
																	);

																}}
															/>
														</span>
														:
														<span
															style={{
																color: "#6352E8",
																fontSize: "11px",
																marginLeft: "50px",
															}}
														>
															{MyPath == "/profile/mine" ?
																<CountUp className={inOutReward == 2 && showReward == 2 ? "HeaderText" : ""} start={voteNumber || 0} end={(voteNumber || 0) + (headerExtraVote?.collect ? headerExtraVote?.vote : 0)} duration={3}
																	onEnd={() => {
																		setInOutReward((prev: number) => {
																			return prev == 2 ? 3 : prev
																		});
																		setHeaderExtraVote((prev: number) => {
																			if (prev != 0) {
																				setShowReward((prev: number) => {
																					return prev == 2 ? 3 : prev
																				})
																			}
																			return prev
																		})
																	}
																	}
																/> :
																voteNumber && voteNumber + (headerExtraVote?.collect ? headerExtraVote?.vote : 0)
															}
															{" "}
															votes left
														</span>
												}
											</p>
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
															handleSoundClick()
															navigate("/votingbooster")
														}}>
															<span>+</span>
														</PlusButton>}
												</div>

											}
										</HeaderCenter>
										{
											!(followerPage && followerInfo != "") &&
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
												{userInfo?.displayName &&
													<span className='mb-1 d-block' style={{ fontSize: "13px" }}>
														{userInfo?.displayName && userInfo?.displayName}
													</span>
												}
												{(!!followerInfo?.status?.name || !!userInfo?.status?.name) && <MemberText>
													{!!followerInfo?.status?.name ? followerInfo?.status?.name : userInfo?.status?.name || ""}
												</MemberText>}
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
					show={show}
					size="lg"
					onHide={handleClose}
					aria-labelledby="contained-modal-title-vcenter"
					centered
					style={{ opacity: 1, zIndex: 100 }}
					className="borderColor"
					// animation={false}
					backdrop="static"
				>
					{/* <Modal.Header>

              </Modal.Header> */}
					<div className="d-flex justify-content-end">
						<button type="button" className="btn-close " aria-label="Close" onClick={() => {
							setShow(false)
							setAfterVotePopup(false)
						}}></button>
					</div>
					<Modal.Body>

						{/* <hr /> */}
						<p className="text-uppercase text-center mb-3" > Out of votes? </p>
						{/* <strong className="text-uppercase" style={{ fontSize: "20px" }}>Out of votes?</strong> */}
						<div className="text-center">
							<Link className="text-uppercase" to="/votingbooster" onClick={() => {
								handleSoundClick()
								navigate("/votingbooster")
								setShow(false)
								setAfterVotePopup(false)
							}} >Buy Extra votes</Link> \
							{" now or wait,".toUpperCase()}
							<span className="text-uppercase">
								{/* @ts-ignore */}
								{!!new Date(votingTimer).getDate() && <Countdown date={votingTimer}
									renderer={({ hours, minutes, seconds, completed }) => {
										return (
											<span >
												{/* {hours < 10 ? `0${hours}` : hours}: */}
												{Number(voteRules?.maxVotes)} votes in {' '}
												{hours < 1 ? null : `${hours} :`}
												{minutes < 10 ? `0${minutes}` : minutes}:
												{seconds < 10 ? `0${seconds}` : seconds}
											</span>
										);

									}}
								/>}
							</span>

						</div>
					</Modal.Body>
				</Modal>
			</div>
		</MenuContainer>

	);
};


export default Header;
