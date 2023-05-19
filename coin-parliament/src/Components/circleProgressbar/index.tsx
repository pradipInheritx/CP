//@ts-nocheck
import React from "react";
import { render } from "react-dom";

// Import react-circular-progressbar module and styles
import {
    CircularProgressbar,
    CircularProgressbarWithChildren,
    buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// Animation
import { easeQuadInOut } from "d3-ease";
import AnimatedProgressProvider from "./AnimatedProgressProvider";
const CircularProgress = ({ percentage }) => {

    return (
        <div style={{ width: "100%" }}>
            <AnimatedProgressProvider
                valueStart={0}
                valueEnd={percentage}
                duration={2}
                easingFunction={easeQuadInOut}
            >
                {(value) => {
                    const roundedValue = Math.round(value);
                    return (
                        <>
                            <CircularProgressbarWithChildren
                                value={100}
                                strokeWidth={1}
                                styles={buildStyles({
                                    pathColor: "#fff",
                                    pathTransition: "none",
                                    strokeLinecap: "butt",
                                    trailColor: "transparent"
                                })}
                            >
                                <div style={{ width: "98%" }}>
                                    <CircularProgressbarWithChildren
                                        value={70}
                                        styles={buildStyles({
                                            pathColor: "#6352e8",
                                            pathTransition: "none",
                                            strokeLinecap: "butt",
                                            trailColor: "transparent"
                                        })}
                                    >
                                        <span style={{ color: "var(--white)", fontSize: '20px' }}>{roundedValue}/100</span>
                                        <span style={{ color: "var(--blue-violet)", fontSize: '20px' }}>CMP</span>

                                    </CircularProgressbarWithChildren>
                                </div>
                            </CircularProgressbarWithChildren>
                        </>
                    );
                }}
            </AnimatedProgressProvider>
        </div>
    );
};

export default CircularProgress;
