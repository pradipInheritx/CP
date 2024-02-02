/** @format */

import React, { useContext, useState, useEffect } from "react";
import { Form, Image, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";

import firebase from "firebase/compat/app";
import { Buttons } from "Components/Atoms/Button/Button";
import axios from "axios";
import UserContext from "Contexts/User";
import { auth, firestore } from "../../../firebase";
import { showToast } from "App";
import { ToastType } from "Contexts/Notification";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import PaymentSuccess from "./PaymentSuccess";
import PaymentFail from "./PaymentFail";
import { doc, getDoc } from "firebase/firestore";

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
  width:${window.screen.width > 767 ? "31%" : "99%"};
  border-radius:10px;
  background-color:#1e0243;
  padding :30px;
  display:flex;  
  flex-wrap:${window.screen.width > 767 ? "" : "wrap"}
`;

const Opctiondiv = styled.div`
  border:1px solid white;
  border-radius:10px;
  overflow:hidden;
  width:${window.screen.width > 767 ? "50%" : "98%"};
  margin:${window.screen.width > 767 ? "" : "auto"};
  font-size:15px;
  & div{
    padding:13px;
    display:flex;    
  }
`;

const Sidediv = styled.div`
width:${window.screen.width > 767 ? "65%" : "98%"};
margin:${window.screen.width > 767 ? "" : "auto"};
 margin-left:${window.screen.width > 767 ? "20px" : ""};
 margin-top:${window.screen.width > 767 ? "" : "30px"};
 
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
  width:${window.screen.width > 767 ? "31%" : "98%"};
  border-radius:10px;

  display:flex;
  justify-content: ${window.screen.width > 767 ? "end" : "center"};
  & button {
    width:150px;
    margin:20px 0px;
    padding:10px;
    border:none;
    border-radius:5px;
  }
`;


const CoinsList: React.FC<{
  checkAndPay: Function,
  setPaymentStatus: React.Dispatch<React.SetStateAction<string>>,
  paymentStatus: string,
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
  setShowOptionList, }) => {


    const [coinsList, setCoinsList] = useState([])
    const [selectPayment, setSelectPayment] = useState(0);
    // const [selectCoin, setSelectCoin] = useState("none");
    const [CheckCoin, setCheckCoin] = useState(0);
    // const [coinInfo, setCoinInfo] = useState([]);

    // const connectOrNot = localStorage.getItem("wldp_disconnect");

    const [connectOrNot, setConnectOrNot] = React.useState(false);
    const [walletName, setWalletName] = React.useState("");
    const { userInfo, user } = useContext(UserContext);
    const [payamount, setPayamount] = useState();
    const [payType, setPayType] = useState();
    const [extraVote, setExtraVote] = useState(0);
    const [getbalance, setGetbalance] = useState(0);
    // const [payButton, setPayButton] = useState(false);
    // const [showOptionList, setShowOptionList] = useState(false);
    const [afterPay, setAfterPay] = useState(false);  

    // Insufficient balance 

    // Buy more tokens here or swap from other tokens with balance on this account here


    //  For put email in userid


  const navigate = useNavigate();
  
  const getCoinList = async () => {
    const coinsDocRef = doc(firestore, 'settings', 'coins');

    try {
      const snapshot = await getDoc(coinsDocRef);
      const allList = snapshot.data()?.coins;
      setCoinsList(allList && allList);
    } catch (error) {
      console.log(error, "error");
    }
  };

    useEffect(() => {
      // const getCoinList = firebase
      //   .firestore()
      //   .collection("settings").doc("coins")
      // getCoinList.get()
      //   .then((snapshot) => {
      //     const allList = snapshot.data()?.coins;
      //     setCoinsList(allList && allList);
      //   }).catch((error) => {
      //     console.log(error, "error");
      //   });
      getCoinList()
    }, [])

    useEffect(() => {
      // if (localStorage.getItem("wldp-cache-provider")) {   
      // @ts-ignore
      setWalletName(localStorage.getItem("wldp-cache-provider"))
      // }
    }, [connectOrNot])

    useEffect(() => {
      if (!localStorage.getItem("PayAmount")) {
        navigate("/upgrade")
      }
    }, [])


    //  For put email in userid 

    useEffect(() => {
      (window as any)?.wldp?.send_uid(`${user?.email}`).then((data: any) => {
        console.log(data, "username")
      })
      // @ts-ignore
      let AllInfo = JSON.parse(localStorage.getItem("PayAmount"))
      setPayamount(AllInfo[0])
      setPayType(AllInfo[1])
      setExtraVote(AllInfo[2])
    }, [])

    const mybtn = (window as any)?.wldp?.connectionWallet

    //  for do payment 

    const handleAfterPayClose = () => setAfterPay(false);
    const handleAfterPayShow = () => setAfterPay(true);


    const handleClick = () => {
      setPaymentStatus("");
      setPayButton(true);
      // Call the global function and pass the values as arguments
      checkAndPay(
        coinInfo,
        setPayButton,
        setSelectCoin,
        setShowOptionList,
        setAfterPay,
      );
    };


    const startAgainAction = () => {
      setShowOptionList(false)
      setSelectCoin("none");
      setPaymentStatus('');
    }

    const paymentSuccessAction = () => {
      navigate("/profile/history")
      setSelectCoin("none");
    }

    return (
      <>
        {!paymentStatus && <div
          style={{
            width: "100%",
          }}
          className="d-flex justify-content-center flex-column align-items-center"
        >
          <div className="mt-3">
            <h4>Select Payment Mode</h4>
          </div>
          <Boxdiv className={`${window.screen.width > 767 ? "mt-5" : "mt-3"}`}
            style={{
              justifyContent: `${selectPayment == 0 ? "center" : ""}`,

            }}
          >
            <Opctiondiv>
              <div
                style={{
                  cursor: "pointer",
                  borderBottom: "1px solid white",
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
            {selectPayment == 1 && selectCoin == "none" &&
              <Sidediv style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="pay-custom-select-container" style={{ width: '18em' }}>
                  <div
                    className={showOptionList ? "pay-selected-text active" : "pay-selected-text"}
                    onClick={() => {
                      setShowOptionList(!showOptionList)
                    }
                    }
                  >
                    {selectCoin !== "none" ? selectCoin : "Select coin"}
                  </div>
                  {showOptionList && (
                    <ul className="pay-select-options"
                      style={{
                        height: `${window.screen.width > 767 ? "300px" : "200px"}`
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
                              console.log(option, 'selected');

                              setCoinInfo(option)
                              // setShowOptionList(!showOptionList)
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
              </Sidediv>}


            {selectCoin != "none" && <Paymentdiv>
              <div className="d-flex flex-column justify-content-center align-items-center">
                <p
                  className="my-1"
                  style={{
                    fontSize: "20px"
                  }}
                >Pay {payamount}$ using {selectCoin}</p>
              </div>
            </Paymentdiv>}
          </Boxdiv>
          {
            selectCoin != "none" &&
            // localStorage.getItem("wldp-cache-provider") &&
            <Divbutton>
              <button
                style={{
                  marginRight: "20px",
                  border: "1px solid #543cd6",
                  color: "#543cd6",
                  background: "none",
                }}
                onClick={async () => {
                  setSelectCoin("none")
                  // mybtn("disconnect", "true")
                  setCoinInfo([])
                  //         await mybtn("disconnect", "true").then(() => {
                  //   setConnectOrNot(!connectOrNot)
                  // })
                }}
              >Cancel</button>
              <button
                style={{
                  background: "#543cd6",
                  color: "white",
                  opacity: `${payButton ? "0.6" : "1"}`
                }}
                disabled={payButton}
                onClick={async () => {
                  // send()
                  // checkAndPay()
                  handleClick()
                }}
              >Pay Now</button>
            </Divbutton>
          }
        </div>}
        <div className="pb-3">
          {paymentStatus == 'success' && <PaymentSuccess paymentSuccessAction={paymentSuccessAction} />}
          {paymentStatus == 'error' && <PaymentFail tryAgainAction={handleClick} startAgainAction={startAgainAction} />}
        </div>
      </>
    );
  };

export default CoinsList;
