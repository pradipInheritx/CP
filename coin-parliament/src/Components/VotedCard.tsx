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

const Rectangle2620 = styled.div`
  ${Border1pxBlueViolet};  
  max-width: 345px;
  height: 75px;
  background-color: var(--white);
  border-radius: 38px;
  box-shadow: 0 3px 6px #00000029;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 35px;
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
    var(--font-size-14) / var(--line-spacing-14) var(--font-family-poppins);
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
  
}) => {
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
    row2 = "";
  if (!isEmpty(vote)) {
    let valueVotingTime;
    if (Array.isArray(vote.valueVotingTime)) {
      valueVotingTime = vote.valueVotingTime[Number(vote.direction + "")];
    } else {
      valueVotingTime = vote.valueVotingTime;
    }

    valueVotingTime = Number(Number(valueVotingTime).toFixed(2));
    row1 = coin2
      ? `${votedCoin.symbol} - `
      : `${votedCoin.symbol}`;
      
    row2 = coin2
      ? `${vote.timeframe.name} ${valueVotingTime}`
      : `${voted} - ${vote.timeframe.name} $${valueVotingTime || 'loading'}`;
  }


// console.log(vote,"voteCheck")
  
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
            title: translate("Select voting time frame"),
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
      <Rectangle2620 style={{border:'1px solid #218b17'}}>
     
               
            
        <div className="d-flex justify-content-between w-100">
          <div>
            <BitcoinBTCBULL24H3864490
              className={coin2 ? "flex-row" : "flex-row"}
            >
              <Row1 className="poppins-normal-blackcurrant-14px mx-2">{row1}</Row1>
              <Row2 className="poppins-normal-blue-violet-14px-2">{row2}</Row2>
              
            </BitcoinBTCBULL24H3864490>
            
            <div className="d-flex justify-content-around align-items-center">
              <MyCountdown expirationTime={expirationTime} />
            <Text2 >
            {coin2===undefined && <img  style={{marginLeft:'3px', border:'50%'}} src={process.env.PUBLIC_URL + `/images/icons/highgreen.png`}/>}
              {/* @ts-ignore */}
                {coin2 && <img style={{ marginLeft: '3px', border: '50%' }} src={process.env.PUBLIC_URL + `/images/icons/highgreen.png`} />}
        
         
              </Text2>
              <Text2>
             
            {coin2===undefined &&  <img style={{marginLeft:'3p∂x', border:'2px solid blue',borderRadius:'50%'}}  src={process.env.PUBLIC_URL + `/images/icons/mediumgreen.png`}/>}
             {/* @ts-ignore */}
            {coin2  &&  <img style={{marginLeft:'3px', border:'2px solid blue',borderRadius:'50%'}}  src={process.env.PUBLIC_URL + `/images/icons/mediumgreen.png`}/>}
              
             
              </Text2>
              <Text2>
              {coin2===undefined &&<img style={{marginLeft:'3px', border:'50%'}} src={process.env.PUBLIC_URL + `/images/icons/lightgreen.png`}/>}
           {/* @ts-ignore */}
           {coin2  &&<img style={{marginLeft:'3px', border:'50%' }} src={process.env.PUBLIC_URL + `/images/icons/lightgreen.png`}/>}
            
               
              
              </Text2>
              
            
          </div>
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

export const MyCountdown = ({ expirationTime }: { expirationTime: number }) => {
  
  return (
    // @ts-ignore
    <Countdown
      date={expirationTime}
      renderer={({ hours, minutes, seconds, completed }) => {
        if (completed) {
          return <span>loading...</span>;
        } else {
          return (
            <span style={{color:'#6352e8',fontSize:'17px',fontWeight:400}}>
              {hours < 10 ? `0${hours}` : hours}:
              {minutes < 10 ? `0${minutes}` : minutes}:
              {seconds < 10 ? `0${seconds}` : seconds}
            </span>
          );
        }
      }}
    />
  );
};
