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

// Animation
import { easeQuadInOut, easeQuadIn } from "d3-ease";
import AnimatedProgressProvider from "./AnimatedProgressProvider";
import { useWindowSize } from "../../hooks/useWindowSize";
import UserContext from "Contexts/User";
import { CurrentCMPContext, CurrentCMPDispatchContext } from "Contexts/CurrentCMP";
const CircularProgress = ({ percentage }) => {
    const { width: w = 0 } = useWindowSize();
    const [progressBarValue, setProgressBarValue] = useState(0);
    const [startValue, setStartValue] = useState(false);
    const { user, userInfo } = useContext(UserContext);
    const currentCMP = useContext(CurrentCMPContext);
    const setCurrentCMP = useContext(CurrentCMPDispatchContext);
    console.log(userInfo?.voteStatistics?.score, currentCMP, userInfo?.rewardStatistics?.total, userInfo?.rewardStatistics?.claimed, 'startValue');
    useEffect(() => {
        let newScore = localStorage.getItem(`${user?.uid}_newScores`) || '0'
        if (progressBarValue && newScore != '0') {
            let prevScore = (userInfo?.voteStatistics?.score - newScore) % 100
            setStartValue((prevScore <= 0 ? 0 : prevScore));
            const time = setTimeout(() => {
                localStorage.setItem(`${user?.uid}_newScores`, 0);
                setCurrentCMP(0);
            }, [5000]);
        }
    }, [progressBarValue]);
    useEffect(() => {
        setProgressBarValue(0);
        const time = setTimeout(() => {
            setProgressBarValue(percentage);
        }, [800]);
    }, [percentage]);

    // currentScore=localStorage.getItem('')
    return (
        <div style={{ width: w > 767 ? "98%" : "52%" }}>
            <CircularProgressbarWithChildren
                value={100}
                strokeWidth={1}
                styles={buildStyles({
                    pathColor: w > 767 ? "#fff" : '#d9d9d9',
                    pathTransition: "none",
                    strokeLinecap: "butt",
                    trailColor: "transparent"
                })}
            >
                {(startValue !== false && localStorage.getItem(`${user?.uid}_newScores`) != '0') ?
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
                                    <div>
                                        <CircularProgressbarWithChildren
                                            value={roundedValue}
                                            strokeWidth={w > 767 ? 11 : 13}
                                            styles={buildStyles({
                                                pathColor: "#6352e8",
                                                pathTransition: 'none',
                                                strokeLinecap: "butt",
                                                trailColor: (w > 767 ? "transparent" : '#160133')
                                            })}
                                        >
                                            <span style={{ color: w > 767 ? "var(--white)" : "var(--black)", fontSize: (w > 767 ? '20px' : '16px') }}>{roundedValue.toFixed(3)}/100</span>
                                            <span style={{ color: w > 767 ? "var(--blue-violet)" : "var(--blue-violet)", fontSize: (w > 767 ? '20px' : '16px') }}>CMP</span>

                                        </CircularProgressbarWithChildren>
                                    </div>
                                </>
                            );
                        }}
                    </AnimatedProgressProvider> : <div>
                        <CircularProgressbarWithChildren
                            value={(percentage - localStorage.getItem(`${user?.uid}_newScores`))}
                            strokeWidth={w > 767 ? 11 : 13}
                            styles={buildStyles({
                                pathColor: "#6352e8",
                                pathTransition: "none",
                                strokeLinecap: "butt",
                                trailColor: (w > 767 ? "transparent" : '#160133')
                            })}
                        >
                            
                            <span style={{ color: w > 767 ? "var(--white)" : "var(--black)", fontSize: (w > 767 ? '20px' : '16px') }}>{(percentage - currentCMP /* localStorage.getItem(`${user?.uid}_newScores`) */).toFixed(3)}/100</span>
                            <span style={{ color: w > 767 ? "var(--blue-violet)" : "var(--blue-violet)", fontSize: (w > 767 ? '20px' : '16px') }}>CMP</span>

                        </CircularProgressbarWithChildren>
                    </div>
                }
            </CircularProgressbarWithChildren>
        </div >
    );
};

export default CircularProgress;
