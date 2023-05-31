/** @format */

import React, { useContext, useEffect, useState } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";
import styled, { css } from "styled-components";
import lottie from "lottie-web";
import PieChart from "./PieChart";
import Collapse from "./Collapse";
import { useTranslation } from "../../common/models/Dictionary";
import { InputAndButton, PoppinsMediumWhite12px } from "../../styledMixins";
import { Form, Modal } from "react-bootstrap";
import UserContext from "../../Contexts/User";
import { functions } from "../../firebase";
import { httpsCallable } from "@firebase/functions";
import { stubFalse } from "lodash";
import { texts } from "../LoginComponent/texts";
import { handleSoundClick, handleSoundWinCmp } from "../../common/utils/SoundClick";
import AppContext from "../../Contexts/AppContext";
import CircularProgress from "../circleProgressbar";
import { Buttons } from "../Atoms/Button/Button";
import Confetti from "../../assets/animation/confetti.json";
import { colors } from "../VoteForm";
import Swal from 'sweetalert2';
const Container = styled.div`
  box-shadow: ${(props: { width: number }) =>
    `${props.width > 767}?"0 3px 6px #00000029":"none"`};
  border-radius: 6px;
  opacity: 1;
  padding: ${(props: { width: number }) =>
    `${props.width > 767 ? "12px 28px 25px" : "0"}`};
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
type MintingProps = {
  score: number;
  setRewardTimer?: any;
  rewardTimer?: any;
  claim?: number;
};
const claimReward = httpsCallable(functions, "claimReward");
const Minting = ({
  score,
  setRewardTimer,
  rewardTimer,
  claim,
}: MintingProps) => {
  const { width = 194 } = useWindowSize();
  const translate = useTranslation();
  const { user, userInfo } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const { showReward, setShowReward, setRewardExtraVote, inOutReward, setInOutReward, setHeaderExtraVote, showBack, setShowBack } = useContext(AppContext);
  const [resultData, setResultData] = React.useState({});
  const [modalShow, setModalShow] = React.useState(false);
  const [CmpPopupShow, setCmpPopupShow] = React.useState(false);
  const handleClose = () => setModalShow(false);
  const handleShow = () => setModalShow(true);

  const handleCmpPopupClose = () => setCmpPopupShow(false);
  const handleCmpPopupShow = () => {
    setCmpPopupShow(true)
    // handleSoundWinCmp.play()    
  };

  // console.log(document.querySelector(".Cmp-animation"), "Cmp-animation")
  useEffect(() => {
    if (score == 100) {

      console.log(document.getElementsByClassName("Cmp-animation"), "i am working")
      handleCmpPopupShow()
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
        autoplay: true, // boolean              
      });
      handleSoundWinCmp.play()
      setTimeout(function () {
        Animation.pause();
        handleSoundWinCmp.pause()
      }, 4000);  // 5000 milliseconds = 5 seconds
      // setShowBack(false)
    }
  }, [CmpPopupShow]);

  const [animateButton, setAnimateButton] = useState<boolean>(false);
  console.log(userInfo, 'pkkk');
  return (
    <React.Fragment>
      <Container {...{ width }} style={{ maxWidth: '257.9px', minHeight: width < 767 ? '210.9px' : '322.9px', }}>
        <div
          className='d-flex justify-content-center align-items-center flex-column'
          style={{ position: "relative", marginTop: width < 767 ? "13px" : "" }}
        >
          <Title
            className='box_title d-md-block text-white d-none mb-4'
            {...{ width }}
          >
            {/* {translate("CP Minting")} */}
            {texts.CPMinting}
          </Title>
          <I className='bi bi-info-circle' style={{ paddingRight: width < 767 ? '8em' : '' }}></I>
          <CircularProgress percentage={score === 0 && (userInfo?.rewardStatistics?.total || 0) > 0 ? 100 : (score || 0)} />

          {/* <PieChart
            percentage={score || 50}
            pax={0} // TODO: ask
            width={width > 767 ? 194 : 154}
          /> */}
        </div>
        {/* width > 767 &&  */(
          <div className="w-100" style={{ display: 'flex', alignContent: 'center', paddingLeft: (width < 767 ? '2em' : ''), paddingRight: (width < 767 ? '2em' : '') }} >
            <Option0
              style={{ marginTop: "10px" }}
              {...{
                onClick: async () => {
                  handleSoundClick()
                  if (claim) {
                    setLoading(true);
                    const result = await claimReward({ uid: user?.uid });
                    // @ts-ignore
                    setResultData(result)
                    handleShow()
                    setLoading(false);
                  } else {
                    Swal.fire({
                      title: `You still need ${100 - score} CMP to claim your reward.`,

                      confirmButtonText: 'Ok',
                      confirmButtonColor: '#6352e8',
                      customClass: {
                        popup: 'popupStyle',
                      }
                    });
                  }
                  setAnimateButton(true);
                  setTimeout(() => setAnimateButton(false), 1000);
                },
                borderColor: "var(--blue-violet)",
                selected: animateButton,
                className: ["p-3 confetti-button svg-button", (animateButton ? "animate" : "")].join(" "),
                // disabled: (!claim || loading || rewardTimer)
              }}
            >
              {(!!claim) && <Dot>{claim}</Dot>
              }
              {loading ? `${texts.CLAIMINGREWARDS}` : `${texts.CLAIMYOURREWARDS}`}
            </Option0>

          </div>
        )}
        {/* <BtnLabelPrimary
          style={{ boxShadow: "0px 3px 6px #00000029", marginTop: "10px" }}
          onClick={async () => {
            handleSoundClick()
            if (claim) {
              setLoading(true);
              console.log("reward");
              const result = await claimReward({ uid: user?.uid });
              // @ts-ignore
              setResultData(result)
              handleShow()
              setLoading(false);
            }
          }}
          disabled={!claim || loading || rewardTimer}
        >
          {!!claim && <Dot>{claim}</Dot>}
          {loading ? `${texts.CLAIMINGREWARDS}` : `${texts.CLAIMYOURREWARDS}`}
        </BtnLabelPrimary> */}
      </Container>
      {
        (width < 767 && false) && (
          <div
            style={{ marginTop: width > 767 ? 17 : 8.5, marginBottom: "16.31px" }}
          >
            <BtnLabelPrimary
              className='w-100 mt-2'
              style={{ boxShadow: "0px 3px 6px #00000029" }}
              onClick={async () => {
                if (claim) {
                  setLoading(true);
                  console.log("reward");
                  const result = await claimReward({ uid: user?.uid });
                  // @ts-ignore
                  setResultData(result)
                  handleShow()
                  // setShowReward(1);
                  // setInOutReward(1);
                  // @ts-ignore
                  // setRewardExtraVote(result?.data?.secondRewardExtraVotes);
                  // setRewardTimer(result);
                  // setRewardExtraVote(10);
                  // setRewardTimer({
                  //   firstRewardCard: "legendary",
                  //   secondRewardExtraVotes: 10,
                  //   thirdRewardDiamonds: 10
                  // });
                  setLoading(false);
                  console.log("rewardresult", result);
                }
              }}
              disabled={!claim || loading || rewardTimer}
            >
              {!!claim && <Dot>{claim}</Dot>}
              {/* {loading ? "CLAIMING REWARDS..." : "CLAIM YOUR REWARDS"} */}
              {loading ? `${texts.CLAIMINGREWARDS}` : `${texts.CLAIMYOURREWARDS}`}
            </BtnLabelPrimary>
          </div>
        )
      }
      <div>
        <Modal
          show={
            modalShow
          } onHide={handleClose}
          // size="sm"
          backdrop="static"
          // contentClassName={window.screen.width > 767 ? "card-content" : "card-contentMob"}
          contentClassName={"modulebackground"}
          aria-labelledby="contained-modal-title-vcenter"
          centered  
          style={{backgroundColor: "rgba(0,0,0,0.8)" ,zIndex:"2200"}}
          // style={{
          //   backgroundColor:"transparent"
          // }}
        >
          <div className="d-flex justify-content-end">
            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => {
              handleClose()
            }}></button>
          </div>
          <Modal.Body className="d-flex  justify-content-center align-items-center">
            {/* continue voting */}
            {/* @ts-ignore */}
            <div className='py-2 '><p style={{ fontSize: "20px",color:"white" }}>Congrats! You've won {resultData?.data?.thirdRewardDiamonds} coins </p></div>
          </Modal.Body>
          {/* <Modal.Footer> */}
          <div className="d-flex justify-content-center ">
            <Buttons.Primary className="mx-2" onClick={() => {
              setTimeout(() => {
                setShowReward(1);
                setInOutReward(1);
                // @ts-ignore
                setRewardExtraVote(resultData?.data?.secondRewardExtraVotes);
                setRewardTimer(resultData);
              }, 1000);

              handleClose()
            }}>COLLECT NOW</Buttons.Primary>
            {/* <Buttons.Default className="mx-2" onClick={handleClose}>No</Buttons.Default> */}
          </div>
          {/* </Modal.Footer>       */}
        </Modal>
      </div>

      {/* PopUp for complate 100cmp  */}

      <div>
        <Modal
          show={
            CmpPopupShow
          } onHide={handleCmpPopupClose}
          // size="sm"
          backdrop="static"
          // contentClassName={window.screen.width >767? "card-content" :"card-contentMob"}
          contentClassName="Cmp-animation"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        // id="Cmp-animation"
        >

          <div className="d-flex justify-content-end"

          >
            <button type="button" className="btn-close" aria-label="Close" onClick={() => {
              handleCmpPopupClose()
            }}></button>
          </div>
          <Modal.Body className="d-flex  justify-content-center align-items-center">
            {/* continue voting */}
            {/* @ts-ignore */}
            <div className='py-2 d-flex flex-column  justify-content-center align-items-center'>
              <strong className="py-2" style={{ fontSize: "20px" }}>Well done, Champ!</strong>
              <p className="py-2" style={{ fontSize: "20px" }}>You've reached your goal.</p>
              <p className="py-2" style={{ fontSize: "14px" }}>Go ahead and claim your reward - you deserve it!</p>
            </div>

          </Modal.Body>
          <div className="d-flex justify-content-center ">
            <Buttons.Primary className="mx-2"
              onClick={async () => {
                if (claim) {
                  setLoading(true);
                  console.log("reward");
                  const result = await claimReward({ uid: user?.uid });
                  // @ts-ignore
                  setResultData(result)
                  handleShow()
                  handleCmpPopupClose()
                  setLoading(false);
                  console.log("rewardresult", result);
                }
              }}
            >CLAIM YOUR REWARDS</Buttons.Primary>
            <Buttons.Primary className="mx-2" onClick={() => {
              handleCmpPopupClose()
            }}>Claim letter</Buttons.Primary>
          </div>
        </Modal>
      </div>
    </React.Fragment >
  );
};

export default Minting;
