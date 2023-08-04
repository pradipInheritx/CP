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
import { Link, useNavigate } from 'react-router-dom';
import { Other } from './SingleCoin';
import AppContext from '../Contexts/AppContext';
import { VoteButton } from '../common/utils/SoundClick';
import { VoteDispatchContext } from 'Contexts/VoteProvider';
import { VoteResultProps } from 'common/models/Vote';
import { CurrentCMPContext, CurrentCMPDispatchContext, CurrentCMPProvider } from 'Contexts/CurrentCMP';
import { Prev } from 'react-bootstrap/esm/PageItem';
import { CompletedVotesDispatchContext } from 'Contexts/CompletedVotesProvider';
import { calculateDiffBetweenCoins, calculateDiffBetweenCoinsType, getCoinDifferenceColor } from 'common/utils/helper';
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

function ModalForResult({ popUpOpen, vote, type,
  setLessTimeVoteDetails,
   /* setpopUpOpen *//* , setHideButton, selectedTimeFrame, hideButton *//* , setModalData,  *//* setVoteDetails */ }: {
    popUpOpen?: any,
    vote: any,
    type?: string,
    setLessTimeVoteDetails: React.Dispatch<React.SetStateAction<VoteResultProps | undefined>>
    // setpopUpOpen?: any,
    // setHideButton?: any,
    // selectedTimeFrame?: any,
    // hideButton?: any,
    // setModalData?: React.Dispatch<React.SetStateAction<VoteResultProps | undefined>>,
    // setVoteDetails: React.Dispatch<React.SetStateAction<{ [key: string]: VoteResultProps }>>
  }) {

  const navigate = useNavigate();
  const setVoteDetails = useContext(VoteDispatchContext);
  const setCompletedVotes = useContext(CompletedVotesDispatchContext);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    if (popUpOpen) {
      VoteButton(true);
      handleShow();
      // setVoteDetails((prev) => {
      //   return {
      //     ...prev,
      //     openResultModal: false
      //   }
      // })
      // setpopUpOpen(false)
    }
  }, [popUpOpen])


  const [show, setShow] = useState(false);
  // const setVoteDetails = useContext(VoteDispatchContext);

  const handleShow = () => setShow(true);
  const handleClose = () => {
    removeVote();
    // setShow(false);
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
        openResultModal: false
      };
    });
    if (Object.keys(temp)?.length <= 0 && (Number(userInfo?.voteValue || 0) + Number(userInfo?.rewardStatistics?.extraVote || 0)) <= 0) {
      setAfterVotePopup(true);
    }
    setCompletedVotes(prev => prev.filter(value => value.voteId != vote.voteId));
    setLessTimeVoteDetails(undefined);
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

  //set reward cmp
  const currentCMP = useContext(CurrentCMPContext);
  const setCurrentCMP = useContext(CurrentCMPDispatchContext);

  useEffect(() => {
    // setCurrentCMP(vote?.score || 0)
  }, [vote?.score])

  var pairCoinResult: calculateDiffBetweenCoinsType = { firstCoin: '', secondCoin: '', difference: '' };
  if (type === "pair" && vote?.valueVotingTime.length > 1) {
    pairCoinResult = calculateDiffBetweenCoins(vote?.valueVotingTime, vote?.valueExpirationTime, vote?.direction);
  }

  return (
    <div>
      {/* <iframe src="silence.mp3" allow="autoplay" id="audio" style={{display: "none"}}></iframe> */}
      <Modal show={show} onHide={handleClose}
        backdrop="static"
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        style={{ zIndex: 100 }}
      >
        <div className='d-flex justify-content-between'>
          <div></div>
          <div className='text-center mb-2' style={{
            color: "#6352e8",
            fontWeight: "300",
            marginLeft: `${window.screen.width < 767 ? "10%" : ""}`
          }}>{type == "pair" && vote ? <p> {timeframeInitials(vote?.timeframe?.name)} VOTE</p> : ""}</div>
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
              <div className={`${window.screen.width < 767 ? "flex-column" : ""} d-flex justify-content-center align-items-center`}>
                <div className=" pb-2">
                  <Logo {...{ symbol: vote?.coin || "", width: 30 }} />
                </div>
                <div className={`${window.screen.width < 767 ? "flex-column" : ""} w-100 d-flex justify-content-between`}>
                  <div className={`${window.screen.width < 767 ? "w-100" : "w-50"} text-center`} style={{ paddingLeft: (window.screen.width < 767 ? '0px' : '2em') }}>
                    <div className=''>
                      <span style={{ fontSize: "14px" }} className='px-3'>
                        {timeframeInitials(vote?.timeframe?.name)} VOTE
                      </span>
                    </div>

                    {/* <span>
                      {coin.name} - {coin.symbol}
                    </span> */}
                    <div >
                      {vote?.direction == 0 ? "BULL" : "BEAR"} {coin.symbol} &nbsp;
                      <span>
                        $  {vote?.valueVotingTime + ''}
                      </span>
                    </div>
                    <div>
                      <Col className="">
                        {/* ${vote?.id} -  */}
                        <span className="sm_txt">

                          {vote?.voteId} </span>
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
                  </div>
                  {/* <div
                    className='d-flex justify-content-around w-50'
                  > */}
                  <div className={`${window.screen.width < 767 ? "w-100 justify-content-center my-2" : "w-50 justify-content-around"}  d-flex `} style={{ paddingLeft: (window.screen.width < 767 ? '0px' : '2em') }}>
                    <div className='text-center'>
                      <span style={{ fontSize: "13px", color: '#6352e8' }}>
                        VOTE RESULT
                      </span>
                      <div style={{ fontSize: "14px" }}>
                        {vote?.valueExpirationTime > vote?.valueVotingTime ? 'BULL' : 'BEAR'} {' '} $ {vote.valueExpirationTime && vote?.valueExpirationTime + ''}
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
                </div>
              </div>
              <div style={{ color: "#6352E8" }}>
                {vote.score && (
                  <Row className="flex-column text-center">

                    <Col>
                      <strong>You progressed - {vote.score}</strong> <span> CMP</span>
                    </Col>

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
                          <div>
                            {pairCoinResult?.firstCoin}%
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
                        <div style={{ minHeight: "100%" }}>
                          <PairsVoteVs>
                            {vote?.coin?.split("-")[vote?.direction]} {" "}

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
                          <div>
                            {pairCoinResult?.secondCoin}%
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
                    <span>{vote?.coin?.split("-")[vote?.direction]}:</span>&nbsp;
                    <span style={{ color: getCoinDifferenceColor(parseFloat(pairCoinResult?.difference)) }}>
                      {pairCoinResult?.difference.replaceAll('-', '')}%
                      {/* {vote?.coin?.split("-")[vote?.valueExpirationTime[0] - vote.valueVotingTime[0] < vote?.valueExpirationTime[1] - vote.valueVotingTime[1] ? 1 : 0]} {" "} - ${vote?.direction === 1 ? vote?.valueExpirationTime[1] : vote?.valueExpirationTime[0]} */}
                    </span>
                    <p>Vote impact : {vote.success == 2 ? 'MID' : vote.success == 1 ? 'HIGH' : 'LOW'}</p>
                  </div>
                  <CoinVoteTimer>
                    {vote?.valueExpirationTime && vote?.score && (
                      <>
                        <strong>You progressed - {vote?.score}</strong> <span> CMP</span>
                      </>

                    )}
                  </CoinVoteTimer>
                </div>
                <Col className="text-center">
                  {/* ${vote?.id} - */}
                  <span className="sm_txt">
                    {vote?.voteId} {' '}
                    {window.screen.width < 768 && <br />}
                    {`
                    - ${moment(
                      new Date(vote?.voteTime)
                    ).format("DD/MM/YYYY")}`}{' '} {`
                     ${moment(
                      new Date(vote?.voteTime)
                    ).format("HH:mm")}`}</span>
                </Col>
              </div>


              : ""
          }


          <div className='py-2  d-flex  justify-content-center'>
            <span style={{ textDecoration: 'none', cursor: 'pointer' }}
              onClick={() => {

                navigate('/profile/mine');
                setShowBack(true);
                removeVote();
              }}
            >
              <Other>{("CHECK PROGRESS")}</Other>
            </span>
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleClose}>
                    Save Changes
                  </Button>
                </Modal.Footer> */}
      </Modal>
    </div>
  )
}

export default React.memo(ModalForResult);