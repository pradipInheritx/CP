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
    border-width: 8px;
    border-style: solid;        
    background-color: black;   
  }
  

  &.RARE {
    background-image: url(${props => !props.darkTheme && bkgnd5}) !important;
    color: #160133;
    border-image: linear-gradient(180deg, #B0B0B0 0.05%, #FFF 51.39%, #B0B0B0 99.94%) 30;     
    border-width: 8px;
    border-style: solid;        
    background-color: black;    
  }  
  &.EPIC {    
    background-image: url(${props => !props.darkTheme && bkgnd3}) !important;
    color: #d4d0f3;    
    border-image:linear-gradient(180deg, #6250EE 0.05%, #D5ABFF 51.39%, #6250EE 99.94%) 30;     
    border-width: 8px;
    border-style: solid;    
    border-radius: 0px 0px 8px 8px;    
    background-color: black;    
  }
  &.UNCOMMON {
    background-image: url(${props => !props.darkTheme && bkgnd2}) !important;
    color: #160133;        
    border-image: linear-gradient(180deg, #D4D1F2 0.05%, #FFF 60.39%, #D4D1F2 99.94%) 30;     
    border-width: 8px;
    border-style: solid;    
    border-color: #D4D1F2;

    border-radius: 0px 0px 8px 8px;
    background-color: black;
  }
  &.COMMON {
    background-image: url(${props => !props.darkTheme && bkgnd}) !important;
    color: #160133;
    border-image: linear-gradient(180deg, #D4D1F2 0.05%, #FFF 60.39%, #D4D1F2 99.94%) 30;        
    border-width: 8px;
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
  ShowQuantity?: any;
  isFollower?: boolean
};
const NftOneCard = ({ darkTheme = false, DivClass, HeaderText, HeaderClass, width, Disable, cardNo, cardHeader, BackSideCard, id, flipCard, Serie, BackCardName, Rarity, Quantity, holderNo, MintedTime, PrivateSerialNo, GeneralSerialNo, fulldata, userId, CollectionType, ImgUrl, VideoUrl, Hide360Icon, BigCard, MoveCard, ShowQuantity, isFollower}: BoxItems) => {



  const Width: number = window.screen.width
  const [flip, setFlip] = useState(true)
  const [Videoshow, setVideoshow] = useState(false)
  const pathname = window.location.pathname;
  const pathnameName = pathname.split("/")
  const navigate = useNavigate();
  const { singalCardData, setSingalCardData } = useContext(AppContext);
  const [tooltipShow, setTooltipShow] = React.useState(false);
  const [tooltipShow2, setTooltipShow2] = React.useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  let params = useParams();
  const { type } = params;
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // console.log(MintedTime, "MintedTimecheck")
  return (
    <div
      className="d-flex justify-content-center"      
    >      
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
        className={`card-container ${flipCard == true || flip != true ? "flipped" : ""
          }`}
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
          cursor: 'pointer',          
        }}
      >
        <div className='front'          
        >
          <Card darkTheme={darkTheme && !!VideoUrl} className={`shadow tex-center ${DivClass} ${Disable} `}
            style={{
            // minHeight: "318px",
            // minWidth: "250px",
            minHeight: `${BigCard ? "418px" : "318px"}`,
            minWidth: `${BigCard ? "350px" : "250px"}`,
            backgroundColor: 'black !important',
            backgroundImage: (darkTheme ? 'none !important' : ''),
            color: (darkTheme ? "white" : ''),
            position: "relative",              
            }}>
            
            <div
            // style={{
            //   width:"100%",
            //   position: "absolute",
            //   height:" 39px",
            //   marginTop: "-10px",
            // }}
              
            >              

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
              {/* <br /> */}
              <div className='card-body'
              // onMouseEnter={() => {
              //   if (Disable == "" || Disable == undefined && !MoveCard && window.screen.width > 767) {
              //     console.log(MoveCard, "MoveCard")
              //     setFlip(false);
              //     if (flipCard != true) {
              //       cardFlip()
              //     }
              //   }
              // }}
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
                      // width: "240px",
                      // height: "220px",
                      // border:"1px solid red",
                      // overflow:"hidden"
                      position: "relative",
                    }}
                    className="d-flex justify-content-center"
                  >
                    {["followerProfile", "profile"].includes(pathnameName[1]) && <span
                      style={{
                        
                        position: "absolute",
                        left: "0px",
                        // bottom: "60px",
                        top:"85px",
                        // transform: "rotate(-90deg)",
                        // width: "100px",
                        color: "black",
                        border: "1px solid #7557ff",
                        borderRadius: "10px",
                        width:"20px",
                        height: "20px",                        
                        textAlign: "center",
                        paddingTop:"2.5px",
                        // alignItems:""
                      }}
                    >
                      {ShowQuantity}
                    </span>}
                    <div
                      className=""
                      style={{
                        position: "absolute",
                        left: "-40px",
                        bottom: "70px",
                        transform: "rotate(-90deg)",
                        width: "100px",
                        color: "black",
                        // alignItems:""
                      }}
                    >
                     {imageLoaded && <p

                      >{["followerProfile", "profile"].includes(pathnameName[1]) ? GeneralSerialNo || "" : GeneralSerialNo || ""}</p>}

                    </div>
                    <img
                      src={ImgUrl || TheEagle}
                      alt='the hgodler'
                      className='image-fluid pk'
                      style={{
                        height: 'auto',
                        maxWidth: '100%',
                        // height: `${BigCard ? "350px" : "240px"}`,
                        // width: `${BigCard ? "350px" : "240px"}`,
                        // margin: "auto",
                        // display: "block",
                        // marginTop: "-10px",
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
                <strong> {cardHeader}</strong>
              </span>
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
            <div className=''>
              <span>
                {["followerProfile", "profile"].includes(pathnameName[1])
                  ?
                  <span
                    className="d-inline border-0 d-flex"
                    onClick={() => {
                      navigate(`/singlecarddetails/${CollectionType || type}/${id}`)
                      // setSingalCardData({ ...fulldata, myID: userId })
                      localStorage.setItem("singalCardData", JSON.stringify({ ...fulldata, myID: userId, isFollower: isFollower }))
                    }}
                  >
                    Serial No. : &nbsp;{<u>{GeneralSerialNo || ""}</u>}
                    <img src={information2} alt=""
                      className="mx-1"
                      width={"10px"}
                      height={"10px"}
                      onMouseEnter={(e) => {
                        e.stopPropagation();
                        setTooltipShow2(true)
                      }}
                      onMouseLeave={(e) => {
                        e.stopPropagation();
                        setTooltipShow2(false);
                      }}
                    />
                  </span>
                  
                  // `Serial No. : ${GeneralSerialNo || ""}`

                  : `Serial No. : ${GeneralSerialNo || ""}`}
              </span>
              <span>Collection : {CollectionType || type}</span>
              <span>Set (Serie) : {Serie}</span>
              <span>Name : {BackCardName}</span>
              <span>Rarity : {Rarity}</span>
              {
                tooltipShow &&
                <div
                  style={{
                    display: "relative",
                  }}
                >
                  <div className="newtooltip2"
                    style={{
                      width: "93%",
                      marginTop: "-86%",
                      fontSize: "11px"
                    }}
                  >
                    {/* <p>Your CMP count</p> */}
                    <p className="mt-1 lh-base"
                    style={{
                      textAlign:"left"
                    }}
                    >
                      As the original Collectible card holder, you get 50% of the royalties from the fee charged on Collectible card sale lifetime! This arrangement ensures you have a continuous and substantial income stream from your digital assets. only members who upgrade their account will have their cards converted to Collectible cards
                    </p>
                  </div>
                </div>
              }

              {
                tooltipShow2 &&
                <div
                  style={{
                    display: "relative",
                  }}
                >
                  <div className="newtooltip2"
                    style={{
                      width: "93%",
                      marginTop: "-35%",
                      fontSize: "11px"
                    }}
                  >
                    {/* <p>Your CMP count</p> */}
                    <p className="mt-1 lh-base"
                    style={{
                      textAlign:"left"
                    }}
                    >
                        Please click on serial number to see all details
                    </p>
                  </div>
                </div>
              }
              <span className="d-flex align-items-end mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setTooltipShow((prev) => !prev)
                }}
              >Royalty : {"50%"}&nbsp;&nbsp;
                <img src={information2} alt=""
                  className="mt-1"
                  width={"10px"}
                  height={"10px"}
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    setTooltipShow(true)
                  }}
                  onMouseLeave={(e) => {
                    e.stopPropagation();
                    setTooltipShow(false);
                  }}
                />
              </span>

              <span>
                {["followerProfile", "profile", "singlecarddetails"].includes(pathnameName[1]) ?
                  <div className="d-flex">                    
                    Quantity : &nbsp;{<u>{ShowQuantity}</u>}                   
                  <img src={information2} alt=""
                    className="mx-1"
                    width={"10px"}
                    height={"10px"}
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      setTooltipShow2(true)
                    }}
                    onMouseLeave={(e) => {
                      e.stopPropagation();
                      setTooltipShow2(false);
                    }}
                  />
                </div> : `Total quantity : ${Quantity}`}
              </span>
              {["followerProfile", "profile", "singlecarddetails"].includes(pathnameName[1]) ?
                // <span>Minted Time : {MintedTime}</span> 
                // <span>General Serial : {GeneralSerialNo || ""}</span>
                ""
                : <span className="">Number of holders: {holderNo != 0 && holderNo != undefined && holderNo != "" ?
                <span className="d-inline border-0"
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

      </div >
      {Videoshow && <VideoPopup
        fulldata={fulldata}
        setVideoshow={setVideoshow}
        Videoshow={Videoshow}
        videoUrl={VideoUrl}
        imgUrl={ImgUrl}
        MintedTime={MintedTime}
        PrivateSerialNo={PrivateSerialNo}
      />}
    </div>

  );
};

export default NftOneCard;
