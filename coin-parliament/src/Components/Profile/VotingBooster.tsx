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
import Rectangle from "assets/images/Rectangle.png"
import Gift from "assets/images/gift.png"
import BGOBJECTS from "assets/images/BGOBJECTS.png"
const H2 = styled.h2`
width: 100%;
height: 45px;
left: 806px;
top: 129px;
font-family: 'Poppins';
font-style: normal;
font-weight: 700;
// font-size: 30px;
line-height: 45px;
color: #FEFEFE;
text-shadow: 0px 1px 3px 0px #5B03FF;
font-size: ${window.screen.width > 767 ? "30px" :"20px"};
font-family: Poppins;
font-weight: 700;
letter-spacing: 0.6px;
text-transform: uppercase; 
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
  position:relative;
  width: 95px; 
	height: 95px;
  background-image:url(${Rectangle}) 
`;
const CornerText = styled.span`
  width: 60px;
  text-align: center;
  display:block;
  line-height: 14.497px !important;
  top:-3.8em;
  padding-top:0.4em;
`;
const ForOnly = styled.span`
color: #673C09;
font-size: 11px;
font-family: Poppins;
font-weight: 700;
text-transform: capitalize; 
`;
const Price = styled.span`
font-family: Poppins;
font-size: 25px;
font-weight: 700;
line-height: 45px;
text-align: left;
color:#FFE927;
text-shadow:-1px -1px 0px #AF6A19;
display:block;
margin-left:-0.4em;
margin-top: -0.2em;
`;
const ExtraText = styled.p`
font-size:14px;
  background: -webkit-linear-gradient(270deg, #FEFEFE 20.94%, #3C1ABA 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
          marginTop: "35px",
        }}
      >
        {translate("BOOST YOUR VOTING POWER").toUpperCase()}
      </H2>
      <Row className="pt-5 pb-5">
        <Col sm={6} className="d-flex justify-content-md-end justify-content-center">
          <img src={votingbooster} alt=""  />
        </Col>
        <Col sm={6}>
          <Row className="">
            <Col lg={5} sm={6} className="d-flex justify-content-center">
              <Prices style={{}}>   
               <div style={{
                  backgroundImage: `url(${BGOBJECTS})`,
                  position:"absolute",
                  width: "264px",
                  height: "330px",
                  marginTop:"-75px",
                  marginLeft: "-20px",
                  opacity: "0.2",
                  zIndex:"1"

                }}>
                  </div>  
                <div
                  style={{
                    position:"relative",
                    width: "95px",
                    height: "95px",
                  }}                    
                  >
                  {/* <CornerText style={{
                    color: '#FFF',
                    fontSize: '22px',
                    fontFamily: 'Poppins',
                    fontWeight: '700',
                    
                  }}>20% <br /><span style={{ fontSize: '12px', marginLeft: '-6px' }}>EXTRA</span></CornerText> */}
                </div>
                <div style={{ backgroundImage: `url(${Gift}) , url(${BGOBJECTS})`, width: '100%', height: '50%', backgroundRepeat: 'no-repeat', marginLeft: '4em', marginTop: '-2em', paddingTop: '1.5em', paddingLeft: '5em' }}>
                  <ForOnly>For Only</ForOnly>
                  <Price>$5.00</Price>
                </div>
                
                <ExtraText className="text-center">
                  <p>BUY 5 VOTES</p>
                </ExtraText>
                  
              </Prices>
            </Col>
            <Col lg={5} sm={6} className="d-flex justify-content-md-start justify-content-center">
              <Prices style={{}}>
                <div style={{
                  backgroundImage: `url(${BGOBJECTS})`,
                  position:"absolute",
                  width: "264px",
                  height: "330px",
                  marginTop:"-75px",
                  marginLeft: "-20px",
                  opacity: "0.2",
                  zIndex:"1"

                }}>
                  </div>  
                <Corner>
                  <CornerText style={{
                    color: '#FFF',
                    fontSize: '22px',
                    fontFamily: 'Poppins',
                    fontWeight: '700',

                  }}>20% <br /><span style={{ fontSize: '12px', }}>EXTRA</span></CornerText>
                </Corner>
                <div style={{ backgroundImage: `url(${Gift})`, width: '100%', height: '50%', backgroundRepeat: 'no-repeat', marginLeft: '4em', marginTop: '-2em', paddingTop: '1.5em', paddingLeft: '5em' }}>
                  <ForOnly>For Only</ForOnly>
                  <Price>$10.00</Price>
                </div>
                <ExtraText className="text-center">
                  <p>BUY 12 VOTES</p>
                </ExtraText>
              </Prices>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col lg={5} sm={6} className="d-flex justify-content-center">
              <Prices style={{}}>
                <div style={{
                  backgroundImage: `url(${BGOBJECTS})`,
                  position:"absolute",
                  width: "264px",
                  height: "330px",
                  marginTop:"-75px",
                  marginLeft: "-20px",
                  opacity: "0.2",
                  zIndex:"1"

                }}>
                  </div>  
                <Corner>
                  <CornerText style={{
                    color: '#FFF',
                    fontSize: '22px',
                    fontFamily: 'Poppins',
                    fontWeight: '700',

                  }}>25% <br /><span style={{ fontSize: '12px', marginLeft: '-6px' }}>EXTRA</span></CornerText>
                </Corner>
                <div style={{ backgroundImage: `url(${Gift})`, width: '100%', height: '50%', backgroundRepeat: 'no-repeat', marginLeft: '4em', marginTop: '-2em', paddingTop: '1.5em', paddingLeft: '5em' }}>
                  <ForOnly>For Only</ForOnly>
                  <Price>$15.00</Price>
                </div>
                <ExtraText className="text-center">
                  <p>BUY 20 VOTES</p>
                </ExtraText>
              </Prices>
            </Col>
            <Col lg={5} sm={6} className="d-flex justify-content-md-start justify-content-center">
              <Prices style={{}}>
                <div style={{
                  backgroundImage: `url(${BGOBJECTS})`,
                  position:"absolute",
                  width: "264px",
                  height: "330px",
                  marginTop:"-75px",
                  marginLeft: "-20px",
                  opacity: "0.2",
                  zIndex:"1"

                }}>
                  </div>  
                <Corner>
                  <CornerText style={{
                    color: '#FFF',
                    fontSize: '22px',
                    fontFamily: 'Poppins',
                    fontWeight: '700',

                  }}>33% <br /><span style={{ fontSize: '12px', }}>EXTRA</span></CornerText>
                </Corner>
                <div style={{ backgroundImage: `url(${Gift})`, width: '100%', height: '50%', backgroundRepeat: 'no-repeat', marginLeft: '4em', marginTop: '-2em', paddingTop: '1.5em', paddingLeft: '5em' }}>
                  <ForOnly>For Only</ForOnly>
                  <Price>$20.00</Price>
                </div>
                <ExtraText className="text-center">
                  <p>BUY 30 VOTES</p>
                </ExtraText>
              </Prices>
            </Col>
          </Row>
        </Col >
      </Row >
      {/* <div
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
      </div> */}
    </>
  );
};

export default VotingBooster;
