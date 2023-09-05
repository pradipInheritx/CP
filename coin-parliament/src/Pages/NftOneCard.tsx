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
    border: #f5e7b5 solid 8px;
    background-color: black;
  }
  

  &.RARE {
    background-image: url(${props => !props.darkTheme && bkgnd5}) !important;
    color: #160133;
    border: #d2d2d2 solid 8px;
    background-color: black;
  }  
  &.EPIC {
    background-image: url(${props => !props.darkTheme && bkgnd3}) !important;
    color: #d4d0f3;
    border: #6352e8 solid 8px;
    background-color: black;
  }
  &.UNCOMMON {
    background-image: url(${props => !props.darkTheme && bkgnd2}) !important;
    color: #160133;
    border: #d4d0f3 solid 8px;
    border-radius: 0px 0px 8px 8px;
    background-color: black;
  }
  &.COMMON {
    background-image: url(${props => !props.darkTheme && bkgnd}) !important;
    color: #160133;
    border: #d4d0f3 solid 8px;
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
    font-weight: 100;
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
const NftOneCard = ({ darkTheme = false, DivClass, HeaderText, HeaderClass, width, Disable, cardNo, cardHeader, BackSideCard, id, flipCard, Serie, BackCardName, Rarity, Quantity, holderNo, MintedTime, PrivateSerialNo, GeneralSerialNo, fulldata, userId, CollectionType, ImgUrl, VideoUrl, Hide360Icon, BigCard, MoveCard }: BoxItems) => {



  const Width: number = window.screen.width
  const [flip, setFlip] = useState(true)
  const [Videoshow, setVideoshow] = useState(false)
  const pathname = window.location.pathname;
  const pathnameName = pathname.split("/")
  const navigate = useNavigate();
  const { singalCardData, setSingalCardData } = useContext(AppContext);

  let params = useParams();
  const { type } = params;


  console.log(MintedTime, "MintedTimecheck")
  return (
    <>
      <div
        // onMouseEnter={() => {
        //   console.log("Hello i am first")
        //   if (Disable == "" || Disable == undefined && MoveCard && window.screen.width > 767) {
        //     console.log(flip,flipCard ,"Flip Flip")
        //     console.log(MoveCard,"MoveCard")
        //     setFlip(false);
        //     if (flipCard != true) {
        //       cardFlip()
        //     }
        //   }
        // }}
        // onMouseLeave={() => {
        //   console.log(flip,flipCard ,"Flip Flip2")
        //   if (Disable == "" || Disable == undefined && MoveCard  && window.screen.width > 767) {
        //     setFlip(true);
        //     cardFlip()
        //     // if (flipCard != true) {            
        //     //   cardFlip()
        //     // }
        //   }
        // }}
        // onFocus={() => {
        //   if (Disable == "" || Disable == undefined) {          
        //     setFlip(!flip);
        //     cardFlip()
        //   }
        //   // setFlip(!flip);
        // }}
        // onFocusCapture={() => {
        //   if (Disable == "" || Disable == undefined) {          
        //     setFlip(!flip);
        //     cardFlip()
        //   }
        //   // setFlip(!flip);
        // }}
        // @ts-ignore
        // flipcard===id =true
        // flag = false = flipclass
        className={`card-container ${flipCard == true || flip != true ? "flipped" : ""}`}
        onClick={(e: any) => {
          if (Disable == "" || Disable == undefined && !MoveCard) {
            console.log('data', e.currentTarget.className?.includes('flipped'), flipCard)
            if (window.screen.width > 767) {
              if (!flip && !flipCard) {
                setFlip(true)
                cardFlip()
                return
              }


              // setFlip(!flip);
            }
            // @ts-ignore
            BackSideCard(id);
            if (window.screen.width < 767) {
              cardFlip()
            }
          }

        }}
        style={{
          minHeight: `${BigCard ? "430px" : "330px"}`,
          minWidth: `${BigCard ? "350px" : "250px"}`,
        }}
      >
        <div className='front'>
          <Card darkTheme={darkTheme && !!VideoUrl} className={`shadow tex-center ${DivClass} ${Disable} `} style={{
            // minHeight: "318px",
            // minWidth: "250px",
            minHeight: `${BigCard ? "418px" : "318px"}`,
            minWidth: `${BigCard ? "350px" : "250px"}`,
            backgroundColor: 'black !important',
            backgroundImage: (darkTheme ? 'none !important' : ''),
            color: (darkTheme ? "white" : ''),
            position: "relative"
          }}>
            <div
            // style={{
            //   width:"100%",
            //   position: "absolute",
            //   height:" 39px",
            //   marginTop: "-10px",
            // }}

            >
              {" "}
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
                        width={"35px"}
                        onClick={(e) => {
                          e.stopPropagation();
                          setVideoshow(true)
                        }}
                        src={Showround}
                      />
                    </div>
                    :
                    <span className='px-2 opacity-0'>{cardNo}</span>}
                </div>
                <CenterText className={HeaderClass}
                  style={{
                    width: "50%"
                  }}
                >
                  &nbsp; {HeaderText?.toLocaleUpperCase()} &nbsp;{" "}
                </CenterText>{" "}
                <div className='d-flex justify-content-end px-2' style={{ fontSize: "12px", width: "25%", }}>
                  {/* <span className='px-2 py-2'>{cardNo || "" }</span> */}
                  <div className={`${MoveCard ? "opacity-0" : ""}`}>

                    <img src={information} alt=""
                      className="mt-1"
                      width={"15px"}
                      height={"15px"}
                    />
                  </div>
                </div>
              </div>
              <div>
                {/* <span className="epic_text">&nbsp; Epic &nbsp; </span><br /> */}
                <span className='cardname' style={{
                  color: (darkTheme ? "white" : ''),
                }}
                >
                  <strong> {cardHeader}</strong>


                </span>
              </div>
              {/* <br /> */}
              <div className='card-body'
                onMouseEnter={() => {
                  if (Disable == "" || Disable == undefined && !MoveCard && window.screen.width > 767) {
                    console.log(MoveCard, "MoveCard")
                    setFlip(false);
                    if (flipCard != true) {
                      cardFlip()
                    }
                  }
                }}
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
                      width: "240px",
                      height: "220px",
                      // border:"1px solid red",
                      // overflow:"hidden"
                      position: "relative",
                    }}
                    className="d-flex justify-content-center"
                  >
                    <div
                      className=""
                      style={{
                        position: "absolute",
                        left: "-30px",
                        bottom: "60px",
                        transform: "rotate(-90deg)",
                        width: "100px",
                        color: "black",
                        // alignItems:""
                      }}
                    >


                      <p

                      >{["followerProfile", "profile"].includes(pathnameName[1]) ? PrivateSerialNo || "" : GeneralSerialNo || ""}</p>

                    </div>
                    <img
                      src={ImgUrl || TheEagle}
                      alt='the hgodler'
                      className='image-fluid'
                      style={{
                        // border:"1px solid red",
                        // zoom:"1.6",
                        // backgroundPosition:" center",

                        // width: "255px",
                        // height: "255px",                      
                        height: `${BigCard ? "350px" : "240px"}`,
                        width: `${BigCard ? "350px" : "240px"}`,
                        margin: "auto",
                        display: "block",
                        marginTop: "-10px",
                      }}
                    // width={"250px"}
                    // width={"100%"}
                    // height={"100%"}
                    // width={"100%"}
                    />
                    <p
                      style={{
                        position: "absolute",
                        // left: "-20px",
                        bottom: "-14PX",
                        // transform: "rotate(-90deg)",
                        color: "black",

                      }}
                    >{fulldata?.albumName?.toLocaleUpperCase()}</p>
                  </div>
                }

              </div>
            </div>
          </Card>
        </div>
        <div className='back'
          // onMouseEnter={() => {
          //   console.log("Hello i am first")  
          //   if (Disable == "" || Disable == undefined && window.screen.width > 767) {

          //     setFlip(false);
          //     if (flipCard != true) {
          //       cardFlip()
          //     }
          //   }
          // }}
          onMouseLeave={() => {
            // console.log(flip,flipCard ,"Flip Flip")
            if (Disable == "" || Disable == undefined && !MoveCard && window.screen.width > 767) {
              setFlip(true);
              cardFlip()
              // if (flipCard != true) {            
              //   cardFlip()
              // }
            }
          }}

        >
          <CardBack CardSize={BigCard} className='shadow tex-center' style={{
            // minHeight: "318px",
            // minWidth: "250px",
            minHeight: `${BigCard ? "418px" : "318px"}`,
            minWidth: `${BigCard ? "350px" : "250px"}`,
          }}>
            <div className='d-flex justify-content-center mt-2'>
              <img src={logo} alt='' width={`${BigCard ? "80px" : "60px"}`} height={`${BigCard ? "80px" : "60px"}`} />
            </div>
            <div className='mt-2 mb-3'>
              <span>
                {["followerProfile", "profile"].includes(pathnameName[1])
                  ? `Serial No. : ${PrivateSerialNo || ""}`
                  : `Serial No. : ${GeneralSerialNo || ""}`}
              </span>
              <span>Collection : {CollectionType || type}</span>
              <span>Set (Serie) : {Serie}</span>
              <span>Name : {BackCardName}</span>
              <span>Rarity : {Rarity}</span>
              <span>
                {["followerProfile", "profile"].includes(pathnameName[1]) ? `Quantity : ${Quantity}` : `Total quantity : ${Quantity}`}
              </span>
              {["followerProfile", "profile"].includes(pathnameName[1]) ? <span>Minted Time : {MintedTime}</span> : <span className="">Number of holders: {holderNo != 0 && holderNo != undefined && holderNo != "" ? <span className="d-inline"
                onClick={() => {
                  navigate(`/singalCard/${CollectionType || type}/${id}`)
                  // setSingalCardData({ ...fulldata, myID: userId })
                  localStorage.setItem("singalCardData", JSON.stringify({ ...fulldata, myID: userId }))
                }}
              >{holderNo}&nbsp;&nbsp;View All
                {/* <u
                
                }}>View All</u> */}
              </span> : 0} </span>}

              {/* {["followerProfile", "profile"].includes(pathnameName[1]) &&
              <>
              <span>
                Royalty : 0%
              </span>
              </>
              } */}

            </div>
          </CardBack>
        </div>
      </div>
      {Videoshow && <VideoPopup
        fulldata={fulldata}
        setVideoshow={setVideoshow}
        Videoshow={Videoshow}
        videoUrl={VideoUrl}
        imgUrl={ImgUrl}
        MintedTime={MintedTime}
        PrivateSerialNo={PrivateSerialNo}
      />}
    </>

  );
};

export default NftOneCard;
