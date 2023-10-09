import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import VotingPayment from './VotingPayment';
import Swal from 'sweetalert2';
import axios from 'axios';
import UserContext from 'Contexts/User';
import { useNavigate } from 'react-router-dom';
import { auth } from "firebase";
import CoinsList from './CoinsList';
import AppContext from 'Contexts/AppContext';
import { texts } from 'Components/LoginComponent/texts';
import { Modal } from 'react-bootstrap';
import VotingPaymentCopy from './VotingPaymentCopy';

export type paymentProps = {
  type: any;
  msg?: any;
  coinInfo?: any;
  setPayButton?: any;
  extraVote?: any;
  payType?: any;
  payamount?: any;
  setSelectCoin?: any;
  setShowOptionList?: any;
  user?: any;
  navigate?: any;

};

function PaymentFun({ isVotingPayment }: any) {
  const { user, userInfo } = useContext(UserContext);
  
  const [payamount, setPayamount] = useState();
  const [payType, setPayType] = useState();
  const [extraVote, setExtraVote] = useState(0);
  const [extraPer, setExtraPer] = useState(0);
  const [apiCalling, setApiCalling] = useState(true);
  
  const [paymentStatus, setPaymentStatus] = useState<{ type: string, message: string }>({ type: '', message: '' });
  const { isWLDPEventRegistered, setIsWLDPEventRegistered,
    // setTransactionId, transactionId
  } = useContext(AppContext);
  
  const [coinInfo, setCoinInfo] = useState<{ [key: string]: any }>({});
  const [payButton, setPayButton] = useState(false);
  const [selectCoin, setSelectCoin] = useState("none");
  const [showOptionList, setShowOptionList] = useState(false);
  const [showForWait, setShowForWait] = useState(false);
  const transactionId = useRef({});
  console.log(coinInfo, 'coinInfo1');

  let navigate = useNavigate();
  const ApiUrl = "https://us-central1-coin-parliament-staging.cloudfunctions.net/api/v1/"

  useEffect(() => {
    (window as any)?.wldp?.send_uid(`${user?.email}`).then((data: any) => {
      console.log(data, "username")
    })
    // @ts-ignore
    let AllInfo = JSON.parse(localStorage.getItem("PayAmount"))
    setPayamount(AllInfo[0])
    setPayType(AllInfo[1])
    setExtraVote(AllInfo[2])
    setExtraPer(AllInfo[3])
  }, [localStorage.getItem("PayAmount")])

  const afterPayPopup = (type?: any, msg?: any) => {
    setPaymentStatus({ type, message: msg });
    return;
  }

  const payNow = (detail?: any) => {
    const headers = {
      // 'Content-Type': 'application/json',
      "accept": "application/json",
      // @ts-ignore
      "Authorization": `Bearer ${auth?.currentUser?.accessToken}`,
      "content-type": "application/json"
    }

    const data = {
      userId: `${user?.uid}`,
      userEmail: `${sessionStorage.getItem("wldp_user")}`,
      walletType: `${localStorage.getItem("wldp-cache-provider")}`,
      // amount: payamount,
      amount: 0.0001,
      network: "11155111",
      // // @ts-ignore
      origincurrency: `${coinInfo?.symbol.toLowerCase()}`,
      token: "ETH",
      transactionType: payType,
      numberOfVotes: extraVote,
      paymentDetails: detail,

    }

    axios.post(`${ApiUrl}payment/makePayment/toServer`, data,
      {
      headers: headers
    }).then(async (response) => {
      setApiCalling(false)
      // console.log(,"response.data.data")
      console.log(response.data,"response.data")
      transactionId.current=response.data
      setShowForWait(true)
      })
      .catch((error) => {
        // setPaymentStatus({ type: 'error', message: '' });
        setApiCalling(false)
      })
  }


  const afterPayment = (detail?: any) => {
    console.log(transactionId.current, "transactionId123")
    const headers = {
      // 'Content-Type': 'application/json',
      "accept": "application/json",
      // @ts-ignore
      "Authorization": `Bearer ${auth?.currentUser?.accessToken}`,
      "content-type": "application/json"
    }    
    const data = {
      userId: `${user?.uid}`,
      userEmail: `${sessionStorage.getItem("wldp_user")}`,
      walletType: `${localStorage.getItem("wldp-cache-provider")}`,
      amount: 0.0001,
      network: "11155111",
      // @ts-ignore
      origincurrency: `${coinInfo?.symbol?.toLowerCase()}`,
      token: "ETH",
      transactionType: payType,
      numberOfVotes: extraVote,
      paymentDetails: { ...detail, ...transactionId.current},      
      
    }
    axios.post(`${ApiUrl}payment/update/user/afterVote`, data,
      {
        headers: headers
      }).then(async (response) => {
        setApiCalling(false)       
      })
      .catch((error) => {
        // setPaymentStatus({ type: 'error', message: '' });
        setApiCalling(false)
      })
    
    
  }
  useEffect(() => {  
    const WLDPHandler = (e: any) => {
      try {
        console.log(e, "alldata231dsf");
        setPayButton(false);
        setShowForWait(false)
        window.scrollTo({
          top: 400,
          behavior: 'smooth',
        });
        // @ts-ignore
        if (e?.detail?.trx?.transactionHash) {
          afterPayPopup("success", "",)
          if (apiCalling) {
            // @ts-ignore
            afterPayment(e?.detail)
            setApiCalling(false)
          }
        }
        // @ts-ignore
        else if (e?.detail?.trx?.transactionStatus) {

          // @ts-ignore      
          afterPayPopup("error", e?.detail?.trx?.transactionStatus?.message,)

        }
        // @ts-ignore
        else if (typeof e?.detail?.trx == "string") {
          // @ts-ignore  
          afterPayPopup("error", e?.detail?.trx,)
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    document.addEventListener('wldp:trx', WLDPHandler);
    return () => document.removeEventListener('wldp:trx', WLDPHandler);
  }, [coinInfo]);

  const checkAndPay = () => {        
    (window as any).wldp.isWalletConnected()
      .then((res: any) => {
        if (res === true) {
          console.log("send call 1")
          payNow()
        }
        else {          
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
          (window as any).wldp.connectionWallet('connect', 'ethereum')
            .then((account: any) => {
              if (account) {                
                payNow()
              }
            })
        }
      }) 
  }
  return (
    <>
      <VotingPaymentCopy
        checkAndPay={checkAndPay}
        paymentStatus={paymentStatus}
        setPaymentStatus={setPaymentStatus}
        coinInfo={coinInfo}
        setCoinInfo={setCoinInfo}
        payButton={payButton}
        setPayButton={setPayButton}
        showOptionList={showOptionList}
        setShowOptionList={setShowOptionList}
        selectCoin={selectCoin}
        setSelectCoin={setSelectCoin}
      />
      {showForWait && <Modal
        show={showForWait}
        backdrop="static"
        centered
        style={{ zIndex: "2200", backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
        contentClassName={window.screen.width > 767 ? "card-content modulebackground" : "card-contentMob modulebackground"}
      >
        <Modal.Body>
          <div style={{
            position: 'fixed',
            height: '100%',
            display: 'flex',
            textAlign: 'center',
            justifyContent: 'center',
            top: '0px',
            right: '0px',
            bottom: '0px',
            zIndex: '9999',
            overflow: 'hidden',
            width: '100%',
            alignItems: 'center',

          }}>
            <span className="loading" style={{ color: "white", zIndex: "2220px", fontSize: '1.5em' }}>
              {texts.waitForIt}
            </span>
          </div>
        </Modal.Body>
      </Modal>}
    </>
  )
}

export default PaymentFun