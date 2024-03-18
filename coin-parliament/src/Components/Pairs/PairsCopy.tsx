import React, {useContext, useEffect, useMemo, useRef, useState} from "react";
import CoinContext from "../../Contexts/CoinsContext";
import { useNavigate } from "react-router-dom";
import UserContext from "../../Contexts/User";
// import EVE from "../../assets/logos/EVE.png";
// import LYON from "../../assets/logos/LYON.png";
// import CIN from "../../assets/logos/CIN.png";
// import DOR from "../../assets/logos/DOR.png";
// import BMG from "../../assets/logos/BMG.png";
// import PSG from "../../assets/logos/PSG.png";
import {
  getData,
  getFilteredData,
  getFilteredDataByFav,
  getNumCardsPairs,
  getOffset,
  PairsRow,
} from "../../common/models/PairTable";
import {listData} from './utils'
import {usePairs} from "./usePairs";
import {getChosenPairs} from "./utils";
import {User} from "firebase/auth";
import {useTranslation} from "../../common/models/Dictionary";
import {Input} from "../Atoms/Input/InputField.stories";
import {capitalize, upperCase} from "lodash";
import {Heart} from "../Atoms/Checkbox/Icon";
import {Buttons} from "../Atoms/Button/Button";
// import Carousel from "./Carousel";
import styled from "styled-components";
import {useWindowSize} from "../../hooks/useWindowSize";
import {getMaxWidth} from "../Coins/Coins";
import AppContext from "../../Contexts/AppContext";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const MainDiv = styled.div`
  // border:1px solid red;  
    display:flex;
    flex-wrap: wrap;    
    justify-content:center;
`;
const MidDiv = styled.div`
  
    // border:1px solid red;
    width:${window.screen.width> 1280? "70%" : "100%"};
    margin:auto;
    //  flex-wrap: wrap;
    display:flex;
    flex-wrap: wrap;
    // flex-direction: ${window.screen.width<767? "column":"row"};
    justify-content: ${window.screen.width<767? "center":"center"};
    
`;
const ChildDiv = styled.div`

  // border:1px solid green;
  // width:${window.screen.width<767 ?"250px":"350px"};
  display:flex;

  
  justify-content: space-between;  
  &:hover{
    animation: zoom-in-zoom-out 1s ease;
    @keyframes zoom-in-zoom-out {
  0% {
    transform: scale(1, 1);
  }
  50% {
    transform: scale(1.1, 1.1);
  }
  100% {
    transform: scale(1, 1);
  }
}
  }
`;

const CarouselWrapper = styled.div`

  transition: all 0.3s ease;
  // width: ${(props: { width?: number; centerMode?: boolean; coin?: boolean }) => props.centerMode ? `${(props.width || 0) + 60 * 2}px` : undefined};
  
  overflow-x: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;
  margin-bottom: 30px;

  &::-webkit-scrollbar {
    display: none;
  }
  .react-multi-carousel-dot-list {
    bottom: ${window.screen.width>767? "-20px" :"-30px"};
    margin: 0 auto;

    & .react-multi-carousel-dot--active.react-multi-carousel-dot button {
      opacity: 1;
    }

    & .react-multi-carousel-dot button {
      width: 8px;
      height: 8px;
      background: var(--electric-violet);
      opacity: 0.4;
      border: 0;
    }
  }
&{
  .react-multiple-carousel__arrow {
    z-index:1;
  }
}
  & {
    .react-multi-carousel-item {
      transform: scale(1);            
      margin:0px 10px;
      width:
    }
    .react-multi-carousel-item--active {
      
    }

    .react-multi-carousel-item--active {
      z-index: 1;
    }
  }
`;

const SwiperButton = styled.div`
display: flex;
  justify-content: space-between;
  margin:10px;
  & button{    
    background:black;
    color:white;
    width:30px;
    height:30px;
    border-radius:50px;
  }
`;

const CoinText = styled.div`
color:black;
font-weight:bold;
text-align:center;
font-size:${window.screen.width > 767 ? "10px":"12px"};
`;

const ImgName = styled.div`
padding:30px 25px 10px 25px;
`;
const PairsCopy = ({
  expanded = false,
  onFavClick,
}: {
  expanded?: boolean;
  onFavClick: (
    favorites: string[],
    user: User | undefined,
    id?: string
  ) => void;
}) => {
  const { width = 0 } = useWindowSize();
  let navigate = useNavigate();  
  

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1 // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2 // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1.5,
      slidesToSlide: 1.5 // optional, default to 1.
    }
  };
  const centerMode = window.screen.width >767 ? true : false
  const cursorShow = window.screen.width >767 ? true : false


  const deviceType = (width?: number, quotes?: Boolean) => {
    if (!width || quotes) {
      return "mobile";
    }
    if (width > 979) {
      return "desktop";
    }

    return "mobile";
  };

  const ButtonGroup = ({ next, previous, goToSlide, ...rest }: any) => {
    console.log("Hello i am working")
    const { carouselState: { currentSlide } } = rest;
    return (
      <>
        {window.screen.width > 767 ? <SwiperButton className=''>
          <button className='' onClick={() => previous()}>
            {" "}
            {"<"}{" "}
          </button>
          <button onClick={() => next()}>
            <span className=''> {">"} </span>
          </button>
        </SwiperButton> : ""}
      </>
    );
  };

  return (
  <>
    {/* // <MainDiv className=""> */}
      
      {/* <MidDiv >
        {listData && listData.map((items:any,index:number) => {
          return <ChildDiv
            
            className={`${window.screen.width > 767 ? "mx-1" : "mt-3"} d-flex flex-column`}
            style={{
              // width:`${window.screen.width < 767 ? "100%" : "32%"}`
              backgroundColor:"white",
        borderRadius:"10px"
            }}
          >
            <div
              className="d-flex justify-content-between"  
              // style={{
              //   width:`${window.screen.width < 767 ? "100%" : "32%"}`
              // }}
            onClick={() => {
              navigate(`/CardShow/${index}`);              
              // console.log(`/pairs/${index}`,"url")
          }}
          >
            <div style={{
              position: "absolute"              
            }}            
            >
            <span className="bi bi-heart" style={{
              color: "#6352e8",
              // padding: "20px",
                position: "relative",
              left: "10px",
                top: "10px",
                fontSize: "15px"
            }}></span>              
           </div>
           <ImgName>
            <img src={items.img1} alt="" className="img-fluid" style={{objectFit:"contain", width: window.innerWidth >= 600 ? "134px" : "70px", height: window.innerWidth >= 600 ? "103px" : "65px",}} />
             <CoinText>{ items.name1}</CoinText>
          </ImgName>
           <div className="w-25 d-flex flex-column align-items-center "
           >
             <div className=""
               style={{
                 borderLeft: "2px solid #6352e8",
                 height: "50px"
             }}
             ></div>

             <div className=""
               style={{
                 border: "1px solid #6352e8",
                 width:"10px",
                 height: "1px"
             }}
             ></div>
             <p style={{color:"#6352e8"}}>VS</p>
          </div>
           <ImgName>
             <img src={items.img2} alt="" className="img-fluid" style={{objectFit:"contain", width: window.innerWidth >= 600 ? "134px" : "70px", height: window.innerWidth >= 600 ? "103px" : "65px"}} />
             <CoinText>{ items.name2}</CoinText>
            </ImgName>                        
            </div>
            <div style={{
              color: "#6352e8",
              cursor:"pointer"
            }}
              className="d-flex justify-content-center align-items-center"
              onClick={() => {
                navigate(`/CardShow/${index}`);                
              }}
            >
              <p>TO VOTE</p>
              <span
                className="mx-1"
                style={{
                  fontSize: "20px"
                }}
              >{">"}</span>
            </div>
          </ChildDiv>
        })}
        
        </MidDiv> */}
      <CarouselWrapper
        style={{
          maxWidth:"750px",
          width: `${window.screen.width > 1280 ? "70%" : "100%"}`,
          margin: "auto",
          // height:"250px"
        }}
        width={window.screen.width} centerMode={centerMode} 
      >
      <Carousel
          customButtonGroup={cursorShow == true ? <ButtonGroup /> : <></>}
          arrows={cursorShow != true ? true : false}
          swipeable={true}
          draggable={true}
          showDots={true}
          renderDotsOutside={true}
          renderButtonGroupOutside={true}
          // autoPlay={true}
          focusOnSelect={true}
          responsive={responsive}
          centerMode={centerMode || false}
          additionalTransfrom={centerMode ? -60 : undefined}
          infinite={true}
          keyBoardControl={true}
          transitionDuration={500}
          containerClass="carousel-container"
          removeArrowOnDeviceType={["mobile"]}
          deviceType={deviceType(window.screen.width, true)}
          shouldResetAutoplay={false}
      >
        {listData && listData.map((items: any, index: number) => {
          return <ChildDiv

            className={`${window.screen.width > 767 ? "mx-1" : "mx-1 mt-3"} d-flex flex-column`}
            style={{
              width:`${window.screen.width < 767 ? "100%" : "100%"}`,
              backgroundColor: "white",
              borderRadius: "10px",              
            }}
          >
            <div
              className="d-flex justify-content-between"
              // style={{
              //   width:`${window.screen.width < 767 ? "100%" : "32%"}`
              // }}
              onClick={() => {
                navigate(`/CardShow/${index}`);
                // console.log(`/pairs/${index}`,"url")
              }}
            >
              <div style={{
                position: "absolute"
              }}
              >
                <span className="bi bi-heart" style={{
                  color: "#6352e8",
                  // padding: "20px",
                  position: "relative",
                  left: "10px",
                  top: "10px",
                  fontSize: "15px"
                }}></span>
              </div>
              <ImgName>
                <img src={items.img1} alt="" className="img-fluid" style={{ objectFit: "contain", width: window.innerWidth >= 600 ? "134px" : "70px", height: window.innerWidth >= 600 ? "103px" : "65px", }} />
                <CoinText>{items.name1}</CoinText>
              </ImgName>
              <div className="w-25 d-flex flex-column align-items-center "
              >
                <div className=""
                  style={{
                    borderLeft: "2px solid #6352e8",
                    height: "50px"
                  }}
                ></div>

                <div className=""
                  style={{
                    border: "1px solid #6352e8",
                    width: "10px",
                    height: "1px"
                  }}
                ></div>
                <p style={{ color: "#6352e8" }}>VS</p>
              </div>
              <ImgName>
                <img src={items.img2} alt="" className="img-fluid" style={{ objectFit: "contain", width: window.innerWidth >= 600 ? "134px" : "70px", height: window.innerWidth >= 600 ? "103px" : "65px" }} />
                <CoinText>{items.name2}</CoinText>
              </ImgName>
            </div>
            <div style={{
              color: "#6352e8",
              cursor: "pointer"
            }}
              className="d-flex justify-content-center align-items-center"
              onClick={() => {
                navigate(`/CardShow/${index}`);
              }}
            >
              <p>TO VOTE</p>
              <span
                className="mx-1"
                style={{
                  fontSize: "20px"
                }}
              >{">"}</span>
            </div>
          </ChildDiv>
        })}
        </Carousel>
      </CarouselWrapper>
        {/* </MainDiv> */}
      </>
  );
};

export default PairsCopy;
