import React, { useEffect, useState, useContext, useRef, useReducer } from "react";
import { useGauge } from "use-gauge";
import { motion, MotionConfig } from "framer-motion";
import { Coin } from "../../common/models/Coin";
import { VoteResultProps } from "../../common/models/Vote";



interface SpeedProps {
  value: number;
  setImpactValue: any
}

function Speed(props: SpeedProps) {
  const { value, setImpactValue } = props;

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
    // console.log('needle points', value, needle.points.toString().includes('e'), needle.points)
  }, [value])
  // 1.4695761589768238e-15
  // 6.000000000000002,-10.392304845413264 174.2050807568878,98.26794919243098 172.2050807568878,101.73205080756874 -5.999999999999997,10.392304845413264
  //-12,1.4695761589768238e-15 -2.000000000000037,-200 1.9999999999999634,-200 12,0
  // -11.992689924229149,-0.4187939604300108 4.981117686462064,-199.94796439722415 8.978680994538447,-199.80836641041412 11.992689924229149,0.4187939604300116

  useEffect(()=>{
    if(value < 40){

      setImpactValue('Low')
    }else if( value >=40 && value <=60){
      setImpactValue('Mid')
    }else{
      setImpactValue('High')
    }
  },[value])


  

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
          display:flex;
          justify-content:center;
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
        .black{
          color:black;
          text-shadow: 1px 1px 2px white, 0 0 1em blue, 0 0 0.2em white;
          font-weight: 600;
        }
        .red{
          color:red;
          text-shadow: -1px 1px 25px rgba(255, 57, 57, 1);
          font-weight: 600;
        }
      `}
      </style>
      <div className="BigDiv">
        <div className="textbox">
          <span className={value < 40 ? "span low red" : "span low"}
            style={{
              top: window.screen.width > 767 ? "50%" : "43%",
              left: window.screen.width > 767 ? "14%" : "17%",
              fontSize: window.screen.width> 767 ? "none": '13px',
            }}
          >low</span>
          <span className={value >= 40 && value <= 60 ? "span mid black" : "span mid"}
            style={{
              top: window.screen.width > 767 ? "2%" : "18%",
              left: window.screen.width > 767 ? "51%" : "51%",
              fontSize: window.screen.width> 767 ? "none": '13px',
            }}
          >mid</span>
          <span className={value > 60 ? "span high select" : "span high"}
            style={{
              top: window.screen.width > 767 ? "51%" : "43%",
              right: window.screen.width > 767 ? "13.8%" : "17%",
              fontSize: window.screen.width> 767 ? "none": '13px',
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
    symbol2,
    voteDirection,
    setImpactValue
  }: {
    // lastTenSec?: any
    vote?: VoteResultProps;
    coins?: any;
    activeTime?:any;
    symbol1?: string;
      symbol2?: string;
      voteDirection?: any;
      setImpactValue?: any
  }
) {
  // const { value } = useSpeedTest();
  // const value = 10;
  const [value, setValue] = useState(1);
  const [currentPrice, setCurrentPrice] = useState<any>(0)
  const prevCountRef = useRef(value)
  // console.log(voteDirection, "voteDirection")
  
  const getCoinValue = () => {
    let tempNewValue = parseFloat(coins) * 100;
    let tempOldValue = prevCountRef.current *100;
    // console.log(tempNewValue - tempOldValue, "tempOldValue")
    if (tempNewValue === tempOldValue) {
      
      setValue(50);
    } else if (voteDirection == 1) {
      const temp = (tempNewValue - tempOldValue);
      setValue(50 + temp);
    }
    else {
      const temp = (tempOldValue - tempNewValue);
      setValue(50 + temp);
    }
    setCurrentPrice(coins)
}

  useEffect(() => {    
    prevCountRef.current = currentPrice;
    getCoinValue()
  }, [coins]);
  

  // console.log(value,"allvalue")
  // useEffect(() => {
  //   const generateRandomNumber = () => {
  //     const min = 1;
  //     const max = 100;
  //     const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  //     // setValue(randomNum);
  //     if (100>value) {
  //     setValue(prev=>prev+1);
        
  //     }
  //   };

  //   // Generate a random number every second
  //   const intervalId = setInterval(generateRandomNumber, 80);

  //   // Clean up the interval when the component unmounts
  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, []);


  const [persentValue, setPersentValue] = useReducer((state: number, action: number) => {
    if (action > 100) {
      return 100;
    }
    return action < 0 ? 0 : action;
  }, 50)

  const setVoteDetails = "";

  useEffect(() => {
    
    // let timer1  = setTimeout(() => setValue(Math.floor((Math.random()*100)+1)), 1000)
   return () => {
        // clearTimeout(timer1);
      };
    
  }, [value])

  return (
    <MotionConfig transition={{ type: "tween", ease: "linear" }} >
      <Speed value={value} setImpactValue={setImpactValue} />{/* // low<mid 40-60>high */}
    </MotionConfig>
  );
}
