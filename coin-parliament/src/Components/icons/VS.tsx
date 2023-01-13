import React from "react";
import styled, { keyframes } from "styled-components";

// const Blink = keyframes`

//   0%{opacity: 0;}
//   25%{opacity: .25;}
//   50%{opacity: .5;}
//   75%{opacity: .75;}
//   100%{opacity: 1;}
//   75%{opacity: .75;}
//   50%{opacity: .50;}
//   25%{opacity: .25;}
//   0%{opacity: .0;}
 
  
// `
const Container = styled.div`
  position: relative;
  width: 33px;
  height: 60px;
`;


export type VSProps = {
  text?: string;
  colorText?: string;
  color?: string;
  pct?:any;
};

const VS = ({
  text = "VS",
  colorText = "var(--blue-violet)",
  color = "var(--blue-violet)",
  pct
}: VSProps) => {
  return (
    <Container style={{left:(pct||50)>50?window.screen.width<976?`${(pct-50||1)*0.9}%`:`${(pct-46||1)*0.9}%`:'',right:(pct||0)<50?window.screen.width<976?`${(50-pct||1)*0.9}%`:`${(53-pct||1)*0.9}%`:''}}>
       {/* <div style={{position:'absolute'}}>{Math.floor(pct)}%</div> */}
      <svg
        id="vs"
        xmlns="http://www.w3.org/2000/svg"
        width="32.693"
        height="59.564"
        viewBox="0 0 32.693 59.564"
      >
        <g
          id="Group_4107"
          data-name="Group 4107"
          transform="translate(9.325 25.656)"
        >
          <text
            id="VS-2"
            data-name="VS"
            transform="translate(6 9)"
            fill={colorText}
            fontSize="12"
            fontFamily="Poppins-SemiBold, Poppins"
            fontWeight="600"
          >
            <tspan x="-7.92" y="0">
              {/* {pct}% */}
            </tspan>
          </text>
        </g>
        <path
          id="lightning-solid"
          d="M5.232,23.2a.328.328,0,0,0,.3.194h9.313a.334.334,0,0,0,.281-.154l7.16-11.365a.328.328,0,0,0-.274-.515H16.884L21.41,2.5A.348.348,0,0,0,21.1,2H19.1a.334.334,0,0,0-.247.107L7.1,14.8a.334.334,0,0,0,.247.568h4.506L5.285,22.845A.328.328,0,0,0,5.232,23.2Z"
          transform="translate(10.349 -2)"
          fill={color}
        />
        <path
          id="lightning-solid-2"
          data-name="lightning-solid"
          d="M17.113.194a.328.328,0,0,0-.3-.194H7.5a.334.334,0,0,0-.281.154L.059,11.519a.328.328,0,0,0,.274.515H5.46L.935,20.892a.348.348,0,0,0,.308.5H3.248a.334.334,0,0,0,.247-.107l11.746-12.7a.334.334,0,0,0-.247-.568H10.488L17.059.548A.328.328,0,0,0,17.113.194Z"
          transform="translate(0 38.171)"
          fill={color}
        />
      </svg>
      {/*<Text>VS</Text>*/}
    </Container>
  );
};

export default VS;
