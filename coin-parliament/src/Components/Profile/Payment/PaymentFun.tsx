import React, { useContext, useEffect, useState } from 'react'
import VotingPayment from './VotingPayment';
import Swal from 'sweetalert2';
import axios from 'axios';
import UserContext from 'Contexts/User';
import { useNavigate } from 'react-router-dom';
import { auth } from "firebase";
import CoinsList from './CoinsList';
import AppContext from 'Contexts/AppContext';

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
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const { isWLDPEventRegistered, setIsWLDPEventRegistered } = useContext(AppContext);

  const [coinInfo, setCoinInfo] = useState<{ [key: string]: any }>({});
  const [payButton, setPayButton] = useState(false);
  const [selectCoin, setSelectCoin] = useState("none");
  const [showOptionList, setShowOptionList] = useState(false);
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
    setPaymentStatus(type);
    return;
  }

  const payNow = (detail: any) => {
    const headers = {
      'Content-Type': 'application/json',
      "accept": "application/json",
      // @ts-ignore
      "Authorization": `Bearer ${auth?.currentUser?.accessToken}`,
    }

    const data = {
      userId: `${user?.uid}`,
      userEmail: `${sessionStorage.getItem("wldp_user")}`,
      walletType: `${localStorage.getItem("wldp-cache-provider")}`,
      amount: payamount,
      network: "11155111",

      // @ts-ignore
      origincurrency: `${coinInfo?.symbol.toLowerCase()}`,
      token: "ETH",
      transactionType: payType,
      numberOfVotes: extraVote,
      paymentDetails: detail,
    }

    console.log(data, "getdataapi")

    axios.post(`${ApiUrl}payment/makePayment`, data, {
      headers: headers
    })
      .then(async (response) => {
        setApiCalling(true)

      })
      .catch((error) => {
        setApiCalling(true)
      })
  }

  const send = () => {
    const obj = {
      method: "getTransaction",
      user: `${sessionStorage.getItem("wldp_user")}`,
      params: {
        // @ts-ignore
        origincurrency: `${coinInfo?.symbol.toLowerCase()}`,
        amount: 0.000001,
        // amount: payamount,
        // @ts-ignore
        // token:"ETH",
        token: `${coinInfo?.symbol.toUpperCase()}`,
        network: "11155111"
      },
      application: "votetoearn",
      uid: `${sessionStorage.getItem("wldp_wsid")}`,
    };
    console.log(obj, "alldata");
    (window as any).wldp.send_msg(obj).then((res: any) => {
      if (isWLDPEventRegistered) {
        return
      } else {
        setIsWLDPEventRegistered(true);
      }
    }).catch((err: any) => {
      console.log(err, "allerr")

    })
  };

  useEffect(() => {
    const WLDPHandler = (e: any) => {
      try {
        console.log(e, "alldata231dsf");
        setPayButton(false);

        // @ts-ignore
        if (e?.detail?.trx?.transactionHash) {
          afterPayPopup("success", "",)
          if (apiCalling) {
            console.log(coinInfo, 'coinInfo pay');
            // @ts-ignore
            payNow(e?.detail)
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
          send()
          console.log("send call 1")
        }
        else {
          (window as any).wldp.connectionWallet('connect', 'ethereum')
            .then((account: any) => {
              if (account) {
                console.log("send call 2")
                send()
              }
            })
        }
      })

  }
  return (
    <>
      <VotingPayment
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

    </>
  )
}

export default PaymentFun