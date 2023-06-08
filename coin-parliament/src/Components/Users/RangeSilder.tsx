import React, { useEffect, useState, useContext, useRef, useReducer } from "react";
import color from 'color';
// import cc from "classcat";
import { useGauge } from "use-gauge";
import { motion, MotionConfig } from "framer-motion";
import { Coin } from "../../common/models/Coin";
import { VoteResultProps } from "../../common/models/Vote";
import CoinsContext from "../../Contexts/CoinsContext";
import { decimal } from "../Profile/utils";
import { VoteDispatchContext } from "Contexts/VoteProvider";
// import * as Motion from 'framer-motion';
// const { motion, MotionConfig }= Motion



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
  const needleAnimatePoint = useRef(needle.points)
  useEffect(() => {

    if (!needle.points.toString().includes('e')) needleAnimatePoint.current = needle.points
    console.log('needle points', value, needle.points.toString().includes('e'), needle.points)
  }, [value])
  // 1.4695761589768238e-15
  // 6.000000000000002,-10.392304845413264 174.2050807568878,98.26794919243098 172.2050807568878,101.73205080756874 -5.999999999999997,10.392304845413264
  //-12,1.4695761589768238e-15 -2.000000000000037,-200 1.9999999999999634,-200 12,0
  // -11.992689924229149,-0.4187939604300108 4.981117686462064,-199.94796439722415 8.978680994538447,-199.80836641041412 11.992689924229149,0.4187939604300116


  return (
    <>
      <style>
        {`
        // body {
        //   font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; 
        //   background-color: #fff;
        //   // margin:50px 0;
        // }
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
          z-index: 2;
        }
        .span {
          position: absolute;
          text-transform: uppercase;
          color:#fff;
          transition: all .3s;
        }
        .low {
          // top:50%;          
          // left: 14.5%;          
          transform: rotate(275deg);          
        }
        .mid {
          // left: 51%;
          top: 0%;
          transform: translateX(-50%);
        }
        .high {
          // top:51%;          
          // right: 13.5%;          
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
          <span className={value < 40 ? "span low select" : "span low"}
            style={{
              top: window.screen.width > 767 ? "50%" : "43%",
              left: window.screen.width > 767 ? "14.5%" : "14.5%"
            }}
          >low</span>
          <span className={value >= 40 && value <= 60 ? "span mid select" : "span mid"}
            style={{
              top: window.screen.width > 767 ? "0.5%" : "1.5%",
              left: window.screen.width > 767 ? "51%" : "51%"
            }}
          >mid</span>
          <span className={value > 60 ? "span high select" : "span high"}
            style={{
              top: window.screen.width > 767 ? "51%" : "43%",
              right: window.screen.width > 767 ? "13.5%" : "14.5%",


            }}
          >high</span>
        </div>
        <div className="gauge">
          <svg className="w-full overflow-visible p-4 SvgCss" {...gauge.getSVGProps()}
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
                          // className="stroke-gray-100"
                          strokeWidth={2}
                          stroke={"#fff"}
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
            <g id="needle" fill="#2d2966">
              <motion.circle
                animate={{
                  cx: needle.base.cx,
                  cy: needle.base.cy
                }}
                r={2}
              />
              <motion.circle
                animate={{
                  cx: needle.base.cx,
                  cy: needle.base.cy
                }}
                r={15}
              />
              <motion.line
                stroke="#2d2966"
                strokeWidth={4}

                animate={{ x1: needle.base.cx, x2: needle.tip.cx, y1: needle.base.cy, y2: needle.tip.cy }}
              />
            </g>
            {/* <g id="needle" fill={"#2d2966"}>
              <motion.circle
                animate={{
                  cx: needle.base.cx,
                  cy: needle.base.cy
                }}
                r={2}
              />
              <motion.circle
                animate={{
                  cx: needle.base.cx,
                  cy: needle.base.cy
                }}
                r={15}
              />
              <motion.polyline className="fill-gray-700" animate={{
                points: needle.points
              }} />
            </g> */}
          </svg>
        </div>
      </div>
    </>
  );
}

export default function SpeedTest(
  {
    // lastTenSec,
    vote,
    coins,
    symbol1,
    symbol2
  }: {
    // lastTenSec?: any
    vote: VoteResultProps;
    coins: { [symbol: string]: Coin };
    symbol1: string;
    symbol2: string;
  }
) {
  // const { value } = useSpeedTest();

  const [persentValue, setPersentValue] = useReducer((state: number, action: number) => {
    if (action > 100) {
      return 100;
    }
    return action < 0 ? 0 : action;
  }, 50)
  const { allCoinsSetting } = useContext(CoinsContext)
  const [priceRange, setPriceRange] = useState(1);
  // const { value } = useSpeedTest(priceRange);
  // const [randomDecimal, setRandomDecimal] = useState(0)
  const setVoteDetails = useContext(VoteDispatchContext);
  useEffect(() => {
    setVoteDetails((prev) => {
      let voteImpact: number = (persentValue < 40 ? 0 :
        (persentValue >= 40 && persentValue <= 60 ? 2 : 1)
      )
      return {
        ...prev, voteImpact: {
          timeFrame: prev?.voteImpact?.timeFrame,
          impact: voteImpact
        }
      }
    })
  }, [persentValue]);
  const getBorderColor = () => {
    if (vote?.expiration < new Date().getTime()) {
      return;
    }

    if (symbol2 !== undefined) {
      // range bar for pair
      let bothLivePrice = [coins[symbol1]?.price, coins[symbol2]?.price];
      if (!vote?.valueVotingTime) {
        setPersentValue(50)
        return false
      }
      let bothCurrentPrice = Array.isArray(vote?.valueVotingTime) ? [...vote?.valueVotingTime] : [0, 0]
      const newPairPrice = [(((bothLivePrice[0] * decimal[symbol1].multiply) + Number(coins[symbol1]?.randomDecimal)) - bothCurrentPrice[0] * decimal[symbol1].multiply) / priceRange, (((bothLivePrice[1] * decimal[symbol2].multiply) + Number(coins[symbol2]?.randomDecimal)) - bothCurrentPrice[1] * decimal[symbol2].multiply) / priceRange]
      const diffPer = [bothLivePrice[0] - bothCurrentPrice[0], bothLivePrice[1] - bothCurrentPrice[1]]
      const getPer = [(diffPer[0] * 1000) / bothCurrentPrice[0] + priceRange, (diffPer[1] * 1000) / bothCurrentPrice[1] + priceRange]

      let diff = [
        bothCurrentPrice[0] / bothLivePrice[0],
        bothCurrentPrice[1] / bothLivePrice[1],
      ];

      let winner = diff[0] < diff[1] ? 1 : 0;
      const averageValue = Math.abs(diff[0] - diff[1]) * 100;

      if ((averageValue == averageValue)) {
        if (50 - (newPairPrice[0] - newPairPrice[1]) < 0) {
          setPersentValue(0)
          return
        }
        if (50 + (newPairPrice[0] - newPairPrice[1]) > 100) {
          setPersentValue(100)
          return
        }
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

      // console.log('newprice',((Number(coins[symbol1]?.price) * decimal[symbol1].multiply)+Number(coins[symbol1]?.randomDecimal)))
      let newPrice = 0;
      if (['BTS', 'ETH'].includes(symbol1)) {
        newPrice = (((Number(coins[symbol1]?.price) * decimal[symbol1].multiply)) - (Number(vote?.valueVotingTime) * decimal[symbol1].multiply)) / priceRange
      } else {
        newPrice = (((Number(coins[symbol1]?.price) * decimal[symbol1].multiply) + Number(coins[symbol1]?.randomDecimal)) - (Number(vote?.valueVotingTime) * decimal[symbol1].multiply)) / priceRange
      }
      if (50 + newPrice > 100) {
        setPersentValue(100);
        return
      }
      if (50 - newPrice < 0) {
        setPersentValue(0);
        return
      }
      if (vote?.direction == 0) setPersentValue(50 + newPrice);
      else setPersentValue(50 - newPrice);

    }
  };


  useEffect(() => {
    getBorderColor()
  }, [coins[symbol1]?.price, coins[symbol2]?.price, vote?.valueVotingTime, coins[symbol1]?.randomDecimal, coins[symbol1]?.randomDecimal])

  useEffect(() => {
    if (!symbol1) return
    setPriceRange(allCoinsSetting?.find((item: any) => item?.symbol == symbol1)?.voteBarRange[`${vote?.timeframe?.index}`])
  }, [symbol1, allCoinsSetting, vote?.voteTime])
  return (
    <MotionConfig transition={{ type: "tween", ease: "linear" }} >
      <Speed value={persentValue || 50} />{/* // low<mid 40-60>high */}
    </MotionConfig>
  );
}
