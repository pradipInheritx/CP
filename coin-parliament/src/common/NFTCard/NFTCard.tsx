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

import newcommon from '../../assets/images/newcommon.png';
import newepic from '../../assets/images/newepic.png';
import newepicBG from '../../assets/images/newepicBG.png';
import newlegendary from '../../assets/images/newlegendary.png';
import newrare from '../../assets/images/newrare.png';
import newuncommon from '../../assets/images/newuncommon.png';

import { Buttons } from "../../Components/Atoms/Button/Button";
import { useNavigate } from "react-router-dom";
import giftImage from "../../assets/images/giftCard.gif"
import popupbg from "../../assets/images/popupbg.png"
import popupline from "../../assets/images/popupline.png"

type MintingProps = {
  cardType?: any;
  rewardTimer?: any;
  setRewardTimer?: any;
  openpopup?: any;
  handleShareModleShow?: any;
  handleCardClose?: any;
  setCountShow?: any;
  setBefornotShow?: any;
  befornotShow?: any;
};


const MainDiv = styled.div`
  opacity: 1; 
  z-index: 2200;  
  // width:${window.screen.width > 767 ? "500px" : "95%"};
  width:100%;
  display: flex;
  justify-content: center;
  align-items: center; 
transition:  opacity 1s ease;

`;
const ScratchCard = styled.canvas`
  position: absolute;
  top: 0;
  z-index: 2202;  
  width:100%;
  height: 100%;
`;


function NFTCard({ cardType = "legendary", setRewardTimer, openpopup, handleShareModleShow, handleCardClose, rewardTimer, setCountShow ,setBefornotShow ,befornotShow}: MintingProps) {
  const classname = `card shadow ${cardType.toLowerCase()} `;
  const [isDrawing, setisDrawing] = useState<any>(false)
  const [startX, setStartX] = useState<any>(0)
  const [startY, setStartY] = useState<any>(0)
  const [cressShow, setCressShow] = useState<any>(false)
  const [scratchShound, setScratchShound] = useState<any>(false)
  const [showImg, setShowImg] = useState<any>(false)
  const [scratchFinish, setScratchFinish] = useState<any>(false)
  // const [befornotShow, setBefornotShow] = useState<any>(true)
  const [allColor, setAllColor] = useState<any>({
    epic: {
      color:"white",
      background:"#4938CD",
      backgroundimg:newepic,
      fill:"#4938CD"
    },
    common: {

      color:"white",
      background:"#C8C0F3",
      backgroundimg:newcommon,
      fill:"#4938CD"
    },
    rare: {
      color:"#292929",
      background:"#9D9D9D",
      fill: "#7E7E7E",
      backgroundimg:newrare,
    },
    uncommon: {
      color:"#6438C1",
      background:"#A27CF9",
      fill: "#6438C1",
      backgroundimg:newuncommon,
    },
    legendary: {
      color:"#292929",
      background:"#DC9F26",
      fill: "#A89120",
      backgroundimg:newlegendary,
    },
  })
  const { showReward, setShowReward } = useContext(AppContext);


  const [allFrontImg, setAllFrontImg] = useState<any>({
    COMMON: common,
    EPIC: epic,
    LEGENDARY: legendary,
    RARE: rare,
    UNCOMMON: uncommon,
  })
  const [rotateCard, setRotateCard] = useState<boolean>(false);

  const navigate = useNavigate();

  const cardDiv = useRef()
  const forwidth = document.getElementById("card-animation")

  console.log(forwidth,"forwidth")
  const WIDTH =  window.screen.width > 767 ? 500 : window.screen.width - 10 ;
  const HEIGHT = 460;

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
      context.lineWidth = 30;
    };
    foregroundImage.src = allColor[`${cardType.toLowerCase()}`].backgroundimg;    
    //   context.fillStyle = "#000";
    // context.font = "15px Helvetica";
    // context.fillText("Scratch", WIDTH /3 , 160);
    context.lineWidth = window.screen.width < 768 ? 10 : 50;
    context.lineJoin = "brush";    
    return () => {
      // second
    }
  }, [])

  console.log(befornotShow,"befornotShow")
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


  // for PC
  const scratchStart = (e: any) => {
    console.log('PCStart', e)
    // console.log(scratchStart,"scratchStartWork")
    const { layerX, offsetX, layerY, offsetY } = e.nativeEvent;
    setisDrawing(true);
    setStartX(offsetX || layerX);
    setStartY(offsetY || layerY);
    setScratchShound(true)
    setShowImg(true)    
    setBefornotShow(false)
    
  };
  const scratch = (e: any) => {
    console.log('PC continue');

    const { offsetX, layerX, offsetY, layerY } = e.nativeEvent;
    // @ts-ignore
    const context = cardDiv.current.getContext("2d");
    if (scratchShound == true) {
      handleSoundClickCard.play()
    } else {
      handleSoundClickCard.pause()
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
    console.log('PcEND');
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
      setCressShow(true);
      setRotateCard(true);
      setScratchShound(false)
      openpopup()
      const Animation = lottie.loadAnimation({
        // @ts-ignore
        // container: document.querySelector("#card-animation"),
        container: document.querySelector("#foranimation"),
        animationData: confetti,
        renderer: "html", // "canvas", "html"
        loop: true, // boolean
        autoplay: true, // boolean                    
      });

      setTimeout(function () {
        Animation.pause();
        // Animation.destroy();
      }, 9000); // 5000 milliseconds = 5 seconds
    setScratchFinish(true)
    }
    setScratchShound(false)
    setisDrawing(false)
  };

  //for mobile
  const scratchStartMobile = (e: any) => {
    console.log('mobileStart', e);
    const { clientX, clientY } = e.touches[0];    
    // @ts-ignore
    const rect = cardDiv.current.getBoundingClientRect();

    console.log(rect,"rect")
    const offsetX = clientX - rect.left;
    const offsetY = clientY - rect.top;
    setisDrawing(true);
    setStartX(offsetX);
    setStartY(offsetY);
    // setScratchShound(true);
    handleSoundClickCard.play();
    setShowImg(true);
    
      setBefornotShow(false)
    
  };

  const scratchMobile = (e: any) => {
    console.log('mobile continue');
    const { clientX, clientY } = e.touches[0];
    // if (scratchShound == true) {
    handleSoundClickCard.play();
    // }
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
  const scratchEndMobile = () => {
    console.log('mobileEnd');
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
      context.clearRect(0, 0, WIDTH, HEIGHT);
      setCressShow(true);
      setRotateCard(true);
      openpopup()
      const Animation = lottie.loadAnimation({
        // @ts-ignore
        // container: document.querySelector("#card-animation"),
        container: document.querySelector("#foranimation"),
        animationData: confetti,
        renderer: "html", // "canvas", "html"
        loop: true, // boolean
        autoplay: true, // boolean              
      });

      setTimeout(function () {
        Animation.pause();
        // Animation.destroy();
      }, 9000); // 5000 milliseconds = 5 seconds
    setScratchFinish(true)
    }    
    setisDrawing(false);
    setScratchShound(false);
  };



  return (
    <>
      <div className="d-flex flex-column justify-content-between align-items-center"
        // id={`${!scratchFinish && "card-animation"}`}
        id="card-animation"
        style={{
          height: "460px",          
          position: "relative",
        }}
      
      
          
      >
        {/* @ts-ignore */}
          {!scratchFinish && <ScratchCard ref={cardDiv}
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
              if (window.screen.width < 768) return
              scratch(e)
            }}
            onTouchStart={(e) => {
              if (window.screen.width > 768) return
              scratchStartMobile(e); // Use the first touch point
            }}
            onTouchEnd={(e) => {
              if (window.screen.width > 768) return
              scratchEndMobile(); // Use the first touch point
            }}
            onTouchMove={(e) => {
              if (window.screen.width > 768) return
              scratchMobile(e); // Use the first touch point
            }}
            width={`${WIDTH}px`}
            height={`${HEIGHT}px`}
            id="canvas"
          >


          </ScratchCard>}
        {!befornotShow && <div          
          className="d-flex justify-content-center"
          style={{
          position:"relative"
          }}          
        >
          <p
            // className={`${cardType.toLowerCase()}_text`}
            className="class_text mt-2"
          style={{
            position: "absolute",            
        }}
          >
            &nbsp; {cardType?.toUpperCase()} &nbsp;
          </p>
          {
          <svg width="250" height="52" viewBox="0 0 406 52" fill="none" xmlns="http://www.w3.org/2000/svg"
            style={{
              marginTop: "-11px",              
          }}
          >  
          <path d="M383.12 0.959961H22.75C14.78 1.11164 9 0.959183 0.5 0.960653C35.5 0.958056 41.9 51.96 68.11 51.96H337.76C363.97 51.96 373.5 8.4998 406 0.998833C399.5 0.959961 391.095 1.12288 383.12 0.959961Z" fill={allColor[`${cardType.toLowerCase()}`].fill} />            
          </svg>
          }
       
        </div>}
      
      {!befornotShow && <MainDiv
          className=""
          id="foranimation"
      >
          <div

          >    
          {/* @ts-ignore */}
            <div
              className=""            
            >
            <div className={`${!showImg ? "d-none" : ""}`}>
              {/* <span className={`${cardType.toLowerCase()}_text`}>
                &nbsp; {cardType?.toUpperCase()} &nbsp;{" "}
              </span> */}
                <span className='cardname'
                  style={{
                  color:`${allColor[`${cardType.toLowerCase()}`].color}`
                }}
                >
                <strong>{rewardTimer?.data?.firstRewardCard || "HODLER"}</strong>
              </span>
              <div
                className="d-flex justify-content-center"
              style={{
                    width: "237px",
                    height:"240px",
                    // border:"1px solid red",
                    // overflow:"hidden"
              }}
                
              >
                <img src={rewardTimer?.data?.firstRewardCardImageUrl || TheEagle} alt='the hgodler'
                  // className='img-fluid'
                  style={{
                   width: "255px",
                  margin: "auto",
                  display: "block",
                  marginTop:"-15px",
                }}
                // width={"100%"}
              />
              </div>
              {/* <div className={classname}>
                {" "}
              </div> */}
            </div>
          </div>
          
        </div>
        </MainDiv>}
        {!befornotShow &&        
      <div        
        className={`w-100 d-flex justify-content-center mb-3`}
      >
        <Buttons.Primary className="mx-2" onClick={() => {
          setRewardTimer(null);
          setShowReward(0);
          handleShareModleShow()
          handleCardClose()
          setCountShow(false)
          }}
            style={{
            backgroundColor:`${allColor[`${cardType.toLowerCase()}`].fill}`
          }}
          >Share Card</Buttons.Primary>

        <Buttons.Primary className="mx-2" onClick={() => {
          setRewardTimer(null);
          setShowReward(0);
          setCountShow(false)
          navigate("/profile/Album")
          }}
            style={{
            backgroundColor:`${allColor[`${cardType.toLowerCase()}`].fill}`
          }}
          >Check Win Card</Buttons.Primary>
          </div>
        }
        </div>
    </>
  );
}

export default NFTCard;


