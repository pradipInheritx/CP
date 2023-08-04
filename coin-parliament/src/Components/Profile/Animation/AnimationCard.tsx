/** @format */

import React, { useEffect, useRef, useState } from "react";
// import "./style.css";
import TheEagle from "../../assets/images/TheEagle.png";
type MintingProps = {
  cardType?: any;
};
function AnimationCard({ cardType = "legendary" }: MintingProps) {
  const classname = `card shadow ${cardType.toLowerCase()} `;
  const [isDrawing, setisDrawing] = useState<any>(false)
  const [startX, setStartX] = useState<any>(0)
  const [startY, setStartY] = useState<any>(0)

  const HEIGHT = 230;
  const WIDTH = 150;
  const cardDiv = useRef()

  useEffect(() => {
    const canvas = cardDiv.current;
    // @ts-ignore
    const context = canvas.getContext("2d");
    context.fillStyle = "#ddd";
    context.fillRect(0, 0, WIDTH, HEIGHT);
    context.lineWidth = 10;
    context.lineJoin = "round";
    return () => {
      // second
    }
  }, [])

  const scratchStart = (e: any) => {
    console.log(scratchStart, "scratchStartWork")
    const { layerX, layerY } = e.nativeEvent;
    setisDrawing(true);
    setStartX(layerX);
    setStartY(layerY);
  };




  const scratch = (e: any) => {
    const { layerX, layerY } = e.nativeEvent;
    console.log(e, "scratchWOrk")
    // @ts-ignore
    const context = cardDiv.current.getContext("2d");

    if (!isDrawing) {
      return;
    }
    console.log(layerX, layerY, e, "contextCheck")
    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(layerX, layerY);
    context.closePath();
    context.stroke();

    setStartX(layerX);
    setStartY(layerY);
  };

  const scratchEnd = (e: any) => {
    console.log(scratchEnd, "scratchEndWork")
    setisDrawing(false)
  };




  return (
    <>
      {/* @ts-ignore */}
      <canvas className="border" ref={cardDiv}
        onMouseDown={(e) => scratchStart(e)}
        onMouseUp={(e) => scratchEnd(e)}
        onMouseMove={(e) => scratch(e)}
        onTouchStart={(e) => scratchStart(e)}
        onTouchEnd={(e) => scratchEnd(e)}
        onTouchMove={(e) => scratch(e)}
        width={`${WIDTH}px`}
        height={`${HEIGHT}px`}
        id="canvas"

      >
        <div className={classname}>


        </div>
      </canvas>


    </>
  );
}

export default AnimationCard;

