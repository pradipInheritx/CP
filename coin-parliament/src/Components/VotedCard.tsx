import React, { useContext, useEffect, useState } from "react";
import { Direction, VoteResultProps } from "../common/models/Vote";
import Countdown from "react-countdown";
import { Coin, formatCurrency, precision } from "../common/models/Coin";
import { useTranslation } from "../common/models/Dictionary";
import styled from "styled-components";
import {
  Border1pxBlueViolet,
  PoppinsNormalBlueViolet14px,
  PoppinsNormalBlueViolet17px,
  PoppinsNormalGunsmoke9px,
} from "../styledMixins";
import moment from "moment";
import { isArray, isEmpty } from "lodash";
import SelectTimeframes from "./Coins/SelectTimeframes";
import AppContext from "../Contexts/AppContext";
import RangeSilder from "./Users/RangeSilder";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { texts } from "./LoginComponent/texts";
import { Button, Image, Modal } from "react-bootstrap";
import { handleSoundClick, lastTensecWait } from "../common/utils/SoundClick";
import Swal from "sweetalert2";
import { calculateDiffBetweenCoins, calculateDiffBetweenCoinsType, getCoinDifferenceColor, getPairResultColor, getSingleCoinPriceColor } from "common/utils/helper";
import { VoteContext, VoteDispatchContext } from "Contexts/VoteProvider";
import Line from "./icons/line";
import { VoteEndCoinPriceContext, VoteEndCoinPriceDispatchContext } from "Contexts/VoteEndCoinPrice";
import { CompletedVotesContext } from "Contexts/CompletedVotesProvider";



const Rectangle2620 = styled.div`
  ${Border1pxBlueViolet};    
  max-width: ${window.screen.width < 767 ? "345px" : "400px"};
  // height: 75px;
  // padding:20px 0px;
  background-color: var(--white);  
  border-radius: 38px;
  box-shadow: 0 3px 6px #00000029;
  display: flex;
  justify-content: center;
  align-items: center;
  // padding: 16px 35px;  
  
  margin: 0 auto 23px;
`;

const ID13020221942 = styled.div`
  ${PoppinsNormalGunsmoke9px};
  letter-spacing: 0;
  line-height: 10px;
  white-space: nowrap;
  margin-top:5px;
`;

const YourVote = styled.div`
  font: var(--font-style-normal) normal var(--font-weight-normal)
    var(--font-size-14) / 23px var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  color: var(--color-160133);
  opacity: 1;
  text-align: center;

  &:first-letter {
    text-transform: capitalize;
  }
`;

const BitcoinBTCBULL24H3864490 = styled.div`
  ${PoppinsNormalBlueViolet14px};
  letter-spacing: 0;
  line-height: 14px;
  white-space: nowrap;
  display: flex;
`;

const Row1 = styled.div`
  font: var(--font-style-normal) normal var(--font-weight-normal)
    var(--font-size-16) / var(--line-spacing-16) var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  color: var(--color-2d2c3c);
  text-align: left;
`;

const Row2 = styled.div`
  font: var(--font-style-normal) normal var(--font-weight-normal)
    var(--font-size-14) / var(--line-spacing-14) var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  color: var(--color-6352e8);
  text-align: left;
`;

const Text2 = styled.div`
  ${PoppinsNormalBlueViolet17px};
  letter-spacing: 0;
  line-height: 12px;
  white-space: nowrap;
`;

const VotedCard = ({
  vote,
  coins,
  symbol1,
  symbol2,
  voteId,
  selectedTimeFrame,
  setSelectedTimeFrame,
  selectedTimeFrameArray,
  cssDegree,
  votePrice,
  setpopUpOpen,
  setHideButton,
  hideButton

}: {
  vote: VoteResultProps;
  coins: { [symbol: string]: Coin };
  symbol1: string;
  symbol2: string;
  voteId: string;
  selectedTimeFrame?: number;
  setSelectedTimeFrame?: (n: number) => void;
  selectedTimeFrameArray?: any;
  cssDegree?: any;
  votePrice?: any;
  setpopUpOpen?: React.Dispatch<React.SetStateAction<boolean>>
  setHideButton?: React.Dispatch<React.SetStateAction<number[]>>;
  hideButton?: any;


}) => {

  const [borderColor, setBorderColor] = useState<any>("#6352e8");
  const getBorderColor = () => {
    // let PricePer = livePrice / 100;   
    if (vote && symbol2 !== undefined && Array.isArray(vote?.valueVotingTime)) {
      let bothLivePrice = [coins[symbol1]?.price, coins[symbol2]?.price];
      // @ts-ignore

      let bothCurrentPrice = vote?.valueVotingTime;
      //   let bothCurrentPrice = [vote?.valueVotingTime[0],vote?.valueVotingTime[1],];
      let diff = [
        bothCurrentPrice[0] / bothLivePrice[0],
        bothCurrentPrice[1] / bothLivePrice[1],
      ];

      let winner = diff[0] < diff[1] ? 1 : 0;
      const averageValue = Math.abs(diff[0] - diff[1]) * 100;
      if ((averageValue <= 10)) {
        setBorderColor("#6352e8")
      } else {
        if (vote?.direction == 1) {
          winner == vote?.direction
            ?
            setBorderColor("#d4d0f3")
            :
            setBorderColor("#3b17b7")

        } else if (vote?.direction == 0) {
          winner != vote?.direction
            ?
            setBorderColor("#d4d0f3")
            :
            setBorderColor("#3b17b7")

        }
      }
    } else if (symbol2 == undefined) {
      let livePrice = coins[symbol1]?.price
      let votePrice = Number(vote?.valueVotingTime)
      let PricePer = livePrice;
      if (livePrice < PricePer + 10 &&
        livePrice > PricePer - 10) {
        setBorderColor(50);
      }
      else {
        if (vote?.direction == 1) {
          livePrice < votePrice ? setBorderColor("#3b17b7") : setBorderColor("#d4d0f3");
        } else if (vote?.direction == 0) {
          livePrice > votePrice ? setBorderColor("#d4d0f3") : setBorderColor("#3b17b7");
        }
      }
    }
  };

  console.log("getpair vote", vote)


  useEffect(() => {
    getBorderColor()
  }, [coins[symbol1]?.price, coins[symbol2]?.price])


  useEffect(() => {
    console.log('component mounter vote')
    // if (setHideButton) {
    //   setHideButton([...hideButton, selectedTimeFrame])
    // }
    return () => {
      console.log('component unmounted vote')
    }
  }, [])

  const [coin1, coin2] = [
    coins[symbol1] || undefined,
    coins[symbol2] || undefined,
  ];
  const { timeframes } = useContext(AppContext);
  const translate = useTranslation();

  const setVoteEndCoinPrice = useContext(VoteEndCoinPriceDispatchContext);
  const voteEndCoinPrice = useContext(VoteEndCoinPriceContext);
  const voteDetails = useContext(VoteContext);
  const [calcPer, setCalcPer] = useState<boolean>(true);
  const [pairCoinResult, setPairCoinResult] = useState<calculateDiffBetweenCoinsType>({ firstCoin: '0', secondCoin: '0', difference: '0' });

  useEffect(() => {
    if (isArray(vote.valueVotingTime) && vote?.valueVotingTime.length > 1) {
      // if (!voteDetails?.openResultModal && calcPer) {
      // console.log(formatCurrency(coins[symbol1]?.price, precision[symbol1]).replaceAll('$', '').replaceAll(',', ''), parseFloat(formatCurrency(coins[symbol1]?.price, precision[symbol1]).replaceAll('$', '').replaceAll(',', '')), parseFloat(formatCurrency(coins[symbol2]?.price, precision[symbol2]).replaceAll('$', '')), 'coinsname');

      let value1 = voteEndCoinPrice?.[`${vote?.coin}_${vote?.timeframe?.seconds}`]?.coin1 || '0.00';
      let value2 = voteEndCoinPrice?.[`${vote?.coin}_${vote?.timeframe?.seconds}`]?.coin2 || '0.00';

      setPairCoinResult((Prev) => {
        if (isArray(vote.valueVotingTime) && value1 && value2) {
          return calculateDiffBetweenCoins(vote?.valueVotingTime, [+value1, +value2], vote?.direction);
        }
        return Prev;
      })
      // }
    }
    // if (voteDetails?.lessTimeVote && voteDetails?.lessTimeVote.coin === vote.coin && voteDetails?.lessTimeVote?.timeframe?.seconds === vote?.timeframe?.seconds) {
    //   setPairCoinResult((Prev) => {
    //     return calculateDiffBetweenCoins(voteDetails?.lessTimeVote?.valueVotingTime, voteDetails?.lessTimeVote?.valueExpirationTime, vote?.direction);
    //   })
    // }
  }, [JSON.stringify(voteEndCoinPrice[`${vote?.coin}_${vote?.timeframe?.seconds}`])]);

  useEffect(() => {
    calculateCurrentPrice();
  }, [vote, coins, voteDetails?.lessTimeVote]);

  const calculateCurrentPrice = () => {
    if (vote?.expiration < new Date().getTime()) {
      return;
    }
    let value1 = `${formatCurrency(coins[symbol1]?.price, precision[symbol1]).replaceAll('$', '').replaceAll(',', '')}${!['BTC', 'ETH'].includes(symbol1.toUpperCase()) ? coins[symbol1]?.randomDecimal : ''}`
    let value2 = symbol2 ? `${formatCurrency(coins[symbol2]?.price, precision[symbol2]).replaceAll('$', '').replaceAll(',', '')}${!['BTC', 'ETH'].includes(symbol2.toUpperCase()) ? coins[symbol2]?.randomDecimal : ''}` : '0.00'
    setVoteEndCoinPrice((prev) => {
      return {
        ...prev,
        [`${vote?.coin}_${vote?.timeframe?.seconds}`]: {
          coin1: value1,
          coin2: value2
        }
      }
    })
  }
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: 300,
        behavior: "smooth",
      });
    }, 0);
  }, []);
  if (!coin1) {
    return <></>;
  }
  const expirationTime = vote.expiration || 0;

  const options = symbol2 ? [symbol1, symbol2] : Object.values(Direction);
  const voted = options[vote.direction];
  const votedCoin = coin2 ? coins[voted] : coins[symbol1];


  // console.log(coins,"votedCoin")

  let row1 = "",
    row2 = "",
    row3 = "";
  if (!isEmpty(vote)) {
    let valueVotingTime;
    if (Array.isArray(vote.valueVotingTime)) {
      valueVotingTime = vote.valueVotingTime[Number(vote.direction + "")];
    } else {
      valueVotingTime = vote.valueVotingTime;
    }

    // valueVotingTime = Number(valueVotingTime);
    console.log('votetime', valueVotingTime)
    row1 = coin2
      ? `${votedCoin.symbol} : `
      : `${voted} ${votedCoin.symbol}`;

    row2 = coin2
      ? ` $${valueVotingTime}`
      : `  $${valueVotingTime || 'loading'}`;

    // row2 = coin2
    //   ? `${vote.timeframe.name} ${valueVotingTime}`
    //   : `${voted} - ${vote.timeframe.name} $${valueVotingTime || 'loading'}`;

    row3 = `${vote.timeframe.name}`
  }



  return (
    <>
      <div className="mt-4" style={{ paddingLeft: symbol2 ? '' : '24px', paddingRight: symbol2 ? '' : '24px', maxWidth: '450px', margin: '0 auto' }}>
        <SelectTimeframes
          {...{
            selected: selectedTimeFrame,
            timeframes,
            selectTimeframe: (timeframe) => {
              // @ts-ignore
              setSelectedTimeFrame(timeframe.index);
            },
            // title: translate("Select voting time frame"),
            title: translate("Select a time frame for your vote").toUpperCase(),
            votedTitle: translate("Select another time frame").toUpperCase(),
            // select a time frame for your vote
            voted: true,
            selectedTimeFrameArray: selectedTimeFrameArray,
            cssDegree: cssDegree,
            votePrice: votePrice,
            setHideButton,
            setpopUpOpen,
            vote
          }}
        />
      </div>
      <div className="mb-3 mt-4 pt-2">
        {/* <YourVote>{translate("Place your vote")}</YourVote> */}
      </div>
      {/* @ts-ignore */}
      {/* <Rectangle2620 className="" style={{border:coin2===undefined? (vote.direction?(vote.valueVotingTime <Number(vote.valueVotingTime) + (Number(vote.valueVotingTime) * 1 / 100) && vote.valueVotingTime >Number(vote.valueVotingTime) - (Number(vote.valueVotingTime) * 1 / 100) && !vote.score?'1px solid #218b17':(vote.valueVotingTime <coin1.price?'1px solid #07501a':'1px solid ##7afd67')):(vote.valueVotingTime <Number(vote.valueVotingTime) + (Number(vote.valueVotingTime) * 1 / 100) && vote.valueVotingTime >Number(vote.valueVotingTime) - (Number(vote.valueVotingTime) * 1 / 100) && !vote.score?'1px solid #218b17':(vote.valueVotingTime >coin1.price?'1px solid #07501a':'1px solid ##7afd67'))):(vote.direction?(Math.abs((coin1.price / vote?.valueVotingTime[0]) - (coin2.price / vote?.valueVotingTime[1]))  <= 1 && !vote?.score?'1px solid #218b17':((coin1.price / vote?.valueVotingTime[0]) > (coin2.price / vote?.valueVotingTime[1])  &&!vote?.score?'1px solid #07501a':'1px solid ##7afd67')):(Math.abs((coin1.price / vote?.valueVotingTime[0]) - (coin2.price / vote?.valueVotingTime[1]))  <= 1 && !vote?.score?'1px solid #218b17':((coin1.price / vote?.valueVotingTime[0]) < (coin2.price / vote?.valueVotingTime[1])  &&!vote?.score?'1px solid #07501a':'1px solid ##7afd67')))}}>     */}
      {/* <YourVote className="mb-2">Your vote</YourVote> */}
      <Rectangle2620 className="pb-3" style={{ border: `1px solid ${borderColor}`, }}>
        <div className="d-flex justify-content-center w-100 text-dark">
          <div className="w-100 px-3">
            <div className="d-flex justify-content-center">
              <div className={`d-flex w-50 ${symbol2 ? 'align-items-end' : 'align-items-center'} flex-column pt-3`}>
                <div className="text-center d-flex flex-column justify-content-center align-items-center" >
                  <Image
                    src={process.env.PUBLIC_URL + `/images/logos/${symbol1.toUpperCase()}.svg`}
                    style={{ width: '2.5em', height: '2.5em' }}
                  />
                  <div>
                    <strong>{coins[symbol1]?.name}</strong>
                  </div>
                  <div>{symbol1}</div>
                </div>
              </div>

              {symbol2 &&
                <>
                  <div className="d-flex align-items-center justify-content-center px-3">
                    <div style={{ height: '97px', width: '19px' }}>
                      <Line />
                    </div>
                  </div>
                  <div className="d-flex w-50 justify-content-center align-items-start flex-column">
                    <div className="text-center d-flex flex-column justify-content-center align-items-center" >
                      <Image
                        src={process.env.PUBLIC_URL + `/images/logos/${symbol2.toUpperCase()}.svg`}
                        style={{ width: '2.5em', height: '2.5em' }}
                      />
                      <div>
                        <strong>{coins[symbol2]?.name}</strong>
                      </div>
                      <div>{symbol2}</div>
                    </div>
                  </div>
                </>}
            </div>


            <div className="d-flex justify-content-center">
              <p style={{ color: "#2D2C3C" }} className="poppins-normal-blackcurrant-14px mx-2 "> {row3} VOTE</p>
            </div>
            <div className="mb-2">
              <YourVote>YOUR CURRENT VOTE IMPACT</YourVote>

            </div>

            <RangeSilder
              vote={vote}
              coins={coins}
              symbol1={symbol1}
              symbol2={symbol2}
            />
            <div className="mb-1" style={{ marginTop: window.screen.width < 370 ? '-8em' : (window.screen.width < 576 ? '-6.5em' : '-4.3em'), }} /* style={{ marginTop: '-3em', height: '4em', paddingLeft: '10px' }} */>
              <MyCountdown setCalcPer={setCalcPer} expirationTime={expirationTime} vote={vote} voteId={voteId} coins={coins} symbol1={symbol1} symbol2={symbol2} openPopup={setpopUpOpen} />
            </div>
            {symbol2 ?
              <div className={`container pt-2`}>
                <div style={{ fontWeight: 'bolder', fontSize: (window.screen.width > 576 ? '1.3em' : (window.screen.width < 370 ? '0.8' : '1em')) }}>
                  Current change between the coins
                </div>
                <div className="d-flex align-items-center justify-content-center" style={{
                  fontSize: '1.7em',
                  color: getPairResultColor(parseFloat(pairCoinResult?.firstCoin), parseFloat(pairCoinResult?.secondCoin), vote?.direction),
                }}>
                  {`${pairCoinResult?.difference.replaceAll('-', '')}%`}
                </div>
                <div className="row justify-content-center align-items-center">
                  <Row1 style={{ textAlign: 'center', fontSize: window.screen.width <= 400 ? '1em' : '1.1em' }}>{"You voted for "}{voted}</Row1>
                </div>
              </div> :
              <>
                <div className="container mt-3">
                  <div style={{ fontWeight: 'bolder', fontSize: (window.screen.width > 576 ? '1.3em' : (window.screen.width < 370 ? '0.8' : '1em')) }}>
                    Current {symbol1} value
                  </div>
                  <div className="d-flex align-items-center justify-content-center" style={{
                    fontSize: '1.7em',
                    color: getSingleCoinPriceColor(parseFloat(row2.replaceAll('$', '').replaceAll(',', '')), parseFloat(voteEndCoinPrice?.[`${vote.coin}_${vote?.timeframe?.seconds}`]?.coin1 || '0.00'), vote?.direction),
                  }}>
                    ${voteEndCoinPrice?.[`${vote.coin}_${vote?.timeframe?.seconds}`]?.coin1 || 0.00}
                  </div>
                </div>
                <BitcoinBTCBULL24H3864490
                  className={`d-flex justify-content-center`}

                >
                  <Row1 className="poppins-normal-blackcurrant-14px" style={{ fontSize: window.screen.width < 400 ? '1em' : '1.1em', }}>You voted for&nbsp;</Row1>
                  {window.screen.width < 330 && <br />}
                  <Row1 className="poppins-normal-blue-violet-14px-2 " style={{ fontSize: window.screen.width < 400 ? '1em' : '1.1em' }}>
                    {row1}  {row2}
                  </Row1>
                </BitcoinBTCBULL24H3864490>
              </>
            }


            <ID13020221942>
              {vote.voteId} {moment(vote.voteTime).format("DD/MM/YYYY HH:mm")}
            </ID13020221942>
          </div>
        </div>
      </Rectangle2620 >
    </>
  );
};

export default VotedCard;

let getresultFlag: any;
const getPriceCalculation = httpsCallable(functions, "getOldAndCurrentPriceAndMakeCalculation");

export const MyCountdown = ({ expirationTime, vote, voteId, coins, symbol1, symbol2, openPopup, setLastTenSec, setCalcPer }:
  {
    expirationTime: number, vote?: any, voteId?: any
    coins?: any, symbol1?: any, symbol2?: any, openPopup?: any, setLastTenSec?: any,
    setCalcPer?: React.Dispatch<React.SetStateAction<boolean>>
  }) => {


  useEffect(() => {
    getresultFlag = true

    return () => {
      getresultFlag = true
    }
  }, [])

  // const [coin1, coin2] = [
  //   coins[symbol1]?.symbol.toLowerCase() || "",
  //   coins[symbol2]?.symbol.toLowerCase() || "",
  // ];
  const TenSec = expirationTime - (expirationTime - 10000)
  // console.log(TenSec ,"TenSec")
  // if (expirationTime == TenSec) {

  // }
  const coin1 = `${coins && symbol1 ? coins[symbol1]?.symbol?.toLowerCase() || "" : ""}`
  const coin2 = `${coins && symbol2 ? coins[symbol2]?.symbol?.toLowerCase() || "" : ""}`

  const checkprice = async () => {
    // if (!getresultFlag) return
    // getresultFlag = false;
    // console.log('price called')
    // const data = await getPriceCalculation({
    //   coin1: `${coin1 != "" ? coin1 + "usdt" : ""}`,
    //   coin2: `${coin2 != "" ? coin2 + "usdt" : ""}`,
    //   voteId: voteId,
    //   voteTime: vote?.voteTime,
    //   valueVotingTime: vote?.valueVotingTime,
    //   expiration: vote?.expiration,
    //   timestamp: Date.now(),
    //   userId: vote?.userId
    // }).then((data) => {
    //   if (data.data == null) {

    //     // getVotes(index).then(void 0);
    //     // openPopup(true)

    //   }
    // }).catch(err => {
    //   if (err && err.message) {
    //     console.log(err.message);
    //   }
    // });

  }
  const completedVotes = useContext(CompletedVotesContext);

  return (
    // @ts-ignore
    <Countdown
      date={new Date(expirationTime)}
      renderer={({ hours, minutes, seconds, completed }) => {
        if (hours == 0 && minutes == 0 && seconds > 0 && seconds < 11 && setLastTenSec instanceof Function) {
          setLastTenSec(true);
        }
        if (completed) {
          if (vote && !vote?.success) {
            checkprice()
          }
          if (setCalcPer) {
            setCalcPer(false);
          }
          // return data;
          return (
            <div
              style={{
                // border: "1px solid red",
                padding: "0em 0em 4em 0em",
                height: "1.4em"
              }}
            >
              <span className="loading" style={{ color: "#7767f7", wordBreak: 'break-all', paddingTop: '1em', paddingLeft: '10px', zIndex: "2220px", fontSize: '1.5em' }}>
                {texts.waitForIt}
              </span>
            </div>
          );
        } else {
          return (
            <div className="" style={{ color: '#6352e8', fontSize: '30px', fontWeight: 400, }}>
              {hours < 1 ? null : `${hours} :`}
              {minutes < 10 ? `0${minutes}` : minutes}:
              {seconds < 10 ? `0${seconds}` : seconds}
            </div>
          );
        }
      }}
    />
  );
};
