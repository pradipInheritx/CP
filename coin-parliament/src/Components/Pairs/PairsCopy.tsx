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
import Carousel from "./Carousel";
import styled from "styled-components";
import {useWindowSize} from "../../hooks/useWindowSize";
import {getMaxWidth} from "../Coins/Coins";

const MainDiv = styled.div`
  // border:1px solid red;  
    display:flex;
    flex-wrap: wrap;    
    justify-content:center;
`;
const MidDiv = styled.div`
  
    // border:1px solid red;
    width:${window.screen.width> 767? "50%" : "100%"};
    margin:auto;
    //  flex-wrap: wrap;
    display:flex;
    flex-wrap: wrap;
    // flex-direction: ${window.screen.width<767? "column":"row"};
    justify-content: ${window.screen.width<767? "center":"center"};
    
`;
const ChildDiv = styled.div`
background-color:white;
  // border:1px solid green;
  border-radius:10px;
  width:${window.screen.width<767 ?"70%":"32%"};
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
const CoinText = styled.div`
color:black;
font-weight:bold;
text-align:center;
`;

const ImgName = styled.div`
padding:30px 25px 20px 25px;
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
  
  

  return (
    <MainDiv  className="">
      <MidDiv>
        {listData && listData.map((items:any,index:number) => {
          return <ChildDiv
          className={`${window.screen.width > 767 ? "mx-1" :" mt-3"}`}
            onClick={() => {
              navigate(`/CardShow/${index}`);
              // console.log(`/pairs/${index}`,"url")
          }}
          >
            <div style={{
              position:"absolute"
            }}>
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
            <img src={items.img1} alt=""  width={"50px"}/>
             <CoinText>{ items.name1}</CoinText>
          </ImgName>
           <div className="w-25 d-flex flex-column align-items-center"
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
             <img src={items.img2} alt="" width={"50px"} />
             <CoinText>{ items.name2}</CoinText>
          </ImgName>
        </ChildDiv>
        })}
        {/* <ChildDiv>
          <div>
            <img src="" alt="" />
            <p>Name</p>
          </div>
          <div></div>
          <div></div>
        </ChildDiv>
        <ChildDiv>
          <div>
            <img src="" alt="" />
            <p>Name</p>
          </div>
          <div></div>
          <div></div>
        </ChildDiv> */}
      </MidDiv>
    </MainDiv>
  );
};

export default PairsCopy;
