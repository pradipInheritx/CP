/** @format */
/** @format */

import React, { useState } from "react";
import styled from "styled-components";
import bkgnd4 from "../assets/images/bkgnd4.png";
import bkgnd5 from "../assets/images/bkgnd5.png";
import bkgnd3 from "../assets/images/bkgnd3.png";
import bkgnd2 from "../assets/images/bkgnd2.png";
import bkgnd from "../assets/images/bkgnd.png";
import TheEagle from "../assets/images/TheEagle.png";
import backBg from "../assets/images/backBg.png";
import { logo } from "../assets/svg/logo";
import { Link, useNavigate } from "react-router-dom";


const Card = styled.div`

  border-radius: 0px 0px 8px 8px;
  text-transform: uppercase;
  font-size: 14px;
  line-height: 14px;

  &.Legendary {
    background-image: url(${bkgnd4}) !important;
    color: #160133;
    border: #f5e7b5 solid 8px;
    background-color: #f5e7b5;
  }

  &.Rare {
    background-image: url(${bkgnd5}) !important;
    color: #160133;
    border: #d2d2d2 solid 8px;
    background-color: #d2d2d2;
  }
  &.Epic {
    background-image: url(${bkgnd3}) !important;
    color: #d4d0f3;
    border: #6352e8 solid 8px;
    background-color: #6352e8;
  }
  &.UNCommon {
    background-image: url(${bkgnd2}) !important;
    color: #160133;
    border: #d4d0f3 solid 8px;
    border-radius: 0px 0px 8px 8px;
    background-color: #d4d0f3;
  }
  &.Common {
    background-image: url(${bkgnd}) !important;
    color: #160133;
    border: #d4d0f3 solid 8px;
    border-radius: 0px 0px 8px 8px;
    background-color: #d4d0f3;
    
  }
  &.CardDisebal{
    opacity: 0.3;
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
  &.Legendary_text {
    border: #f5e7b5 solid 6px;
    background-color: #f5e7b5;
  }
  &.Rare_text {
    border: #d2d2d2 solid 6px;
    background-color: #d2d2d2;
  }

  &.Epic_text {
    border: #6352e8 solid 6px;

    background-color: #6352e8;
  }

  &.UNCommon_text {
    border: #d4d0f3 solid 6px;
    background-color: #d4d0f3;
  }
  &.Common_text {
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
  flipCard?:boolean|string
};
const NftOneCard = ({ DivClass, HeaderText, HeaderClass,width,Disable,cardNo ,cardHeader,BackSideCard,id,flipCard}: BoxItems) => {
  const Width: number = window.screen.width 
  const [flip, setFlip] = useState(true)
  const pathname = window.location.pathname;
  const pathnameName = pathname.split("/")
  const navigate = useNavigate();
  

  return (
    
    <div
      onMouseEnter={() => {
        setFlip(!flip);
      }}
      onMouseLeave={() => {
        setFlip(!flip);
      }}
      onFocus={() => {
        setFlip(!flip);
      }}
      onFocusCapture={() => {
        setFlip(!flip);
      }}
      className={`card-container ${
        flipCard == true || flip != true ? " flipped" : ""
      }`}
      onClick={() => {
        // @ts-ignore
        BackSideCard(id);
      }}
    >
      <div className='front'>
        {/* First Div  */}
        <Card className={`shadow tex-center ${DivClass} ${Disable} `}>
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
                <span className='px-2'>{cardNo}</span>
              </div>
            </div>
            <div>
              {/* <span className="epic_text">&nbsp; Epic &nbsp; </span><br /> */}
              <span className='cardname'>
                THE<strong> {cardHeader}</strong>
              </span>
            </div>
            <br />
            <div className='card-body'>
              <img
                src={TheEagle}
                alt='the hgodler'
                className=''
                width={"200px"}
              />
            </div>
          </div>
        </Card>
      </div>
      <div className='back'>
        <CardBack className='shadow tex-center'>
          <div className='d-flex justify-content-center mt-2'>
            <img src={logo} alt='' width='60px' height='60px' />
          </div>
          <div className='mt-2 mb-3'>
            <span>
              {pathnameName[1] == "profile"
                ? "Private Card Serial No."
                : "General Card Serial No."}
            </span>
            <span>Collection</span>
            <span>Set (Serie)</span>
            <span>Name</span>
            <span>Rarity</span>
            <span>
              {pathnameName[1] == "profile" ? "Quantity" : "Total quantity"}
            </span>
            {pathnameName[1] == "profile" ? <span>Minted Time</span> : <span>Number of holders: 10<u onClick={() => {
              navigate(`/singalCard/${id}`)
            }}
            >  View all </u> </span>}
          </div>
        </CardBack>
      </div>
    </div>
  );
};

export default NftOneCard;
