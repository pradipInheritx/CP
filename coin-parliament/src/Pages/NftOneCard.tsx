/** @format */
/** @format */

import React, { useContext, useState } from "react";
import styled from "styled-components";
import bkgnd4 from "../assets/images/bkgnd4.png";
import bkgnd5 from "../assets/images/bkgnd5.png";
import bkgnd3 from "../assets/images/bkgnd3.png";
import bkgnd2 from "../assets/images/bkgnd2.png";
import bkgnd from "../assets/images/bkgnd.png";
import TheEagle from "../assets/images/TheEagle.png";
import backBg from "../assets/images/backBg.png";
import { logo } from "../assets/svg/logo";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppContext from "../Contexts/AppContext";
import { cardFlip } from "../common/utils/SoundClick";


const Card = styled.div`

  border-radius: 0px 0px 8px 8px;
  text-transform: uppercase;
  font-size: 14px;
  line-height: 14px;

  &.LEGENDARY {
    background-image: url(${bkgnd4}) !important;
    color: #160133;
    border: #f5e7b5 solid 8px;
    background-color: #f5e7b5;
  }
  

  &.RARE {
    background-image: url(${bkgnd5}) !important;
    color: #160133;
    border: #d2d2d2 solid 8px;
    background-color: #d2d2d2;
  }  
  &.EPIC {
    background-image: url(${bkgnd3}) !important;
    color: #d4d0f3;
    border: #6352e8 solid 8px;
    background-color: #6352e8;
  }
  &.UNCOMMON {
    background-image: url(${bkgnd2}) !important;
    color: #160133;
    border: #d4d0f3 solid 8px;
    border-radius: 0px 0px 8px 8px;
    background-color: #d4d0f3;
  }
  &.COMMON {
    background-image: url(${bkgnd}) !important;
    color: #160133;
    border: #d4d0f3 solid 8px;
    border-radius: 0px 0px 8px 8px;
    background-color: #d4d0f3;
    
  }
  &.CardDisebal{
    opacity: 0.5;
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

const CardBack = styled.div`
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
    opacity: 0.8;
    font-size: 10px;
    line-height: 10px;
    display: inline-block;
    width: 95%;
    border: none;
    background: none;
    border-bottom: 1px solid #5f4edb;
    color: #fff;
    margin: 0px 5px;
    padding: 0px 0px 2px 0px;
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
  BackSideCard?: (e: any) => void ;
  id?: string | number;
  flipCard?: boolean | string;  
  Serie?:string;
  BackCardName?:string;
   Rarity?:string;
   Quantity?:string;
  holderNo?: string | number;
  MintedTime?: string | number;
  PrivateSerialNo?: string | number;
  GeneralSerialNo?: string | number;
  fulldata?:any;
  userId?:any;
  CollectionType?:any;
  ImgUrl?:any;
};
const NftOneCard = ({ DivClass, HeaderText, HeaderClass, width, Disable, cardNo, cardHeader, BackSideCard, id, flipCard, Serie, BackCardName, Rarity, Quantity, holderNo, MintedTime, PrivateSerialNo, GeneralSerialNo, fulldata, userId, CollectionType ,ImgUrl}: BoxItems) => {
  


  const Width: number = window.screen.width 
  const [flip, setFlip] = useState(true)
  const pathname = window.location.pathname;
  const pathnameName = pathname.split("/")
  const navigate = useNavigate();
  const { singalCardData, setSingalCardData } = useContext(AppContext);    
  
      let params = useParams();
  const { type} = params;
  

  return (
    
    <div
      onMouseEnter={() => {
        if (Disable == "" || Disable == undefined && window.screen.width > 767) {          
          setFlip(false);
          if (flipCard != true) {            
            cardFlip()
          }
        }        
      }}
      onMouseLeave={() => {
        if (Disable == "" || Disable == undefined && window.screen.width > 767) {                 
          setFlip(true);
          // cardFlip()
          // if (flipCard != true) {            
          //   cardFlip()
          // }
        }        
      }}
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
      className={`card-container ${
        flipCard == true || flip != true ? "flipped" : ""
      }`}
      onClick={(e:any) => {
        if (Disable == "" || Disable == undefined) { 
          console.log('data',e.currentTarget.className?.includes('flipped'), flipCard)
         if(window.screen.width>767) {
          if(!flip && !flipCard){
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
        minHeight: "330px",
        minWidth:"250px",
      }}
    >
      <div className='front'>
        {/* First Div  */}
        <Card className={`shadow tex-center ${DivClass} ${Disable} `} style={{
          minHeight: "318px",
          minWidth:"250px"
      }}>
          <div>
            {" "}
            <div className='d-flex justify-content-between'>
              <div className='opacity-0' style={{ fontSize: "12px" }}>
                <span className='px-2'>{cardNo}</span>
              </div>
              <CenterText className={HeaderClass}>
                &nbsp; {HeaderText?.toLocaleUpperCase()} &nbsp;{" "}
              </CenterText>{" "}
              <div className='' style={{ fontSize: "12px" }}>
                <span className='px-2 py-2'>{cardNo || ""}</span>
              </div>
            </div>
            <div>
              {/* <span className="epic_text">&nbsp; Epic &nbsp; </span><br /> */}
              <span className='cardname'>
                <strong> {cardHeader}</strong>
              </span>
            </div>
            <br />
            <div className='card-body'>
              <img
                src={ImgUrl || TheEagle}
                alt='the hgodler'
                className=''
                width={"200px"}
              />
            </div>
          </div>
        </Card>
      </div>
      <div className='back'>
        <CardBack className='shadow tex-center' style={{
          minHeight: "318px",
          minWidth:"250px",
      }}>
          <div className='d-flex justify-content-center mt-2'>
            <img src={logo} alt='' width='60px' height='60px' />
          </div>
          <div className='mt-2 mb-3'>
            <span>
              {["followerProfile", "profile"].includes(pathnameName[1])
                ? `Serial No. : ${PrivateSerialNo || ""}`
                : `Serial No. : ${GeneralSerialNo || ""}` }
            </span>
            <span>Collection : {CollectionType || type}</span>
            <span>Set (Serie) : {Serie}</span>
            <span>Name : {BackCardName}</span>
            <span>Rarity : {Rarity}</span>
            <span>
              {["followerProfile", "profile"].includes(pathnameName[1]) ? `Quantity : ${Quantity}` : `Total quantity : ${Quantity}`}
            </span>
            {["followerProfile", "profile"].includes(pathnameName[1]) ? <span>Minted Time : {MintedTime}</span> : <span className="">Number of holders: {holderNo != 0 && holderNo != undefined && holderNo != "" ? <span className="d-inline">{holderNo}
              <u
            onClick={() => {
                navigate(`/singalCard/${CollectionType || type}/${id}`)            
                setSingalCardData({ ...fulldata, myID: userId })
                localStorage.setItem("singalCardData", JSON.stringify({ ...fulldata, myID: userId }))
            }}> View All</u></span> : 0} </span>}
            
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
  );
};

export default NftOneCard;
