/** @format */

import React, { useContext, useState, useEffect } from "react";
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
import UpgradeCopy from "./Comingsoon";
import PaymentPop from "./PaymentPop";
import { handleSoundClick } from "../../common/utils/SoundClick";
import upgrade from "../../assets/images/upgrade_small.png";
import MoneyUG from "../../assets/images/MoneyUG.png";
import UGBG from "../../assets/images/UGBG.png";
import UGBGM from "../../assets/images/UGBGM.png";
import CardUG from "../../assets/images/CardUG.png";
import GiftUG from "../../assets/images/GiftUG.png";
import MiniUG from "../../assets/images/MiniUG.png";

import XXCOIN from "../../assets/images/XXCOIN.png";
import GiftUg2 from "../../assets/images/GiftUg2.png";
import VoteUg from "../../assets/images/VoteUg.png";
import XXVote from "../../assets/images/XXVote.png";
import VOUCHER from "../../assets/images/VOUCHER.png";
import { useNavigate } from "react-router-dom";
import Upgrade from "./Comingsoon";

const H2 = styled.h2`
color: #e6d348;
letter-spacing:3px;
  -webkit-text-fill-color: white; /* Will override color (regardless of order) */
  -webkit-text-stroke-width: 3px;
  -webkit-text-stroke-color: #e6d348;
  text-transform: uppercase;
  font-size: 4rem;
  text-shadow: 0px 1px 3px 0px #5B03FF;
  font-family: 'Lilita One';
`;
const P = styled.p`
  color: #FFF;
// font-family: 'Lilita One';
font-size: 54px;
font-style: normal;
font-weight: 900;
line-height: normal;
text-align:center;
`;

const RoundBox = styled.div` 
border:2px solid #fff,#F4F6FA;
height:${window.screen.width >767 ? "140px" :"190px"};
border-radius:${window.screen.width > 767 ? "30px" : "0px"};
border: 4px solid var(--White-Gradient, #F4F6FA);
background: linear-gradient(180deg, rgba(82, 99, 184, 0.60) 0%, rgba(178, 102, 245, 0.60) 100%);
display:flex;
flex-wrap:wrap;
& p{
  padding:${window.screen.width > 767 ? " 10px" : "10px 0px 5px 0px"};
font-size: ${window.screen.width > 767 ? " 16.701px" :"12px"};
font-style: normal;
font-weight: 800;
line-height: normal;
text-transform: uppercase;
background: linear-gradient(180deg, #FED167 0%, #F9F6A8 100%);
background-clip: text;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
text-align: ${window.screen.width > 767 ? "" : "center"};
}

& span {
  padding:${window.screen.width > 767 ? "10px" : "5px 0px 10px 0px"};
  color: #FFF;
font-size: ${window.screen.width > 767 ? " 16px" : "12px"};
font-style: normal;
font-weight: 200;
line-height: normal;
// text-transform: lowercase;
display:inline-block;
text-align: ${window.screen.width > 767 ? "" : "center"};
}
`;

const ButttonDiv = styled.div`

width:290px;
border:4px solid white;
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
    padding:10px;    
    margin:10px 0px;    
    width:260px;
    color: #daa636;
    box-shadow: 0px 3px 10px #1c1c1c57;
& span {
  background: var(--Violet-Gradient, linear-gradient(180deg, #5263B8 0%, #B266F5 100%));
background-clip: text;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
font-size: 15px;
// font-style: normal;
font-weight: 500;
line-height: 101.5%;
}
& u {
     -webkit-text-decoration-line: line-through; /* Safari */
   text-decoration-line: line-through; 
   color:black;
   font-weight: 100;
   font-size: 20px;
}
& p {
   font-family:"Lilita One";  
  font-size: 30px;
  font-weight: 500;
line-height: 101.5%;
}
  }


`;

const UpgradePageCopy = () => {
  const translate = useTranslation();
  const { user, userInfo } = useContext(UserContext);
  const { login, firstTimeLogin, setLogin, setLoginRedirectMessage } =
    useContext(AppContext);
  const { showModal } = useContext(NotificationContext);
  const { quotes } = useContext(ContentContext);
  const { width } = useWindowSize();
  const [clicked, setClicked] = useState(false)
  const screenWidth = () => (window.screen.width > 979 ? "22%" : "40%");
  const screenHeight = () => (window.screen.width > 979 ? "650px" : "730px");
  const flexType = () => (window.screen.width > 979 ? "end" : "space-around");
  useEffect(() => {
    return () => {
      setClicked(false)
    }
  }, [])
  let navigate = useNavigate();

  const upgradeProfile = (amount: any, extravote: any) => {
    handleSoundClick()
    let payvalue = [amount, "UPGRADE", extravote]
    let PayValuestring = JSON.stringify(payvalue)
    localStorage.setItem("PayAmount", PayValuestring);
    navigate("/paymentList")
  }
  

  return (
    <>            
      <div
        className='p-0 m-0 w-100 d-flex justify-content-center'
        
        style={{
          backgroundImage: `${window.screen.width > 767 ? `url(${UGBG})` : `url(${UGBGM})`}`,
          backgroundRepeat: `${window.screen.width > 767 ? "no-repeat" : "repeat"}` ,
          backgroundPosition: "0 0",
          backgroundSize: "100%",
          // backgroundSize: "cover",
          backgroundAttachment: "fixed",   
          // height: "75vh",
          // overflow:"scroll"
          overflow:"hidden"
        }}
       
      >
        <div
          className=''
          style={{
            // background: "#160133",
            width: `${window.screen.width > 979 ? "1000px" : "100%"}`,
          }}
        >
          {/* @ts-ignore */}
         {!userInfo?.isUserUpgraded && <H2
            style={{
              textAlign:"center",
              textTransform: 'uppercase'
            }}
          >
            {translate("Become a miner")}
          </H2>}
          {/* @ts-ignore */}
          {userInfo?.isUserUpgraded && <H2
            style={{
              textAlign: "center",
              textTransform: 'uppercase'
            }}
          >
            {translate("Congratulations")}
          </H2>}
{/* @ts-ignore */}
          {userInfo?.isUserUpgraded && <H2
            style={{
              textAlign: "center",
              textTransform: 'uppercase'
            }}
          >
            {translate("YOU'RE NOW A MINER")}
          </H2>}
          
        {/* @ts-ignore */}
         {!userInfo?.isUserUpgraded && <P
            style={{ fontSize: "18px", fontWeight: "100", marginTop: "10px" }}
            className="px-3 pt-4  pb-3"
          >
            Upgrade your account to a full mining account and enjoy the benefits of being a miner.
          </P>}
{/* @ts-ignore */}
          {userInfo?.isUserUpgraded && <P
            style={{ fontSize: "18px", fontWeight: "100", marginTop: "10px" }}
            className="px-3 pt-4  pb-3"
          >
            Now you can<strong> enjoy the benefits</strong>  of being a miner.
          </P>}

          <div className={`${window.screen.width > 767 ? "" : "justify-content-around "} d-flex w-100 mt-5`}>

            <div style={{
              width:`${window.screen.width >767 ? "35%" :"45%"} `,
            }}>
              <RoundBox>
                <div
                  // className="d-flex justify-content-center align-items-center ml-1 flex-warp"
                  className={`${window.screen.width > 767 ? "justify-content-center align-items-center" :"justify-content-center" } d-flex ml-1`}
                  style={{
                    height: `${window.screen.width > 767 ? "" : "85px"} `,
                    width: `${window.screen.width > 767 ? "30%" : "100%"} `,
                    
                }}
                >
                <img src={MoneyUG} alt="" width={"90px"} />
                </div>
                <div className="d-flex justify-content-center flex-column"
                  style={{
                    width: `${window.screen.width > 767 ? "70%" : "100%"} `,
                  }}
                >                  
                  <p>Collectibles Market</p>
                  <span>Use your VTE  for  collectibles trading</span>
                </div>
              </RoundBox>

              <RoundBox className={`${window.screen.width > 767 ? "mt-5" :"mt-3"}`}>
                <div
                  className={`${window.screen.width > 767 ? "justify-content-center align-items-center" : "justify-content-center"} d-flex ml-1`}
                  style={{
                    width: `${window.screen.width > 767 ? "30%" : "100%"} `,
                  }}
                >
                <img src={CardUG} alt="" width={"90px"} />
                </div>
                <div className="d-flex justify-content-center flex-column"
                  style={{
                    width: `${window.screen.width > 767 ? "70%" : "100%"} `,
                  }}
                >                    
                  <p>Card converter</p>
                  <span>Convert your card to collectible cards</span>
                </div>
              </RoundBox>
              
            </div>
            {window.screen.width > 767 && <div
              
              className="d-flex justify-content-around align-items-center"
              style={{
                width: "30%",
            }}
            >
              <img src={upgrade} alt="" width={window.screen.width > 767 ? "400px" : "300px"}
                style={{
                marginLeft:"35px"
              }}
              />
            </div>}
            <div style={{
              width: `${window.screen.width > 767 ? "35%" : "45%"} `,
            }}>
              <RoundBox>
                <div
                  className={`${window.screen.width > 767 ? "justify-content-center align-items-center" : "justify-content-center"} d-flex ml-1`}
                  style={{
                    width: `${window.screen.width > 767 ? "30%" : "100%"} `,
                    height: `${window.screen.width > 767 ? "" : "85px"} `,
                  }}
                  
                >
                <img src={GiftUG} alt="" width={"90px"} />
                </div>
                <div className="d-flex justify-content-center flex-column"
                  style={{
                    width: `${window.screen.width > 767 ? "70%" : "100%"} `,
                  }}
                >                   
                  <p>Purchases</p>
                  <span>Use your VTE to buy merchandise</span>
                  
                </div>
              </RoundBox>

              <RoundBox className={`${window.screen.width > 767 ? "mt-5" : "mt-3"}`}>
                <div
                  className={`${window.screen.width > 767 ? "justify-content-center align-items-center" : "justify-content-center"} d-flex ml-1`}
                  style={{
                    width: `${window.screen.width > 767 ? "30%" : "100%"} `,
                  }}
                >
                <img src={MiniUG} alt="" width={"90px"} />
                </div>
                <div className="d-flex justify-content-center flex-column"
                  style={{
                    width: `${window.screen.width > 767 ? "70%" : "100%"} `,
                  }}>      
                  <p>Full mining machine</p>
                  <span>Mine PAX BEP20 token <br />to your external wallet</span>
                </div>
              </RoundBox>
              
            </div>
            
          </div>
                               
          {/* @ts-ignore */}
          {/* {!userInfo?.isUserUpgraded &&
            <div
              className='text-center mb-4'              
            >
              <button
                type='button'
                className='btn '
                onClick={() => {    
                  upgradeProfile(99, 0)
                }}
                style={{
                  background:" linear-gradient(to bottom, #6352E8 0%, #3712B3 100%)" ,
                  color: "#fff",
                  width: "250px",                  
                  padding: "5px 0px",
                  boxShadow: "0px 3px 6px #00000029",
                  fontSize: "25px",
                }}
              >
                <p> UPGRADE NOW </p>
                <span style={{ fontSize: "12px" }}>One time Payment of <del>$199</del> $99</span>
              </button>
            </div>} */}
          {/* @ts-ignore */}
          {!userInfo?.isUserUpgraded &&
            <>
            <div
              className={`${window.screen.width > 767 ? "" : "mt-3"} d-flex justify-content-center`}
            >
              <ButttonDiv className="mt-1">
                <button
                  onClick={() => {
                    handleSoundClick()
                    upgradeProfile(99, 0)
                    // showModal(<Upgrade />)
                  }}
                >
                  <div className='d-flex justify-content-around' >
                    <div
                    
                    >

                      <span                      
                        style={{
                          letterSpacing: "4px",
                          // display:"inline-block",
                        }}
                    >LIMITED                    
                      </span>
                      <br />
                      <span>TIME OFFER</span>
                    </div>
                    <u>$199</u>
                    <p>$99</p>
                  </div>


                </button>
              </ButttonDiv>
            </div>
            <div
              className="text-center mb-4"
              style={{
                
            fontSize: `${window.screen.width >767? "30px" :"20px"}`,
            fontStyle: "normal",
            fontWeight: "800",
                lineHeight: "normal",
                color:"#dfc650"
              }}
            >
              <p>
              ONE TIME PAYMENT
            </p></div>
          </>
          }
          
          {window.screen.width < 767 && <div

            className="d-flex justify-content-center align-items-center"
            style={{
              width: "100%",
            }}
          >
            <img src={upgrade} alt="" width={window.screen.width > 767 ? "400px" : "400px"}
              // style={{
              //   marginLeft: "35px"
              // }}
            />
          </div>}
          <div
            style={{
              width: `${window.screen.width > 767 ? "800px" : "100%"}`,
              border: `${window.screen.width > 767 ?"3px solid #f3f6fa" :"2.5px solid #d4b05c"}`,
              borderRadius: `${window.screen.width > 767 ? "55px":"10px"}`,
              padding: "15px 5px 15px 5px",
              margin: "auto",
              background:`${ window.screen.width > 767 && "linear-gradient(180deg,rgba(82, 99, 184, 0.30) 0%,rgba(178, 102, 245, 0.30) 100%)"}`,
            }}
            className="mb-4"
          >
            <p
              style={{
                textAlign: "center",
                color: "#dbbd54",
                fontFamily: 'Lilita One',
            fontSize: "25px",
            fontStyle: "normal",
            fontWeight: "900",
            lineHeight: "normal",
              // textTransform: `${window.screen.width < 767 ? "uppercase":""}`,
            letterSpacing:"2px"
            }}
            >
              In addition, you will
              receive the following gifts
            </p>
            <div className="d-flex justify-content-around mt-4 mb-3">
              <div
                style={{
                  background: `${window.screen.width < 767 && "linear-gradient(180deg, rgba(82,99,184,1) 0%, rgba(178,102,245,1) 100%)"}`,
                  width: `${window.screen.width > 767 ? "19%" : "28%"}`,
                  borderRadius: "25px",                  
                }}
                className="d-flex justify-content-center align-items-center flex-column pt-3 pb-3"
              >
                <img src={GiftUg2} alt="" width={"40px"} />
                <p className="text-center mt-2"
                  style={{
                    fontSize: "14px",
                  }}>
                  
                  Merchandise Voucher</p>
              </div>
              <div
              style={{                
                  background: `${window.screen.width < 767 && "linear-gradient(180deg, rgba(82,99,184,1) 0%, rgba(178,102,245,1) 100%)"}`,
                  width: `${window.screen.width > 767 ? "19%" : "28%"}`,
                  borderRadius: "25px",
                  

                }}   
                className="d-flex justify-content-center align-items-center flex-column pt-3 pb-3"
              >
                <img src={VoteUg} alt="" width={"70px"} />
                <p className="text-center mt-2"
                  style={{
                    fontSize: "14px",
                    padding:"1px"
                  }}>
                  
                  50 <br /> Extra Votes</p>
              </div>
              <div
                style={{
                  
                  background: `${window.screen.width < 767 && "linear-gradient(180deg, rgba(82,99,184,1) 0%, rgba(178,102,245,1) 100%)"}`,
                  width: `${window.screen.width > 767 ? "19%" : "28%"}`,
                  borderRadius: "25px",
                  
                }}
                className="d-flex justify-content-center align-items-center flex-column pt-3 pb-3"
              >
              
                <img src={XXCOIN} alt="" width={"80px"}/>
                <p className="text-center mt-2"
                  style={{
                    fontSize: "14px",
                }}
                >500 <br /> VTE</p>
                
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {clicked &&
        <PaymentPop
        openPopup={clicked}
        setClicked={setClicked}
      />
      } */}
      {/* <div
        style={{
          backgroundImage: `${window.screen.width > 767 ? `url(${UGBG})` : `url(${UGBGM})`}`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "0 0",
          backgroundSize: "100% 100%",
          backgroundAttachment: "fixed",
          position: "fixed",
          top:120,
          width: "100%",
          height: "800px",
          zIndex: -1
        }}
      >

      </div> */}
    </>
  );
};

export default UpgradePageCopy;
