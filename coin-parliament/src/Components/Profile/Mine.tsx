/** @format */

import React, { useContext, useEffect, useRef, useState } from "react";
import { Badge, Button, Col, Container, Modal, Row } from "react-bootstrap";
import UserContext from "../../Contexts/User";
import Collapse from "./Collapse";
import PAXCard from "./PAXCard";
import LevelCard from "./LevelCard";
import AppContext from "../../Contexts/AppContext";
import Minting from "./Minting";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useTranslation } from "../../common/models/Dictionary";
import styled, { css } from "styled-components";
import NotificationContext, { ToastType } from "../../Contexts/Notification";
import Upgrade from "./Upgrade";
import { isV1, ZoomCss } from "../App/App";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import animation from "./Comp.json";
import AnimationReward from "./Animation/AnimationReward";
import NFTCard from "../../common/NFTCard/NFTCard";
import './Style.css'

import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase";
import { texts } from "../LoginComponent/texts";
import { Other } from "../../Pages/SingleCoin";
import { Buttons } from "../Atoms/Button/Button";
import AnimationCard from "./Animation/AnimationCard";
import { CurrentCMPContext } from "Contexts/CurrentCMP";
import Copy from "Components/icons/copyShare";
import Swal from "sweetalert2";
import RewardHistory from "./rewardHistory";
import ShareModal from "Components/shareModal";
import { VoteContext, VoteDispatchContext } from "Contexts/VoteProvider";
import { LessTimeVoteDetailDispatchContext } from "Contexts/LessTimeVoteDetails";


const MyBadge = styled(Badge)`
  background-color: var(--color-6352e8);
  box-shadow: 0 3px 6px #00000029;
  border-radius: 0 0 6px 6px;
  font-size: 14px;
  opacity: 1;
  width: auto;
  color: var(--white);
`;
const RewardList = styled.p`
  font-size: 10px;
  color: #707070;
  cursor: pointer;
`;
const CardDiv = styled.div`

`;
type ZoomProps = {
  inOutReward?: number
};

const I = styled.i`
  cursor: pointer;
  font-size:22px;
  color:#6352e9;
`;

// const ForZoom = styled.div`
// z-index:${(props: ZoomProps) => `${props.inOutReward == 1 ? "2200" : ""}`};  
//  ${(props: ZoomProps) => `${props.inOutReward == 1 ? ZoomCss : ""}`} 
// `;

const Mine = () => {
  const { userInfo, user } = useContext(UserContext);
  const { userTypes, showBack, setShowBack, showReward, setShowReward, inOutReward, setInOutReward, setAlbumOpen } = useContext(AppContext);
  const { showModal, showToast } = useContext(NotificationContext);
  const { width = 0 } = useWindowSize();
  const translate = useTranslation();
  const location = useLocation();
  const [rewardTimer, setRewardTimer] = useState(null);
  const [albumName, setAlbumName] = useState("");
  const [modalShow, setModalShow] = React.useState(false);
  const [cardModalShow, setCardModalShow] = React.useState(false);
  const [paxValue, setPaxValue] = React.useState(userInfo?.rewardStatistics?.diamonds || 0);
  const [befornotShow, setBefornotShow] = useState<any>(true)
  const [shareModalShow, setShareModalShow] = React.useState(false);
  const [countShow, setCountShow] = React.useState(false);
  const [modelText, setModelText] = React.useState(0);

  let navigate = useNavigate();



  const handleClose = () => setModalShow(false);
  const handleShow = () => setModalShow(true);

  const handleCardClose = () => {
    setCardModalShow(false);
    setInOutReward(0);
    setShowReward(0);
  };
  const handleCardShow = () => setCardModalShow(true);

  const currentCMP = useContext(CurrentCMPContext);
  const handleShareModleShow = () => setShareModalShow(true);
  const voteDetails = useContext(VoteContext);
  const setLessTimeVoteDetails = useContext(LessTimeVoteDetailDispatchContext);
  useEffect(() => {
    setLessTimeVoteDetails(undefined); // we don't need to called vote API when user is in profile page
  }, []);
  // @ts-ignore 
  const currentCMPDiff = Math.floor((userInfo?.voteStatistics?.score || 0) / 100);
  const prevCMPDiff = Math.floor(((userInfo?.voteStatistics?.score || 0) - currentCMP) / 100);
  const score = (userInfo?.voteStatistics?.score || 0) - ((userInfo?.rewardStatistics?.total || 0) * 100);

  const remainingCMP = ((currentCMP > 0 && currentCMPDiff > prevCMPDiff && (userInfo?.voteStatistics?.score || 0) > 0) ? 100 : score);
  const remainingReward = (userInfo?.rewardStatistics?.total || 0) - (userInfo?.rewardStatistics?.claimed || 0);

  var urlName = window.location.pathname.split('/');
  const ProfileUrl = urlName.includes("profile")

  console.log(currentCMPDiff, prevCMPDiff, currentCMP, remainingCMP, 'hello');

  useEffect(() => {
    // @ts-ignore
    setPaxValue(userInfo?.rewardStatistics?.diamonds)
  }, [userInfo?.rewardStatistics?.diamonds])
  

  const prevPAXValue = useRef(paxValue)

  useEffect(() => {
    if (!prevPAXValue.current) {
      prevPAXValue.current = paxValue;
    }
    if (countShow) {
      prevPAXValue.current = userInfo?.rewardStatistics?.diamonds || 0;
    }

  }, [paxValue, countShow])


  useEffect(() => {
    if (!!rewardTimer && showReward == 3 && inOutReward == 3) {

      handleCardShow();
    }
  }, [inOutReward, showReward, rewardTimer]);
  const remainingRewardRef = useRef<number>(0);
  const remainingCMPRef = useRef<number>(0);
  useEffect(() => {
    remainingRewardRef.current = remainingReward;
    remainingCMPRef.current = remainingCMP;
  }, [remainingReward, remainingCMP]);
  useEffect(() => {
    let timerPopup: any = null;
    if (!voteDetails.openResultModal && showBack && ProfileUrl && !modalShow && ((userInfo?.voteStatistics?.score || 0) % 100) < 100 && remainingReward < 1) { //remainingReward < 1 &&   userInfo?.voteStatistics?.score < 100are same
      timerPopup = setTimeout(() => {
        setModelText(1)
        // handleShow();
        if (ProfileUrl && score != 100) {
          Cmppopup();
        }
        setShowBack(false)
      }, 15000);
    }
    return () => {
      if (timerPopup) {
        clearTimeout(timerPopup);
      }
    }
  }, []);

  const Cmppopup = () => {
    var urlName = window.location.pathname.split('/');

    const UrlCheck = urlName.includes("profile")
    if (UrlCheck && remainingRewardRef.current < 1) {
      Swal.fire({
        html:
          // "<div className='' style='text-align: center !important;display:flex;flex-direction: column !important;  margin-top: 2em;' >" +
          "<strong style='font-size:20px; margin-bottom:1em !important; '>Stay in the game</strong>" +
          "<p style='font-size:20px; margin-top:10px !important;'>Only " + (100 - remainingCMPRef.current).toFixed(2) + " CMP to reach your goal</p>" +
          "",
        color: 'black',
        showConfirmButton: ((userInfo?.rewardStatistics?.extraVote || 0) + parseInt(userInfo?.voteValue || '0') > 0),
        confirmButtonText: 'Continue Voting',
        confirmButtonColor: '#6352e8',        
        // showCloseButton: false,
        showCancelButton: ((userInfo?.rewardStatistics?.extraVote || 0) + parseInt(userInfo?.voteValue || '0') == 0),        
        cancelButtonText: "Buy more votes Now",
        cancelButtonColor: '#6352e8',
        customClass: {
          popup: 'stayInGamePopupStyle',
          htmlContainer: 'pt-3'
        }
      }).then((result) => {

        if (result.isConfirmed) {
          let continueVotingUrl = localStorage.getItem('continueVotingUrl');
          if (continueVotingUrl) {
            localStorage.removeItem('continueVotingUrl');
            navigate(continueVotingUrl);
          }
        }
        if (result.dismiss === Swal.DismissReason.cancel) {
          navigate("/votingbooster")
        }
      });
    }
    else {
      // console.log("i am working not")
    }
  }

  const openpopup = () => {
    if (showBack) {
      setTimeout(() => {
        setModelText(2)
        // handleShow()
        setShowBack(false)
        handleCardClose()
        setRewardTimer(null);
        setShowReward(0);
      }, 10000);
    }
  }

  if (isV1()) {
    return (
      <Navigate
        to='/'
        state={{
          from: location,
        }}
      />
    );
  }

  const goBack = () => {
    navigate(-1);
  }
// @ts-ignore
  const url = `${document.location.protocol}//${document.location.host}/profile/Album?collectionName=${albumName}`;
  // const url = "https://coinparliament.com/"
  const shareText = "I won this unique card! Join the Parliament and win with me."  

  // console.log('userInfo',userInfo?.rewardStatistics?.total , userInfo?.rewardStatistics?.claimed)

  return (
    <div className="border">
      <Container >
        {width > 767 ? (
          <div className='d-flex justify-content-center mt-2'>
            <div>
              <div>
                {" "}
                <LevelCard userTypes={userTypes} userInfo={userInfo} />
              </div>
              {/* <ForZoom {...{ inOutReward }} style={{ marginTop: "7px" }}> */}

              <PAXCard
                countShow={countShow}
                walletId={userInfo?.wallet || ""}
                rewardTimer={rewardTimer}
                setCountShow={setCountShow}
                PAX={paxValue}
              // PAX={
              //   prevPAXValue.current
              // }
              />
              {/* {inOutReward == 1 && <div className=""> <CoinAnimation /> </div>} */}
              {/* </ForZoom> */}

            </div>
            {/* @ts-ignore */}
            <div style={{ marginLeft: "10px" }}>
              <Minting
                {...{
                  setCountShow,
                  width,
                  score: remainingCMP /* ((userInfo?.voteStatistics?.score || 0) > 0 ? remainingCMP : 0) */,
                  // @ts-ignore
                  // remainingCMP,
                  setRewardTimer,
                  rewardTimer,
                }}
                setRewardTimer={setRewardTimer}
                rewardTimer={rewardTimer}
                // @ts-ignore
                claim={remainingReward}
              />
            </div>
          </div>
        ) : (
          <Row className='flex-row-reverse align-items-stretch mt-2'>
            <Col sm={12} md={6}>
              <div className='d-flex justify-content-center align-items-center flex-column mb-2'>
                {/* @ts-ignore */}
                <Minting
                  {...{

                    width,
                    setCountShow,
                    score: remainingCMP,
                    // @ts-ignore
                    // remainingCMP,
                    setRewardTimer,
                    rewardTimer,
                  }}
                  setRewardTimer={setRewardTimer}
                  rewardTimer={rewardTimer}
                  // @ts-ignore
                  claim={remainingReward}
                />
              </div>
            </Col>
            <Col
              sm={12}
              md={6}
              className='d-flex flex-column flex-md-column-reverse'
            >
              {/* <ForZoom
                {...{ inOutReward }}
              > */}
              <PAXCard
                countShow={countShow}
                walletId={userInfo?.wallet || ""}
                rewardTimer={rewardTimer}
                setCountShow={setCountShow}
                // @ts-ignore
                // PAX={userInfo?.rewardStatistics?.diamonds || 0}
                PAX={paxValue}
              // PAX={
              //   prevPAXValue.current
              // }
              />
              {/* </ForZoom> */}
              <div className='mb-2'>
                <LevelCard userTypes={userTypes} userInfo={userInfo} />
              </div>
            </Col>
          </Row>
        )}
        <Row className='align-items-stretch mt-1 d-flex justify-content-center'>
          <RewardHistory rewardTimer={rewardTimer} />
        </Row>
      </Container>
      <div>
        <Modal
          show={
            modalShow
          } onHide={handleClose}
          // size="sm"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <div className="d-flex justify-content-end">
            <button type="button" className="btn-close " aria-label="Close" onClick={() => {
              handleClose()
            }}></button>
          </div>
          <Modal.Body>
            {/* continue voting */}
            {modelText == 1 && <div className='py-2  d-flex flex-column  justify-content-center'>
              <strong style={{ fontSize: "20px" }}>Stay in the game</strong>
              <p style={{ fontSize: "20px" }}>Only {100 - remainingCMP} CMP to reach your goal</p>
            </div>}
            {modelText == 2 && <div className='py-2  d-flex  flex-column justify-content-center'>
              <strong style={{ fontSize: "20px" }}>Great job!!</strong>
              <p style={{ fontSize: "20px" }}>
                You're one step closer to claiming your reward!
              </p>
            </div>}

          </Modal.Body >
          {/* <Modal.Footer> */}
          < div className="d-flex justify-content-center " >
            <Buttons.Primary className="mx-2" onClick={goBack}>CONTINUE VOTING</Buttons.Primary>
          </div >
        </Modal>
      </div >

      {/* Card Modal */}

      <CardDiv>
        {/* reward modal 5 */}
        <Modal
          className=""
          show={
            cardModalShow
          } onHide={handleCardClose}
          // fullscreen="sm-down"
          backdrop="static"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: "2200" }}
          // @ts-ignore
          contentClassName={window.screen.width > 767 ? `card-content modulebackground ForBigNft ${rewardTimer?.data?.firstRewardCardType.toLowerCase()}BG` : `card-contentMob modulebackground ForBigNft ${rewardTimer?.data?.firstRewardCardType.toLowerCase()}BG`}
        >
          <div className="d-flex justify-content-end">
            {/* <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => {
              setRewardTimer(null);
              setShowReward(0);
              handleCardClose()
            }}></button> */}
          </div>
          <Modal.Body
            style={{
              padding: "0px"
            }}
          >
            {/* continue voting */}
            {/* @ts-ignore */}
            <NFTCard openpopup={openpopup} setRewardTimer={setRewardTimer} setCountShow={setCountShow} handleShareModleShow={handleShareModleShow} handleCardClose={handleCardClose} cardType={rewardTimer?.data?.firstRewardCardType} rewardTimer={rewardTimer} setBefornotShow={setBefornotShow} befornotShow={befornotShow} setAlbumName={setAlbumName} />
          </Modal.Body>
        </Modal>
      </CardDiv>

      {/* Share Link */}
      <ShareModal shareModalShow={shareModalShow} setShareModalShow={setShareModalShow} url={url} shareText={shareText} />

    </div >
  );
};

export default Mine;
