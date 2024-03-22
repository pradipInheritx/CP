//@ts-nocheck
import React, { useContext, useEffect, useState } from "react";
import { render } from "react-dom";

// Import react-circular-progressbar module and styles
import {
    CircularProgressbar,
    CircularProgressbarWithChildren,
    buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import giftIcon from "../../assets/images/gift-icon-head.png"

// Animation
import { easeQuadInOut, easeQuadIn } from "d3-ease";
import AnimatedProgressProvider from "./AnimatedProgressProvider";
import { useWindowSize } from "../../hooks/useWindowSize";
import UserContext from "Contexts/User";
import { CurrentCMPContext, CurrentCMPDispatchContext } from "Contexts/CurrentCMP";
import styled from "styled-components";

export const TotalCmpDiv = styled.div`
  background: red;
  color: white;
  border-radius:50%;
  width:11px;  
  height:11px;  
  font-size:7px;
  position:absolute;
  right:7px;
  top:9px;
  z-index:1000;
`;
export const AnimationTotalCmpDiv = styled.div`
background: red;
color: white;
border-radius:50%;
width:14px;  
height:14px;  
font-size:8px;
position:absolute;
right:-4px;
line-height: 15px;
top:-5px;
z-index:1000;
`;
const HeaderProgressbar = ({ percentage, remainingReward }) => {
    const { width: w = 0 } = useWindowSize();
    const [progressBarValue, setProgressBarValue] = useState(0);
    const [startValue, setStartValue] = useState(false);
    const { user, userInfo } = useContext(UserContext);
    const currentCMP = useContext(CurrentCMPContext);
    const setCurrentCMP = useContext(CurrentCMPDispatchContext);
    // console.log(userInfo?.voteStatistics?.score, currentCMP, userInfo?.rewardStatistics?.total, userInfo?.rewardStatistics?.claimed, 'startValue');    
    useEffect(() => {
        let newScore = localStorage.getItem(`${user?.uid}_newScores`) || '0'
        if (progressBarValue != '0' && newScore != '0') {
            let prevScore = (userInfo?.voteStatistics?.score - newScore) % 100
            // console.log(progressBarValue, prevScore,"allCmp1234")
            // let prevScore = (((userInfo?.voteStatistics?.score - newScore) % 100) + newScore) - newScore < 0 ? 0 : ((userInfo?.voteStatistics?.score - newScore) % 100)        

            setStartValue((prevScore <= 0 || percentage == 100 ? 0 : prevScore));
            const time = setTimeout(() => {
                localStorage.setItem(`${user?.uid}_newScores`, 0);
                setCurrentCMP(0);
            }, [5000]);
        }
    }, [progressBarValue]);
    useEffect(() => {
        // setProgressBarValue(0);
        const time = setTimeout(() => {
            setProgressBarValue(percentage);
        }, [800]);
    }, [percentage]);
    const [animateBox, setAnimateBox] = useState(false);
    const [calledCount, setCalledCount] = useState(0);
    useEffect(() => {
        if (calledCount) {
            setAnimateBox(true);
            setTimeout(() => {
                setAnimateBox(false);
            }, 5000)
        }
        setCalledCount((prev) => prev + 1)
    }, [percentage])
    // currentScore=localStorage.getItem('')
    return (
        <div style={{
            width: w > 767 ? "55px" : "45px", height: w > 767 ? "55px" : "45px",
        }}
        >

            {/* {(startValue !== false && localStorage.getItem(`${user?.uid}_newScores`) != '0') ?
                    <AnimatedProgressProvider
                        valueStart={startValue}
                        valueEnd={progressBarValue}
                        duration={4}
                        easingFunction={easeQuadIn}
                    >
                        {(value) => {
                        const roundedValue = parseFloat(value.toFixed(3));                        
                            return (
                                <>
                                    <div                                        
                                    >
                                        <CircularProgressbarWithChildren
                                            value={roundedValue < 0 ? 0 : roundedValue }
                                            background={true}
                                            strokeWidth={8}
                                            styles={buildStyles({
                                                pathColor: "#6352e8",
                                                pathTransition: "none",
                                                strokeLinecap: "butt",
                                                trailColor: ('white'),
                                                backgroundColor: "white",
                                            })}
                                        >
                                            <img src={giftIcon} alt='' className="gift-icon" width="20px" />                                            
                                        </CircularProgressbarWithChildren>
                                    </div>
                                </>
                            );
                        }}
                </AnimatedProgressProvider>
                : */}
            <div
            >
                <CircularProgressbarWithChildren
                    value={(percentage) < 0 ? 0 : (percentage)}
                    background={true}
                    strokeWidth={8}
                    styles={buildStyles({
                        pathColor: "#6352e8",
                        pathTransition: "none",
                        strokeLinecap: "butt",
                        trailColor: ('white'),
                        backgroundColor: "white",
                    })}
                >
                    <div
                        style={{
                            width: w > 767 ? "47px" : "38px", height: w > 767 ? "47px" : "38px",
                            border: "1px solid #160133",
                            borderRadius: "50%",
                        }}
                    >
                        {
                            !animateBox ?
                                <>
                                    {remainingReward > 0 && <TotalCmpDiv>
                                        <span>{remainingReward}</span>
                                    </TotalCmpDiv>}
                                    <img src={giftIcon} alt='' className="gift-icon" width="20px" />
                                </>
                                :
                                <>
                                    
                                     <div className="gift_animation-css">
                                     {remainingReward > 0 &&<AnimationTotalCmpDiv>
                                        <span>{remainingReward}</span>
                                    </AnimationTotalCmpDiv>}
                                        <img src={giftIcon} alt='' className="gift-icon-css " width="20px" />
                                    </div>
                                </>
                        }
                    </div>
                </CircularProgressbarWithChildren>
            </div>
            {/* } */}
            {/* </CircularProgressbarWithChildren> */}
        </div >
    );
};

export default HeaderProgressbar;
