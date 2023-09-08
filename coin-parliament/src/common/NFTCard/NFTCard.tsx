/** @format */

import React, { useContext, useEffect, useRef, useState } from "react";
import lottie from "lottie-web";
import confetti from "../../assets/animation/confetti.json";
import "./style.css";
import TheEagle from "../../assets/images/TheEagle.png";
import styled from "styled-components";
import AppContext from "../../Contexts/AppContext";
import { handleSoundClickCard, handleSoundWinCmp } from "../utils/SoundClick";
import scratchCArdImg from '../../assets/images/scratchCArd.jpg';
import common from '../../assets/images/commonText.png';
import epic from '../../assets/images/epicText.png';
import legendary from '../../assets/images/legendaryText.png';
import rare from '../../assets/images/rareText.png';
import uncommon from '../../assets/images/uncommonText.png';
import Showround from '../../assets/images/Showround.png';
import information from '../../assets/svg/information.svg';
import firebase from "firebase/compat";

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
import { doc } from "firebase/firestore";
import VideoPopup from "Pages/VideoPopup";
import UserContext from "Contexts/User";

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


// const MainDiv = styled.div`
//   opacity: 1; 
//   z-index: 2200;  
//   // width:${window.screen.width > 767 ? "500px" : "95%"};
//   width:100%;
//   display: flex;
//   justify-content: center;
//   align-items: center; 
// transition:  opacity 1s ease;
// border:1px solid red;

// `;

const MainDiv = styled.div`  
  opacity: 1; 
  z-index: 2200;
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


function NFTCard({ cardType = "legendary", setRewardTimer, openpopup, handleShareModleShow, handleCardClose, rewardTimer, setCountShow, setBefornotShow, befornotShow }: MintingProps) {
  const classname = `card shadow ${cardType.toLowerCase()} `;
  const [isDrawing, setisDrawing] = useState<any>(false)
  const [startX, setStartX] = useState<any>(0)
  const [startY, setStartY] = useState<any>(0)
  const [cressShow, setCressShow] = useState<any>(false)
  const [scratchShound, setScratchShound] = useState<any>(false)
  const [showImg, setShowImg] = useState<any>(false)
  const [scratchFinish, setScratchFinish] = useState<any>(false)
  const [Videoshow, setVideoshow] = useState(false)
  const [fulldata, setFulldata] = useState([])
  // const [befornotShow, setBefornotShow] = useState<any>(true)

  const { showReward, setShowReward } = useContext(AppContext);
  const [mintedTime, setMintedTime] = useState("");
  const { user } = useContext(UserContext);


  const [allFrontImg, setAllFrontImg] = useState<any>({
    COMMON: common,
    EPIC: epic,
    LEGENDARY: legendary,
    RARE: rare,
    UNCOMMON: uncommon,
  })
  const [rotateCard, setRotateCard] = useState<boolean>(false);
  // const MintedTime = new Date(1691676648*1000);

  const navigate = useNavigate();
  const cardDiv = useRef()
  const forwidth = document.getElementById("card-animation")

  console.log(forwidth, "forwidth")
  // const WIDTH =  window.screen.width > 767 ? 500 : window.screen.width - 10 ;
  // const HEIGHT = 460;
  const WIDTH = 252;
  const HEIGHT = 320;




  useEffect(() => {

    console.log(rewardTimer?.data?.firstRewardCardId, "rewardTimer")
    const getCardDetails = firebase
      .firestore()

      .collection("cardsDetails")
      .where("cardId", "==", rewardTimer?.data?.firstRewardCardId)
    getCardDetails.get()
      .then((snapshot) => {
        const data: any = []
        snapshot.forEach((doc) => {
          let cardData = doc.data()
          data.push({
            cardType: cardData?.cardType,
            setName: cardData?.setName,
            cardName: cardData?.cardName,
            albumName: cardData?.albumName,
            noOfCardHolders: cardData?.noOfCardHolders,
            cardId: cardData?.cardId,
            id: cardData?.cardId,
            totalQuantity: cardData?.totalQuantity,
            cardImageUrl: cardData?.cardImageUrl,
            cardVideoUrl: cardData?.cardVideoUrl,
            setId: cardData?.setId,
          });
        });
        setFulldata(data[0])
        console.log(data, "rewardcarddata")
        // setAllCardArrayNew(data)
        console.log(data, "allcardData")
      }).catch((error) => {
        console.log(error, "error");
      });

    const getTime = []

    const getRewardTransactions = firebase
      .firestore()
      .collection("reward_transactions")
      .where("user", "==", user?.uid)
    getRewardTransactions.get()
      .then((doc: any) => {

        doc.forEach((cards: any, index: number) => {
          // winCards.push(cards.data().)
          if (cards.data()?.winData?.firstRewardCardSerialNo == rewardTimer?.data?.firstRewardCardSerialNo) {
            const date = new Date(cards.data()?.transactionTime?.seconds * 1000);
            // console.log(cards.data()?.transactionTime?.seconds,"getMIntedTime")            
            var getMIntedTime = date.toLocaleString()
            setMintedTime(getMIntedTime)
            // getTime.push(
            //   { ...cards.data().winData, ...cards.data().transactionTime}
            // )

          }
        })

        // console.log(getTime,"getTime")
      })
      .catch((error: any) => {
        console.log("getAllRewardsOfUser Error", error)
      })

    // const userRef = doc(db, "cardsDetails", rewardTimer?.data?.firstRewardCardId);
    return () => {

    };
  }, []);


  // console.log(mintedTime,"getMIntedTime")
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
      context.lineWidth = 50;
    };
    foregroundImage.src = allColor[`${cardType.toLowerCase()}`].backgroundimg;
    //   context.fillStyle = "#000";
    // context.font = "15px Helvetica";
    // context.fillText("Scratch", WIDTH /3 , 160);
    // context.lineWidth = window.screen.width < 768 ? 60 : 55;
    context.lineJoin = "brush";
    return () => {
      // second
    }
  }, [])

  console.log(befornotShow, "befornotShow")
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
      handleSoundWinCmp.play()
      const Animation = lottie.loadAnimation({
        // @ts-ignore
        // container: document.querySelector("#card-animation"),
        container: document.querySelector("#card-animation"),
        animationData: confetti,
        renderer: "html", // "canvas", "html"
        loop: true, // boolean
        autoplay: true, // boolean                    
      });

      setTimeout(function () {
        Animation.pause();
        // Animation.destroy();
        handleSoundWinCmp.pause()
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

    console.log(rect, "rect")
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
      handleSoundWinCmp.play()
      const Animation = lottie.loadAnimation({
        // @ts-ignore
        // container: document.querySelector("#card-animation"),

        container: document.querySelector("#card-animation"),
        animationData: confetti,
        renderer: "html", // "canvas", "html"
        loop: true, // boolean
        autoplay: true, // boolean              
      });

      setTimeout(function () {
        Animation.pause();
        handleSoundWinCmp.pause()
        // Animation.destroy();
      }, 9000); // 5000 milliseconds = 5 seconds
      setScratchFinish(true)
    }
    setisDrawing(false);
    setScratchShound(false);
  };

  // const getMintedTime = () => {  
  //     // const date = new Date(winCard?.seconds * 1000);

  //     const date = new Date(1691676648 * 1000);
  //   var getMIntedTime = date.toLocaleString()
  //    return  getMIntedTime


  //   }


  return (
    <div className="d-flex justify-content-around align-items-center flex-column"
      style={{
        height: "100%",
      }}
    >
      <div
      // onClick={()=>setVideoshow(true)}
      >
        {/* click */}
      </div>
      <MainDiv>
        <div
          style={{
            position: "relative",
          }}>
          {/* @ts-ignore */}
          <div className={classname} id=""
            style={{
              position: "relative",
              height: '335px'
            }}
          >
            <div id="card-animation" style={{
              height: "280px", width: "245px", position: "absolute",
              top: "25px",
            }} />

            <div className={`${!showImg ? "d-none" : ""}`}>
              <div className="d-flex justify-content-around">
                <div className={`${!fulldata ? "opacity-0" : ""}`}
                  style={{
                    width: "25%"
                  }}
                >
                  {/* {!Hide360Icon ? */}
                  <img
                    className=""
                    style={{
                      // position: "absolute",
                      // right: 15,
                      padding: "0px 0px 0px 10px",
                      cursor: "pointer"
                    }}
                    width={"35px"}
                    onClick={() => {
                      setVideoshow(true)
                    }}
                    src={Showround}
                  />
                  {/* :
                    <span className='px-2 opacity-0'
                      style={{
                      fontWeight:"bold"
                    }}
                    >123A</span>} */}
                </div>
                <span className={`${cardType.toLowerCase()}_text`}
                  style={{
                    width: "50%"
                  }}
                >
                  &nbsp; {cardType?.toUpperCase()} &nbsp;{" "}
                </span>
                <div className={`${!fulldata ? "opacity-0" : ""} px-2`}
                  style={{
                    fontSize: "12px",
                    width: "25%",
                    textAlign: "right",
                    fontWeight: "bold"

                  }}
                >

                  <div>
                    <img src={information} alt=""
                      className="mt-1"
                      width={"15px"}
                      height={"15px"}
                    />
                  </div>
                </div>
              </div>

              <span className='cardname'>
                <strong>{rewardTimer?.data?.firstRewardCard || "HODLER"}</strong>
              </span>
              <div
                className="d-flex justify-content-center" style={{
                  // border:"1px solid red",
                  // overflow:"hidden"

                  position: "relative",
                }}>
                <div
                  className=""
                  style={{
                    position: "absolute",
                    left: "-40px",
                    bottom: "60px",
                    transform: "rotate(-90deg)",
                    width: "125px",
                    color: "black",
                    // alignItems:""
                  }}
                >


                  <p

                  >{rewardTimer?.data?.firstRewardCardSerialNo || ''}</p>

                </div>
                <img src={rewardTimer?.data?.firstRewardCardImageUrl || TheEagle} alt='the hgodler'
                  // className='img-fluid'
                  style={{
                    width: "245px",
                    margin: "auto",
                    display: "block",
                    marginTop: "-7px",
                  }}
                // width={"100%"}
                />
                <p
                  style={{
                    position: "absolute",
                    // left: "-20px",
                    bottom: "-14PX",
                    // transform: "rotate(-90deg)",
                    color: "black",
                    paddingTop: '0.5em'
                  }}
                >{rewardTimer?.data?.firstRewardCardCollection?.toLocaleUpperCase()}</p>
              </div>
            </div>
          </div>
          {/* @ts-ignore */}
          {!cressShow && <ScratchCard ref={cardDiv}
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
        </div>
      </MainDiv>
      <div
        // className="w-100 d-flex justify-content-center mt-3"
        className={`${!cressShow ? "opacity-0" : ""} w-100 d-flex justify-content-center `}
      >
        <Buttons.Primary className="mx-2" onClick={() => {
          setRewardTimer(null);
          setShowReward(0);
          handleShareModleShow()
          handleCardClose()
          setCountShow(false)
          handleSoundWinCmp.pause()
        }}
          style={{
            backgroundColor: `${allColor[`${cardType.toLowerCase()}`].fill}`,
            width: `${"120px"}`
          }}
        >
          {/* Share Card */}
          BARG & WIN
        </Buttons.Primary>

        <Buttons.Primary className="mx-2" onClick={() => {
          setRewardTimer(null);
          setShowReward(0);
          setCountShow(false);
          localStorage.setItem('filterCollection', JSON.stringify({ name: rewardTimer?.data?.firstRewardCardCollection }));
          navigate("/profile/Album");
          handleSoundWinCmp.pause();
        }}
          style={{
            backgroundColor: `${allColor[`${cardType.toLowerCase()}`].fill}`,
            width: `${"120px"}`
          }}
        >
          YOUR COLLECTION  {/* Check Win Card */}
        </Buttons.Primary>
      </div>
      {Videoshow  && <VideoPopup
        fulldata={fulldata}
        setVideoshow={setVideoshow}
        Videoshow={Videoshow}
        // @ts-ignore
        videoUrl={fulldata?.cardVideoUrl}
        // @ts-ignore
        imgUrl={fulldata?.cardImageUrl}
        MintedTime={mintedTime}
        PrivateSerialNo={rewardTimer.data.firstRewardCardSerialNo}
      />}
    </div>

  );
}

export default NFTCard;

export const allColor: { [key: string]: { [key: string]: any } } = {
  epic: {
    color: "white",
    background: "#4938CD",
    backgroundimg: epic,
    // backgroundimg:newepic,
    fill: "#4938CD"
  },
  common: {

    color: "white",
    background: "#C8C0F3",
    // backgroundimg:newcommon,
    backgroundimg: common,
    fill: "#4938CD"
  },
  rare: {
    color: "#292929",
    background: "#9D9D9D",
    fill: "#7E7E7E",
    backgroundimg: rare,
    // backgroundimg:newrare,
  },
  uncommon: {
    color: "#6438C1",
    background: "#A27CF9",
    fill: "#6438C1",
    backgroundimg: uncommon,
    // backgroundimg:newuncommon,
  },
  legendary: {
    color: "#292929",
    background: "#DC9F26",
    fill: "#A89120",
    backgroundimg: legendary,
    // backgroundimg:newlegendary,
  },
}


