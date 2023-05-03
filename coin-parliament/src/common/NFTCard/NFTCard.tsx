/** @format */

import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import TheEagle from "../../assets/images/TheEagle.png";
import styled from "styled-components";
type MintingProps = {
  cardType?: any;
};

const MainDiv = styled.div`
  // display: none;
  opacity: 1;
  width: 50vh;
   height: 50vh;
  // min-width: 300px;
  // min-height: 300px;
  position: fixed;
  left: 50%;
  transform: translate(-50%, -20%);  
  // top: 25vh; left: 40%;
  z-index: 101;
  transition: opacity .3s;

  // background-color: white;
  // padding: 60px 20px 40px;
  // border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ScratchCard = styled.canvas`
  position: absolute;
  top: 0;
  zIndex:10;
`;


function NFTCard({ cardType = "legendary" }: MintingProps) {
  const classname = `card shadow ${cardType.toLowerCase()} `;
  const [isDrawing, setisDrawing] = useState<any>(false)
  const [startX, setStartX] = useState<any>(0)
  const [startY, setStartY] = useState<any>(0)


  const HEIGHT = 320;
const WIDTH = 252;
  const cardDiv = useRef()
  
useEffect(() => {
    const canvas = cardDiv.current;
    // @ts-ignore
  const context = canvas.getContext("2d"); 
  console.log(context,"context")
    context.fillStyle = "#5d49df";
  context.fillRect(0, 0, WIDTH, HEIGHT);
    context.lineWidth = 50;
    context.lineJoin = "brush";
    return () => {
      // second
    }
  }, [])
  
  const scratchStart = (e: any) => {
    console.log(scratchStart,"scratchStartWork")
    const { layerX,offsetX, layerY ,offsetY} = e.nativeEvent;    
    setisDrawing(true);
    setStartX(offsetX || layerX);
    setStartY(offsetY ||layerY);
  };



  
  const scratch = (e: any) => {
    const { offsetX ,layerX, offsetY,layerY } = e.nativeEvent;    
    // @ts-ignore
    const context = cardDiv.current.getContext("2d");

    if (!isDrawing) {
      return;
    }
console.log(offsetX,offsetY, e,"contextCheck")
    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.moveTo(startX,startY);
    context.lineTo(offsetX || layerX , offsetY || layerY);
    context.closePath();
    context.stroke();
    
    setStartX(offsetX || layerX );
    setStartY(offsetY || layerY );
  };

  const scratchEnd = (e: any) => {
    console.log(scratchEnd,"scratchEndWork")
      setisDrawing(false)    
  };
  



  return (
    <MainDiv>
    <div style={{
      position: "relative",

    }}>
      {/* @ts-ignore */}         
      <div className={classname}>        
        <div>
          <span className={`${cardType.toLowerCase()}_text`}>
            &nbsp; {cardType?.toUpperCase()} &nbsp;{" "}
          </span>
          <span className='cardname'>
            THE <strong>HODLER</strong>
          </span>
          <div className='card-body'>
            {" "}
            <img src={TheEagle} alt='the hgodler' className='img-fluid' />
          </div>
        </div>
      </div>
      {/* @ts-ignore */}  
    <ScratchCard className="" ref={cardDiv}
          onMouseDown={(e) => { scratchStart(e) }}
          onMouseUp={(e) => { scratchEnd(e) }}
          onMouseMove={(e) => { scratch(e) }}          
          onTouchStart={(e) => { scratchStart(e) }}
          onTouchEnd={(e) => { scratchEnd(e) }}
        onTouchMove={(e) => { scratch(e) }}   
         width={`${WIDTH}px`}
        height={`${HEIGHT}px`}
          id="canvas"       
      >
      
      </ScratchCard>
      </div>
      </MainDiv>
  );
}

export default NFTCard;
// position: absolute;
//     left: 0;
//     bottom: 0;
//     top: 0;
//     scale: 0.1;
//     z-index: 2;
//     width: 161px;
//     /* max-width: 134px; */
//     /* display: flex; */
//     /* height: 100px; */

//     card
//     width: 100%;
//     height: auto;
//     text-align: center;

//     card body
//     width: 100%;
