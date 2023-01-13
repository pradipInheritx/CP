import React, {useContext, useState} from "react";
import {Badge, Col, Container, Row} from "react-bootstrap";
import UserContext from "../../Contexts/User";
import Collapse from "./Collapse";
import PAXCard from "./PAXCard";
import LevelCard from "./LevelCard";
import AppContext from "../../Contexts/AppContext";
import Minting from "./Minting";
import {useWindowSize} from "../../hooks/useWindowSize";
import {useTranslation} from "../../common/models/Dictionary";
import styled from "styled-components";
import NotificationContext from "../../Contexts/Notification";
import Upgrade from "./Upgrade";
import {isV1} from "../App/App";
import {Navigate, useLocation} from "react-router-dom";
import { Player, Controls } from '@lottiefiles/react-lottie-player';
import animation from './Comp.json'
import AnimationReward from "./Animation/AnimationReward";
import NFTCard from "../../common/NFTCard/NFTCard";

const MyBadge = styled(Badge)`
  background-color: var(--color-6352e8);
  box-shadow: 0 3px 6px #00000029;
  border-radius: 0 0 6px 6px;
  font-size: 14px;
  opacity: 1;
  width: auto;
  color: var(--white)
`;
const RewardList = styled.p`
 font-size:10px;
 color:#707070
`;

const Mine = () => {
  const {userInfo} = useContext(UserContext);
  const {userTypes} = useContext(AppContext);
  const {showModal} = useContext(NotificationContext);
  const {width = 0} = useWindowSize();
  const translate = useTranslation();
  const location = useLocation();
  const [rewardTimer,setRewardTimer]=useState(1)
const data=[1,2]
  if (isV1()) {
    return (
      <Navigate
        to="/"
        state={{
          from: location,
        }}
      />
    );
  }

  return (<div>
      <Container>
       
       {/* {!!rewardTimer&& <AnimationReward/>} */}
       
      {/* <Player
  autoplay
  loop
  src={animation}
  style={{ height: '300px', width: '300px' }}
>
  <Controls visible={true} buttons={['play', 'repeat', 'frame', 'debug']} />
</Player> */}
        {!userInfo?.paid &&
          <Row className="flex-row-reverse" role="button" 
          onClick={() => showModal(<Upgrade/>)}
          ><MyBadge
            bg="-">{translate("upgrade your account")}</MyBadge></Row>}
         { width>767?  <div className='d-flex justify-content-center'>
             
              <div >
              <div> <LevelCard userTypes={userTypes} userInfo={userInfo}/></div>
                <div style={{marginTop:'7px'}}> <PAXCard
                walletId={userInfo?.wallet || ""}
                PAX={userInfo?.voteStatistics?.pax || 0}
              /></div>
               
              </div>
              {/* @ts-ignore */}
              <div style={{marginLeft:'10px'}}><Minting {...{width, score: (userInfo?.voteStatistics?.score ||0 ) - (userInfo?.rewardStatistics?.total *100) || 0, setRewardTimer,rewardTimer}} setRewardTimer={setRewardTimer} rewardTimer={rewardTimer} /></div>
            </div>:
        <Row className="flex-row-reverse align-items-stretch mt-1">
          <Col sm={12} md={6}>
            <div className="d-flex justify-content-center align-items-center flex-column mb-2">
              {/* @ts-ignore */}
              <Minting {...{width, score: (userInfo?.voteStatistics?.score ||0 ) - (userInfo?.rewardStatistics?.total *100) || 0, setRewardTimer,rewardTimer}} setRewardTimer={setRewardTimer} rewardTimer={rewardTimer} />
            </div>
          </Col>
          <Col sm={12} md={6} className="d-flex flex-column flex-md-column-reverse">
            <div >
              <PAXCard
                walletId={userInfo?.wallet || ""}
                // @ts-ignore
                PAX={userInfo?.rewardStatistics?.diamonds || 0}
              />
              {/* <Collapse title={"view PAX history"}>{}</Collapse> */}
            </div>
            <div className="mb-2">
              <LevelCard userTypes={userTypes} userInfo={userInfo}/>
            </div>
          </Col>
        </Row>}
        <Row className="align-items-stretch mt-1">
            <div  style={{background:'white', textAlign:'center', color:'#6352E8', fontSize:'12px', marginTop:'30px'}}>
              <div style={{marginTop:'20px', marginBottom:'20px',fontSize:'12px'}} >REWARD HISTORY</div >
             {data.map((item,index)=><> <div className='d-flex justify-content-around px-5'>
                <RewardList><span style={{color:'#6352E8'}}>5</span> Votes</RewardList>
                <RewardList><span style={{color:'#6352E8'}}>2</span> Game Pts</RewardList>
                <RewardList><span style={{color:'#6352E8'}}>#24</span> Card</RewardList>
              </div>
              <p className='px-5' style={{textAlign:'start', color:'#868686', fontSize:'8px',marginTop:'6px', marginLeft:'20px'}}>iddsbfjksdhfkldhsjkhjhsdjkhasdgjkhcdhskljl</p>
              {data?.length-1 != index ?<hr className="solid" style={{margin:'15px 30px 12px 30px'}}/>:<p className="solid" style={{margin:'28px'}}></p>}
              </>)}
              {!data?.length &&<> <div className='d-flex justify-content-around px-5'>
                <RewardList>-</RewardList>
                <RewardList>-</RewardList>
                <RewardList>-</RewardList>
              </div>
            
              <p className="solid" style={{margin:'28px'}}></p>
              </>}
            </div>
          
        </Row>
      </Container>
    </div>
  );
};

export default Mine;
