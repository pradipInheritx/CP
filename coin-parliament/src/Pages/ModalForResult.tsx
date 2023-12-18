import React, { SetStateAction, useContext, useEffect, useState } from 'react'
import { Button, Col, Container, Modal, Row } from 'react-bootstrap'
import { Logo } from '../Components/Pairs/Card';
import styled from "styled-components";
import Trend from '../Components/Atoms/utils/Trend';
import CoinsContext from '../Contexts/CoinsContext';
import { formatCurrency } from '../common/models/Coin';
import moment from "moment";
import Line from '../Components/icons/line';
import { timeframeInitials } from '../Components/Atoms/Button/Button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Other } from './SingleCoin';
import AppContext from '../Contexts/AppContext';
import { VoteButton } from '../common/utils/SoundClick';
import { VoteContext, VoteDispatchContext } from 'Contexts/VoteProvider';
import { VoteResultProps } from 'common/models/Vote';
import { CurrentCMPContext, CurrentCMPDispatchContext, CurrentCMPProvider } from 'Contexts/CurrentCMP';
import { Prev } from 'react-bootstrap/esm/PageItem';
import { CompletedVotesDispatchContext } from 'Contexts/CompletedVotesProvider';
import { calculateDiffBetweenCoins, calculateDiffBetweenCoinsType, getCoinDifferenceColor, getPairResultColor, getSingleCoinPriceColor } from 'common/utils/helper';
import UserContext from 'Contexts/User';
// const silent = require("../assets/sounds/silent.mp3").default;
const CoinContainer = styled.div`
  border-top-color: ${(props: { winner: boolean }) =>
    props.winner ? "#6352E8" : "transparent"};
  border-top-style: solid;
  border-top-width: 4px;
`;

const CoinVoteTimer = styled.span`
  // font-size: 14px;
  // line-height: 14px;
  color: #6352e8;
`;

const LineImg = styled.div`
  // height: 60px;
  // width: 19px;
`;

interface Rdiv {
  // submit: boolean,
  backcolor: string
}

const RoundDiv = styled.div<Rdiv>`
width:16px ;
height:16px;
border-radius:50px;
// border:1px solid red;
background:${Props => Props.backcolor};
`;

const PairsVoteVs = styled.span`
  font-size: ${window.screen.width > 676 ? "14px" : "10px"};
  color: #6352e8;
`;


const calculate = (vote: any, index?: 0 | 1 | undefined) => {
  if (Array.isArray(vote?.valueExpirationTime) && index !== undefined) {
    return Number(
      Number(
        (((vote?.valueExpirationTime as number[])[index] || 0) /
          ((vote?.valueVotingTime as number[])[index] || 1) -
          1) *
        100
      ).toFixed(2)
    );
  } else {
    return Number(
      Number(
        (((vote?.valueExpirationTime as number) || 0) /
          ((vote?.valueVotingTime as number) || 1) -
          1) *
        100
      ).toFixed(2)
    );
  }
};

const calculateWinner = (vote: any) =>
  Math.max(calculate(vote, 0), calculate(vote, 1));

function ModalForResult({
  popUpOpen,
  vote,
  type,
  setLessTimeVoteDetails,
  setShowComplete100CMP,
  currentCMP,
}
  : {
    popUpOpen?: any,
    vote: any,
    type?: string,
    setLessTimeVoteDetails: React.Dispatch<React.SetStateAction<VoteResultProps | undefined>>,
    setShowComplete100CMP: React.Dispatch<React.SetStateAction<boolean>>,
    currentCMP: number
  }) {

  const navigate = useNavigate();
  const setVoteDetails = useContext(VoteDispatchContext);
  const setCompletedVotes = useContext(CompletedVotesDispatchContext);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    if (popUpOpen) {
      VoteButton(true);
      handleShow();
    }
  }, [popUpOpen])
  const [show, setShow] = useState(false);

  /// show 100 CMP complete modal
  const location = useLocation();
  const currentCMPDiff = Math.floor((userInfo?.voteStatistics?.score || 0) / 100);
  const prevCMPDiff = Math.floor(((userInfo?.voteStatistics?.score || 0) - currentCMP) / 100);
  const score = (userInfo?.voteStatistics?.score || 0) - ((userInfo?.rewardStatistics?.total || 0) * 100);
  const remainingCMP = ((currentCMP > 0 && currentCMPDiff > prevCMPDiff && (userInfo?.voteStatistics?.score || 0) > 0) ? 100 : score);
  /// show 100 CMP complete modal
  const setCurrentCMP = useContext(CurrentCMPDispatchContext);
  const handleShow = () => setShow(true);
  const handleClose = () => {
    removeVote();
    if (score > 99.98 && location.pathname !== "/profile/mine") {
      setShowComplete100CMP(true);
    }
    console.log(remainingCMP, score ,"remainingCMP")
  };

  const removeVote = () => {
    let temp = {};
    setVoteDetails((prev) => {
      Object.keys(prev?.activeVotes).map((key: string) => {
        if (/* prev?.activeVotes[key].expiration > new Date().getTime() &&  */vote?.voteId !== prev?.activeVotes[key].voteId) {
          temp = { ...temp, [`${prev?.activeVotes[key].coin}_${prev?.activeVotes[key]?.timeframe?.seconds}`]: prev?.activeVotes[key] }
        }
      });
      return {
        ...prev,
        lessTimeVote: undefined,
        activeVotes: temp,
        openResultModal: false,        
      };
    });
    if (Object.keys(temp)?.length <= 0 && (Number(userInfo?.voteValue || 0) + Number(userInfo?.rewardStatistics?.extraVote || 0)) <= 0) {
      setAfterVotePopup(true);
    }
    setCompletedVotes(prev => prev.filter(value => value.voteId != vote.voteId));
    setLessTimeVoteDetails(undefined);
    // localStorage.setItem(`${userInfo?.uid}_newScores`, `${(vote?.score || 0) + parseFloat(localStorage.getItem(`${userInfo?.uid}_newScores`) || '0')}`);
    // setCurrentCMP(parseFloat(`${(vote?.score || 0) + parseFloat(localStorage.getItem(`${userInfo?.uid}_newScores`) || '0')}`))
    // setLessTimeVoteDetails({
    //   lessTimeVote: undefined,
    //   openResultModal: false
    // })
    // if (setModalData instanceof Function) {
    //   setModalData(undefined);
    // }
  }



  const { coins } = useContext(CoinsContext);
  const { showBack, setShowBack, setAfterVotePopup } = useContext(AppContext);
  const winner = calculateWinner(vote);
  // console.log(vote,"allVote1")
  const voteCoins = vote?.coin?.split("-");
  const pair = voteCoins?.length > 1;

  const trend = calculate(vote, pair ? 1 : 0);

  const coin = coins[vote?.coin] || {};
  const paircoin = pair ? [coins[voteCoins[0]], coins[voteCoins[1]]] : {};

  const votelength = Object.keys(vote).length

  var pairCoinResult: calculateDiffBetweenCoinsType = { firstCoin: '', secondCoin: '', difference: '' };
  if (type === "pair" && vote?.valueVotingTime.length > 1) {
    pairCoinResult = calculateDiffBetweenCoins(vote?.valueVotingTime, vote?.valueExpirationTime, vote?.direction);
  }

  console.log(pairCoinResult.difference,"pairCoinResult")
  return (
    <div>
      <Modal show={show} onHide={handleClose}
        backdrop="static"
        size={type === 'pair' ? "lg" : undefined}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        style={{ zIndex: 1000 }}
      >
        <div className='d-flex justify-content-end'>
          <div></div>
          {/* <div className='text-center mb-2' style={{
            color: "#6352e8",
            fontWeight: "300",
            marginLeft: `${window.screen.width < 767 ? "10%" : ""}`
          }}>
            {type == "pair" && vote ? <p> {timeframeInitials(vote?.timeframe?.name)} VOTE</p> : ""}
          </div> */}
          <div className="d-flex justify-content-end">
            <button type="button" className="btn-close " aria-label="Close" onClick={handleClose}></button>
          </div>
        </div>
        <Modal.Body>
          {type == "coin" && vote ?
            <div className=' p-2 w-100 m-auto'
              style={{
                // boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
              }}
            >
              <div className={`${window.screen.width < 767 ? "flex-column" : "flex-column"} d-flex justify-content-center align-items-center`}>
                <div className="pb-2 d-flex flex-column justify-content-center align-items-center">
                  <Logo {...{ symbol: vote?.coin || "", width: 30 }} />
                  <strong>{coins[vote?.coin]?.name} </strong>
                  {vote?.coin}
                  <strong>{timeframeInitials(vote?.timeframe?.name)} </strong>
                  <div>
                    {vote?.direction == 0 ? "BULL" : "BEAR"} &nbsp;
                    <span>
                      ${vote?.valueVotingTime + ''}
                    </span>
                  </div>
                  <div className='text-center mt-2'>
                    <span style={{ fontSize: "15px", color: '#6352e8' }}>
                      VOTE RESULT
                    </span>
                    <div style={{
                      fontSize: "14px",
                    }}>
                      {/* {vote?.valueExpirationTime > vote?.valueVotingTime ? 'BULL' : 'BEAR'} */}
                      {/* {vote?.direction == 0 ? "BULL" : "BEAR"} */}
                      {vote?.valueExpirationTime > vote?.valueVotingTime ? 'BULL' : vote?.valueExpirationTime < vote?.valueVotingTime ? 'BEAR' : vote?.direction == 0 ? "BULL" : "BEAR"} 
                      <span style={{
                        color: getSingleCoinPriceColor(parseFloat(vote?.valueVotingTime || 0.00), parseFloat(vote.valueExpirationTime || 0.00), vote?.direction)
                      }}>
                        &nbsp;${vote.valueExpirationTime && vote?.valueExpirationTime + ''}

                      </span>
                    </div>
                    <div>
                      <span>Vote impact : {vote.success == 2 ? 'MID' : vote.success == 1 ? 'HIGH' : 'LOW'}</span>
                    </div>
                    <div>
                      {/* {vote.valueExpirationTime && (
                          <Trend num={trend} />
                        )} */}
                    </div>
                  </div>
                </div>
                <div className={`${window.screen.width < 767 ? "flex-column" : "flex-column"} w-100 d-flex justify-content-center align-items-center`}>
                  <div className={`${window.screen.width < 767 ? "w-100" : "w-50"} text-center`} style={{ paddingLeft: (window.screen.width < 767 ? '0px' : '2em') }}>


                  </div>
                  {/* <div
                    className='d-flex justify-content-around w-50'
                  > */}
                  <div className={`${window.screen.width < 767 ? "w-100 justify-content-center my-2" : "w-50 justify-content-around"}  d-flex `} style={{ paddingLeft: (window.screen.width < 767 ? '0px' : '2em') }}>

                  </div>
                </div>
              </div>
              <div style={{ color: "#6352E8" }}>
                {vote.score && (
                  <Row className="flex-column text-center">
                    <Col style={{ fontSize: (window.screen.width < 370 ? '0.8125em' : '') }}>
                      You progressed - <strong>{vote.score} <span> CMP</span></strong>
                    </Col>
                    <div>
                      <Col className="">
                        {/* ${vote?.id} -  */}
                        <span className="sm_txt">
                          {vote?.voteId}</span>
                        {window?.screen?.width < 768 && <br />}
                        <span className="sm_txt">

                          {`
                         ${moment(
                            new Date(vote.voteTime)
                          ).format("DD/MM/YYYY")}`} {`
                        ${moment(
                            new Date(vote.voteTime)
                          ).format("HH:mm")}`}</span>
                      </Col>
                    </div>
                  </Row>
                )}
              </div>
            </div>
            : ""
          }
          {
            type == "pair" && votelength ?
              <div className=' w-100 '>
                <div className={`${window.screen.width < 767 ? "" : ""}  d-flex justify-content-between`}>
                  <div className=' text-center' style={{ width: `${window.screen.width < 767 ? "100%" : "30%"}` }}>
                    <CoinContainer winner={vote?.direction === 0}>
                      <div className=" ">
                        <div className='p-2'>
                          {/* @ts-ignore */}
                          <Logo {...{ symbol: paircoin[0]?.symbol || "", width: 30 }} />
                        </div>
                        <div className="" style={{ lineHeight: '20px' }}>
                          <div>
                            {/* @ts-ignore */}
                            <strong>{paircoin[0]?.name}</strong>
                          </div>
                          {/* @ts-ignore */}
                          <div>{paircoin[0]?.symbol}</div>

                          <div>
                            {/* {vote?.valueExpirationTime && vote?.valueVotingTime[0]} - {vote?.valueExpirationTime[0]} */}
                          </div>
                          <div style={{ color: getCoinDifferenceColor(parseFloat(pairCoinResult?.firstCoin)) }}>
                            {pairCoinResult?.firstCoin.replaceAll('-', '')}%
                          </div>
                          <div>
                          </div>
                        </div>
                      </div>
                    </CoinContainer>
                  </div>
                  <div className=' text-center ' style={{ width: `${window.screen.width < 767 ? "100%" : "30%"}` }}>
                    <Col className="">
                      <div className="">
                        <LineImg>
                          <Line />
                        </LineImg>
                      </div>
                      {/* } */}
                      <div className="">
                        <div className='d-flex  justify-content-center'>
                          <RoundDiv backcolor={vote.score === 1 ? "#3712B3" : vote.score === 0.5 ? "#6352E8" : vote.score === 0.25 ? "#D4D0F3" : "#6352E8"}>

                          </RoundDiv>

                        </div>
                        <div style={{ minHeight: "100%", fontWeight: 'bold' }}>
                          <PairsVoteVs>
                            <strong>{vote?.coin?.split("-")[vote?.direction]} - {timeframeInitials(vote?.timeframe?.name)}</strong>
                          </PairsVoteVs>
                        </div>

                      </div>
                    </Col>
                  </div>

                  <div className=' text-center ' style={{ width: `${window.screen.width < 767 ? "100%" : "30%"}` }}>
                    <CoinContainer winner={vote?.direction === 1}>
                      <div className="">
                        <div className='p-2'>
                          {/* @ts-ignore */}
                          <Logo {...{ symbol: paircoin[1]?.symbol || "", width: 30 }} />
                        </div>
                        <div className="" style={{ lineHeight: '20px' }}>
                          <div>
                            {/* @ts-ignore */}
                            <strong>{paircoin[1]?.name}</strong>
                          </div>
                          {/* @ts-ignore */}
                          <div>{paircoin[1]?.symbol}</div>
                          <div>
                            {/* {vote.valueExpirationTime && vote.valueVotingTime[1]} - {vote?.valueExpirationTime[1]} */}
                          </div>
                          <div style={{ color: getCoinDifferenceColor(parseFloat(pairCoinResult?.secondCoin)) }}>
                            {pairCoinResult?.secondCoin.replaceAll('-', '')}%
                          </div>
                        </div>
                      </div>
                    </CoinContainer>
                  </div>
                </div>
                <div style={{ minHeight: "100%" }} className="text-center ">
                  <div className=''
                    style={{ fontSize: "12px" }}
                  >
                    <p>VOTE RESULT</p>
                    <span>{vote?.coin?.split("-")[vote?.direction]}&nbsp;</span>&nbsp;
                    <span style={{ color: getPairResultColor(parseFloat(pairCoinResult?.firstCoin), parseFloat(pairCoinResult?.secondCoin), vote?.direction) }}>
                      {pairCoinResult?.difference.replaceAll('-', '')}%
                      {/* {vote?.coin?.split("-")[vote?.valueExpirationTime[0] - vote.valueVotingTime[0] < vote?.valueExpirationTime[1] - vote.valueVotingTime[1] ? 1 : 0]} {" "} - ${vote?.direction === 1 ? vote?.valueExpirationTime[1] : vote?.valueExpirationTime[0]} */}
                    </span>
                    {/* <p>Vote impact : {vote.success == 2 ? 'MID' : vote.success == 1 ? 'HIGH' : 'LOW'}</p> */}
                    {/* @ts-ignore */}
                    <p>Vote impact : {pairCoinResult.difference < 0 ? 'LOW' : pairCoinResult.difference == 0 ? 'MID':'HIGH'}</p>
                  </div>
                  <CoinVoteTimer>
                    {vote?.valueExpirationTime && vote?.score && (
                      <>
                        <div style={{ fontSize: (window.screen.width < 370 ? '0.8125em' : '') }}>
                          You progressed - <strong>{vote.score}<span> CMP</span></strong>
                        </div>
                      </>

                    )}
                  </CoinVoteTimer>
                </div>
                <Col className="text-center">
                  {/* ${vote?.id} - */}
                  <span className="sm_txt">
                    {vote?.voteId} {' '}
                    {window.screen.width < 768 && <br />}
                    {`${moment(
                      new Date(vote?.voteTime)
                    ).format("DD/MM/YYYY")}`}{' '} {`
                     ${moment(
                      new Date(vote?.voteTime)
                    ).format("HH:mm")}`}</span>
                </Col>
              </div>
              : ""
          }


          <div className='py-2 d-flex flex-column  justify-content-center text-center'>
            <span className='d-flex justify-content-center' style={{ textDecoration: 'none', cursor: 'pointer' }}
              onClick={() => {
                navigate('/profile/mine');
                localStorage.setItem('continueVotingUrl', `/${type == "pair" ? 'pairs' : 'coins'}/${vote?.coin}`);
                setShowBack(true);
                removeVote();
              }}
            >
              <Other>{("CHECK PROGRESS")}</Other>
            </span>
            <span className='pt-3' style={{ textDecoration: 'none', cursor: 'default' }}>Stay in the game!</span>
            <span className='pt-1 d-flex justify-content-center' style={{ color: '#6352e8' }} onClick={() => {
              handleClose();
              navigate(`/${type == "pair" ? 'pairs' : 'coins'}/${vote?.coin}`);
            }}>CONTINUE VOTING</span>
          </div>
        </Modal.Body >
        {/* <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleClose}>
                    Save Changes
                  </Button>
                </Modal.Footer> */}
      </Modal >
    </div >
  )
}

export default React.memo(ModalForResult);