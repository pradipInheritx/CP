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
import upgrade1 from "../../assets/svg/upgrade1.svg";
import upgrade2 from "../../assets/svg/upgrade2.svg";
import upgrade3 from "../../assets/svg/upgrade3.svg";
import UpgradeCopy from "./UpgradeCopy";
import { handleSoundClick } from "../../common/utils/SoundClick";

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

const UpgradePage = () => {
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
  paddinng-top:20px;
  background:linear-gradient(to bottom, #6352E8 0%, #3712B3 100%);
  display:"flex"
  justify-content: ${flexType()};
   flex-wrap: wrap;
  border-radius:6px;
  font-weight: lighter;
  boxShadow: 0px 3px 6px #00000029;
  
  & 
  div {
    color:#fff;
    font-size:14px;
    padding:14px 18px;
    
  }
`;
  return (
    <>
      <div
        className='p-0 m-0 w-100 d-flex justify-content-center'
        style={{
          background: "#160133",
          height: `${screenHeight()}`,
          // width: `${window.screen.width > 979 ? "730px" : "100%"}`,
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
            className='d-xl-none '
            style={
              {
                // textTransform: "none",
              }
            }
          >
            <H2
              style={{
                fontWeight: "bold",
                position: "relative",
                fontSize: "20px",
                paddingTop: "45px",
              }}
            >
              {translate("UPGRADE YOUR VOTING PASS!")}
            </H2>
            <p
              className='fw-lighter'
              style={{
                // fontWeight: "100",
                textAlign: "center",
                marginTop: "20px",
                fontSize: "15px",
                padding: "0px 10px 0px 10px",
              }}
            >
              {translate(
                "By upgrading your Voting pass you will be able to mint PAX token, Earn NFTs and power up the voting"
              )}
            </p>
          </TextContainer>
          {window.screen.width > 979 && (
            <H2
              style={{
                fontSize: "20px",
                marginTop: "0px",
                paddingTop: "30px",
                fontWeight: "bold",
              }}
            >
              {translate("UPGRADE YOUR VOTING PASS!")}
            </H2>
          )}
          {window.screen.width > 979 && (
            <P
              style={{ fontSize: "15px", fontWeight: "100", marginTop: "10px" }}
            >
              {translate(
                "By upgrading your Voting pass you will be able to mint PAX token, Earn NFTs and power up the voting"
              )}
            </P>
          )}

          <div
            className='d-flex justify-content-around px-3 text-center'
            style={{ marginTop: "47px" }}
          >
            <BoxCard>
              <p className='text-end' style={{ color: "#160133" }}>
                Get an exclusive Avatar NFT!
              </p>
              <div className='mt-3 mb-2 d-flex justify-content-center align-items-center'>
                <img className='' src={upgrade1} alt='' />
              </div>
            </BoxCard>
            <BoxCard>
              <p className='text-end' style={{ color: "#160133" }}>
                Power up your voting
              </p>
              <div className='mt-3 mb-2 d-flex justify-content-center align-items-center'>
                <button
                  type='button'
                  className='btn fw-bold'
                  style={{
                    background:
                      " linear-gradient(to bottom, #6352E8 0%, #3712B3 100%)" /* fallback for old browsers */,
                    color: "#fff",
                    // width: "340px",
                    marginTop: "25px",
                    // padding: "14px 44px",
                    boxShadow: "0px 3px 6px #00000029",
                    fontSize: "10px",
                  }}
                >
                  100 VOTES
                </button>
              </div>
            </BoxCard>
            <BoxCard>
              <p className='text-end' style={{ color: "#160133" }}>
                Cash Out Your Minted PAX tokens
              </p>
              <div className='mt-3 mb-2 d-flex justify-content-center align-items-center'>
                <img className='' src={upgrade2} alt='' />
              </div>
            </BoxCard>
          </div>
          <TextContainer
            className='d-xl-none '
            style={{
              textTransform: "none",
              fontWeight: "400",
              // maxWidth: "280px",
            }}
          >
            <H2
              style={{
                zIndex: 1,
                fontWeight: "400",
                position: "relative",
                marginTop: "15px",
                fontSize: "26px",
              }}
            >
              {translate("ONETIME PAYMENT OF $199")}
            </H2>
          </TextContainer>
          {window.screen.width > 979 && (
            <H2
              style={{
                zIndex: 1,
                fontSize: "20px",
                marginTop: "0px",
                paddingTop: "30px",
              }}
            >
              {translate("ONETIME PAYMENT OF $199")}
            </H2>
          )}
          <div
            className='text-center'
            style={{
              zIndex: 1,
              fontWeight: "400",
              position: "relative",
              marginTop: "20px",
            }}
          >
            <button
              type='button'
              className='btn '
              onClick={() => {
                handleSoundClick()
                showModal(<UpgradeCopy />)
              }}
              style={{
                background:
                  " linear-gradient(to bottom, #6352E8 0%, #3712B3 100%)" /* fallback for old browsers */,
                color: "#fff",
                width: "340px",
                // margin: "20px",
                padding: "14px 44px",
                boxShadow: "0px 3px 6px #00000029",
                fontSize: "31px",
              }}
            >
              BUY NOW
            </button>
          </div>

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
                zIndex: 1,
                fontWeight: "400",
                position: "relative",
                marginTop: "44px",
                fontSize: "20px",
              }}
            >
              {translate("Power up your voting")}
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
              {translate("Power up your voting")}
            </H2>
          )}
          <div className='d-flex justify-content-around mt-4 text-center px-3'>
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

export default UpgradePage;
