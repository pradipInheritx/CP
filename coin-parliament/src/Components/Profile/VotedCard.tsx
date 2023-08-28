import React, { useContext, useEffect } from "react";
import { VoteResultProps, VoteSnap } from "../../common/models/Vote";
import styled from "styled-components";
import Line from "../icons/line";
import CoinsContext from "../../Contexts/CoinsContext";
import { formatCurrency } from "../../common/models/Coin";
import Trend from "../Atoms/utils/Trend";
import { Logo } from "../Pairs/Card";
import { Col, Container, Row } from "react-bootstrap";
import moment from "moment";
import { timeframeInitials } from "../Atoms/Button/Button";
import { MyCountdown } from "../VotedCard";
import { calculateDiffBetweenCoins, calculateDiffBetweenCoinsType } from "common/utils/helper";
import { isArray } from "lodash";

type VotedCardProps = {
  vote: VoteSnap;
  id: string;
  coinSocketData?: any;
  callbackFun?: any;
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
  console.log(vote, " checkvoteid")
  const { coins } = useContext(CoinsContext);
  const pair = voteCoins.length > 1;


  const trend = calculate(vote, index);
  const coin =
    (index === undefined ? coins[vote?.coin] : coins[voteCoins[index]]) || {};

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
          <div>
            {/* {vote.valueExpirationTime &&
              // @ts-ignore
              index !== undefined && index == 0 ? vote?.valueVotingTime[0] : vote.valueVotingTime[1]
            } */}
            {index === 0 ? pairCoinResult?.firstCoin : pairCoinResult?.secondCoin}%

          </div>
        </CoinName>
      </div>
    </CoinContainer>
  ) : (
    <div className="profile_coin_vote shadow-sm" style={{ minWidth: window.screen.width < 979 ? '' : '480px' }}>
      <Container className="p-0 ">
        <div style={{ display: 'flex' }}>
          <Col>
            <div className=" d-flex justify-content-center  align-items-center">
              <div className="col-2" >
                <div className="h-100 d-flex w-100 justify-content-center align-items-center">
                  <Logo {...{ symbol: vote.coin || "", width: 30 }} />
                </div>
              </div>
              <Col
                className="flex-row"
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
                        {
                          (Number(vote?.valueVotingTime || 0) < Number(vote?.valueVotingTime) + (Number(vote?.valueVotingTime) * 1 / 100) && vote?.valueVotingTime > Number(vote?.valueVotingTime) - (Number(vote?.valueVotingTime) * 1 / 100) && !vote.score) ?
                            <RoundDiv backcolor={"#6352E8"}></RoundDiv> :
                            <>
                              {vote?.valueVotingTime < coin.price && !vote.score && <RoundDiv backcolor={"#3712B3"}></RoundDiv>}
                              {vote?.valueVotingTime > coin.price && !vote.score && <RoundDiv backcolor={"#D4D0F3"}></RoundDiv>}
                            </>
                        }
                      </> :
                      <>
                        {vote?.valueVotingTime < Number(vote?.valueVotingTime) + (Number(vote?.valueVotingTime) * 1 / 100) && vote?.valueVotingTime > Number(vote?.valueVotingTime) - (Number(vote?.valueVotingTime) * 1 / 100) && !vote.score ? <RoundDiv backcolor={"#6352E8"}></RoundDiv> :
                          <>{vote?.valueVotingTime > coin.price && !vote.score && <RoundDiv backcolor={"#3712B3"}></RoundDiv>}
                            {vote?.valueVotingTime < coin.price && !vote.score && <RoundDiv backcolor={"#D4D0F3"}></RoundDiv>}</>
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
          </Col>
        </div>
      </Container>
    </div>
  );
};

const calculateWinner = (vote: VoteResultProps) =>
  Math.max(calculate(vote, 0), calculate(vote, 1));

const VotedCard = ({ vote, id, coinSocketData, callbackFun }: VotedCardProps) => {

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
            <div className=''
              style={{ fontSize: "12px" }}
            >
              <p>VOTE RESULT</p>
              {/* @ts-ignore */}
              {(vote?.valueExpirationTime?.length && pairCoinResult?.difference) ? `${vote?.coin?.split("-")[vote?.direction]}: ${pairCoinResult?.difference}` : 0}%
              {/* @ts-ignore */}
              <p>Vote impact : {vote.success == 2 ? 'MID' : vote.success == 1 ? 'HIGH' : 'LOW'}</p>
            </div>

            <CoinVoteTimer>
              {vote.valueExpirationTime && vote.score && (
                <>
                  <strong>You progressed -  {vote.score}</strong><span> CMP</span>
                </>
              )}
              {!vote.valueExpirationTime && (
                <MyCountdown expirationTime={vote.expiration || 0}
                // vote={vote} voteId={id} coins={coins} symbol1={voteCoins[0]} symbol2={voteCoins[1]}
                />
              )}
            </CoinVoteTimer>
          </div>
        </Row>
        <Row className="">
          <Col className="justify-content-center w-100 mb-2">
            <SmText className="text-center">{`${id} - ${moment(
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