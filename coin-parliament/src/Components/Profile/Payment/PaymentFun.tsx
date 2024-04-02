import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import VotingPayment from './VotingPayment';
import Swal from 'sweetalert2';
import axios, { Axios } from 'axios';
import UserContext from 'Contexts/User';
import { useNavigate } from 'react-router-dom';
import { auth } from "../../../firebase";
import CoinsList from './CoinsList';
import AppContext from 'Contexts/AppContext';
import { texts } from 'Components/LoginComponent/texts';
import { Modal } from 'react-bootstrap';
import VotingPaymentCopy from './VotingPaymentCopy';
import CoinsContext from 'Contexts/CoinsContext';
import Button, { Buttons } from 'Components/Atoms/Button/Button';
import VBG from '../../../assets/images/VBG.png';
import VBGM from '../../../assets/images/VBGM.png';

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
  // const [PassCodeModal, setPassCodeModal] = useState(false);  
  const [PassCodeErr, setPassCodeErr] = useState(false);  
  const [passCode, setPassCode] = useState("");    
  const { coins, totals, allCoins } = useContext(CoinsContext);
  const [networkCode, setNetworkCode] = useState({
    ETH: "1",
    BNB: "56",
    MATIC:"137",    
  }); 
  const transactionId = useRef({});
  
  console.log(coinInfo, 'coinInfo1');

  let navigate = useNavigate();  
  // @ts-ignore  
  const liveAmount = localStorage.getItem('CoinsPrice') && JSON.parse(localStorage.getItem('CoinsPrice'))

  useEffect(() => {
    // (window as any)?.wldp?.send_uid(`${user?.email}`).then((data: any) => {
    //   console.log(data, "username")
    // })
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

  


  // const payNow = (detail?: any) => {
  //   const headers = {
  //     // 'Content-Type': 'application/json',
  //     "accept": "application/json",
  //     // @ts-ignore
  //     "Authorization": `Bearer ${auth?.currentUser?.accessToken}`,
  //     "content-type": "application/json"
  //   }
    
  //   const data = {
  //     // userId: `${user?.uid}`,
  //     userEmail: `${sessionStorage.getItem("wldp_user")}`,     
  //     // walletType: `${localStorage.getItem("wldp-cache-provider")}`,
  //     amount: Number(payamount && Number(payamount)/coins[`${coinInfo?.symbol}`].price).toFixed(18),
  //     // amount: 0.0001,
  //     // @ts-ignore
  //     network: `${networkCode[coinInfo?.name] || ""}`,
  //     // @ts-ignore
  //     originCurrency: `${coinInfo?.symbol.toLowerCase()}`,      
  //     token: `${coinInfo?.name}`,
  //     // transactionType: payType,
  //     // numberOfVotes: extraVote,
  //     // paymentDetails: detail,

  //   }

  //   axios.post(`/payment/makePayment/toServer`, data,
  //     {
  //       headers: headers
  //     }).then(async (response) => {
  //       setApiCalling(false)
  //       // console.log(,"response.data.data")
  //       console.log(response.data, "response.data")
  //       transactionId.current = response.data
        
  //       setShowForWait(true)
  //     })
  //     .catch((error) => {
  //       // setPaymentStatus({ type: 'error', message: '' });
  //       console.log(error, "response.data")
  //       // setShowForWait(true)
  //       setApiCalling(false)
  //       setPayButton(false)
  //     })
  // }


  // const afterPayment = (detail?: any) => {
  //   console.log(transactionId.current, "transactionId123")
  //   const headers = {
  //     // 'Content-Type': 'application/json',
  //     "accept": "application/json",
  //     // @ts-ignore
  //     "Authorization": `Bearer ${auth?.currentUser?.accessToken}`,
  //     "content-type": "application/json"
  //   }
  //   const data = {
  //     userId: `${user?.uid}`,
  //     userEmail: `${sessionStorage.getItem("wldp_user")}`,
  //     walletType: `${localStorage.getItem("wldp-cache-provider")}`,
  //     amount:payamount,
  //     // network: "11155111",
  //     // @ts-ignore
  //     network: `${networkCode[coinInfo?.name] || ""}`,
  //     // @ts-ignore
  //     origincurrency: `${coinInfo?.symbol?.toLowerCase()}`,
  //     token: `${coinInfo?.name}`,
  //     transactionType: payType,
  //     numberOfVotes: extraVote,
  //     paymentDetails: { ...detail, ...transactionId.current },

  //   }
  //   axios.post(`/payment/update/user/afterVote`, data,
  //     {
  //       headers: headers
  //     }).then(async (response) => {
  //       setApiCalling(false)
  //     })
  //     .catch((error) => {
  //       // setPaymentStatus({ type: 'error', message: '' });
  //       setApiCalling(false)
  //       setPayButton(false)
  //     })


  // }

  // const PaymentWait = () => {    
  //   const headers = {
  //     "accept": "application/json",      
  //   }
  //   const data = {   
  //     userId: userInfo?.uid,
  //     userEmail: `${sessionStorage.getItem("wldp_user")}`,
  //     walletType: `${localStorage.getItem("wldp-cache-provider")}`,
  //     amount: payamount,
  //     // amount: 0.01,
  //     // network: "11155111",
  //     // @ts-ignore
  //     network: `${networkCode[coinInfo?.name] || ""}`,
  //     // @ts-ignore
  //     origincurrency: `${coinInfo?.symbol?.toLowerCase()}`,
  //     token: `${coinInfo?.name}`,
  //     transactionType: payType,
  //     numberOfVotes: extraVote,      
  //     initiated: "FE"
  //   }
  //   console.log(data, "PaymentWaitData")
  //   // @ts-ignore
  //   const transactionIdSet = transactionId?.current?.transaction_id
  //   axios.post(`/payment/update/paymentStatusOnTransaction/${transactionIdSet}`, data,
  //     {        
  //       headers: headers
  //     }).then(async (response) => {
  //       setApiCalling(false)
  //     })
  //     .catch((error) => {
  //       // setPaymentStatus({ type: 'error', message: '' });
  //       setApiCalling(false)
  //       setPayButton(false)
  //     })


  // }
  // useEffect(() => {
  
  //   const WLDPHandler = (e: any) => {
  //     try {
  //       console.log(e, "alldata231dsf");
  //       setPayButton(false);
  //       setShowForWait(false)
  //       window.scrollTo({
  //         top: 500,
  //         behavior: 'smooth',
  //       });
  //       // @ts-ignore
  //       if (e?.detail?.trx?.transactionHash) {
  //         afterPayPopup("success", "",)
  //         if (apiCalling) {
  //           // @ts-ignore
  //           afterPayment(e?.detail)
  //           setApiCalling(false)
  //         }
  //       }
  //       else if (e?.detail?.trx =="Transaction was not mined within 50 blocks, please make sure your transaction was properly sent. Be aware that it might still be mined!") {
  //         afterPayPopup("success", "",)
  //         if (apiCalling) {
  //           // @ts-ignore
  //           afterPayment(e?.detail)
  //           setApiCalling(false)
  //         }
  //       }
  //       // @ts-ignore
  //       else if (e?.detail?.trx?.transactionStatus) {
  //         console.log(e, "Withstatus")
  //         setTimeout(() => {            
  //           PaymentWait()
  //         }, 2000);
  //         // @ts-ignore             
  //         afterPayPopup("error", e?.detail?.trx?.transactionStatus?.message)
  //       }
  //       // @ts-ignore
  //       else if (typeof e?.detail?.trx == "string") {
  //         console.log(e, "withoutstatus")
  //         setTimeout(() => {
  //           PaymentWait()
  //         }, 2000);          
  //         // @ts-ignore  
  //         afterPayPopup("error", e?.detail?.trx,)
  //       }
  //     } catch (error) {
  //       console.error("Error:", error);
  //       setShowForWait(false);
  //     }
  //   }
  //   document.addEventListener('wldp:trx', WLDPHandler);
  //   return () => document.removeEventListener('wldp:trx', WLDPHandler);
  // }, [coinInfo]);

  const checkAndPay = () => {
    console.log("click working")
    // (window as any).wldp.isWalletConnected()
    //   .then((res: any) => {
    //     if (res === true) {
    //       payNow()
    //     }
    //     else {
    //       window.scrollTo({
    //         top: 0,
    //         behavior: 'smooth',
    //       });
    //       (window as any).wldp.connectionWallet('connect', 'ethereum')
    //         .then((account: any) => {
    //           (window as any)?.wldp?.send_uid(`${user?.email}`).then((data: any) => {
    //             console.log(data, "username")
    //           })
    //           if (account) {
    //             payNow()
    //           }
    //         })
    //     }
    //   })
  }
  
  const cardPayment = () => {
  //   axios.post(`https://direct.palaris.io/api?ref_id=${2}&email=${"manish.s@inheritx.com"}&ftype=${1}&famount=${100}&ctype=${2}`).then((res) => {
  //     console.log("getresponse", res)
  // })
}

  return (
    <div className=''
      style={{
        backgroundImage: `${window.screen.width > 767 ? `url(${VBG})` : `url(${VBGM})`}`,
        backgroundRepeat: `${window.screen.width > 767 ? "no-repeat" : "repeat"}`,
        backgroundPosition: "0 0",
        backgroundSize: "100%",
        height:"80vh"
      }}
    >
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
        cardPayment={cardPayment}
      />
      {/* <Modal
        show={PassCodeModal}
        backdrop="static"
        centered
        style={{ zIndex: "2200", backgroundColor: 'rgba(0, 0, 0, 0.6)' }}        
      >
        <Modal.Body>
          <div className='d-flex justify-content-center align-items-center flex-column'>
            <p>Enter Pass Code</p>
            <input type="text" name="" id=""
              onChange={(e) => {
                setPassCode(e.target.value)
                setPassCodeErr(false)
              }}    
              className='mt-2'
            />

            {PassCodeErr == true && <span
              style={{
                color: "red",
                fontSize:"10px"
            }}
            >Enter Right Passcode</span>}
            <Buttons.Primary
              className='my-3'
              onClick={() => {
                if (passCode == "Inx!@123") {
                  setPassCodeModal(false)
                }
                else {
                  setPassCodeErr(true)
                }
            }}
            >
              Submit
            </Buttons.Primary>
          </div>
        </Modal.Body>
      </Modal> */}

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
    </div>
  )
}

export default PaymentFun
