/** @format */

import React, { useContext, useEffect, useState } from "react";
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
import NotificationContext from "../../Contexts/Notification";
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
const ForZoom = styled.div`
z-index:${(props: ZoomProps) => `${props.inOutReward == 1 ? "2200" : ""}`};  
 ${(props: ZoomProps) => `${props.inOutReward == 1 ? ZoomCss : ""}`} 
`;
const getRewardTransactions = httpsCallable(functions, "getRewardTransactions");

const Mine = () => {
  const { userInfo, user } = useContext(UserContext);
  const { userTypes, showBack, setShowBack, showReward, setShowReward, inOutReward, setInOutReward } = useContext(AppContext);
  const { showModal } = useContext(NotificationContext);
  const { width = 0 } = useWindowSize();
  const translate = useTranslation();
  const location = useLocation();
  const [rewardTimer, setRewardTimer] = useState(null);
  const [data, setData] = useState([]);
  const [modalShow, setModalShow] = React.useState(false);
  const [cardModalShow, setCardModalShow] = React.useState(false);
  const [modelText, setModelText] = React.useState(0);
  let navigate = useNavigate();
  const rewardList = async () => {
    // console.log("user Id called");
    const result = await getRewardTransactions({ uid: user?.uid });
    // @ts-ignore
    setData(result?.data);
    // console.log("user Id", result);
  };

  const handleClose = () => setModalShow(false);
  const handleShow = () => setModalShow(true);

  const handleCardClose = () => setCardModalShow(false);
  const handleCardShow = () => setCardModalShow(true);

  // @ts-ignore
  const ClaimNumber = userInfo?.rewardStatistics?.total - userInfo?.rewardStatistics?.claimed

  useEffect(() => {
    rewardList();
  }, [rewardTimer]);

  useEffect(() => {
    if (!!rewardTimer && showReward == 3 && inOutReward == 3) {
      handleCardShow();
    }
  }, [inOutReward, showReward, rewardTimer]);

  useEffect(() => {

    if (showBack && ClaimNumber < 1) {
      setTimeout(() => {
             setModelText(1)
             console.log(showBack, "viewshow")
             handleShow()
             setShowBack(false)            
             console.log("Openpopup not")
        }, 10000);
        }       
    }, []);

  const openpopup = () => {
    if (showBack) {
      setTimeout(() => {
             setModelText(2)
             console.log(showBack, "viewshow")
             handleShow()
             setShowBack(false)
            handleCardClose()
            setRewardTimer(null);
            setShowReward(0);
             console.log("Openpopup")
        }, 5000);
    }
  }
  console.log(showBack, "viewshow back")

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
  const RemeingCmp=(userInfo?.voteStatistics?.score || 0) - userInfo?.rewardStatistics?.total * 100 || 0
  
// console.log('userInfo',(userInfo?.voteStatistics?.score || 0) - userInfo?.rewardStatistics?.total * 100 || 0)
// console.log('userInfo',userInfo?.rewardStatistics?.total , userInfo?.rewardStatistics?.claimed)
  
  return (
    <div>
      <Container >        
        {/* @ts-ignore */}
        {/* <AnimationReward
           setRewardTimer={setRewardTimer}
           rewardTimer={rewardTimer}
         /> */}
        {/* {!!rewardTimer && showReward==3 && inOutReward==3 && (        
          <div className=''>
          
            <NFTCard openpopup={openpopup} setRewardTimer={setRewardTimer} cardType={rewardTimer?.data?.firstRewardCardType} />          
        </div>
        )} */}
        {/* @ts-ignore */}

        {/* <Player
  autoplay
  loop
  src={animation}
  style={{ height: '300px', width: '300px' }}
>
  <Controls visible={true} buttons={['play', 'repeat', 'frame', 'debug']} />
</Player> */}
        {/* {!userInfo?.paid && (
          <Row
            className='flex-row-reverse'
            role='button'
          
            onClick={() => navigate("/upgrade")}
          >
            <MyBadge bg='-'>{translate("upgrade your account")}</MyBadge>
          </Row>
        )} */}
        {width > 767 ? (
          <div className='d-flex justify-content-center mt-2'>
            <div>
              <div>
                {" "}
                <LevelCard userTypes={userTypes} userInfo={userInfo} />
              </div>
              <ForZoom {...{ inOutReward }} style={{ marginTop: "7px" }}>
                {" "}
                {/* <PAXCard
                  walletId={userInfo?.wallet || ""}
                  PAX={userInfo?.voteStatistics?.pax || 0}
                /> */}

                <PAXCard
                  walletId={userInfo?.wallet || ""}
                  rewardTimer={rewardTimer}
                  // @ts-ignore
                  PAX={userInfo?.rewardStatistics?.diamonds || 0}
                // PAX={rewardTimer?.thirdRewardDiamonds|| 0  }
                />
              </ForZoom>
            </div>
            {/* @ts-ignore */}
            <div style={{ marginLeft: "10px" }}>
              <Minting
                {...{
                  width,
                  score:
                    // @ts-ignore
                    (userInfo?.voteStatistics?.score || 0) - userInfo?.rewardStatistics?.total * 100 || 0,
                  setRewardTimer,
                  rewardTimer,
                }}
                setRewardTimer={setRewardTimer}
                rewardTimer={rewardTimer}
                // @ts-ignore
                claim={userInfo?.rewardStatistics?.total - userInfo?.rewardStatistics?.claimed
                }
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
                    score:
                      // @ts-ignore
                      (userInfo?.voteStatistics?.score || 0) - userInfo?.rewardStatistics?.total * 100 || 0,
                    setRewardTimer,
                    rewardTimer,
                  }}
                  setRewardTimer={setRewardTimer}
                  rewardTimer={rewardTimer}
                  // @ts-ignore
                  claim={userInfo?.rewardStatistics?.total - userInfo?.rewardStatistics?.claimed
                  }
                />
              </div>
            </Col>
            <Col
              sm={12}
              md={6}
              className='d-flex flex-column flex-md-column-reverse'
            >
              <ForZoom
                {...{ inOutReward }}
              >
                <PAXCard
                  walletId={userInfo?.wallet || ""}
                  rewardTimer={rewardTimer}
                  // @ts-ignore
                  PAX={userInfo?.rewardStatistics?.diamonds || 0}
                // PAX={rewardTimer?.thirdRewardDiamonds || 0 }
                />
                {/* <Collapse title={"view PAX history"}>{}</Collapse> */}
              </ForZoom>
              <div className='mb-2'>
                <LevelCard userTypes={userTypes} userInfo={userInfo} />
              </div>
            </Col>
          </Row>
        )}
        <Row className='align-items-stretch mt-1 d-flex justify-content-center'>
          <div
            style={{
              background: "white",
              textAlign: "center",
              color: "#6352E8",
              fontSize: "12px",
              marginTop: "30px",
              width: `${window.screen.width > 767 ? "730px" : "100%"}`
            }}
          >
            <div
              style={{
                marginTop: "20px",
                marginBottom: "20px",
                fontSize: "12px",
              }}
            >
              {texts.REWARDHISTORY}
            </div>
            {data.map((item, index) => (
              <div key={index}>
                {" "}
                <div className='d-flex justify-content-around px-5'>
                  {/* @ts-ignore */}
                  <RewardList>
                    <span style={{ color: "#6352E8" }}>
                      {/* @ts-ignore */}
                      {item?.winData?.secondRewardExtraVotes}
                    </span>{" "}
                    {texts.Votes}
                  </RewardList>
                  {/* @ts-ignore */}
                  <RewardList>
                    <span style={{ color: "#6352E8" }}>
                      {/* @ts-ignore */}
                      {item?.winData?.thirdRewardDiamonds}
                    </span>{" "}
                    {texts.GamePts}
                  </RewardList>
                  <RewardList onClick={() => navigate('/profile/Album')}>
                    {/* @ts-ignore */}
                    <span style={{ color: "#6352E8", }} onClick={() => navigate('/profile/Album')}>{item?.winData?.firstRewardCard}</span> {texts.Card}
                  </RewardList>
                </div>
                {/* @ts-ignore */}
                <p
                  className='px-5'
                  style={{
                    textAlign: "start",
                    color: "#868686",
                    fontSize: "8px",
                    marginTop: "6px",
                    marginLeft: "20px",
                  }}
                >
                  {/* @ts-ignore */}
                  {item?.user}
                </p>
                {data?.length - 1 != index ? (
                  <hr
                    className='solid'
                    style={{ margin: "15px 30px 12px 30px" }}
                  />
                ) : (
                  <p className='solid' style={{ margin: "28px" }}></p>
                )}
              </div>
            ))}
            {!data?.length && (
              <>
                {" "}
                <div className='d-flex justify-content-around px-5'>
                  <RewardList>-</RewardList>
                  <RewardList>-</RewardList>
                  <RewardList>-</RewardList>
                </div>
                <p className='solid' style={{ margin: "28px" }}></p>
              </>
            )}
          </div>
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
        <button type="button" className="btn-close " aria-label="Close" onClick={()=>{
          handleClose()
          }}></button>
        </div>
      <Modal.Body>
            {/* continue voting */}          
            {modelText == 1 && <div className='py-2  d-flex flex-column  justify-content-center'>
              <strong style={{ fontSize: "20px" }}>Stay in the game</strong>
              <p style={{ fontSize: "20px" }}>Only {100 - RemeingCmp} CMP to reach your goal</p>
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
            {/* <Buttons.Default className="mx-2" onClick={handleClose}>No</Buttons.Default> */}
          </div >
          {/* </Modal.Footer>       */}
        </Modal >
      </div >

      {/* Card Modal */}

      <CardDiv>
        <Modal
          className=""          
          show={
            cardModalShow
          } onHide={handleCardClose}
          // fullscreen="sm-down"
          backdrop="static"
          aria-labelledby="contained-modal-title-vcenter"          
          centered
          contentClassName={window.screen.width >767? "card-content" :"card-contentMob"}
    >
          <div className="d-flex justify-content-end">
            <button type="button" className="btn-close " aria-label="Close" onClick={() => {
          setRewardTimer(null);
          setShowReward(0);
          handleCardClose()
          }}></button>
        </div>
          <Modal.Body          
          >
            {/* continue voting */}          
            {/* @ts-ignore */}
            <NFTCard openpopup={openpopup} setRewardTimer={setRewardTimer} cardType={rewardTimer?.data?.firstRewardCardType} />
      </Modal.Body>      
    </Modal>
  </CardDiv>
  </div >
  );
};

export default Mine;
