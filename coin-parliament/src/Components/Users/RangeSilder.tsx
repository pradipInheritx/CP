

import React, { useEffect, useState } from "react";
// import cc from "classcat";
import { useGauge } from "use-gauge";
import { motion, MotionConfig } from "framer-motion";
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
          margin:50px 0;
        }
        .gauge {
          width: 430px;
          height: 205px;
          margin: 0 auto;
        }
        .textbox {
          position: absolute;
          height: 205px;
          width: 430px;
          left: 0;
          right: 0;
          margin: 0 auto;
          z-index: 999;
        }
        .span {
          position: absolute;
          text-transform: uppercase;
          color:#000;
          transition: all .3s;
        }
        .low {
          bottom: 50%;
          left: 7%;
          transform: rotate(-61deg);
        }
        .mid {
          left: 50%;
          top: -10%;
          transform: translateX(-50%);
        }
        .high {
          right: 6%;
          bottom: 50%;
          transform: rotate(59deg);
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
      <div className="textbox">
        <span className={value<40?"span low select":"span low"}>low</span>
        <span className={value>40 && value<60?"span mid select":"span mid"}>mid</span>
        <span className={value>60?"span high select":"span high"}>high</span>
      </div>
      <div className="gauge">
        <svg className="w-full overflow-visible p-4" {...gauge.getSVGProps()}>
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
          <g id="needle">
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
            <motion.polyline  className="fill-gray-700" points={needle.points} />
           
          </g>
        </svg>
      </div>
    </>
  );
}

export default function SpeedTest() {
  // const { value } = useSpeedTest();
  const [value,setValue]=useState(50)
  useEffect(() => {
    setInterval(function () {

      setValue((prev:any)=>{
        return Math.random()<0.5?prev+1:prev-1
      })
    }, 100);
  }, [])
  return (
    <MotionConfig transition={{ type: "tween", ease: "linear" }}>
      <Speed value={value} />
    </MotionConfig>
  );
}
