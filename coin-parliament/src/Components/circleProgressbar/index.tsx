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
        <div style={{ width: "70%" }}>
            <AnimatedProgressProvider
                valueStart={0}
                valueEnd={percentage}
                duration={2}
                easingFunction={easeQuadInOut}
            >
                {(value) => {
                    const roundedValue = Math.round(value);
                    return (
                        <CircularProgressbarWithChildren
                            value={value}
                            strokeWidth={10}
                            /* This is important to include, because if you're fully managing the
                    animation yourself, you'll want to disable the CSS animation. */
                            styles={buildStyles({
                                pathColor: "#6352e8",
                                pathTransition: "none",
                                strokeLinecap: "butt"
                            })}
                        >
                            <span style={{ color: "var(--white)", fontSize: '20px' }}>{roundedValue}/100</span>
                            <span style={{ color: "var(--blue-violet)", fontSize: '20px' }}>CMP</span>
                        </CircularProgressbarWithChildren>
                    );
                }}
            </AnimatedProgressProvider>
        </div>
    );
};

export default CircularProgress;
