/** @format */

import React, { useContext, useEffect, useState } from "react";
import { Col, Image, Row } from "react-bootstrap";
import { useTranslation } from "../../../common/models/Dictionary";
import Pairs from "../../Pairs/Pairs";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import UserContext from "../../../Contexts/User";
import Coins from "../../Coins/Coins";
import { calcFavorites } from "../../../common/utils/coins";
import AppContext from "../../../Contexts/AppContext";
import { HomeContainer } from "../../App/App";
import NotificationContext from "../../../Contexts/Notification";
import NotLoggedInPopup from "../../App/NotLoggedInPopup";
import Quotes from "../../Quotes";
import ContentContext from "../../../Contexts/ContentContext";
import { useWindowSize } from "../../../hooks/useWindowSize";
import InfluencersCarousel from "../../Users/InfluencersCarousel";
import { BorderRadius4px } from "../../../styledMixins";
import votingbooster from "../../../assets/images/votingbooster_small.png";
import Rectangle from "assets/images/Rectangle.png"
import Gift from "assets/images/gift.png"
import BGOBJECTS from "assets/images/BGOBJECTS.png"
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat";
import { auth } from "firebase";
import Swal from "sweetalert2";
import axios from "axios";
import PaymentFail from "./PaymentFail";
import PaymentSuccess from "./PaymentSuccess";
import upgrade from "../../../assets/images/upgrade_small.png";
import VoteBg from '../../../assets/images/VoteBg.png';
import votebgMob from '../../../assets/images/votebgMob.png';
import VoteStar from '../../../assets/images/VoteStar.png';
import VoteToP from '../../../assets/images/VoteTop.png';

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


const CoinList = styled.div`
  // border:1px solid red;
   width:${window.screen.width < 767 ? "300px" : "400px"};
  background:white;
  color:black;
  padding:10px 15px;
  margin:10px 0px;
  border-radius:10px;
`;

const Boxdiv = styled.div`
  width:${window.screen.width > 767 ? "40%" : "99%"};
  border-radius:10px;
  background-color:#1e0243;
  padding :30px;
  display:flex;  
  flex-wrap:${window.screen.width > 767 ? "wrap" : "wrap"}
`;

const Opctiondiv = styled.div`

  // border:1px solid white;
  // border-radius:10px;
  overflow:hidden;
  display:flex;
  justify-content: space-around; 
  flex-wrap:wrap; 
  width:${window.screen.width > 767 ? "98%" : "98%"};
  margin:${window.screen.width > 767 ? "" : "auto"};
  
  font-size:15px;
  & div{
    border:1px solid white;
    margin-top:${window.screen.width > 767 ? "" : "20px"};
  border-radius:10px;
    padding:25px 15px;
    display:flex;    
    width:${window.screen.width > 767 ? "230px" : "250px"};
  }
`;

const Sidediv = styled.div`
width:${window.screen.width > 767 ? "75%" : "98%"};
// margin:${window.screen.width > 767 ? "auto" : "auto"};
// margin-left:${window.screen.width > 767 ? "20px" : ""};
// margin-top:${window.screen.width > 767 ? "30px" : "30px"};
 
`;

const Paymentdiv = styled.div`
//  width:65%;
width:${window.screen.width > 767 ? "65%" : "98%"};
margin-top:${window.screen.width > 767 ? "" : "30px"};
 display:flex;
  justify-content: center;
    align-items: center;
 margin-left:20px;
`;
const Divbutton = styled.div`
  width:60%;
  border-radius:10px;

  display:flex;
  justify-content: center;
  & button {
    width:150px;
    margin-top:20px ;
    padding:10px;
    border:none;
    border-radius:5px;
  }
`;
const ButttonDivSec = styled.div`

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


const VotingPaymentCopy: React.FC<{
  checkAndPay: Function,
  setPaymentStatus: React.Dispatch<React.SetStateAction<{ type: string, message: string }>>,
  paymentStatus: { type: string, message: string },
  coinInfo: { [key: string]: any },
  setCoinInfo: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>,
  payButton: boolean,
  setPayButton: React.Dispatch<React.SetStateAction<boolean>>,
  selectCoin: string,
  setSelectCoin: React.Dispatch<React.SetStateAction<string>>,
  showOptionList: boolean,
  setShowOptionList: React.Dispatch<React.SetStateAction<boolean>>,
}> = ({
  checkAndPay,
  setPaymentStatus,
  paymentStatus,
  coinInfo,
  setCoinInfo,
  payButton,
  setPayButton,
  selectCoin,
  setSelectCoin,
  showOptionList,
  setShowOptionList,
}) => {
    const translate = useTranslation();
    const { user, userInfo } = useContext(UserContext);
    const { login, firstTimeLogin, setLogin, setLoginRedirectMessage } =
      useContext(AppContext);
    const { showModal } = useContext(NotificationContext);
    const { quotes } = useContext(ContentContext);
    const { width } = useWindowSize();


    const [coinsList, setCoinsList] = useState([])
  // const [coinsList, setCoinsList] = useState([{
  //     name:"a"
  // },
  //   {
  //     name: "a"
  //   },
  //   {
  //     name: "a"
  //   },    
  // ])
    const [selectPayment, setSelectPayment] = useState(0);
    // const [selectCoin, setSelectCoin] = useState("none");
    // const [coinInfo, setCoinInfo] = useState([]);

    // const connectOrNot = localStorage.getItem("wldp_disconnect");

    const [payamount, setPayamount] = useState("");
    const [payType, setPayType] = useState();
    const [extraVote, setExtraVote] = useState(0);
    const [extraPer, setExtraPer] = useState(0);
  const [showText, setShowText] = useState(false);
    // const [payButton, setPayButton] = useState(false);
    // const [showOptionList, setShowOptionList] = useState(false);
    // const [afterPay, setAfterPay] = useState(false);

    const screenWidth = () => (window.screen.width > 979 ? "25%" : "30%");
    const screenHeight = () => (window.screen.width > 979 ? "650px" : "730px");
    const flexType = () => (window.screen.width > 979 ? "end" : "space-around");
    let navigate = useNavigate();


    useEffect(() => {
      // window.scrollTo({ top: 500, behavior: 'smooth' });
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });      
    }, [payType, selectPayment,])
    useEffect(() => {
      // window.scrollTo({ top: 500, behavior: 'smooth' });
      if (coinInfo) {        
        if (window.screen.width > 767) {          
          window.scrollTo({ top:650, behavior: 'smooth' });                        
        }

        else {
          window.scrollTo({ top:630, behavior: 'smooth' });          
        }
        
      }
    }, [coinInfo])


    useEffect(() => {
      (window as any)?.wldp?.send_uid(`${user?.email}`).then((data: any) => {
        console.log(data, "senduid")
      })
      // @ts-ignore
      let AllInfo = JSON.parse(localStorage.getItem("PayAmount"))
      setPayamount(AllInfo[0])
      setPayType(AllInfo[1])
      setExtraVote(AllInfo[2])
      setExtraPer(AllInfo[3])
    }, [])

    useEffect(() => {
      const getCoinList = firebase
        .firestore()
        .collection("settings").doc("paymentCoins")
      getCoinList.get()
        .then((snapshot) => {
          const allList = snapshot.data()?.coins;
          const filterCoin = allList.filter((item: any, index: number) => {
            return item.name == "ETH"
              // || item.name == "BNB" || item.name == "MATIC" && item
          })          
          setCoinsList(filterCoin ? filterCoin : allList && allList );
        }).catch((error) => {
          console.log(error, "error");
        });

    }, [])


  const handleClick = () => {
      setShowText(true)
      setPaymentStatus({ type: "", message: '' });
      setPayButton(true);
      // Call the global function and pass the values as arguments    
      checkAndPay();
    };

    const startAgainAction = () => {
      setShowOptionList(false)
      setSelectCoin("none");
      setPaymentStatus({ type: "", message: '' });
    }

    const paymentSuccessAction = () => {
      navigate("/profile/history")
      setSelectCoin("none");
    }



    return (
      <>
        {payType == "EXTRAVOTES" && <H2
          style={{
            zIndex: 1,
            marginTop: "35px",
            fontSize: "1.25rem",
          }}
        >
          {/* @ts-ignore */}
          {translate("Boost your voting power").toUpperCase()}
        </H2>}
        {/* @ts-ignore */}
        {payType !== "EXTRAVOTES" && userInfo?.isUserUpgraded == false && <H2
          style={{
            zIndex: 1,
            marginTop: "35px",
            fontSize: "1.25rem",
          }}
        >
          {/* @ts-ignore */}
          {translate("Upgrade your account").toUpperCase()}
        </H2>}
        <div className="pt-5 pb-5 d-flex justify-content-center"
          style={{
            flexDirection: `${window.screen.width > 767 ? "row" : "column"}`,
            overflow: "hidden",

          }}
        >
          <div className="d-flex"
            style={{
              width: `${window.screen.width > 767 ? "49%" : "100%"}`,
              justifyContent: `${window.screen.width < 767 ? "center" : payType == "EXTRAVOTES" ? "center" :"end"}`
            }}
          >
            {payType == "EXTRAVOTES" ? <img src={votingbooster} alt=""  className=""/>

              : <img src={upgrade} alt="" width={window.screen.width > 767 ? "400px" : "300px"} />}
          </div>
          {payType == "EXTRAVOTES" ?
            <>
            </>
             :
            <>
              <div
                className="m-auto "
                style={{
                  width: `${window.screen.width > 767 ? "49%" : "100%"}`
                }}
              >
                {/* @ts-ignore */}
                {userInfo?.isUserUpgraded ?
                  <div className="w-50"
                    style={{
                      lineHeight: 5,
                    }}
                  >
                    <H2
                      style={{
                        fontSize: "1.25rem",
                        marginTop: "0px",
                        paddingTop: "30px",
                        fontWeight: "bold",
                        textTransform: 'uppercase',
                        // textAlign: "left"

                      }}
                    >
                      {translate("Congratulations")}
                    </H2>
                    <H2
                      style={{
                        fontSize: "1.25rem",
                        marginTop: "0px",
                        paddingTop: "30px",
                        fontWeight: "bold",
                        textTransform: 'uppercase',
                        // textAlign: "left"
                      }}
                    >
                      {translate("YOU'RE NOW A MINER")}
                    </H2>
                    <P
                      style={{
                        fontSize: "15px", fontWeight: "100", marginTop: "10px",
                        lineHeight: "2"
                        // textAlign: "left"
                      }}
                      className="px-3 pt-4  pb-3"
                    >
                      Now you can<strong> enjoy the benefits</strong>  of being a miner.
                    </P>
                  </div> :
                  <div
                    className="d-flex"
                    style={{
                      justifyContent: `${window.screen.width > 767 ? "start" : "center"}`
                    }}
                  >
                    <p
                      style={{
                        fontSize: "20px", fontWeight: "100", marginTop: "10px", lineHeight: 2,
                        // textAlign:"",
                        width: `${window.screen.width > 767 ? "50%" : "75%"}`,
                      }}
                      className="px-3 pt-4  pb-3"
                    >
                      Upgrade your account to a full mining account and <strong>enjoy the benefits</strong> of being a miner.
                    </p>
                  </div>
                }
              </div>
            </>
          }
        </div>
        {!paymentStatus?.type &&
          <div
            style={{
              width: "100%",
            }}
            className="d-flex justify-content-center flex-column align-items-center"
          >
            <Boxdiv className={`${window.screen.width > 767 ? "" : ""}`}
              style={{
                justifyContent: `${selectPayment == 0 ? "" : ""}`
              }}
            >
              <Opctiondiv className="">
                <div
                  style={{
                    cursor: "pointer",
                    // borderBottom: "1px solid white",
                    background: `${selectPayment && "linear-gradient(180.07deg, #543CD6 0.05%, #361F86 48.96%, #160133 99.94%)"}`,
                  }}
                  onClick={() => {
                    setSelectPayment(1)
                    
                  }}
                >
                  <i className="bi bi-coin"></i>
                  <p className="mx-2">Cryptocurrency</p>
                </div>
                <div
                  style={{
                    cursor: "not-allowed",
                  }}
                >
                  <i className="bi bi-credit-card-fill "></i>
                  <p className="mx-2">Debit & Credit cards</p>
                </div>
              </Opctiondiv>
            </Boxdiv>

            {selectPayment == 1 &&
              <Boxdiv className="mt-4 mb-4"
                style={{
                  display: "flex",
                  justifyContent: "center",                  
                }}
              >
                <Sidediv style={{ display: 'flex', justifyContent: 'center' }}>
                  {/* <div className={`${selectCoin === "none" && "pay-custom-select-container"} mb-3`} style={{ */}
                  <div className={`pay-custom-select-container mb-3`} style={{
                    width: '23em',
                    zIndex: 4,                    
                  }} >
                    <div
                      className={showOptionList ? " pay-selected-text text-center" : selectCoin !== "none" ? "pay-selected-textv2 text-center" :  "pay-selected-text text-center"}
                      onClick={() => {
                        if (payButton) {
                          return 
                        }
                        // if (selectCoin === "none") {
                        // }
                        setShowOptionList(prev => !prev)
                      }

                      }
                    >
                      {!showOptionList && selectCoin != "none" ? `Pay $${payamount} using ${selectCoin}` : "Select coin"}
                    </div>
                    {showOptionList && (
                      <ul className="pay-select-options"
                        style={{

                          maxHeight: "200px",
                          // top: `${!payamount? -200 : ""}` 
                          top: `${selectCoin == "none" ? `${coinsList.length > 5 ? "-200px" : `-${coinsList.length*44}px`}` : ""}`,
                          borderRadius: `${selectCoin == "none" ? "8px 8px 8px 8px " : "0px 0px 8px 8px "}`,
                          borderTop: "none",
                          border: " 1px solid #cab7ff",
                        }}
                      >
                        {coinsList.map((option: any, index: number) => {
                                        
                            return (
                              <>
                              <li
                                style={{
                                
                                }}
                                className="pay-custom-select-option"
                                data-name={option.name}
                                key={option.id}
                                onClick={async () => {
                                  setSelectCoin(option.name)
                                  setCoinInfo(option)
                                  setShowOptionList(!showOptionList)                                  
                                  // window.scrollTo({ top: 1000, behavior: 'smooth' });
                                  // await mybtn("disconnect", "true").then(() => {
                                  //   setConnectOrNot(!connectOrNot)
                                  // })
                                }}
                              >
                                {option.name}
  
                                </li>
                              </>
                            );
                          
                        })}
                      </ul>
                    )}
                  </div>
                </Sidediv>
                {selectPayment == 1 && showText == false && window.screen.width < 767 && <p
                  style={{
                    padding: "10px",
                    fontSize: "10px",
                    textAlign: "center"
                  }}
                >Please select the desired network in your wallet before initiating any payments.</p>}

                {/* {
                  selectCoin != "none" &&
                  <Divbutton>
                    <button
                      style={{
                        background: "#543cd6",
                        color: "white",
                        opacity: `${payButton ? "0.6" : "1"}`
                      }}
                      disabled={payButton}
                      onClick={async () => {
                        handleClick()
                      }}
                    >{payButton ? <span className="">Pay Now...</span> : 'Pay Now'}</button>
                  </Divbutton>
                } */}
                
                {
                  payType == "EXTRAVOTES" && selectCoin != "none" && 

                  
                    <div
                        className={`${window.screen.width > 767 ? "" : "mt-3"} d-flex justify-content-center`}
                    >
                        <ButttonDiv className="mt-1">
                          <button
                            disabled={payButton}
                            style={{
                              // opacity: `${payButton ? "0.6" : "1"}`
                            }}
                            onClick={() => {
                              handleClick()
                            }}
                          >

                            {payButton ? "PAY NOW..." : 'PAY NOW !'}
                          </button>
                        </ButttonDiv>
                    </div >                  
                }

                {payType !== "EXTRAVOTES" && selectCoin != "none" && 
                  <>
                  <div
                    className={`${window.screen.width > 767 ? "" : "mt-3"} d-flex justify-content-center`}
                  >
                    <ButttonDivSec className="mt-1">
                      <button
                        onClick={() => {
                          // upgradeProfile(99, 0)
                          handleClick()
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
                    </ButttonDivSec>
                  </div>
                  </>
                }
              </Boxdiv>}


          </div>}                
        <div className="pb-3">
          {paymentStatus?.type === 'success' && <PaymentSuccess paymentSuccessAction={paymentSuccessAction} message={paymentStatus?.message} />}
          {paymentStatus?.type === 'error' && <PaymentFail tryAgainAction={handleClick} startAgainAction={startAgainAction} message={paymentStatus?.message} />}
        </div>
      </>

    );
  };

export default VotingPaymentCopy;

