/** @format */

import React, { useContext } from "react";
import { Col, Image, Row } from "react-bootstrap";
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
import votingbooster from "../../assets/images/votingbooster_small.png";

const H2 = styled.h2`
width: 100%;
height: 45px;
left: 806px;
top: 129px;

font-family: 'Poppins';
font-style: normal;
font-weight: 700;
font-size: 30px;
line-height: 45px;

/* identical to box height */
letter-spacing: 0.02em;
text-transform: uppercase;

color: #FEFEFE;

text-shadow: 0px 1px 3px #5B03FF;
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
const Prices = styled.div`
box-sizing: border-box;
width: 264px;
height: 261px;
left: 1269px;
top: 578px;
background: linear-gradient(180.07deg, #543CD6 0.05%, #361F86 48.96%, #160133 99.94%);
`;
const Corner = styled.div`
  width: 0; 
	height: 0; 
	border-top: 50px solid #CA0088;
	border-bottom: 50px solid transparent;
	border-right: 50px solid transparent;
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
      <Row>
        <Col sm={6} className="text-center">
          <img src={votingbooster} alt="" width={window.screen.width > 767 ? "400px" : "300px"} />
        </Col>
        <Col sm={6}>
          <Row>
            <Col sm={2}>
              <Prices style={{}}>
                <Corner>
                  <span style={{
                    position: 'absolute',
                    width: '47px',
                    height: '27px',
                    left: '1278px',
                    top: '247px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: '700',
                    fontSize: '22px',
                    lineHeight: '26px'
                  }}>20% EXTRA</span>
                </Corner>
              </Prices>
            </Col>
            <Col sm={2}></Col>
            <Col sm={2}></Col>
            <Col sm={2}></Col>
          </Row>
        </Col >
      </Row >
      <div className="d-flex justify-content-center">

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
