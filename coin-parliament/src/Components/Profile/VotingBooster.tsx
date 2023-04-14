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
import  votingbooster  from "../../assets/images/votingbooster.png";

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
    font-size:14px;
    padding:14px 18px;
  }
`;
  return (
    <>
        <div className="d-flex justify-content-center">
          <img src={votingbooster} alt="" width={"400px"}/>
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
              {translate("Boost your voting power").toUpperCase()}
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
              {translate("Boost your voting power").toUpperCase()}
            </H2>
          )}
          <div className='d-flex justify-content-around mt-4 text-center px-3 mb-4'>
            <PriceCard>
              <div>
                <p className='fw-bold'>100 VOTES </p>
                <span>$9.99</span>
              </div>
            </PriceCard>
            <PriceCard>
              <div>
                <p className='fw-bold'>250 VOTES </p>
                <span>$19.99</span>
              </div>
            </PriceCard>
            <PriceCard>
              <div>
                <p className='fw-bold'>500 VOTES </p>
                <span>$34.99</span>
              </div>
            </PriceCard>
          </div>
        </div>
      </div>
    </>
  );
};

export default VotingBooster;
