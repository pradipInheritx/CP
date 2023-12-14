/** @format */

import React, { useContext, useEffect, useState } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";
import styled, { css } from "styled-components";
import lottie from "lottie-web";
import PieChart from "./PieChart";
import Collapse from "./Collapse";
import { useTranslation } from "../../common/models/Dictionary";
import { InputAndButton, PoppinsMediumWhite12px } from "../../styledMixins";
import { Form, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import UserContext from "../../Contexts/User";
import { functions } from "../../firebase";
import { httpsCallable } from "@firebase/functions";
import { divide, stubFalse } from "lodash";
import { texts } from "../LoginComponent/texts";
import { claimRewardSound, handleSoundClick, handleSoundWinCmp } from "../../common/utils/SoundClick";
import AppContext from "../../Contexts/AppContext";
import CircularProgress from "../circleProgressbar";
import { Buttons } from "../Atoms/Button/Button";
import Confetti from "../../assets/animation/confetti.json";
import { colors } from "../VoteForm";
import Swal from 'sweetalert2';
import { CurrentCMPDispatchContext } from "Contexts/CurrentCMP";
import { showToast } from "App";
import { ToastType } from "Contexts/Notification";
const Container = styled.div`
  box-shadow: ${(props: { width: number }) =>
    `${props.width > 767}?"0 3px 6px #00000029":"none"`};
  border-radius: 6px;
  opacity: 1;
  padding: ${(props: { width: number }) =>
    `${props.width > 767 ? "12px 28px 41.5px" : "0"}`};
  background: ${(props: { width: number }) =>
    `${props.width > 767 ? "#160133" : "none"}`};
  color: #d4d0f3;
`;

const Title = styled.div`
  color: var(--color-ffffff);
  font: normal normal normal 14px/14px Poppins;
  font-size: 14px;
  line-height: 1;
  letter-spacing: 0;
  text-transform: uppercase;
  opacity: 1;
  text-align: center;
`;
// @ts-ignore
const BtnLabel = styled(Form.Check.Label)`
  ${InputAndButton}
  ${PoppinsMediumWhite12px}
  padding: 7.7px 19px;
  justify-content: center;
  align-items: center;
  min-height: 19px;
  letter-spacing: 0;
  white-space: nowrap;
  text-transform: capitalize;
  color: var(--blue-violet);
  cursor: pointer;
`;
const BtnLabelPrimary = styled.button`
  width: 212px;
  font-size: 15px;
  background-color: var(--white);
  color: var(--blue-violet);
  border: none !important;
  position: relative;
  padding: 7.7px 19px;
  justify-content: center;
  align-items: center;
  min-height: 19px;
  letter-spacing: 0;
  white-space: nowrap;
  text-transform: capitalize;
  color: var(--blue-violet);
  cursor: pointer;
  &:disabled {

    background: var(--unnamed-color-ffffff) 0% 0% no-repeat padding-box;
    background: #FFFFFF 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #00000029;
    border-radius: 4px;
    opacity: 0.3;
}
`;

const Option = css`
border: ${(props: { borderColor: string; selected: boolean }) =>
    `1px solid ${props.borderColor}`};
background: ${(props: { borderColor: string; selected: boolean }) =>
    props.selected ? colors[0] : colors[1]};
  flex-grow: 1;
  flex-basis: 0;
  min-width: 0;
  box-shadow: rgb(67 47 229) 0px 4px 1px, rgba(0,0,0,0.22) 0px 6px 12px;
  transition: all .2s ease;
  &:disabled {

    background: var(--unnamed-color-ffffff) 0% 0% no-repeat padding-box;
    background: #FFFFFF 0% 0% no-repeat padding-box;
    opacity: 0.3;
}
`;

const Option0 = styled(Buttons.RadiusTopRight)`
  ${Option};
  flex-direction: column;
  justify-content: center;
  border-radius:0 ;
  &:active{
    position: relative;
    top: 2px;
    box-shadow: rgb(67 47 229) 0px 3px 1px, rgba(0,0,0,0.22) 0px 6px 12px;
    }
    &:disabled {
      pointer-events: none;  
      cursor:pointer;
    }
    &:hover {
    background:#6352E8;
    color:white;
    box-shadow: rgb(67 47 229) 0px 4px 1px, rgb(170 164 220) 0px 8px 6px;
  }
`;
const Dot = styled.div`
  border-radius: 50%;
  position: absolute;
  font-size: 9px;
  top: -5px;
  right: -5px;
  // text-shadow: -1px 0 1px white;
  font-weight: 300;
  color: white;
  width:19px;
  height: 19px;
  word-break: break-word;
  padding: 2px;

  background: red;
  // border: 2px solid #666;
  // color: #666;
  text-align: center;
`;
const I = styled.i`
  border-radius: 50%;
  position: absolute;
  font-size: 11px;
  top: 0px;
  right: -20px;

  font-weight: 300;
  color: #6352e8;

  width: 16px;
  height: 16px;

  text-align: center;
`;

const Popuphead = styled.p`
  font-size:25px;
  font-weight:600;
background: linear-gradient(180deg, #FFF8A6 29.44%, #FFC00B 73.33%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  // text-shadow: 0px 1px 3px #FFCB35;
font-family: Poppins;
font-size: 25px;
font-style: normal;
font-weight: 700;
line-height: normal;
letter-spacing: 2px;
text-transform: uppercase;
`;


type MintingProps = {

  score: number;
  setRewardTimer?: any;
  rewardTimer?: any;
  claim?: number;
  setCountShow?: any;
};
const claimReward = httpsCallable(functions, "claimReward");
const Minting = ({

  score,
  setRewardTimer,
  rewardTimer,
  claim,
  setCountShow
}: MintingProps) => {
  const { width = 194 } = useWindowSize();
  const translate = useTranslation();
  const { user, userInfo } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const { showReward, setShowReward, setRewardExtraVote, albumOpen, setAlbumOpen, inOutReward, setInOutReward, setHeaderExtraVote, showBack, setShowBack } = useContext(AppContext);
  const [resultData, setResultData] = React.useState({});
  const [modalShow, setModalShow] = React.useState(false);
  const [tooltipShow, setTooltipShow] = React.useState(false);
  const [CmpPopupShow, setCmpPopupShow] = React.useState(false);
  const [ClickedOption, setClickedOption] = React.useState(false);
  const handleClose = () => setModalShow(false);
  const handleShow = () => {
    setModalShow(true)
    claimRewardSound.play();
    // handleSoundWinCmp.play()

  };
  const setCurrentCMP = useContext(CurrentCMPDispatchContext);
  const handleCmpPopupClose = () => {
    setCmpPopupShow(false);
    setCurrentCMP(0);
    localStorage.setItem(`${user?.uid}_newScores`, '0');
  };
  const handleCmpPopupShow = () => {
    setCmpPopupShow(true)
  };
  useEffect(() => {
    if (modalShow && CmpPopupShow) {
      setCmpPopupShow(false);
    }
  }, [modalShow, CmpPopupShow]);
  useEffect(() => {
    if (score === 100) {
      setTimeout(() => {
        handleCmpPopupShow();
      }, 8100);
    }
  }, [score]);
  useEffect(() => {
    if (CmpPopupShow) {
      const Animation = lottie.loadAnimation({
        // @ts-ignore
        container: document.querySelector(".Cmp-animation"),
        animationData: Confetti,
        renderer: "html", // "canvas", "html"
        loop: true, // boolean
        autoplay: true, // boolean   ,
      });
      handleSoundWinCmp.play();
      // setTimeout(function () {
      //   // Animation.destroy();
      //   handleSoundWinCmp.pause();
      // }, 3000);  // 5000 milliseconds = 5 seconds

      // setShowBack(false)
    } else {
      handleSoundWinCmp.pause();
    }
  }, [CmpPopupShow]);

  const [animateButton, setAnimateButton] = useState<boolean>(false);

  const claimRewardHandler = () => {
    setAnimateButton(true);
    setTimeout(() => setAnimateButton(false), 1000);
    handleSoundClick()
    if (claim) {
      setLoading(true);
      claimReward({ uid: user?.uid, isVirtual: false }).then((result: any) => {
        handleShow();
        setResultData(result);
        setRewardTimer(result);
        if (result?.data) {
          // @ts-ignore
          setHeaderExtraVote({ vote: result?.data!.secondRewardExtraVotes, collect: false })
        }
        // claimReward({ uid: user?.uid, isVirtual: true });
        setLoading(false);
      }).catch((error) => {
        showToast(error.message, ToastType.ERROR);
      });
    } else {
      Swal.fire({
        title: '',
        text: `You still need ${100 - score} CMP to claim your reward.`,
        color: 'black',
        confirmButtonText: 'Ok',
        confirmButtonColor: '#6352e8',
        showCloseButton: true,
        customClass: {
          popup: 'popupStyle',
          container: 'popupStyleContainer'
        }
      });
    }
  }


  // const tooltip = (props:any) => {

  // };
  console.log(animateButton, "setAnimateButton")

  return (
    <React.Fragment>
      {loading && <Modal
        show={loading}
        backdrop="static"
        centered
        style={{ zIndex: "2200", backgroundColor: 'rgba(0, 0, 0, 0.80)' }}
        contentClassName={window.screen.width > 767 ? "card-content modulebackground" : "card-contentMob modulebackground"}
      >
        <Modal.Body>
          <div style={{
            position: 'fixed',
            height: '100%',
            display: 'flex',
            textAlign: 'center',
            justifyContent: 'center',
            top: '0px',
            right: '0px',
            bottom: '0px',
            zIndex: '9999',
            overflow: 'hidden',
            width: '100%',
            alignItems: 'center',

          }}>
            <span className="loading" style={{ color: "#7767f7", zIndex: "2220px", fontSize: '1.5em' }}>
              {texts.waitForIt}
            </span>
          </div>
        </Modal.Body>
      </Modal>}
      <Container {...{ width }} style={{ maxWidth: '257.9px', minHeight: width < 767 ? '210.9px' : '322.9px', }}>
        {
          tooltipShow &&
          <div
            style={{
              display: "relative"
            }}
          >
            <div className="newtooltip"
              style={{
                // right: "0%",
                width: `${window.screen.width > 767 ? "25%" : "78%"}`,
                marginLeft: `${window.screen.width > 767 ? "16.50%" : ""}`,
                marginTop: `${window.screen.width > 767 ? "1%" : "10%"}`,
              }}
            >
              {/* <p>Your CMP count</p> */}
              <p className="mt-1 text-end lh-base">This dynamic system amplifies your rewards as you actively vote and impact the game. </p>
              <p className="mt-3 text-end lh-base">
                Watch your CMP grow with every influential vote, unlocking Parliament Coins, extra votes, and exclusive cards at key milestones.
              </p>
              <p className="mt-3 text-end lh-base">
                As you climb through user levels, CMP reflects your dedication, making your experience in Coin Parliament uniquely rewarding and engaging.
              </p>
            </div>
          </div>
        }
        <div
          className='d-flex justify-content-center align-items-center flex-column'
          style={{ position: "relative", marginTop: width < 767 ? "13px" : "" }}
        >
          <Title
            className='box_title d-md-block text-white d-none mb-4'
            {...{ width }}
          >
            {texts.CPMinting}
          </Title>
          <I className='bi bi-info-circle ' style={{ paddingRight: width < 767 ? '8em' : '' }}
            onMouseDown={(e) => {
              setTooltipShow(false)
            }}
            onMouseUp={(e) => {
              setTooltipShow(true)
            }}
            onMouseEnter={() => setTooltipShow(true)}
            onMouseLeave={() => setTooltipShow(false)}
          ></I>


          <CircularProgress percentage={(score.toFixed(2) || 0)} />
        </div>
        {/* width > 767 &&  */(
          <div className="w-100" style={{ display: 'flex', alignContent: 'center', paddingLeft: (width < 767 ? '2em' : ''), paddingRight: (width < 767 ? '2em' : '') }} >
            <Option0
              style={{ marginTop: "10px" }}
              {...{
                onClick: claimRewardHandler,
                borderColor: "var(--blue-violet)",
                selected: animateButton,
                className: ["p-3 confetti-button svg-button", (animateButton ? "animate" : "")].join(" "),
                disabled: (loading || rewardTimer)
              }}
            >
              {(!!claim) && <Dot>{claim}</Dot>
              }
              {loading ? `${texts.CLAIMINGREWARDS}` : `${texts.CLAIMYOURREWARDS}`}
              
            </Option0>
              
          </div>
        )}
      </Container>
      <div>
        {/* reward modal 1 */}
        <Modal
          show={
            modalShow
          } onHide={handleClose}
          backdrop="static"
          contentClassName={"modulebackground ForBigDiv"}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: "2200" }}
          id="popupid"
        >


          <Modal.Body className="d-flex  flex-column  justify-content-between align-items-center"
            style={{
              width: `${window.screen.width > 767 ? "500px" : "100%"}`,
              height: "400px"
            }}
          >
            <Popuphead>Congrats!</Popuphead>
            {/* @ts-ignore*/}
            <div className=''><p style={{ fontSize: "24px", color: "white", fontWeight: "600" }}>You've won {resultData?.data?.thirdRewardDiamonds} coins </p></div>


            <div className="d-flex justify-content-center ">
              <Buttons.Primary className="mx-2" onClick={() => {
                setTimeout(() => {
                  setShowReward(1);
                  setInOutReward(1);
                  // setCountShow(true)
                  // @ts-ignore
                  setAlbumOpen(resultData?.data?.firstRewardCardCollection);
                  // @ts-ignore
                  setRewardExtraVote(resultData?.data?.secondRewardExtraVotes);
                  // setRewardTimer(resultData); i commented here because i set this when i get result 
                }, 1000);
                claimRewardSound.pause()
                handleClose()
              }}>COLLECT YOUR COIN</Buttons.Primary>
              {/* <Buttons.Default className="mx-2" onClick={handleClose}>No</Buttons.Default> */}
            </div>
          </Modal.Body>
          {/* </Modal.Footer>       */}
        </Modal>
      </div>


      {/* PopUp for complete 100cmp  */}
      <div>
        <Modal
          show={
            CmpPopupShow
          } onHide={handleCmpPopupClose}
          backdrop="static"
          contentClassName=""
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <div className="d-flex justify-content-end" style={{ zIndex: 100 }}>
            <button type="button" className="btn-close " aria-label="Close" onClick={handleCmpPopupClose}></button>
          </div>
          <Modal.Body className="d-flex  justify-content-center align-items-center">
            <div className="Cmp-animation" style={{ height: '150%', width: '120%', position: 'absolute', zIndex: '99' }} />
            <div className='py-2 d-flex flex-column  justify-content-center align-items-center' style={{ zIndex: '101' }}>
              <strong className="py-2" style={{ fontSize: "20px", textAlign: "center" }}>Well done, Champ!</strong>
              <p className="py-2" style={{ fontSize: "20px", textAlign: "center" }}>You've reached your goal.</p>
              <p className="py-2" style={{ fontSize: "14px", textAlign: "center" }}>Go ahead and claim your reward , You deserve it!</p>
            </div>
          </Modal.Body>
          <div className="d-flex justify-content-center pb-1 " style={{ zIndex: '101' }}>
            <Buttons.Primary className="mx-2"
              onClick={async () => {
                claimRewardHandler();
                handleCmpPopupClose();
              }}
            >CLAIM YOUR REWARDS</Buttons.Primary>
          </div>
          <div className="mx-2 text-center" style={{ cursor: 'pointer', color: '#6352e8', fontSize: '0.9em' }} onClick={handleCmpPopupClose}>Claim later</div>
        </Modal>
      </div>
    </React.Fragment >
  );
};

export default Minting;
