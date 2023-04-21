/** @format */

import React, { useContext } from "react";
import { Image } from "react-bootstrap";
import { useTranslation } from "../../common/models/Dictionary";
import Pairs from "../Pairs/Pairs";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import UserContext from "../../Contexts/User";
import Coins from "../Coins/Coins";
import { calcFavorites } from "../../common/utils/coins";
import AppContext from "../../Contexts/AppContext";
import { HomeContainer } from "../App/App";
import NotificationContext from "../../Contexts/Notification";
import NotLoggedInPopup from "../App/NotLoggedInPopup";
import Quotes from "../Quotes";
import ContentContext from "../../Contexts/ContentContext";
import { useWindowSize } from "../../hooks/useWindowSize";
import InfluencersCarousel from "../Users/InfluencersCarousel";
import { BorderRadius4px } from "../../styledMixins";
import  votingbooster  from "../../assets/images/votingbooster_small.png";

const H2 = styled.h2`
  font-size: var(--font-size-xxl);
  text-align: center;
`;
const P = styled.p`
  font-size: var(--font-size-l);
  text-align: center;
`;

const TextContainer = styled.div`
  max-width: 350px;
  margin: 0 auto;
`;

const VotingBooster = () => {
  const translate = useTranslation();
  const { user } = useContext(UserContext);
  const { login, firstTimeLogin, setLogin, setLoginRedirectMessage } =
    useContext(AppContext);
  const { showModal } = useContext(NotificationContext);
  const { quotes } = useContext(ContentContext);
  const { width } = useWindowSize();

  const screenWidth = () => (window.screen.width > 979 ? "25%" : "30%");
  const screenHeight = () => (window.screen.width > 979 ? "650px" : "730px");
  const flexType = () => (window.screen.width > 979 ? "end" : "space-around");

  const BoxCard = styled.div`
  width:${screenWidth()};
  paddinng-top:20px;
  background-color:#fff;
  border:3px solid #6352E8;
  display:"flex"
  justify-content: ${flexType()};
   flex-wrap: wrap;
  border-radius:6px;
  padding:10px;
  & 
  p {
    color:'#160133';
    text-algin:"left";
    font-size:14px
  }
`;

  const PriceCard = styled.div`
  width:${screenWidth()};
  background:#fff;
  display:"flex"
  justify-content: ${flexType()};
   flex-wrap: wrap;
  border-radius:50px 0px 50px 50px;
  border:1px solid #6352E8;
  font-weight: lighter;
  boxShadow: 0px 3px 6px #00000029;
  
  & 
  div {
    color:#6352E8;    
    padding:14px 18px;
    & p{
      font-size:13px;
      font-weight:600;      
    }
    & span{
      font-size:12px;
    }
  }
`;
  return (
    <>
      <TextContainer
            className=' d-xl-none'
            style={{
              textTransform: "none",
              fontWeight: "400",
              // maxWidth: "250px",
            }}
          >
            <H2
              style={{
                // zIndex: 1,
                fontWeight: "400",
                position: "relative",
                marginTop: "44px",
                fontSize: "20px",
              }}
            >
              {translate("BOOST YOUR VOTING POWER").toUpperCase()}
            </H2>
          </TextContainer>
          {window.screen.width > 979 && (
            <H2
              style={{
                zIndex: 1,
                fontSize: "20px",
                marginTop: "35px",
                // paddingTop: "30px",
              }}
            >
              {translate("BOOST YOUR VOTING POWER").toUpperCase()}
            </H2>
          )}
        <div className="d-flex justify-content-center">
          <img src={votingbooster} alt="" width={window.screen.width>767? "400px":"300px"}/>
        </div>
      <div
        className='p-0 m-0 w-100 d-flex justify-content-center'
        style={{
          background: "#160133",
          // height: `${screenHeight()}`,
        }}
      >
        <div
          className=''
          style={{
            background: "#160133",
            width: `${window.screen.width > 979 ? "730px" : "100%"}`,
          }}
        >          
          <div className='d-flex justify-content-around mt-4 text-center px-3 mb-4'>
            <PriceCard>
              <div>
                <p className='my-1'>Buy extra 100 votes</p>
                <span>For only <strong>$9.99</strong> </span>
              </div>
            </PriceCard>
            <PriceCard>
              <div>
                <p className='my-1'>Buy extra 200 votes</p>
                <span>For only <strong>$19.99</strong></span>
              </div>
            </PriceCard>
            <PriceCard>
              <div>
                <p className='my-1'>Buy extra 300 votes</p>
                <span>For only <strong>$29.99</strong></span>
              </div>
            </PriceCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default VotingBooster;
