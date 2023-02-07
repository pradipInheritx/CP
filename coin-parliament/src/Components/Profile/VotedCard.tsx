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

type VotedCardProps = {
  vote: VoteSnap;
  id: string;
  coinSocketData?:any;
  callbackFun?:any;
};

const ProfilePairVote = styled.div`
  max-width: 350px;
  min-width:350px;
  width: 100%;
  height: 152px;
  vertical-align: middle;
  border-radius: 6px;
  background: var(--white) 0 0% no-repeat padding-box;
  box-shadow: 0 3px 6px #00000029;
  opacity: 1;
`;

const SmText = styled.div`
  font-size: 10px;
  line-height: 15px;
  color: #666;
`;

const PairsVoteVs = styled.span`
  font-size: 14px;
  color: #6352e8;
`;

const CoinVoteTimer = styled.span`
  font-size: 18px;
  line-height: 18px;
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
  coinSocketData?:any;
};

const calculate = (vote: VoteResultProps, index?: 0 | 1) => {
  if (Array.isArray(vote.valueExpirationTime) && index !== undefined) {
    return Number(
      Number(
        (((vote.valueExpirationTime as number[])[index] || 0) /
          ((vote.valueVotingTime as number[])[index] || 1) -
          1) *
          100
      ).toFixed(2)
    );
  } else {
    return Number(
      Number(
        (((vote.valueExpirationTime as number) || 0) /
          ((vote.valueVotingTime as number) || 1) -
          1) *
          100
      ).toFixed(2)
    );
  }
};

const Coin = ({ vote, winner, index, id,coinSocketData }: CoinProps) => {
  const voteCoins = vote.coin.split("-");
  const { coins } = useContext(CoinsContext);
  const pair = voteCoins.length > 1;


  const trend = calculate(vote, index);
  const coin =
    (index === undefined ? coins[vote.coin] : coins[voteCoins[index]]) || {};

    
  return pair ? (
    <CoinContainer winner={vote?.direction === index}>
      <div className="d-flex w-100 justify-content-center align-items-center flex-column mt-2">
        <div >
          <Logo {...{ symbol: coin.symbol || "", width: 30 }} />
        </div>
        <CoinName className="text-center d-flex flex-column justify-content-center align-items-center" style={{lineHeight:'16px'}}>
          <div>
            <strong>{coin.name}</strong>
          </div>
          <div>{coin.symbol}</div>
          <div>
            {formatCurrency(
              index === undefined
                ? (vote.valueVotingTime as unknown as number)
                : (vote.valueVotingTime as number[])[index]
            )}
          </div>
          <div>
            {vote.valueExpirationTime &&
              formatCurrency(
                index === undefined
                  ? (vote.valueVotingTime as unknown as number)
                  : (vote.valueExpirationTime as number[])[index]
              )}
          </div>
          <div>{vote.valueExpirationTime && <Trend num={trend} />}</div>
        </CoinName>
      </div>
    </CoinContainer>
  ) : (
    <div className="profile_coin_vote shadow-sm" style={{minWidth:window.screen.width<979?'':'480px'}}>
      <Container className="p-0">
        <Row>
          <Col>
            <div className="hstack justify-content-center">
              <div className="col-2" style={{paddingBottom:'20px'}}>
                <div className="h-100 d-flex w-100 justify-content-center align-items-center">
                  <Logo {...{ symbol: vote.coin || "", width: 30 }} />
                </div>
              </div>
              <Col
                className="flex-row"
                style={{ paddingTop: 23, paddingBottom: 14 }}
              >
                <Row>
                  <Col>
                    <p className="profile_coin_vote_txt d-flex flex-column">
                      <CoinTitle className="dark_prpl">
                        {coin.name} - {coin.symbol}
                        
                        {/* {coinSocketData && coinSocketData[0]?.pair?.includes(coin?.symbol) && coinSocketData[0]?.pair && <CoinTitle>test - {coinSocketData[0]?.pair } - { coinSocketData[0]?.p }</CoinTitle>}  */}
                      </CoinTitle>
                      <CoinCurrency >
                        {vote.direction ? "BULL" : "BEAR"} - 1H &nbsp;
                        <span>
                          {formatCurrency(
                            index === undefined
                              ? (vote.valueVotingTime as unknown as number)
                              : (vote.valueVotingTime as number[])[index]
                          )}
                        </span>
                      </CoinCurrency>
                    </p>
                  </Col>
                  <Col>
                    {!vote.valueExpirationTime && (
                      <Row className="text-body profile_coin_vote_txt">
                        <Col >
                          <MyCountdown expirationTime={vote.expiration || 0} />
                        </Col>
                      </Row>
                    )}
                    {vote.valueExpirationTime && (
                      <Row className="text-body profile_coin_vote_txt">
                        <Col xs={6}>
                          <Row>
                            <Col>
                              <Row className="flex-column text-center">
                                <Col style={{fontSize:'8px'}}>
                                  {vote.valueExpirationTime &&
                                    formatCurrency(
                                      index === undefined
                                        ? (vote.valueVotingTime as unknown as number)
                                        : (
                                            vote.valueExpirationTime as number[]
                                          )[index]
                                    )}
                                </Col>
                                
                                <Col>
                                  {vote.valueExpirationTime && (
                                    <Trend num={trend} />
                                  )}
                                  
                                </Col>
                                
                              </Row>
                            </Col>
                          </Row>
                        </Col>
                        
                        <Col xs={5}>
                          
                          <Row className="text_prpl">
                            <Col>
                            
                              {vote.score && (
                                <Row className="flex-column text-center">
                                  
                                  <Col>
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
                  <Col xs={2}>
                 {vote.direction?
                <>  { vote.valueVotingTime <Number(vote.valueVotingTime) + (Number(vote.valueVotingTime) * 1 / 100) && vote.valueVotingTime >Number(vote.valueVotingTime) - (Number(vote.valueVotingTime) * 1 / 100) && !vote.score ? <img src={process.env.PUBLIC_URL + `/images/icons/mediumgreen.png`}/>:
                <>{vote.valueVotingTime <coin.price &&!vote.score && <img src={process.env.PUBLIC_URL + `/images/icons/highgreen.png`}/>}
                {vote.valueVotingTime>  coin.price && !vote.score && <img src={process.env.PUBLIC_URL + `/images/icons/lightgreen.png`}/>}</>
                }  </> :<>
                { vote.valueVotingTime <Number(vote.valueVotingTime) + (Number(vote.valueVotingTime) * 1 / 100) && vote.valueVotingTime >Number(vote.valueVotingTime) - (Number(vote.valueVotingTime) * 1 / 100) && !vote.score ? <img src={process.env.PUBLIC_URL + `/images/icons/mediumgreen.png`}/>:
                <>{vote.valueVotingTime >coin.price &&!vote.score && <img src={process.env.PUBLIC_URL + `/images/icons/highgreen.png`}/>}
                {vote.valueVotingTime<  coin.price && !vote.score && <img src={process.env.PUBLIC_URL + `/images/icons/lightgreen.png`}/>}</>
                } 
                </>
                }
                 
                  
                  { vote.score ===1 && <img src={process.env.PUBLIC_URL + `/images/icons/highgreen.png`}/>}
                  { vote.score ===0.5 && <img src={process.env.PUBLIC_URL + `/images/icons/mediumgreen.png`}/>}
                   { vote.score ===0.25 && <img src={process.env.PUBLIC_URL + `/images/icons/lightgreen.png`}/>}
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <span className="sm_txt">{`${id} - ${moment(
                      new Date(vote.voteTime)
                    ).format("HH:mm DD/MM/YYYY")}`}</span>
                  </Col>
                </Row>
              </Col>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const calculateWinner = (vote: VoteResultProps) =>
  Math.max(calculate(vote, 0), calculate(vote, 1));

const VotedCard = ({ vote, id,coinSocketData,callbackFun }: VotedCardProps) => {
  const { coins } = useContext(CoinsContext);
 
 useEffect(() => {
   
   if(!vote.valueExpirationTime){
 var a = moment(vote.expiration)
var b = moment();
let votetime= a.diff(b)

   setTimeout(() => {
     console.count('votetime')
     console.log('votetime', vote)
    if(callbackFun)callbackFun()

   }, votetime+4000);
  }
 }, [])
 
  const winner = calculateWinner(vote);
  const pair = vote.coin.split("-").length > 1;
 
  return pair ? (
    <ProfilePairVote style={{minWidth:window.screen.width<979?'':'480px',maxWidth:window.screen.width<979?'':'480px'}}>
      <Container>
        <Row className="mx-auto" style={{ marginBottom: 14 }}>
          <Col className="col-4">
            <Coin
              vote={vote}
              winner={winner}
              index={pair ? 0 : undefined}
              id={id}
            />
          </Col>
          <Col className="col-4 flex-column justify-content-end align-items-center h-100">
            <div className="d-flex align-items-center justify-content-center">
              <LineImg>
                <Line />
              </LineImg>
            </div>
            <div className="align-self-end justify-content-end d-flex flex-column align-items-center">
              <div>
              {vote.direction?
              // @ts-ignore
                <>  { Math.abs((coins[vote.coin.split("-")[0]]?.price / vote?.valueVotingTime[0]) - (coins[vote.coin.split("-")[1]]?.price / vote?.valueVotingTime[1]))  <= 1 && !vote?.score ? <img src={process.env.PUBLIC_URL + `/images/icons/mediumgreen.png`}/>:
                // @ts-ignore
                <>{(coins[vote.coin.split("-")[0]]?.price / vote?.valueVotingTime[0]) > (coins[vote.coin.split("-")[1]]?.price / vote?.valueVotingTime[1])  &&!vote?.score && <img src={process.env.PUBLIC_URL + `/images/icons/highgreen.png`}/>}
                {/* @ts-ignore */}
                {(coins[vote.coin.split("-")[0]]?.price / vote?.valueVotingTime[0]) < (coins[vote.coin.split("-")[1]]?.price / vote?.valueVotingTime[1]) && !vote?.score && <img src={process.env.PUBLIC_URL + `/images/icons/lightgreen.png`}/>}</>
                // @ts-ignore
                }  </> :<>  { Math.abs((coins[vote.coin.split("-")[0]]?.price / vote?.valueVotingTime[0]) - (coins[vote.coin.split("-")[1]]?.price / vote?.valueVotingTime[1]))  <= 1 && !vote?.score ? <img src={process.env.PUBLIC_URL + `/images/icons/mediumgreen.png`}/>:
                // @ts-ignore
                <>{(coins[vote.coin.split("-")[0]]?.price / vote?.valueVotingTime[0]) < (coins[vote.coin.split("-")[1]]?.price / vote?.valueVotingTime[1])  &&!vote?.score && <img src={process.env.PUBLIC_URL + `/images/icons/highgreen.png`}/>}
                {/* @ts-ignore */}
                {(coins[vote.coin.split("-")[0]]?.price / vote?.valueVotingTime[0]) > (coins[vote.coin.split("-")[1]]?.price / vote?.valueVotingTime[1]) && !vote?.score && <img src={process.env.PUBLIC_URL + `/images/icons/lightgreen.png`}/>}</>
                }  </>
                }
              { vote.score ===1 && <img src={process.env.PUBLIC_URL + `/images/icons/highgreen.png`}/>}
                  { vote.score ===0.5 && <img src={process.env.PUBLIC_URL + `/images/icons/mediumgreen.png`}/>}
                   { vote.score ===0.25 && <img src={process.env.PUBLIC_URL + `/images/icons/lightgreen.png`}/>}
              </div>
              <div style={{ minHeight: "100%" }}>
                <PairsVoteVs>
                  {vote.coin.split("-")[vote.direction]} -{" "}
                  {timeframeInitials(vote.timeframe.name)}
                </PairsVoteVs>
              </div>
              <div style={{ minHeight: "100%" }}>
                <CoinVoteTimer>
                  {vote.valueExpirationTime && vote.score && (
                    <strong>{vote.score} CMP</strong>
                  )}
                  {!vote.valueExpirationTime && (
                    <MyCountdown expirationTime={vote.expiration || 0} />
                  )}
                </CoinVoteTimer>
              </div>
            </div>
          </Col>
          <Col className="col-4">
            <Coin
              vote={vote}
              winner={winner}
              index={pair ? 1 : undefined}
              id={id}
            />
          </Col>
        </Row>
        <Row>
          <Col className="justify-content-center w-100">
            <SmText className="text-center">{`${id} - ${moment(
              new Date(vote.voteTime)
            ).format("HH:mm DD/MM/YYYY")}`}</SmText>
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
