

import React, { useEffect, useState ,useContext} from "react";
// import cc from "classcat";
import { useGauge } from "use-gauge";
import { motion, MotionConfig } from "framer-motion";
import { Coin } from "../../common/models/Coin";
import { VoteResultProps } from "../../common/models/Vote";
import CoinsContext from "../../Contexts/CoinsContext";
import { decimal } from "../Profile/utils";
// import * as Motion from 'framer-motion';
// const { motion, MotionConfig }= Motion
// const useSpeedTest = () => {
//   const [value, setValue] = useState(0);

//   useAnimationFrame((t) => {
//     if (value >= 100) return;
//     setValue((t / 5500) * 100);
//   });

//   return {
//     value: Math.min(value, 100)
//   };
// };

interface SpeedProps {
  value: number;
}

function Speed(props: SpeedProps) {
  const { value } = props;
  const gauge = useGauge({
    domain: [0, 100],
    startAngle: 60,
    endAngle: 300,
    numTicks: 21,
    diameter: 400
  });

  const needle = gauge.getNeedleProps({
    value,
    baseRadius: 12,
    tipRadius: 2
  });

  return (
    <>
      <style>
        {`
        body {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; 
          background-color: #fff;
          // margin:50px 0;
        }
        .BigDiv{          
          position:relative;
        }
        .gauge {
          width: 100%;
          height: 205px;          
        }
        .SvgCss{          
          width:70%;
          height:auto;

        }
        .textbox {
          position: absolute;
           
          height: 100%;
          width: 100%;
          // left: 0;
          // right: 0;
          margin: 0 auto;
          z-index: 999;
        }
        .span {
          position: absolute;
          text-transform: uppercase;
          color:#fff;
          transition: all .3s;
        }
        .low {
          top:50%;          
          left: 14.5%;          
          transform: rotate(275deg);          
        }
        .mid {
          left: 51%;
          top: 0%;
          transform: translateX(-50%);
        }
        .high {
          top:51%;          
          right: 13.5%;          
          transform: rotate(84deg);
        }
        .select {
          color: #5dff6d;
          text-shadow: 0 0px 10px #5dff6d, 0 0px 20px #5dff6d, 0 0px 30px #5dff6d;
          font-weight: 600;
        }
        #arcs path {
          stroke-opacity: 1;
          filter: drop-shadow(0px 0px 4px #aeaeff);
        }
        
      `}
      </style>
      <div className="BigDiv">
      <div className="textbox">
        <span className={value<40?"span low select":"span low"}>low</span>
        <span className={value>40 && value<60?"span mid select":"span mid"}>mid</span>
        <span className={value>60?"span high select":"span high"}>high</span>
      </div>
      <div className="gauge">
        <svg className="w-full overflow-visible p-4 SvgCss" {...gauge.getSVGProps()}
        // viewBox={window.screen.width >767? "0 0 50% 50%":"0 0 50% 50%"}
        >
          <g id="arcs">
            <path
              {...gauge.getArcProps({
                offset: 30,
                startAngle: 60,
                endAngle: 300
              })}
              fill="none"
              // className="stroke-gray-200"
              strokeLinecap="round"
              strokeWidth={50}
              stroke="url(#MyGradient)"
            />
            <linearGradient id="MyGradient">
              <stop offset="5%" stop-color="#8888d7" />
              <stop offset="50%" stop-color="#403b8f" />
              <stop offset="95%" stop-color="#2d2966" />
            </linearGradient>
            <path
              {...gauge.getArcProps({
                offset: 0,
                startAngle: 60,
                endAngle: 300
              })}
              // stroke="url(#MyGradient)"
              strokeLinecap="round"
              fill="none"
              // className="stroke-green-400"
              // strokeLinecap="round"
              strokeWidth={44}
            />
          </g>
          <g id="ticks">
            {gauge.ticks.map((angle) => {
              const asValue = gauge.angleToValue(angle);
              const showText = asValue === 40 || asValue === 60;

              return (
                <React.Fragment key={`tick-group-${angle}`}>
                  {showText && (
                    <>
                      <line
                        className="stroke-gray-100"
                        strokeWidth={2}
                        stroke={"white"}
                        //  style={{height:'100px'}}
                        {...gauge.getTickProps({
                          angle,
                          length: showText ? 60 : 6
                        })}
                      />
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </g>
          <g id="needle" fill={"#2d2966"}>
            <motion.circle
              className="fill-gray-200"
              animate={{
                cx: needle.base.cx,
                cy: needle.base.cy
              }}
              r={12}
            />
            <motion.circle
              className="fill-orange-400"
              animate={{
                cx: needle.base.cx,
                cy: needle.base.cy
              }}
              r={10}
            />
              <motion.polyline className="fill-gray-700" points={needle.points}  />
           
          </g>
        </svg>
        </div>
        </div>
    </>
  );
}

export default function SpeedTest(
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
  }
) {
  // const { value } = useSpeedTest();
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
 
  useEffect(() => {
    if (!symbol1) return
    setPriceRange(allCoinsSetting?.find((item: any) => item?.symbol == symbol1)?.voteBarRange[`${vote?.timeframe?.index}`])
  }, [symbol1, allCoinsSetting, vote?.voteTime])


  // const [value,setValue]=useState(50)
  // useEffect(() => {
  //   setInterval(function () {

  //     setValue((prev:any)=>{
  //       return Math.random()<0.5?prev+1:prev-1
  //     })
  //   }, 100);
  // }, [])
  return (
    <MotionConfig transition={{ type: "tween", ease: "linear" }}>
      <Speed value={persentValue} />
    </MotionConfig>
  );
}
