/** @format */
/** @format */

import React from "react";
import styled from "styled-components";
import bkgnd4 from "../assets/images/bkgnd4.png";
import bkgnd5 from "../assets/images/bkgnd5.png";
import bkgnd3 from "../assets/images/bkgnd3.png";
import bkgnd2 from "../assets/images/bkgnd2.png";
import bkgnd from "../assets/images/bkgnd.png";
import TheEagle from "../assets/images/TheEagle.png";

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
  width: 60%;
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

export type BoxItems = {
  DivClass?: string;
  HeaderText?: string;
  HeaderClass?: string;
  width?: string;
  Disable?: string;
};
const NftOneCard = ({ DivClass, HeaderText, HeaderClass,width,Disable }: BoxItems) => {
  const Width:number =window.screen.width 
  return (
    <div className='d-flex m-3 '>
      {/* First Div  */}
      <Card  className={`shadow tex-center ${DivClass} ${Disable}`} >
        <div>
          {" "}
          <CenterText className={HeaderClass}>
            &nbsp; {HeaderText?.toLocaleUpperCase()} &nbsp;{" "}
          </CenterText>{" "}
          <br />
          <br />
          <div className='card-body'>
            <img src={TheEagle} alt='the hgodler' className='img-fluid' />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NftOneCard;
