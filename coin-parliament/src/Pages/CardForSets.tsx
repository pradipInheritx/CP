/** @format */
/** @format */

import React, { useContext, useState } from "react";
import styled from "styled-components";
import bkgnd4 from "../assets/images/bkgnd4.png";
import bkgnd5 from "../assets/images/bkgnd5.png";
import bkgnd3 from "../assets/images/bkgnd3.png";
import bkgnd2 from "../assets/images/bkgnd2.png";
import bkgnd from "../assets/images/bkgnd.png";
import Showround from "../assets/images/Showround.png";
import TheEagle from "../assets/images/TheEagle1.png";
import information from "../assets/svg/information.svg";
import information2 from "../assets/svg/information2.svg";
import backBg from "../assets/images/backBg.png";
import { logo } from "../assets/svg/logo";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppContext from "../Contexts/AppContext";
import { cardFlip } from "../common/utils/SoundClick";
import { Ratio } from "react-bootstrap";
import VideoPopup from "./VideoPopup";


const Card = styled.div<{ darkTheme: boolean }>`
  border-radius: 0px 0px 8px 8px;
  text-transform: uppercase;
  font-size: 14px;
  line-height: 14px;
  
  &.LEGENDARY {
    background-image: url(${props => !props.darkTheme && bkgnd4}) !important;
    color: #160133;    
    border-image: linear-gradient(180deg, #FFD25A 0.05%, #F89E18 51.39%, #FFD25A 99.94%) 30; 
    border-width: 5px;
    border-style: solid;        
    background-color: black;   
  }
  

  &.RARE {
    background-image: url(${props => !props.darkTheme && bkgnd5}) !important;
    color: #160133;
    border-image: linear-gradient(180deg, #B0B0B0 0.05%, #FFF 51.39%, #B0B0B0 99.94%) 30;     
    border-width: 5px;
    border-style: solid;        
    background-color: black;    
  }  
  &.EPIC {    
    background-image: url(${props => !props.darkTheme && bkgnd3}) !important;
    color: #d4d0f3;    
    border-image:linear-gradient(180deg, #6250EE 0.05%, #D5ABFF 51.39%, #6250EE 99.94%) 30;     
    border-width: 5px;
    border-style: solid;    
    border-radius: 0px 0px 8px 8px;    
    background-color: black;    
  }
  &.UNCOMMON {
    background-image: url(${props => !props.darkTheme && bkgnd2}) !important;
    color: #160133;        
    border-image: linear-gradient(180deg, #D4D1F2 0.05%, #FFF 60.39%, #D4D1F2 99.94%) 30;     
    border-width: 5px;
    border-style: solid;    
    border-color: #D4D1F2;

    border-radius: 0px 0px 8px 8px;
    background-color: black;
  }
  &.COMMON {
    background-image: url(${props => !props.darkTheme && bkgnd}) !important;
    color: #160133;
    border-image: linear-gradient(180deg, #D4D1F2 0.05%, #FFF 60.39%, #D4D1F2 99.94%) 30;        
    border-width: 5px;
    border-style: solid;    
    border-radius: 0px 0px 8px 8px;
    background-color: black;
    
  }
  &.CardDisebal{
    opacity: 0.2;
  }
`;
const CardName = styled.div`
  font-size: 30px;
  color: #160133;
`;

const CenterText = styled.div`  
  margin: auto;
  text-transform: uppercase;
  font-weight: bold;
  top: 10px;
  border-radius: 0px 0px 8px 8px;

  text-align: center;
  &.LEGENDARY_text {
    border: #f5e7b5 solid 6px;
    background-color: #f5e7b5;
  }  
  &.RARE_text {
    border: #d2d2d2 solid 6px;
    background-color: #d2d2d2;
  }

  &.EPIC_text {
    border: #6352e8 solid 6px;

    background-color: #6352e8;
  }

  &.UNCOMMON_text {
    border: #d4d0f3 solid 6px;
    background-color: #d4d0f3;
  }
  &.COMMON_text {
    border: #d4d0f3 solid 6px;
    background-color: #d4d0f3;
  }
`;

//  back Side Card

const CardBack = styled.div<{ CardSize: any }>`
  overflow: hidden;
  border-radius: 8px 8px 8px 8px;
  text-transform: uppercase;
  background-image: url(${backBg}) !important;
  opacity: 1;
  color: #d4d0f3;
  border: #6352e8 solid 8px;
  background-color: #7563f9;

  & span {
    font-weight: 300;
    // opacity: 0.8;
    font-size: ${props => props.CardSize ? "12px" : "10px"};
    line-height: 10px;
    display: inline-block;
    width: 95%;
    border: none;
    background: none;
    border-bottom: 1px solid #5f4edb;
    color: #fff;
    margin: 0px 5px;
    // padding: 23px 0px 5px 0px;
    padding:${props => props.CardSize ? "22px 0px 5px 0px" : "0px 0px 2px 0px"};

  }
`;





export type BoxItems = {
  DivClass?: string;
  HeaderText?: string;
  HeaderClass?: string;
  width?: string;
  Disable?: string;
  cardNo?: string;
  cardHeader?: string;
  BackSideCard?: (e: any) => void;
  id?: string | number;
  flipCard?: boolean | string;
  Serie?: string;
  BackCardName?: string;
  Rarity?: string;
  Quantity?: string;
  holderNo?: string | number;
  MintedTime?: string | number;
  PrivateSerialNo?: string | number;
  GeneralSerialNo?: string | number;
  fulldata?: any;
  userId?: any;
  CollectionType?: any;
  ImgUrl?: any;
  VideoUrl?: any;
  darkTheme?: boolean;
  Hide360Icon?: boolean;
  BigCard?: boolean;
  MoveCard?: boolean;

};
const CardForSets = ({ darkTheme = false, DivClass, HeaderText, HeaderClass, width, Disable, cardNo, cardHeader, BackSideCard, id, flipCard, Serie, BackCardName, Rarity, Quantity, holderNo, MintedTime, PrivateSerialNo, GeneralSerialNo, fulldata, userId, CollectionType, ImgUrl, VideoUrl, Hide360Icon, BigCard, MoveCard }: BoxItems) => {

  console.log(HeaderText,"HeaderText")

  const Width: number = window.screen.width
  const [flip, setFlip] = useState(true)
  const [Videoshow, setVideoshow] = useState(false)
  const pathname = window.location.pathname;
  const pathnameName = pathname.split("/")
  const navigate = useNavigate();
  const { singalCardData, setSingalCardData } = useContext(AppContext);
  const [tooltipShow, setTooltipShow] = React.useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  let params = useParams();
  const { type } = params;
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  console.log(MintedTime, "MintedTimecheck")
  return (
    <div
      className="d-flex justify-content-center"      
    >      
      <div        
        className={`card-containerSets ${flipCard == true || flip != true ? "flipped" : ""
          }`}        
        style={{
          minHeight: `${BigCard ? "210px" : "110px"}`,
          minWidth: `${BigCard ? "250px" : "140px"}`,
          cursor: 'pointer',          
        }}
      >
        <div className='front'          
        >
          <Card darkTheme={darkTheme && !!VideoUrl} className={`shadow tex-center ${DivClass} ${Disable} `}
            style={{
              minHeight: `${BigCard ? "218px" : "118px"}`,
              minWidth: `${BigCard ? "250px" : "150px"}`,
            backgroundColor: 'black !important',
            backgroundImage: (darkTheme ? 'none !important' : ''),
            color: (darkTheme ? "white" : ''),
            position: "relative",              
            }}>
            
            <div>              

              <div className='d-flex justify-content-between'>
                <div className='opacity-1' style={{
                  fontSize: "12px",
                  // marginTop:"10px",
                  width: "25%",
                }}
                >
                  {!Hide360Icon ?
                    <div>
                      <img
                        className=""
                        style={{
                          // position: "absolute",
                          // right: 15,
                          padding: "0px 0px 0px 10px",
                          cursor: "pointer",

                        }}
                        width={"25px"}
                        onClick={(e) => {
                          e.stopPropagation();
                          setVideoshow(true);
                        }}
                        src={Showround}
                      />
                    </div>
                    :
                    <span className='px-2 opacity-0'>{cardNo}</span>}
                </div>
                <CenterText className={HeaderClass}
                  style={{
                    width: "70%",
                    fontSize:"9px"
                  }}
                >
                  &nbsp; {HeaderText?.toLocaleUpperCase()} &nbsp;{" "}
                </CenterText>{" "}
                <div className='d-flex justify-content-end px-2' style={{ fontSize: "12px", width: "25%", }}>
                  {/* <span className='px-2 py-2'>{cardNo || "" }</span> */}
                  <div className={`${MoveCard ? "opacity-0" : ""}`}>

                    <img src={information} alt=""
                      className="mt-1"
                      width={"10px"}
                      height={"10px"}
                    />
                  </div>
                </div>
              </div>
              {/* <br /> */}
              <div className='card-body'              
              >
                {VideoUrl && darkTheme ?
                  <Ratio
                    style={{
                      width: `${BigCard ? "400px" : "300px"}`,
                    }}
                  >
                    <embed type="" src={VideoUrl} />
                  </Ratio>
                  :
                  <div
                    style={{
                      position: "relative",
                    }}
                    className="d-flex justify-content-center"
                  >
                    {/* <div
                      className=""
                      style={{
                        position: "absolute",
                        left: "-40px",
                        bottom: "60px",
                        transform: "rotate(-90deg)",
                        width: "100px",
                        color: "black",
                        // alignItems:""
                      }}
                    >
                     {imageLoaded && <p

                      >{["followerProfile", "profile"].includes(pathnameName[1]) ? PrivateSerialNo || "" : GeneralSerialNo || ""}</p>}

                    </div> */}
                    <img
                      src={ImgUrl || TheEagle}
                      alt='the hgodler'
                      className='image-fluid pk'
                      style={{
                        height: 'auto',
                        maxWidth: '100%',
                      }}
                      onLoad={handleImageLoad}
                    />
                  </div>
                }

              </div>
              <span className='cardname pb-2' style={{
                color: (darkTheme ? "white" : ''),
              }}
              >
                <strong style={{
                  fontSize:"10px"
                }}> {cardHeader}</strong>
              </span>
            </div>
          </Card>
        </div>        
      </div >      
    </div>

  );
};

export default CardForSets;
