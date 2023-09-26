//@ts-nocheck
import React, { useEffect, useState } from "react";
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
const CircularProgress = ({ percentage }) => {
    const { width: w = 0 } = useWindowSize();
    const [progressBarValue, setProgressBarValue] = useState(0);
    useEffect(() => {
        setProgressBarValue(0);
        const time = setTimeout(() => {
            setProgressBarValue(percentage);
        }, [800]);
    }, [percentage])
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
                <AnimatedProgressProvider
                    valueStart={0}
                    valueEnd={progressBarValue}
                    duration={progressBarValue > 5 ? 4 : 0}
                    easingFunction={easeQuadIn}
                >
                    {(value) => {
                        const roundedValue = parseFloat(value.toFixed(2));
                        return (
                            <>
                                <div>
                                    <CircularProgressbarWithChildren
                                        value={roundedValue}
                                        strokeWidth={w > 767 ? 11 : 13}
                                        styles={buildStyles({
                                            pathColor: "#6352e8",
                                            pathTransition: value === 0 ? "none" : "stroke-dashoffset 0.5s ease 0s",
                                            strokeLinecap: "butt",
                                            trailColor: (w > 767 ? "transparent" : '#160133')
                                        })}
                                    >
                                        <span style={{ color: w > 767 ? "var(--white)" : "var(--black)", fontSize: (w > 767 ? '20px' : '16px') }}>{roundedValue}/100</span>
                                        <span style={{ color: w > 767 ? "var(--blue-violet)" : "var(--blue-violet)", fontSize: (w > 767 ? '20px' : '16px') }}>CMP</span>

                                    </CircularProgressbarWithChildren>
                                </div>
                            </>
                        );
                    }}
                </AnimatedProgressProvider>
            </CircularProgressbarWithChildren>
        </div >
    );
};

export default CircularProgress;
