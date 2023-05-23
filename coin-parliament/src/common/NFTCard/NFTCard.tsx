/** @format */

import React, { useContext, useEffect, useRef, useState } from "react";
import lottie from "lottie-web";
import confetti from "../../assets/animation/confetti.json";
import "./style.css";
import TheEagle from "../../assets/images/TheEagle.png";
import styled from "styled-components";
import AppContext from "../../Contexts/AppContext";
import { handleSoundClickCard } from "../utils/SoundClick";
import scratchCArdImg from '../../assets/images/scratchCArd.jpg';
import common from '../../assets/images/commonText.png';
import epic from '../../assets/images/epicText.png';
import legendary from '../../assets/images/legendaryText.png';
import rare from '../../assets/images/rareText.png';
import uncommon from '../../assets/images/uncommonText.png';
import { Buttons } from "../../Components/Atoms/Button/Button";
import { useNavigate } from "react-router-dom";
type MintingProps = {
  cardType?: any;
  setRewardTimer?: any;
  openpopup?: any;
};


const MainDiv = styled.div`
  // display: none;
  opacity: 1;
  // min-width: 300px;
  // min-height: 300px;
  // position: fixed;
  // top:0;
  // left:0;
  // right:0;
  // bottom:0;
  // width: 100%;
  // height: 100vh;
  // left: 50%;
  // transform: translate(-50%, -20%);  
  // top: 25vh; left: 40%;
  z-index: 2200;
  // transition: opacity .3s;
// border:1px solid red;
  // background-color: rgba(0,0,0,0.8);
  // padding: 60px 20px 40px;
  // border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center; 
transition:  opacity 1s ease;

`;
const ScratchCard = styled.canvas`
  position: absolute;
  top: 0;
  zIndex:10;
  width:100%;
   height: 100%;
`;
const Cross = styled.div`
  position: absolute;
  // top:${window.screen.width > 767 ? "0" : "2.5%"};
  // right:${window.screen.width > 767 ? "0" : "2.5%"};  
  top:-10%;
  right:-17%;  
  zIndex:99999;
  width:30px;
  height:30px;
  display: flex;
  justify-content: center;
  align-items: center;
  // border:1px solid red;
  border-radius:50px;
  background-color:#5d49df;
  color:white;
  font-size:15px;


`;


function NFTCard({ cardType = "legendary", setRewardTimer, openpopup }: MintingProps) {
  const classname = `card shadow ${cardType.toLowerCase()} `;
  const [isDrawing, setisDrawing] = useState<any>(false)
  const [startX, setStartX] = useState<any>(0)
  const [startY, setStartY] = useState<any>(0)
  const [cressShow, setCressShow] = useState<any>(false)
  const [scratchShound, setScratchShound] = useState<any>(false)
  const { showReward, setShowReward } = useContext(AppContext);
  const [allFrontImg, setAllFrontImg] = useState<any>({
      COMMON:common,
      EPIC:epic,
      LEGENDARY:legendary,
      RARE:rare,
      UNCOMMON:uncommon,
  })

  console.log(allFrontImg[`${cardType}`],cardType,"checktype")
const navigate = useNavigate();

  const WIDTH = 252;
  const HEIGHT = 320;
  const cardDiv = useRef()

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (isDrawing) {
        e.preventDefault();
      }
    };
    document.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isDrawing]);


  useEffect(() => {
    const canvas = cardDiv.current;
    // @ts-ignore
  const context = canvas.getContext("2d");
  // console.log(context,"context")
  // context.fillStyle = "#5d49df";
  // context.fillRect(0, 0, WIDTH, HEIGHT);

  
  
  // for (let i = 1; i < 8;  i++){    
  //   context.fillText("Scratch", 20, 40 * i);
  //   context.fillText("Scratch", 100, 40 * i);
  //   context.fillText("Scratch", 180, 40 * i);    
  // }

    const foregroundImage = new Image();
		foregroundImage.onload = function () {
			context.drawImage(this, 0, 0);
			context.globalCompositeOperation = "destination-out";
			context.lineWidth = 20;			
		};
    foregroundImage.src = allFrontImg[`${cardType}`];
  //   context.fillStyle = "#000";
  // context.font = "15px Helvetica";
  // context.fillText("Scratch", WIDTH /3 , 160);

    context.lineWidth = window.screen.width<768? 10 :50;
    context.lineJoin = "brush";
    return () => {
      // second
    }
  }, [])
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (isDrawing) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, [isDrawing]);

  const scratchStart = (e: any) => {
    console.log('eventmobile', e)
    // console.log(scratchStart,"scratchStartWork")
    const { layerX, offsetX, layerY, offsetY } = e.nativeEvent;
    setisDrawing(true);
    setStartX(offsetX || layerX);
    setStartY(offsetY || layerY);
    setScratchShound(true)
  };

  const scratchStartMobile = (e: any) => {
    console.log('eventmobile', e)
    const { clientX, clientY } = e.touches[0];
    // @ts-ignore
    const rect = cardDiv.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;
    setisDrawing(true);
    setStartX(offsetX);
    setStartY(offsetY);
    setScratchShound(true)
  };

  const scratchMobile = (e: any) => {
    console.log('eventmobile', e)
    const { clientX, clientY } = e.touches[0];
    if (scratchShound == true) {
      handleSoundClickCard.play()
    }
    // @ts-ignore
    const rect = cardDiv.current.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;

    // const { clientX, clientY } = e.targetTouches[0];
    // @ts-ignore
    const context = cardDiv.current.getContext("2d");

    if (!isDrawing) {
      return;
    }

    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    context.arc(offsetX, offsetY, 5, 0, Math.PI * 2); // Adjust the arc radius as needed
    context.closePath();
    context.stroke();

    setStartX(offsetX);
    setStartY(offsetY);
  };


  const scratch = (e: any) => {
    const { offsetX, layerX, offsetY, layerY } = e.nativeEvent;
    // @ts-ignore
    const context = cardDiv.current.getContext("2d");
    if (scratchShound == true) {
      handleSoundClickCard.play()
    }
    if (!isDrawing) {
      return;
    }
    console.log(offsetX, offsetY, e, "contextCheck")
    context.globalCompositeOperation = "destination-out";
    context.beginPath();
    // context.moveTo(startX,startY);
    // context.lineTo(offsetX || layerX , offsetY || layerY);
    context.arc(offsetX, offsetY, 5, 0, Math.PI * 2);
    context.closePath();
    context.stroke();

    setStartX(offsetX || layerX);
    setStartY(offsetY || layerY);
  };

  const scratchEnd = (e: any) => {
    console.log(scratchEnd, "scratchEndWork")
    handleSoundClickCard.pause();
    // @ts-ignore
    const context = cardDiv.current.getContext("2d");
    const pixels = context.getImageData(0, 0, WIDTH, HEIGHT);
    const total = pixels.data.length / 30;
    let count = 0;
    for (let i = 0; i < pixels.data.length; i += 30) {
      if (parseInt(pixels.data[i], 10) === 0) count++;
    }
    const percentage = Math.round((count / total) * 100);
    if (percentage > 80) {
      context.clearRect(0, 0, WIDTH, HEIGHT)
      setCressShow(true)
      setScratchShound(false)
      openpopup()
      const Animation = lottie.loadAnimation({
        // @ts-ignore
        container: document.querySelector("#card-animation"),
        animationData: confetti,
        renderer: "html", // "canvas", "html"
        loop: true, // boolean
        autoplay: true, // boolean              
      });

      setTimeout(function () {
        Animation.pause();
      }, 9000); // 5000 milliseconds = 5 seconds

    }
    setScratchShound(false)
    setisDrawing(false)
  };

  const scratchEndMobile = () => {
    handleSoundClickCard.pause()
    // @ts-ignore
    const context = cardDiv.current.getContext("2d");
    const pixels = context.getImageData(0, 0, WIDTH, HEIGHT);
    const total = pixels.data.length / 30;
    let count = 0;
    for (let i = 0; i < pixels.data.length; i += 30) {
      if (parseInt(pixels.data[i], 10) === 0) count++;
    }
    const percentage = Math.round((count / total) * 100);
    if (percentage > 80) {
      context.clearRect(0, 0, WIDTH, HEIGHT);
      setCressShow(true);
      openpopup()
      const Animation = lottie.loadAnimation({
        // @ts-ignore
        container: document.querySelector("#card-animation"),
        animationData: confetti,
        renderer: "html", // "canvas", "html"
        loop: true, // boolean
        autoplay: true, // boolean              
      });

      setTimeout(function () {
        Animation.pause();
      }, 9000); // 5000 milliseconds = 5 seconds
    }
    setisDrawing(false);
    setScratchShound(false)
  };



  return (
   <>
    <MainDiv>      
    <div style={{
      position: "relative",

      }}>
        {/* <Cross
        className={`${!cressShow ? "d-none" : ""} `}
        style={{ cursor: "pointer" }}
        onClick={() => {
          setRewardTimer(null);
          setShowReward(0);
        }}
      >
          <span>
            X
          </span> 
        </Cross> */}
      {/* @ts-ignore */}         
      
        
        {/* @ts-ignore */}
      <div className={classname} id="card-animation">        
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
          onMouseDown={(e) => {
            e.stopPropagation()
            if (window.screen.width < 768) return
            scratchStart(e)
          }}
          onMouseUp={(e) => {
            e.stopPropagation()
            if (window.screen.width < 768) return
            scratchEnd(e)
          }}
          onMouseMove={(e) => {
            e.stopPropagation()
            if(window.screen.width<768) return
            scratch(e) }}          
            onTouchStart={(e) => {
              if(window.screen.width>768) return
              scratchStartMobile(e); // Use the first touch point
            }}
            onTouchEnd={(e) => {
              if(window.screen.width>768) return
              scratchEndMobile(); // Use the first touch point
            }}
            onTouchMove={(e) => {
              if(window.screen.width>768) return
              scratchMobile(e); // Use the first touch point
            }}
         width={`${WIDTH}px`}
        height={`${HEIGHT}px`}
          id="canvas"       
      >
        
      
        </ScratchCard>              
      </div>    
      </MainDiv>  
      <div
        // className="w-100 d-flex justify-content-center mt-3"
      className={`${!cressShow ? "d-none" : ""} w-100 d-flex justify-content-center mt-3`}
      >
        <Buttons.Primary className="mx-2" onClick={() => {
          setRewardTimer(null);
          setShowReward(0);
          navigate("/profile/Album")
        }}>Check Win Card</Buttons.Primary>                
      </div>        
    </>
  );
}

export default NFTCard;


