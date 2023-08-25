/** @format */

import React, { useContext, useEffect, useState } from "react";
import { Badge, Col, Container, Row } from "react-bootstrap";
import UserContext from "../../Contexts/User";
import Collapse from "./Collapse";
import PAXCard from "./PAXCard";
import LevelCard from "./LevelCard";
import AppContext from "../../Contexts/AppContext";
import Minting from "./Minting";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useTranslation } from "../../common/models/Dictionary";
import styled from "styled-components";
import NotificationContext from "../../Contexts/Notification";
import Upgrade from "./Upgrade";
import { isV1 } from "../App/App";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Player, Controls } from "@lottiefiles/react-lottie-player";
import animation from "./Comp.json";
import AnimationReward from "./Animation/AnimationReward";
import NFTCard from "../../common/NFTCard/NFTCard";

import { httpsCallable } from "firebase/functions";
import { db, functions } from "../../firebase";
import firebase from "firebase/compat";
import { texts } from "../LoginComponent/texts";
import RewardHistory from "Components/Profile/rewardHistory";
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
const getRewardTransactions = httpsCallable(functions, "getRewardTransactions");

const FwMine = () => {
  const { user } = useContext(UserContext);
  const { setAlbumOpen } = useContext(AppContext)
  const followerUserId = localStorage.getItem("followerId")
  const [userInfo, setUserInfo] = useState<any>()
  const { userTypes } = useContext(AppContext);
  const { showModal } = useContext(NotificationContext);
  const { width = 0 } = useWindowSize();
  const translate = useTranslation();
  const location = useLocation();
  const [rewardTimer, setRewardTimer] = useState(null);
  const [data, setData] = useState([]);
  let navigate = useNavigate();

  const rewardList = async () => {

    const result = await getRewardTransactions({ uid: followerUserId, pageNumber: 1, pageSize: 5 });
    // @ts-ignore
    setData(result?.data);

  };


  const getFollowerData = () => {



    const getCollectionType = firebase
      .firestore()
      .collection("users")
      .where("uid", "==", followerUserId)
    getCollectionType.get()
      .then((snapshot) => {

        snapshot.docs?.map(doc => setUserInfo(doc.data()))




      }).catch((error) => {
        console.log(error, "error");
      });
  }


  useEffect(() => {
    rewardList();
    getFollowerData()
  }, [rewardTimer]);

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



  return (
    <div>
      <Container >
        {/* @ts-ignore */}
        {!!rewardTimer && (<AnimationReward setRewardTimer={setRewardTimer} rewardTimer={rewardTimer} />)}

        {/* <Player
        autoplay
        loop
        src={animation}
        style={{ height: '300px', width: '300px' }}
      >
        <Controls visible={true} buttons={['play', 'repeat', 'frame', 'debug']} />
      </Player> */}
        {!userInfo?.paid && (
          <Row
            className='flex-row-reverse'
            role='button'
            // onClick={() => showModal(<Upgrade/>)}
            onClick={() => navigate("/upgrade")}
          >
            {/* <MyBadge bg='-'>{translate("upgrade your account")}</MyBadge> */}
          </Row>
        )}
        {width > 767 ? (
          <div className='d-flex justify-content-center'>
            <div>
              <div>
                {" "}
                <LevelCard userTypes={userTypes} userInfo={userInfo} />
              </div>
              <div style={{ marginTop: "7px" }}>
                {" "}
                <PAXCard
                  walletId={userInfo?.wallet || ""}
                  // @ts-ignore
                  PAX={userInfo?.rewardStatistics?.diamonds || 0}
                />
              </div>
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
          <Row className='flex-row-reverse align-items-stretch mt-1'>
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
              <div>
                <PAXCard
                  walletId={userInfo?.wallet || ""}
                  // @ts-ignore
                  PAX={userInfo?.rewardStatistics?.diamonds || 0}
                />
                {/* <Collapse title={"view PAX history"}>{}</Collapse> */}
              </div>
              <div className='mb-2'>
                <LevelCard userTypes={userTypes} userInfo={userInfo} />
              </div>
            </Col>
          </Row>
        )}
        <Row className='align-items-stretch mt-1 d-flex justify-content-center'>
          <RewardHistory rewardTimer={rewardTimer} userId={followerUserId} />
        </Row>
      </Container>
    </div>
  );
};

export default FwMine;
