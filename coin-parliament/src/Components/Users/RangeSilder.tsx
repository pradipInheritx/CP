import React, { useContext, useEffect, useState } from 'react'
import { Coin } from "../../common/models/Coin";
import { VoteResultProps } from "../../common/models/Vote";
import "./styles.css";
import CoinsContext from '../../Contexts/CoinsContext';
import { decimal } from '../Profile/utils';



function RangeSilder(
  {
    lastTenSec,
    vote,
    coins,
    symbol1,
    symbol2
  }: {
    lastTenSec?: any
    vote: VoteResultProps;
    coins: { [symbol: string]: Coin };
    symbol1: string;
    symbol2: string;
  }) {
  const [persentValue, setPersentValue] = useState<any>(0)
  const { allCoinsSetting } = useContext(CoinsContext)
  const [priceRange, setPriceRange] = useState(0.0015)
  const [randomDecimal, setRandomDecimal] = useState(0)
  const getBorderColor = () => {
    if (symbol2 !== undefined) {
      // range bar for pair
      let bothLivePrice = [coins[symbol1]?.price, coins[symbol2]?.price];
      if (!vote?.valueVotingTime) {
        setPersentValue(50)
        return false
      }
      let bothCurrentPrice = Array.isArray(vote?.valueVotingTime) ? [...vote?.valueVotingTime] : [0, 0]
      const newPairPrice = [(bothLivePrice[0] * decimal[symbol1].multiply - bothCurrentPrice[0] * decimal[symbol1].multiply) / priceRange, (bothLivePrice[1] * decimal[symbol2].multiply - bothCurrentPrice[1] * decimal[symbol2].multiply) / priceRange]
      const diffPer = [bothLivePrice[0] - bothCurrentPrice[0], bothLivePrice[1] - bothCurrentPrice[1]]
      const getPer = [(diffPer[0] * 1000) / bothCurrentPrice[0] + priceRange, (diffPer[1] * 1000) / bothCurrentPrice[1] + priceRange]

      let diff = [
        bothCurrentPrice[0] / bothLivePrice[0],
        bothCurrentPrice[1] / bothLivePrice[1],
      ];

      let winner = diff[0] < diff[1] ? 1 : 0;
      const averageValue = Math.abs(diff[0] - diff[1]) * 100;

      if ((averageValue == averageValue)) {

        setPersentValue(vote?.direction == 1 ? 50 - (newPairPrice[0] - newPairPrice[1]) : 50 + (newPairPrice[0] - newPairPrice[1]))
      } else {
        if (vote?.direction == 1) {
          winner == vote?.direction
            ?
            setPersentValue(25 + getPer[1] > 0 ? 25 + getPer[1] : 0)
            :
            setPersentValue(75 + getPer[1] > 100 ? 100 : 75 + getPer[1])

        } else if (vote?.direction == 0) {
          winner != vote?.direction
            ?
            setPersentValue(25 + getPer[0] > 0 ? 25 + getPer[0] : 0)
            :
            setPersentValue(75 + getPer[0] > 100 ? 100 : 75 + getPer[0])

        }
      }
    } else if (symbol2 == undefined) {
      // range bar for single coin
      if (!vote?.valueVotingTime) {
        setPersentValue(50)
        return false
      }
      console.log('decimal1',randomDecimal)
      

      const newPrice = ((Number(coins[symbol1]?.price) * decimal[symbol1].multiply) - (Number(vote?.valueVotingTime) * decimal[symbol1].multiply) + randomDecimal) / priceRange

        if (vote?.direction == 0) setPersentValue(50 + newPrice);
        else setPersentValue(50 - newPrice);

    }
  };


  useEffect(() => {
    getBorderColor()
  }, [coins[symbol1]?.price, coins[symbol2]?.price, vote?.valueVotingTime,randomDecimal])
  useEffect(() => {
    if(symbol1?.includes('BTC') || symbol1?.includes('ETH')) return
    const randomDecimalInterval = setInterval(function () { setRandomDecimal(prev => Math.random() > 0.5 ? prev + 1 : prev - 1) }, 1000);
    return () => {
      clearInterval(randomDecimalInterval)
    }
  }, [])
 console.log('decimal',randomDecimal)
  useEffect(() => {
    if (!symbol1) return
    setPriceRange(allCoinsSetting?.find((item: any) => item?.symbol == symbol1)?.voteBarRange[`${vote?.timeframe?.index}`])
  }, [symbol1, allCoinsSetting, vote?.voteTime])



  return (
    <div >
     
      <div className="d-flex justify-content-around w-100 range">
       
        <div className='grow' aria-hidden='true' ></div>

        <input id="silder" type="range" min={0} max={100} value={persentValue} className={`${lastTenSec == true ? "rengeInput123 " : "rengeInput "} w-100`} >

        </input>
      </div>
      <div className="d-flex justify-content-between mt-2"
        style={{ color: "black" }}
      >
        <span>LOW</span>
        <span>MID</span>
        <span>HIGH</span>
      </div>
    </div>
  )
}

export default RangeSilder