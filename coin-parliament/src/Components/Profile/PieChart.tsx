import React from "react";
import styled, {css} from "styled-components";
import {useWindowSize} from "../../hooks/useWindowSize";

type PieChartProps = {
  percentage: number;
  color?: string;
  border?: number;
  width?: number;
};

const PiePseudo = css`
  content: "";
  position: absolute;
  border-radius: 50%;
`;

const Pie = styled.div`

border:1px solid;
  box-shadow: 0 3px 6px #00000029;
  border-radius: 100%;
  width: ${(props: PieChartProps) => `${props.width}px`};
  
  aspect-ratio: 1;
  position: relative;
  display: inline-grid;
  margin: 5px;
  place-content: center;
  font-size: 25px;
  font-weight: bold;
  font-family: sans-serif;
  
  

  &:before {
    ${PiePseudo};
    inset: 0;
    background: conic-gradient(${(props: PieChartProps) => `${props.color}`} calc(${(props: PieChartProps) => `${props.percentage}`} * 1%),
    #0000 0);     
    -webkit-mask: radial-gradient(farthest-side,
    #0000 calc(99% - ${(props: PieChartProps) => `${props.border}px`}),
    #000 calc(100% - ${(props: PieChartProps) => `${props.border}px`}));
    mask: radial-gradient(farthest-side,
    #0000 calc(99% - ${(props: PieChartProps) => `${props.border}px`}),
    #000 calc(100% - ${(props: PieChartProps) => `${props.border}px`}));
  }

  &:after {
    ${PiePseudo};
    background: ${(props: PieChartProps) => `${props.color}`};
    transition: all 4s ease-out;
  }
`;

const PCT2 = styled.div`
  color: var(--color-ffffff);
  text-align: center;
  font: normal normal normal 16px/13px Poppins;
  font-size: 16px;
  line-height: 13px;
  letter-spacing: 0;
  margin-top: 50px;
`
const PCT = styled.div`
  font: var(--font-style-normal) normal var(--font-weight-normal) 10px/11px
  var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  color: var(--color-6352e8);
  text-align: center;
  font-size: 10px;
  opacity: 1;
  width: 40px;
  height: 26px;
  left: 50%;
  margin-left: -20px;
  top: ${(props: { border: number }) => `${props.border + 10}`}px;

`;

const PAX = styled.div`
  font: var(--font-style-normal) normal var(--font-weight-normal)
    var(--font-size-12) / var(--line-spacing-14) var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  text-align: left;
  font-size: var(--font-size-16);
  text-transform: uppercase;
  opacity: 1;
  margin-bottom:10px;
`;
const REWARD = styled.div`
  font: var(--font-style-normal) normal var(--font-weight-normal)
    var(--font-size-12) / var(--line-spacing-14) var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  text-align: left;
  font-size: var(--font-size-12);
  text-transform: uppercase;
  opacity: 1;
`;

const PieChart = (props: PieChartProps & { pax: number }) => {
  const {percentage, pax} = props;
  const border = props.border || 20;
  const width = props.width || 154;
  const {width: w = 0} = useWindowSize();

  return (
    <>
      {/* <PCT2 className="d-md-block text-white d-none" {...{border, width: w}}>
        {percentage}/100 CPM
      </PCT2> */}
      <div className="position-relative mb-2" style={{height: width, width}}>
        <div className="position-absolute">
          <Pie {...{percentage: 100, color: "var(--black)", border, width}} />
        </div>
        <div className="position-absolute ">
          <Pie
            {...{
              percentage,
              color: props.color || "#6352E8",
              border,
              width,
            }}
          >
            {/* <PCT className="position-absolute d-md-none" {...{border}}>
              <div>{percentage}/100</div>
              <div>CPM</div>
            </PCT> */}
            <div className="d-flex justify-content-center align-items-center flex-column">
              <PAX style={{color: w>767?"var(--white)":"var(--black)",fontSize:'20px'}}>{percentage?.toString()?.substring(0, 4)}/100</PAX>
              <REWARD style={{color: w>767?"var(--blue-violet)":"var(--blue-violet)", fontSize:'20px'}}>CMP</REWARD>
            </div>
          </Pie>
        </div>
      </div>
    </>
  );
};

export default PieChart;
