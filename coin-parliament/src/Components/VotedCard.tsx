import React, { useContext, useEffect, useState } from "react";
import {Direction, VoteResultProps} from "../common/models/Vote";
import Countdown from "react-countdown";
import {Coin} from "../common/models/Coin";
import {useTranslation} from "../common/models/Dictionary";
import styled from "styled-components";
import {
  Border1pxBlueViolet,
  PoppinsNormalBlueViolet14px,
  PoppinsNormalBlueViolet17px,
  PoppinsNormalGunsmoke9px,
} from "../styledMixins";
import moment from "moment";
import {isEmpty} from "lodash";
import SelectTimeframes from "./Coins/SelectTimeframes";
import AppContext from "../Contexts/AppContext";
import RangeSilder from "./Users/RangeSilder";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { texts } from "./LoginComponent/texts";
import { Button, Modal } from "react-bootstrap";
import { handleSoundClick, lastTensecWait } from "../common/utils/SoundClick";



const Rectangle2620 = styled.div`
  ${Border1pxBlueViolet};    
  max-width: ${window.screen.width<767? "345px":"400px"};
  // height: 75px;
  padding:20px 0px;
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
  
}: {
  vote: VoteResultProps;
  coins: { [symbol: string]: Coin };
  symbol1: string;
  symbol2: string;
  voteId: string;
  selectedTimeFrame?:number;
  setSelectedTimeFrame?: (n: number) => void;  
  selectedTimeFrameArray?: any;
  cssDegree?:any;
  votePrice?:any;
  setpopUpOpen?:any
  
  }) => {
  
  const [lastTenSec, setLastTenSec] = useState<any>(false);
  const [borderColor, setBorderColor] = useState<any>("#6352e8");
  const getBorderColor = () => {
    // let PricePer = livePrice / 100;   
     if (symbol2 !== undefined) {
         let bothLivePrice = [coins[symbol1]?.price, coins[symbol2]?.price];
        // @ts-ignore
      let bothCurrentPrice = [...vote?.valueVotingTime];
    //   let bothCurrentPrice = [vote?.valueVotingTime[0],vote?.valueVotingTime[1],];
    let diff = [
        bothCurrentPrice[0] / bothLivePrice[0],
        bothCurrentPrice[1] / bothLivePrice[1],
    ];
       
      let winner = diff[0] < diff[1] ? 1 : 0;
      const averageValue = Math.abs(diff[0] - diff[1]) * 100;
      if ((averageValue <=10)) {        
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
       let livePrice =coins[symbol1]?.price
       let votePrice =Number(vote?.valueVotingTime)
       let PricePer = livePrice;
       if(livePrice < PricePer + 10 &&
         livePrice > PricePer - 10) { 
          setBorderColor(50);
        }
        else{
          if(vote?.direction == 1){
            livePrice < votePrice ?setBorderColor("#3b17b7"):setBorderColor("#d4d0f3");
          }else if(vote?.direction == 0){
            livePrice > votePrice ? setBorderColor("#d4d0f3"):setBorderColor("#3b17b7");
          }
        }     
    }
};
  

  
 useEffect(() => {    
      getBorderColor()    
  }, [coins[symbol1]?.price ,coins[symbol2]?.price])


  useEffect(() => {
    console.log('component mounter vote')
  
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
  if (!coin1) {
    return <></>;
  }
  const expirationTime = vote.expiration || 0;

  const options = symbol2 ? [symbol1, symbol2] : Object.values(Direction);
  const voted = options[vote.direction];
  const votedCoin = coin2 ? coins[voted] : coins[symbol1];


  
  
  let row1 = "",
    row2 = "",
    row3="";
  if (!isEmpty(vote)) {
    let valueVotingTime;
    if (Array.isArray(vote.valueVotingTime)) {
      valueVotingTime = vote.valueVotingTime[Number(vote.direction + "")];
    } else {
      valueVotingTime = vote.valueVotingTime;
    }

    // valueVotingTime = Number(valueVotingTime);
    console.log('votetime',valueVotingTime)
    row1 = coin2
      ? `${votedCoin.symbol} - `
      : `${voted} ${votedCoin.symbol}`;
      
    row2 = coin2
      ? ` $${valueVotingTime}`
      : `  $${valueVotingTime || 'loading'}`;
       
    // row2 = coin2
    //   ? `${vote.timeframe.name} ${valueVotingTime}`
    //   : `${voted} - ${vote.timeframe.name} $${valueVotingTime || 'loading'}`;

    row3=`${vote.timeframe.name}`
  }    
  // console.log('votetime',vote)

  return (
    <>
     <div className="mt-4" style={{paddingLeft:symbol2?'':'24px',paddingRight:symbol2?'':'24px',maxWidth:'450px', margin:'0 auto'}}>
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
            voted:true,
            selectedTimeFrameArray: selectedTimeFrameArray,
            cssDegree:cssDegree,
            votePrice:votePrice,
          }}
        />
      </div>
      <div className="mb-3 mt-4 pt-2">
        {/* <YourVote>{translate("Place your vote")}</YourVote> */}
      </div>
      {/* @ts-ignore */}
      {/* <Rectangle2620 className="" style={{border:coin2===undefined? (vote.direction?(vote.valueVotingTime <Number(vote.valueVotingTime) + (Number(vote.valueVotingTime) * 1 / 100) && vote.valueVotingTime >Number(vote.valueVotingTime) - (Number(vote.valueVotingTime) * 1 / 100) && !vote.score?'1px solid #218b17':(vote.valueVotingTime <coin1.price?'1px solid #07501a':'1px solid ##7afd67')):(vote.valueVotingTime <Number(vote.valueVotingTime) + (Number(vote.valueVotingTime) * 1 / 100) && vote.valueVotingTime >Number(vote.valueVotingTime) - (Number(vote.valueVotingTime) * 1 / 100) && !vote.score?'1px solid #218b17':(vote.valueVotingTime >coin1.price?'1px solid #07501a':'1px solid ##7afd67'))):(vote.direction?(Math.abs((coin1.price / vote?.valueVotingTime[0]) - (coin2.price / vote?.valueVotingTime[1]))  <= 1 && !vote?.score?'1px solid #218b17':((coin1.price / vote?.valueVotingTime[0]) > (coin2.price / vote?.valueVotingTime[1])  &&!vote?.score?'1px solid #07501a':'1px solid ##7afd67')):(Math.abs((coin1.price / vote?.valueVotingTime[0]) - (coin2.price / vote?.valueVotingTime[1]))  <= 1 && !vote?.score?'1px solid #218b17':((coin1.price / vote?.valueVotingTime[0]) < (coin2.price / vote?.valueVotingTime[1])  &&!vote?.score?'1px solid #07501a':'1px solid ##7afd67')))}}>     */}
      <YourVote className="mb-2">Your vote</YourVote> 
      <Rectangle2620 className="" style={{border:`1px solid ${borderColor}`}}>    
        <div className="d-flex justify-content-center w-100">
          <div className="w-100 px-3">
            <div className="d-flex justify-content-center mb-1">
              <p style={{color:"#2D2C3C"}} className="poppins-normal-blackcurrant-14px mx-2 "> {row3} VOTE </p>
            </div>
            <div className="my-2">
            <YourVote>YOUR CURRENT VOTE IMPACT</YourVote> 
             
            </div>            
            <div>
              <RangeSilder
              //  lastTenSec={lastTenSec}
               vote={vote}
               coins={coins}
               symbol1={symbol1}
               symbol2={symbol2}
              />
            </div>
            <div className="my-2">
              <MyCountdown expirationTime={expirationTime} vote={vote} voteId={voteId} coins={coins} symbol1={symbol1} symbol2={symbol2} openPopup={setpopUpOpen} 
                setLastTenSec={setLastTenSec}
              />
            </div>
            <BitcoinBTCBULL24H3864490
              className={`${coin2 ? "flex-row" : "flex-row"} d-flex justify-content-center`}
            >
              {/* <Row1 className="poppins-normal-blackcurrant-14px mx-2"> You voted for { row1}</Row1> */}

              
              <Row1 className="poppins-normal-blackcurrant-14px mx-2"> {coin2?"You voted for ":"" }{ row1}</Row1>
              <Row1 className="poppins-normal-blue-violet-14px-2">{row2}</Row1>              
            </BitcoinBTCBULL24H3864490>
            
            
            
            {/* <div className="d-flex align-items-center justify-content-center w-100">
               
                <Text2 >
              {coin2===undefined && <img  style={{marginLeft:'3px', border:vote.direction?(vote.valueVotingTime <coin1.price ?'2px solid blue':''):vote.valueVotingTime >coin1.price?'2px solid blue':'',borderRadius:vote.direction?(vote.valueVotingTime <coin1.price ?'50%':''):vote.valueVotingTime >coin1.price?'50%':''}} src={process.env.PUBLIC_URL + `/images/icons/highgreen.png`}/>}
              
              {coin2 && <img style={{ marginLeft: '3px', border: vote.direction ? ((coin1.price / vote?.valueVotingTime[0]) > (coin2.price / vote?.valueVotingTime[1]) && !vote?.score ? '2px solid blue' : '') : (coin1.price / vote?.valueVotingTime[0]) < (coin2.price / vote?.valueVotingTime[1]) && !vote?.score ? '2px solid blue' : '', borderRadius: vote.direction ? ((coin1.price / vote?.valueVotingTime[0]) > (coin2.price / vote?.valueVotingTime[1]) && !vote?.score ? '50%' : '') : (coin1.price / vote?.valueVotingTime[0]) < (coin2.price / vote?.valueVotingTime[1]) && !vote?.score ? '50%' : '' }} src={process.env.PUBLIC_URL + `/images/icons/highgreen.png`} />}
  
              </Text2>
              <Text2>
             
              {coin2===undefined &&  <img style={{marginLeft:'3px', border:vote.direction?(vote.valueVotingTime <Number(vote.valueVotingTime) + (Number(vote.valueVotingTime) * 1 / 100) && vote.valueVotingTime >Number(vote.valueVotingTime) - (Number(vote.valueVotingTime) * 1 / 100) && !vote.score?'2px solid blue':''): vote.valueVotingTime <Number(vote.valueVotingTime) + (Number(vote.valueVotingTime) * 1 / 100) && vote.valueVotingTime >Number(vote.valueVotingTime) - (Number(vote.valueVotingTime) * 1 / 100) && !vote.score?'2px solid blue':'',borderRadius:vote.direction?(vote.valueVotingTime <Number(vote.valueVotingTime) + (Number(vote.valueVotingTime) * 1 / 100) && vote.valueVotingTime >Number(vote.valueVotingTime) - (Number(vote.valueVotingTime) * 1 / 100) && !vote.score?'50%':''): vote.valueVotingTime <Number(vote.valueVotingTime) + (Number(vote.valueVotingTime) * 1 / 100) && vote.valueVotingTime >Number(vote.valueVotingTime) - (Number(vote.valueVotingTime) * 1 / 100) && !vote.score?'50%':''}}  src={process.env.PUBLIC_URL + `/images/icons/mediumgreen.png`}/>}
              
              {coin2 &&  <img style={{marginLeft:'3px', border:vote.direction?(Math.abs((coin1.price / vote?.valueVotingTime[0]) - (coin2.price / vote?.valueVotingTime[1]))  <= 1 && !vote?.score?'2px solid blue':''): Math.abs((coin1.price / vote?.valueVotingTime[0]) - (coin2.price / vote?.valueVotingTime[1]))  <= 1 && !vote?.score?'2px solid blue':'',borderRadius:vote.direction?(Math.abs((coin1.price / vote?.valueVotingTime[0]) - (coin2.price / vote?.valueVotingTime[1]))  <= 1 && !vote?.score?'50%':''): Math.abs((coin1.price / vote?.valueVotingTime[0]) - (coin2.price / vote?.valueVotingTime[1]))  <= 1 && !vote?.score?'50%':''}}  src={process.env.PUBLIC_URL + `/images/icons/mediumgreen.png`}/>}
              
             
              </Text2>
              <Text2>
              {coin2===undefined &&<img style={{marginLeft:'3px', border:vote.direction?(vote.valueVotingTime > coin1.price && !vote.score?'2px solid blue':''):vote.valueVotingTime<  coin1.price?'2px solid blue':'',borderRadius:vote.direction?(vote.valueVotingTime > coin1.price && !vote.score?'50%':''):vote.valueVotingTime<  coin1.price?'50%':''}} src={process.env.PUBLIC_URL + `/images/icons/lightgreen.png`}/>}
              
              {coin2 &&<img style={{marginLeft:'3px', border:vote.direction?((coin1.price / vote?.valueVotingTime[0]) < (coin2.price / vote?.valueVotingTime[1]) && !vote?.score?'2px solid blue':''):(coin1.price / vote?.valueVotingTime[0]) > (coin2.price / vote?.valueVotingTime[1]) && !vote?.score?'2px solid blue':'',borderRadius:vote.direction?((coin1.price / vote?.valueVotingTime[0]) < (coin2.price / vote?.valueVotingTime[1]) && !vote?.score?'50%':''):(coin1.price / vote?.valueVotingTime[0]) > (coin2.price / vote?.valueVotingTime[1]) && !vote?.score?'50%':''}} src={process.env.PUBLIC_URL + `/images/icons/lightgreen.png`}/>}                                         
              </Text2>
              </div> */}
            <ID13020221942>
              {voteId} - {moment(vote.voteTime).format("MM.DD.YYYY HH:mm")}
            </ID13020221942>
          </div>
          
        </div>
      </Rectangle2620>
    </>
  );
};

export default VotedCard;
let getresultFlag:any;
const getPriceCalculation = httpsCallable(functions, "getOldAndCurrentPriceAndMakeCalculation");

export const MyCountdown = ({expirationTime, vote, voteId, coins,symbol1,symbol2,openPopup,setLastTenSec ,}:
  {
    expirationTime: number, vote?: any, voteId?: any
    coins?: any, symbol1?: any, symbol2?: any, openPopup?: any, setLastTenSec?: any
  
  }) => {


  useEffect(() => {
    getresultFlag=true
  
    return () => {
      getresultFlag=true
    }
  }, [])
  
  // const [coin1, coin2] = [
  //   coins[symbol1]?.symbol.toLowerCase() || "",
  //   coins[symbol2]?.symbol.toLowerCase() || "",
  // ];
  const TenSec = expirationTime - (expirationTime - 10000)
  // console.log(TenSec ,"TenSec")
  // if (expirationTime == TenSec) {
  //   console.log("i am working")
  // }
  const coin1 = `${coins && symbol1? coins[symbol1]?.symbol?.toLowerCase() || "":""}`
  const coin2 = `${coins && symbol2? coins[symbol2]?.symbol?.toLowerCase() || "":""}`
  
  const checkprice = async() => {
    if (!getresultFlag) return
    getresultFlag=false
    console.log('price called')
   const data = await getPriceCalculation({            
        coin1: `${coin1 !="" ? coin1 + "usdt" :"" }`,
        coin2: `${coin2 !="" ? coin2 + "usdt" :"" }`,
        voteId:voteId,
        voteTime:vote?.voteTime,
        valueVotingTime: vote?.valueVotingTime,
        expiration: vote?.expiration,
        timestamp: Date.now()
   }).then((data) => {
     if (data.data == null) {
        // console.log(data.data,"i am working data.data")
        // getVotes(index).then(void 0);
       openPopup(true)
       
      }
    }).catch(err => {
        if (err && err.message) {
            console.log(err.message);
        }        
    });
      
}

  return (
    // @ts-ignore
    <Countdown
      date={expirationTime}
      renderer={({ hours, minutes, seconds, completed }) => {

        // if (expirationTime && hours == 0 && minutes == 0 && seconds > 0 && seconds < 11) {
        //   console.log( hours, minutes, seconds, "i am done")
        //   lastTensecWait()
        // }
        if ( hours == 0 && minutes == 0 && seconds > 0 && seconds < 11 ) {
          setLastTenSec(true)
        }
        if (completed) {
          if (vote && !vote?.sucess) {            
            checkprice()
          }
      // return data;
          return <span style={{color:"#7767f7"}}>{texts.LoadingText}</span>;
        } else {
          return (
            <span className="" style={{color:'#6352e8',fontSize:'20px',fontWeight:400,marginLeft:"10px"}}>
              {hours < 1 ? null : `${hours} :` }
              {minutes < 10 ? `0${minutes}` : minutes}:
              {seconds < 10 ? `0${seconds}` : seconds}
            </span>
          );
        }
      }}
    />
  );
};
