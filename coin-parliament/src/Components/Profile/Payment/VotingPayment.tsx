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
import { useNavigate, useParams } from "react-router-dom";
import firebase from "firebase/compat";
import { auth } from "firebase";
import Swal from "sweetalert2";
import axios from "axios";
import PaymentFail from "./PaymentFail";
import PaymentSuccess from "./PaymentSuccess";
import upgrade from "../../../assets/images/upgrade_small.png";


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


const VotingPayment: React.FC<{
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
    const [selectPayment, setSelectPayment] = useState(0);
    // const [selectCoin, setSelectCoin] = useState("none");
    // const [coinInfo, setCoinInfo] = useState([]);

    // const connectOrNot = localStorage.getItem("wldp_disconnect");

    const [payamount, setPayamount] = useState();
    const [payType, setPayType] = useState();
    const [extraVote, setExtraVote] = useState(0);
    const [extraPer, setExtraPer] = useState(0);
    // const [payButton, setPayButton] = useState(false);
    // const [showOptionList, setShowOptionList] = useState(false);
    // const [afterPay, setAfterPay] = useState(false);



    const screenWidth = () => (window.screen.width > 979 ? "25%" : "30%");
    const screenHeight = () => (window.screen.width > 979 ? "650px" : "730px");
    const flexType = () => (window.screen.width > 979 ? "end" : "space-around");
    let navigate = useNavigate();


    useEffect(() => {
      window.scrollTo({ top: 500, behavior: 'smooth' });
    }, [payType])


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
          setCoinsList(allList && allList);
        }).catch((error) => {
          console.log(error, "error");
        });

    }, [])


    const handleClick = () => {
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
              justifyContent: `${window.screen.width > 767 ? "end" : "center"}`
            }}
          >
            {payType == "EXTRAVOTES" ? <img src={votingbooster} alt="" />

              : <img src={upgrade} alt="" width={window.screen.width > 767 ? "400px" : "300px"} />}
          </div>
          {payType == "EXTRAVOTES" ? <div className="m-auto"
            style={{
              width: `${window.screen.width > 767 ? "49%" : "100%"}`
            }}
          >
            <Row className=""
              style={{
                width: `${window.screen.width > 767 ? "" : "100%"}`,
                padding: `${window.screen.width > 767 ? "" : "0px"}`,
                margin: `${window.screen.width > 767 ? "" : "0px"}`

              }}
            >
              <Col lg={12} sm={12} className="d-flex justify-content-md-start justify-content-center"
                style={{
                  cursor: "pointer",
                }}              
              >
                <Prices style={{}}>
                  <div style={{
                    backgroundImage: `url(${BGOBJECTS})`,
                    backgroundRepeat: "no-repeat",
                    marginTop: "30px",
                    position: "absolute",
                    width: "264px",
                    height: "330px",
                    opacity: "0.2",
                    zIndex: "1"

                  }}
                  >
                  </div>

                  {extraPer > 0 ?
                    <Corner>
                      <CornerText style={{
                        color: '#FFF',
                        fontSize: '22px',
                        fontFamily: 'Poppins',
                        fontWeight: '700',

                      }}>{extraPer}% <br /><span style={{ fontSize: '12px', }}>EXTRA</span></CornerText>
                    </Corner>
                    :
                    <div
                      style={{
                        position: "relative",
                        width: "95px",
                        height: "95px",
                      }}
                    >
                    </div>
                  }
                  <div style={{
                    backgroundImage: `url(${Gift})`, width: '100%', height: '50%', backgroundRepeat: 'no-repeat',
                    marginLeft: '4em', marginTop: '-2em', paddingTop: '1.5em', paddingLeft: '5em'
                  }}>
                    <ForOnly>For Only</ForOnly>
                    <Price>${payamount}.00</Price>
                  </div>
                  <ExtraText className="text-center">
                    <p>BUY {extraVote} VOTES</p>
                  </ExtraText>
                </Prices>
              </Col>
            </Row>

          </div > :
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
                  justifyContent: "center"
                }}
              >
                <Sidediv style={{ display: 'flex', justifyContent: 'center' }}>
                  <div className="pay-custom-select-container" style={{
                    width: '23em'
                  }} >
                    <div
                      className={showOptionList ? "pay-selected-text active text-center" : "pay-selected-text text-center"}
                      onClick={() => {
                        if (payButton) {
                          return
                        }
                        setShowOptionList(prev => !prev)
                      }

                      }
                    >
                      {!showOptionList && selectCoin != "none" ? `Pay ${payamount}$ using ${selectCoin}` : "Select coin"}
                    </div>
                    {showOptionList && (
                      <ul className="pay-select-options"
                        style={{
                          height: `${window.screen.width > 767 ? "200px" : "200px"}`
                        }}
                      >
                        {coinsList.map((option: any, index: number) => {
                          return (
                            <li
                              className="pay-custom-select-option"
                              data-name={option.name}
                              key={option.id}
                              onClick={async () => {
                                setSelectCoin(option.name)
                                setCoinInfo(option)
                                setShowOptionList(!showOptionList)
                                // await mybtn("disconnect", "true").then(() => {
                                //   setConnectOrNot(!connectOrNot)
                                // })
                              }}
                            >
                              {option.name}

                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </Sidediv>

                {
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

export default VotingPayment;
