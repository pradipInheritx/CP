/** @format */

import React, { useContext, useState } from "react";
import { Col, Image, Modal, Row } from "react-bootstrap";
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
import votingbooster from "../../assets/images/votingbooster_small2.png";
import Rectangle from "assets/images/Rectangle.png"
import Gift from "assets/images/gift.png"
import BGOBJECTS from "assets/images/BGOBJECTS.png"
import { useNavigate } from "react-router-dom";
import VoteBg from '../../assets/images/VoteBg.png';
import votebgMob from '../../assets/images/votebgMob.png';
import VoteStar from '../../assets/images/VoteStar.png';
import BuyText from '../../assets/images/BuyText.png';
import VotesText from '../../assets/images/VotesText.png';
import VoteButton from '../../assets/images/VoteButton.png';
import VoteButton2 from '../../assets/images/VoteButton2.png';
import VoteTop from '../../assets/images/VoteTop.png';
import VBG from '../../assets/images/VBG.png';
import VBGM from '../../assets/images/VBGM.png';
import Upgrade from "./Comingsoon";
import { handleSoundClick } from "common/utils/SoundClick";
import { Buttons } from "Components/Atoms/Button/Button";
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
font-size: ${window.screen.width > 767 ? "30px" : "20px"};
font-family: Poppins;
font-weight: 700;
letter-spacing: 0.6px;
text-transform: uppercase; 
  text-align: center;
`;

const NumberText = styled.strong`
// border:1px solid red;
font-family:"Lilita One";
color :#e2cc4d;
text-shadow: 1.5px 1.3px #daa636;
`;

const VotText = styled.p`
color: #fff;
font-family:"Lilita One";
font-family: Rounded Mplus 1c;
font-size: 35px;
font-style: normal;
font-weight: 900;
text-shadow: 1.2px 1.3px #c7ccf9;

`;

const TopDiv = styled.div`
position :absolute;
top:-47px;
z-index:10;
`;

const ButttonDiv = styled.div`
width:200px;
border:3px solid white;
 display: flex;
justify-content: center;
border-radius:50px;
background: linear-gradient(180deg, rgba(82,99,184,1) 0%, rgba(178,102,245,1) 100%);
  animation: zoom-in-zoom-out 1s infinite ;
transition: background 1s;

@keyframes zoom-in-zoom-out {
  0% {
    background: linear-gradient(180deg, rgba(82,99,184,1) 0%, rgba(178,102,245,1) 100%);
    color: #B869FC;
  }
  100% {
   background: linear-gradient(180deg, rgba(212,176,92,1) 0%, rgba(243,236,60,1) 100%);
   color:#DAA636;
  }  
}

  button {
    background:white;
    border:1px solid white;
    border-radius:50px;
    padding:5px;    
    margin:7px 0px;
    font-size:20px;
    color: red;
    width:180px;
    color: #B869FC;
font-family:"Lilita One";
font-family: Rounded Mplus 1c;
font-size: 20px;
transition: color 1s;

animation: colorText 1s infinite ;

    @keyframes colorText {
  0% {    
    color: #B869FC;
  }
  100% {
   
   color:#DAA636;
  }  
}

  }


`;

const ButttonDivMob = styled.div`
width:150px;
border:3px solid white;
 display: flex;
justify-content: center;
border-radius:50px;
background: linear-gradient(180deg, rgba(82,99,184,1) 0%, rgba(178,102,245,1) 100%);
  animation: zoom-in-zoom-out 1s infinite ;
transition: background 1s;

@keyframes zoom-in-zoom-out {
  0% {
    background: linear-gradient(180deg, rgba(82,99,184,1) 0%, rgba(178,102,245,1) 100%);
    color: #B869FC;
  }
  100% {
   background: linear-gradient(180deg, rgba(212,176,92,1) 0%, rgba(243,236,60,1) 100%);
   color:#DAA636;
  }  
}

  button {
    background:white;
    border:1px solid white;
    border-radius:50px;
    padding:0px;    
    margin:6px 0px;    
    color: red;
    width:135px;
    color: #B869FC;
font-family:"Lilita One";
font-family: Rounded Mplus 1c;
font-size: 20px;
transition: color 1s;
font-size:15px;

animation: colorText 1s infinite ;

    @keyframes colorText {
  0% {    
    color: #B869FC;
  }
  100% {
   
   color:#DAA636;
  }  
}

  }


`;

const VotingBoosterCopy = () => {
  const translate = useTranslation();
  const { user, userInfo } = useContext(UserContext);
  const { login, firstTimeLogin, setLogin, setLoginRedirectMessage } =
    useContext(AppContext);
  const { showModal } = useContext(NotificationContext);
  const { quotes } = useContext(ContentContext);
  const { width } = useWindowSize();
const [comingSoon, setComingSoon] = useState(false)
  const screenWidth = () => (window.screen.width > 979 ? "25%" : "30%");
  const screenHeight = () => (window.screen.width > 979 ? "650px" : "730px");
  const flexType = () => (window.screen.width > 979 ? "end" : "space-around");
  const [PaytypeValue, setPaytypeValue] = useState([
    {
      value:5,
      Extra:0,
      star: 2,
      vote:5
    },
    {
      value:10,
      Extra:20,
      star: 3,
      vote: 12
    },
    {
      value:15,
      Extra:25,
      star: 4,
      vote: 20
    },
    {
      value:25,
      Extra:50,
      star: 5,
      vote: 50
    }
  ])
  let navigate = useNavigate();
  

  const getExtraVote = (amount: any, extravote: any, ExtraPer: any) => {
    let payvalue = [amount, "EXTRAVOTES", extravote, ExtraPer]
    let PayValuestring = JSON.stringify(payvalue)
    localStorage.setItem("PayAmount", PayValuestring);
    navigate("/votepayment")
  }

  return (
    <div
      style={{        
        backgroundImage: `${window.screen.width > 767 ? `url(${VBG})` : `url(${VBGM})`}`,
        backgroundRepeat: `${window.screen.width > 767 ? "no-repeat" : "repeat"}`,
        backgroundPosition: "0 0",
        backgroundSize: "100%",
    }}
    >

      <H2
        style={{
          zIndex: 1,
          marginTop: "35px",
          fontSize: "1.25rem",
        }}
      >
        {/* @ts-ignore */}
        {userInfo?.isUserUpgraded ? 'Boost your mining power' : translate("Boost your voting power").toUpperCase()}
      </H2>
      <div className="pt-5 pb-5 d-flex justify-content-center"
        style={{
          flexDirection: `${window.screen.width > 767 ? "row" : "column"}`,
          overflow: "hidden",

        }}
      >
        {/* <div className="d-flex justify-content-center"
          style={{
            width: `${window.screen.width > 767 ? "49%" : "100%"}`
          }}
        >
          <img src={votingbooster} alt="" />
        </div> */}
        <div className=" d-flex justify-content-center flex-wrap mt-2"
          style={{
            width: `${window.screen.width > 767 ? "100%" : "100%"}`,
            height: "600px",
            position: "relative"
          }}
        >
          {window.screen.width > 766 && <div
            style={{
              // marginTop: "20%",
              position: "absolute",
              left: "3%",
              top:"47%",
            }}
            
          >
            <img src={votingbooster} alt="" className="" />
          </div>}
          {window.screen.width > 766 && PaytypeValue.map((item,index) => {
            return <div
              className="d-flex justify-content-center"
              style={{
                position: "relative",
                height: "350px",
              }}
            >
              {item.Extra > 0 && <TopDiv >
                <img src={VoteTop} alt="" width={"80px"} />
                <div
                  className="text-center w-100"
                  style={{
                    position: "absolute",
                    top: "20px",
                    fontSize: "15px",
                    lineHeight: 0.9,
                  }}
                >
                  <p
                    style={{
                      fontSize: "20px"
                    }}
                  >SAVE</p>
                  <p className="mt-1"><strong
                    style={{
                      fontSize: "20px"
                    }}
                  >{item.Extra}</strong>%</p>
                  
                </div>
              </TopDiv>}
              <div className="d-flex align-items-center flex-column"
                style={{
                  width: "250px",
                  backgroundImage: `url(${VoteBg})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  height: "400px"
                  
                }}
              >
                <p className="mt-4 "
                  style={{
                    fontSize: "20px",
                    fontWeight: "initial"
                  }}
                >FOR ONLY</p>
                <NumberText
                  className=""
                  style={{
                    fontSize: "40px",
                    lineHeight: 1.1
                  }}
                >$ {item.value}.00</NumberText>
                <div className="d-flex mt-3">
                  {/* @ts-ignore */}
                  {Array(item.star).fill().map(() => {
                    return <img src={VoteStar} alt="" width={"50px"} className=""/>
                  })}                                    
                </div>                
                <div
                  className="d-flex align-items-center flex-column"
                  style={{
                    lineHeight: 0.9
                  }}
                >


                  <VotText>BUY</VotText>
                  <NumberText
                    className=""
                    style={{
                      fontSize: "100px"
                    }}
                  >{item.vote}</NumberText>
                  
                  <VotText>votes</VotText>
                </div>
                <ButttonDiv className="mt-1">
                  <button
                    onClick={() => {
                      handleSoundClick()
                      // getExtraVote(item.value, item.vote, item.Extra)
                      // showModal(<Upgrade />)
                      setComingSoon(true)
                  }}
                  >BUY NOW !</button>
                </ButttonDiv>                
              </div>
            </div>
          })}          
          {window.screen.width <767 && PaytypeValue.map((item, index) => {
            return <div
              className="d-flex justify-content-center"
              style={{
                position: "relative",
                height: "350px",
                
              }}                                          
            >
              {item.Extra  > 0 &&<TopDiv >
                <img src={VoteTop} alt="" width={"80px"}
                  style={{
                    textShadow: "1.5px 1.3px #000",
                }}
                />
                <div
                  className="text-center w-100"
                  style={{
                    position: "absolute",
                    top: "20px",
                    fontSize: "15px",
                    lineHeight: 0.9,                    
                }}
                >
                  <p className=""><strong
                    style={{
                      fontSize: "25px"
                    }}
                  >{item.Extra}</strong>%</p>
                <p>Extra</p>
                </div>
              </TopDiv>}
              <div className="d-flex align-items-center flex-column"
                style={{
                  width: "160px",
                  backgroundImage: `url(${votebgMob})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  // backgroundSize:"150px 300px",
                  height: "300px",
                  position:"relative"
                }}
              >                
                <p className="mt-4"
                  style={{
                    fontSize: "17px",
                    fontWeight: "initial"
                  }}
                >FOR ONLY</p>
                <NumberText
                  className=""
                  style={{
                    fontSize: "30px",
                    lineHeight: 1.1
                  }}
                >$ {item.value}.00</NumberText>
                <div className="d-flex justify-content-center"
                  style={{
                }}
                >
                  {/* @ts-ignore */}
                  {Array(item.star).fill().map(() => {
                    return <img src={VoteStar} alt="" width={"30px"} className="imgflip mt-2" />
                  })}
                </div>
                {/* <img src={BuyText} alt="" /> */}
                <div
                  className="d-flex align-items-center flex-column"
                  style={{
                    lineHeight: 0.9
                  }}
                >
                  <VotText
                    style={{
                      fontSize: "25px"
                  }}
                  >BUY</VotText>
                  <NumberText
                    className=""
                    style={{
                      fontSize: "75px"
                    }}
                  >{item.vote}</NumberText>
                  {/* <img src={BuyText} alt="" /> */}
                  <VotText
                    style={{
                      fontSize: "25px"
                    }}
                  >votes</VotText>
                </div>
                <ButttonDivMob className="mt-1">
                  <button
                    onClick={() => {
                      // getExtraVote(item.value, item.vote, item.Extra)
                      // showModal(<Upgrade />)
                      setComingSoon(true)
                    }}
                  >BUY NOW !</button>
                </ButttonDivMob>
                {/* <img src={VoteButton} alt="" width={"250px"}/> */}
              </div>              
            </div>

          })}          
        </div >
        
      </div >  
      
      <div>
        <Modal
          show={
            comingSoon
          } onHide={() => { setComingSoon(false) }}
          backdrop="static"                    
          aria-labelledby="contained-modal-title-vcenter"          
          centered
        >
          <div className="d-flex justify-content-end" style={{ zIndex: 100 }}>
            <button type="button" className="btn-close " aria-label="Close" onClick={() => {

              setComingSoon(false)

            }
            }></button>
          </div>
          <Modal.Body className="d-flex  justify-content-center align-items-center"            
          >

            <p className="py-2" style={{ fontSize: "20px", textAlign: "center" }}>Coming soon</p>

          </Modal.Body>
        </Modal>
      </div>

      {window.screen.width < 767 && <div>
        <img src={votingbooster} alt="" className=""  width={"100px"}/>
      </div>}
    </div>
  );
};

export default VotingBoosterCopy;
