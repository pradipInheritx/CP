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
const HeaderProgressbar = ({ percentage }) => {
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
                        <img src={giftIcon} alt='' className="gift-icon" width="20px" />                        
                        </CircularProgressbarWithChildren>
                    </div>
                {/* } */}
            {/* </CircularProgressbarWithChildren> */}
        </div >
    );
};

export default HeaderProgressbar;
