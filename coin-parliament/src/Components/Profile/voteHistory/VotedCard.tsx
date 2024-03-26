import React, { useContext, useEffect } from "react";
import { VoteResultProps, VoteSnap } from "../../../common/models/Vote";
import styled from "styled-components";
import Line from "../../icons/line";
import CoinsContext from "../../../Contexts/CoinsContext";
import { Logo } from "../../Pairs/Card";
import { Col, Container, NavLink, Row } from "react-bootstrap";
import moment from "moment";
import { timeframeInitials } from "../../Atoms/Button/Button";
import { MyCountdown } from "../../VotedCard";
import { calculateDiffBetweenCoins, calculateDiffBetweenCoinsType, getCoinDifferenceColor, getPairResultColor, getSingleCoinPriceColor } from "common/utils/helper";
import { isArray } from "lodash";
import { Link } from "react-router-dom";

type VotedCardProps = {
  vote: VoteSnap;
  id: string;
  coinSocketData?: any;
  callbackFun?: any;
  setRunVote?: any;
};

const ProfilePairVote = styled.div`
  max-width: 350px;
  min-width:350px;
  width: 100%;
  // height: 152px;
  vertical-align: middle;
  border-radius: 6px;
  background: var(--white) 0 0% no-repeat padding-box;
  box-shadow: 0 3px 6px #00000029;
  opacity: 1;
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



const SmText = styled.div`
  font-size: 10px;
  line-height: 15px;
  color: #666;
`;

const PairsVoteVs = styled.span`
  font-size: ${window.screen.width > 676 ? "14px" : "10px"};
  color: #6352e8;
`;

const CoinVoteTimer = styled.span`
  font-size: 14px;
  line-height: 14px;
  color: #6352e8;
`;

const CoinName = styled.div`
  font-size: 13px;
  line-height: 13px;
  color: #160133;
`;
const CoinTitle = styled.span`
  font-size: 12px;
  font-weight:400;
  color: #160133;
`;
const CoinCurrency = styled.span`
  font-size: 12px;
  font-weight:400;
  color: #6352e8;
  white-space:no-wrap;
`;
const LineImg = styled.div`
  height: 60px;
  width: 19px;
`;

const CoinContainer = styled.div`
  border-top-color: ${(props: { winner: boolean }) =>
    props.winner ? "#6352E8" : "transparent"};
  border-top-style: solid;
  border-top-width: 4px;
`;

type CoinProps = {
  vote: VoteResultProps;
  winner: number;
  index?: 0 | 1;
  id: string;
  coinSocketData?: any;
  pairCoinResult?: calculateDiffBetweenCoinsType
};

const calculate = (vote: VoteResultProps, index?: 0 | 1) => {
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

const Coin = ({ vote, winner, index, id, coinSocketData, pairCoinResult }: CoinProps) => {
  const voteCoins = vote?.coin.split("-");
  const { coins } = useContext(CoinsContext);
  const pair = voteCoins.length > 1;


  const trend = calculate(vote, index);
  const coin =
    (index === undefined ? coins[vote?.coin] : coins[voteCoins[index]]) || {};
  const widthLess400 = window.screen.width < 400;
  const coinPrice = (index === 0 ? pairCoinResult?.firstCoin : pairCoinResult?.secondCoin)?.replaceAll('-', '');
  return pair ? (
    <CoinContainer winner={vote?.direction === index}>
      <div className="d-flex w-100 justify-content-center align-items-center flex-column mt-2 ">
        <div >
          <Logo {...{ symbol: coin.symbol || "", width: 30 }} />
        </div>
        <CoinName className="text-center d-flex flex-column justify-content-center align-items-center" style={{ lineHeight: '16px' }}>
          <div>
            <strong>{coin.name}</strong>
          </div>
          <div>{coin.symbol}</div>
          <div style={{ color: getCoinDifferenceColor(index === 0 ? parseFloat(pairCoinResult?.firstCoin || '0') : parseFloat(pairCoinResult?.secondCoin || '0')) }}>
            {coinPrice && coinPrice + '%'}

          </div>
        </CoinName>
      </div>
    </CoinContainer>
  ) : (
    <div className="profile_coin_vote shadow-sm mb-3 text-center" style={{ minWidth: window.screen.width < 500 ? '98%' : '35rem', }}>
      <Container className="p-2 ">
        <div className="row">
          <div className="col-sm-3 col-3 d-flex flex-column justify-content-center align-items-center p-0 pe-1" style={{ fontSize: (widthLess400 ? '0.8em' : '') }}>
            <Logo {...{ symbol: vote.coin || "", width: 30 }} />
            <span className="fw-bold">{coin.name}</span>
            <span className="">{vote.coin}</span>
          </div>
          <div className="col-sm-4 col-4 d-flex flex-column justify-content-center align-items-center p-0">
            <span className="" >{vote.timeframe.name}</span>
            <span className={`${window.screen.width > 502 && 'fs-6'} fw-normal`} style={{ fontSize: (widthLess400 ? '0.9em' : '') }}>
              {vote.direction == 0 ? "BULL" : "BEAR"} ${vote?.valueVotingTime}
            </span>
            <span className="sm_txt" style={{ fontSize: (widthLess400 ? '7.9px' : '') }}>{vote?.voteId} </span>
            <span className="sm_txt" style={{ fontSize: (widthLess400 ? '7.9px' : '') }}> {moment(new Date(vote.voteTime)).format("DD/MM/YYYY HH:mm")}</span>
          </div>
          {vote.score ?
            <>
              <div className="col-sm-3 col-3 d-flex flex-column justify-content-center align-items-center p-0">
                <span style={{ fontSize: '0.8em' }} className="">VOTE RESULT</span>
                <div className="fw-normal" style={{ fontSize: (widthLess400 ? '0.9em' : '') }}>
                    {/* {vote.direction == 0 ? "BULL" : "BEAR"} */}
                    {/* @ts-ignore */}                    
                    {vote?.valueExpirationTime > vote?.valueVotingTime ? 'BULL' : vote?.valueExpirationTime < vote?.valueVotingTime ? 'BEAR' : vote?.direction == 0 ? "BULL" : "BEAR"} 
                  &nbsp;
                  {/* @ts-ignore */}
                  <span style={{ color: getSingleCoinPriceColor(parseFloat(vote?.valueVotingTime || 0.00), parseFloat(vote?.valueExpirationTime || 0.00), vote?.direction) }}>
                    ${vote?.valueExpirationTime}</span>
                </div>
                {/* @ts-ignore */}
                <span style={{ fontSize: widthLess400 ? '0.69em' : '0.8em' }}>Vote impact : {vote.success === 2 ? 'MID' : vote.success === 1 ? 'HIGH' : 'LOW'} </span>
              </div>
              <div className="col-sm-2 col-2 d-flex flex-column justify-content-center align-items-center p-0 ps-1" style={{ color: '#604de4' }}>
                <span style={{ fontSize: widthLess400 ? '0.69em' : '0.8em' }}>You progressed </span>
                <strong className="fs-6">{vote.score}</strong>
                <span className="fs-6">CMP</span>
              </div>
            </>
            :
            <div className="col-sm-5 col-5 d-flex flex-column justify-content-center align-items-center p-0">
              <MyCountdown expirationTime={vote.expiration || 0} />
              <Link to={`/coins/${vote?.coin}?timeFrame=${vote?.timeframe.index}`} className="text-decoration-none">
                <span className={`fs-6`} style={{ color: '#7767f7' }} >CHECK VOTE</span>
              </Link>
            </div>
          }

          <Col
            className="flex-row d-none"
            style={{ paddingTop: 23, paddingBottom: 14 }}
          >
            <Row>
              <Col >
                <p className="profile_coin_vote_txt d-flex flex-column">
                  <CoinTitle className="dark_prpl">
                    {coin.name} - {coin.symbol}

                    {/* {coinSocketData && coinSocketData[0]?.pair?.includes(coin?.symbol) && coinSocketData[0]?.pair && <CoinTitle>test - {coinSocketData[0]?.pair } - { coinSocketData[0]?.p }</CoinTitle>}  */}
                  </CoinTitle>
                  <CoinCurrency >
                    {vote.direction == 0 ? "BULL" : "BEAR"} - {timeframeInitials(vote.timeframe.name)}&nbsp;
                    <span>
                      {/* {formatCurrency(
                            index === undefined
                              ? (vote?.valueVotingTime as unknown as number)
                              : (vote?.valueVotingTime as number[])[index]
                            )}  */}
                      {vote?.valueVotingTime as unknown as number}
                    </span>
                  </CoinCurrency>
                </p>

                <Col className="">
                  {/* @ts-ignore */}
                  <span className="sm_txt">{`${vote?.voteId ? vote?.voteId : id} - ${moment(
                    new Date(vote.voteTime)
                  ).format("DD/MM/YYYY")} ${moment(
                    new Date(vote?.voteTime)
                  ).format("HH:mm")}`}</span>
                </Col>

              </Col>
              <Col>
                {!vote.valueExpirationTime && (
                  <Row className="text-body profile_coin_vote_txt">
                    <Col >

                      <MyCountdown expirationTime={vote.expiration || 0}
                      // vote={vote} voteId={id} coins={coins} symbol1={voteCoins[0]} symbol2={voteCoins[1]}
                      />

                    </Col>
                  </Row>
                )}
                {vote.valueExpirationTime && (
                  <Row className="text-body profile_coin_vote_txt">
                    <Col >
                      <Row>
                        <Col>
                          <Row className="flex-column text-center ">
                            <Col style={{ fontSize: '8px' }} className="">
                              VOTE RESULT
                            </Col>

                            <Col className=""
                              style={{ fontSize: '10px' }}
                            >
                              {/* {vote.valueExpirationTime && (
                                    <Trend num={trend} />
                                  )} */}
                              {vote?.valueExpirationTime > vote?.valueVotingTime ? 'BULL' : 'BEAR'} {' '}
                              {vote.valueExpirationTime &&
                                vote?.valueExpirationTime
                                // formatCurrency(                                                                          
                                //   index === undefined
                                //     ? (vote?.valueExpirationTime as unknown as number)
                                //     : (
                                //         vote?.valueExpirationTime as number[]
                                //   )[index]
                                //   )
                              }
                            </Col>
                            <Col
                              style={{ fontSize: '8px' }}
                              className=""
                            >
                              {/* @ts-ignore */}
                              Vote impact : {vote.success == 2 ? 'MID' : vote.success == 1 ? 'HIGH' : 'LOW'}
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Col>

                    <Col style={{ display: 'flex', alignItems: 'center' }}>

                      <Row className="text_prpl">
                        <Col >

                          {vote.score && (
                            <Row className="flex-column text-center" >
                              <span style={{ fontSize: '8px' }}>You progressed </span>
                              <Col >


                                <strong>{vote.score}</strong>
                              </Col>
                              <Col>CMP</Col>
                            </Row>
                          )}
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                )}
              </Col>
              {!vote.valueExpirationTime && <Col xs={2} className="">
                {vote.direction ?
                  <>
                    {/* @ts-ignore */}
                    {(Number(vote?.valueVotingTime || 0) < Number(vote?.valueVotingTime) + (Number(vote?.valueVotingTime) * 1 / 100) && vote?.valueVotingTime > Number(vote?.valueVotingTime) - (Number(vote?.valueVotingTime) * 1 / 100) && !vote.score) ?
                      <RoundDiv backcolor={"#6352E8"}></RoundDiv> :
                      <>
                        {/* @ts-ignore */}
                        {vote?.valueVotingTime < coin.price && !vote.score && <RoundDiv backcolor={"#3712B3"}></RoundDiv>} {vote?.valueVotingTime > coin.price && !vote.score && <RoundDiv backcolor={"#D4D0F3"}></RoundDiv>}
                      </>
                    }
                  </> :
                  <>
                    {/* @ts-ignore */}
                    {vote?.valueVotingTime < Number(vote?.valueVotingTime) + (Number(vote?.valueVotingTime) * 1 / 100) && vote?.valueVotingTime > Number(vote?.valueVotingTime) - (Number(vote?.valueVotingTime) * 1 / 100) && !vote.score ? <RoundDiv backcolor={"#6352E8"}></RoundDiv> : <>{vote?.valueVotingTime > coin.price && !vote.score && <RoundDiv backcolor={"#3712B3"}></RoundDiv>} {vote?.valueVotingTime < coin.price && !vote.score && <RoundDiv backcolor={"#D4D0F3"}></RoundDiv>}</>
                    }
                  </>
                }


                {/* { vote.score ===1 && <img src={process.env.PUBLIC_URL + `/images/icons/highgreen.png`}/>}
                  { vote.score ===0.5 && <img src={process.env.PUBLIC_URL + `/images/icons/mediumgreen.png`}/>}
                   { vote.score ===0.25 && <img src={process.env.PUBLIC_URL + `/images/icons/lightgreen.png`}/>} */}

              </Col>}
            </Row>

          </Col>
        </div>
      </Container >
    </div >
  );
};

const calculateWinner = (vote: VoteResultProps) =>
  Math.max(calculate(vote, 0), calculate(vote, 1));

const VotedCard = ({ vote, id, coinSocketData, callbackFun , setRunVote }: VotedCardProps) => {

  
  const { coins } = useContext(CoinsContext);
  //  Math.abs((coins[vote.coin.split("-")[0]].price

  const voteCoins = vote?.coin.split("-");
  useEffect(() => {

    if (!vote.valueExpirationTime) {
      var a = moment(vote.expiration)
      var b = moment();
      let votetime = a.diff(b)

      setTimeout(() => {

        if (callbackFun) callbackFun()

      }, votetime + 4000);
    }
  }, [])

  const winner = calculateWinner(vote);
  const pair = vote.coin.split("-").length > 1;

  var pairCoinResult: calculateDiffBetweenCoinsType = { firstCoin: '', secondCoin: '', difference: '' };
  if (pair && isArray(vote?.valueVotingTime) && isArray(vote?.valueExpirationTime)) {
    pairCoinResult = calculateDiffBetweenCoins(vote?.valueVotingTime, vote?.valueExpirationTime, vote?.direction);
  }
  return pair ? (
    <ProfilePairVote style={{ minWidth: window.screen.width < 979 ? '' : '480px', maxWidth: window.screen.width < 979 ? '' : '480px', }} >
      <Container>
        <Row className="mx-auto" style={{ marginBottom: 14 }}>
          <Col className="col-4">
            <Coin
              vote={vote}
              winner={winner}
              index={pair ? 0 : undefined}
              id={id}
              pairCoinResult={pairCoinResult}
            />
          </Col>
          <Col className="col-4 flex-column justify-content-end align-items-center h-100 ">
            <div className="d-flex align-items-center justify-content-center">
              <LineImg>
                <Line />
              </LineImg>
            </div>
            <div className="align-self-end justify-content-end d-flex flex-column align-items-center">
              <div>
                <RoundDiv backcolor={vote.score === 1 ? "#3712B3" : vote.score === 0.5 ? "#6352E8" : vote.score === 0.25 ? "#D4D0F3" : "#6352E8"}>

                </RoundDiv>
              </div>
              <div style={{ minHeight: "100%" }}>
                <PairsVoteVs>
                  {vote.coin.split("-")[vote.direction]} -{" "}
                  {timeframeInitials(vote.timeframe.name)}
                </PairsVoteVs>
              </div>

            </div>
          </Col>
          <Col className="col-4">
            <Coin
              vote={vote}
              winner={winner}
              index={pair ? 1 : undefined}
              id={id}
              pairCoinResult={pairCoinResult}
            />
          </Col>
        </Row>
        <Row>
          <div style={{ minHeight: "100%" }} className="text-center">
            {/* @ts-ignore */}
            {vote?.valueExpirationTime && vote?.valueExpirationTime?.length && <div className=''
              style={{ fontSize: "12px" }}
            >
              <p>VOTE RESULT</p>
              {vote?.coin?.split("-")[vote?.direction]}&nbsp;
              <span style={{ color: getPairResultColor(parseFloat(pairCoinResult?.firstCoin), parseFloat(pairCoinResult?.secondCoin), vote?.direction) }}>
                {/* @ts-ignore */}
                {(vote?.valueExpirationTime && vote?.valueExpirationTime.length && pairCoinResult?.difference) ? `${pairCoinResult?.difference.replaceAll('-', '')}` : 0}%
              </span>
              {/* @ts-ignore */}
              <p>Vote impact : {vote.success == 2 ? 'MID' : vote.success == 1 ? 'HIGH' : 'LOW'}</p>
            </div>}

            <CoinVoteTimer>
              {vote.valueExpirationTime && vote.score && (
                <>
                  You progressed -<strong>  {vote.score} <span> CMP</span></strong>
                </>
              )}
              {!vote.valueExpirationTime && (
                <div className="d-flex flex-column justify-content-center align-items-center p-0">
                  <MyCountdown expirationTime={vote.expiration || 0} />
                  <Link to={`/pairs/${vote?.coin}?timeFrame=${vote?.timeframe.index}`} className="text-decoration-none mt-3 mb-1">
                    <span className={`fs-6 pt-5`} style={{ color: '#7767f7' }} >CHECK VOTE</span>
                  </Link>
                </div>
              )}
            </CoinVoteTimer>
          </div>
        </Row>
        <Row className="">
          <Col className="justify-content-center w-100 mb-2">
            <SmText className="text-center">{`${vote.voteId}  ${moment(
              new Date(vote?.voteTime)
            ).format("DD/MM/YYYY")} ${moment(
              new Date(vote?.voteTime)
            ).format("HH:mm")}`}  </SmText>
          </Col>
        </Row>
      </Container>
    </ProfilePairVote>
  ) : (
    <Coin
      vote={vote}
      winner={winner}
      index={pair ? 1 : undefined}
      id={vote.id}
      coinSocketData={coinSocketData}
    />
  );
};

export default VotedCard;
