import React, { useContext, useEffect, useState } from 'react'
import VotingPayment from './VotingPayment';
import Swal from 'sweetalert2';
import axios from 'axios';
import UserContext from 'Contexts/User';
import { useNavigate } from 'react-router-dom';
import { auth } from "firebase";
import CoinsList from './CoinsList';

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
  setAfterPay?: any;
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
  const [isWLDPEventRegistered, setIsWLDPEventRegistered] = useState(false);
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

  const afterPayPopup = (type?: any, msg?: any, coinInfo?: any, setPayButton?: any, setSelectCoin?: any, setShowOptionList?: any, setAfterPay?: any) => {
    setPaymentStatus(type);
    return;
    if (type == "error") {
      Swal.fire({
        icon: 'error',
        title: 'Payment Failed',
        // text: 'Your account balance is : ${balance} , This is insufficient balance for this payment',
        // html: msg || "<span>Your account balance is : " + (getbalance) + " , This is insufficient balance for this payment</span>",
        html: msg,
        showCancelButton: true,
        cancelButtonColor: '#d33',
        cancelButtonText: 'Start Over Again',
        confirmButtonColor: '#543cd6',
        confirmButtonText: 'Try Again',
        allowOutsideClick: false,
        allowEscapeKey: false,

      }).then(async (result) => {
        if (result.isConfirmed) {
          setAfterPay(false)

          checkAndPay(coinInfo)
        } else if (result.isDismissed) {

          setShowOptionList(false)
          setSelectCoin("none");
        }
      })
    }
    if (type == "success") {
      Swal.fire({
        icon: 'success',
        title: 'Payment Successfull',
        // text: msg || "Your payment has been confirmed",
        text: `${payType == "EXTRAVOTES" ? "🚀 Payment Successfully Processed! 🎉 You've unlocked additional voting power. Let's shape the future together with your impactful votes! 🗳️💪" : "🔥 Payment Successfully Processed! 🚀 Thank you for your support. Enjoy your upgraded account and enhanced benefits! Keep voting, keep earning! 🌟"}`,
        showCloseButton: true,
        showCancelButton: true,
        cancelButtonColor: '#543cd6',
        cancelButtonText: 'Purchase Details',
        confirmButtonColor: '#543cd6',
        confirmButtonText: 'Continue Voting',
        allowOutsideClick: false,
        allowEscapeKey: false,
        // footer: '<a href="">Why do I have this issue?</a>'
      }).then(async (result) => {
        if (result.isConfirmed) {

          setAfterPay(false)
          navigate("/profile/mine")

        }
        else if (result.isDismissed) {
          setShowOptionList(false)
          navigate("/profile/history")
          setSelectCoin("none");
        }
      })
    }
  }

  const payNow = (detail: any, coinInfo?: any, setPayButton?: any, setSelectCoin?: any, setShowOptionList?: any, setAfterPay?: any) => {
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

  const send = (coinInfo?: any, setPayButton?: any, setSelectCoin?: any, setShowOptionList?: any, setAfterPay?: any) => {
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
      document.addEventListener('wldp:trx', (e) => {
        try {

          setPayButton(false);

          // @ts-ignore
          if (e?.detail?.trx?.transactionHash) {
            afterPayPopup("success", "", coinInfo, setPayButton, setSelectCoin, setShowOptionList, setAfterPay)
            if (apiCalling) {
              // @ts-ignore
              payNow(e?.detail, coinInfo, setPayButton, setSelectCoin, setShowOptionList, setAfterPay)
              setApiCalling(false)
            }
          }
          // @ts-ignore
          else if (e?.detail?.trx?.transactionStatus) {
            console.log(e, "alldata231dsf");
            // @ts-ignore      
            afterPayPopup("error", e?.detail?.trx?.transactionStatus?.message, coinInfo, setPayButton, setSelectCoin, setShowOptionList, setAfterPay)

          }
          // @ts-ignore
          else if (typeof e?.detail?.trx == "string") {
            // @ts-ignore  
            afterPayPopup("error", e?.detail?.trx, coinInfo, setPayButton, setSelectCoin, setShowOptionList, setAfterPay)
          }
        } catch (error) {

          console.error("Error:", error);

        }
      });
    }).catch((err: any) => {
      console.log(err, "allerr")

    })
  };

  const checkAndPay = (coinInfo?: any, setPayButton?: any, setSelectCoin?: any, setShowOptionList?: any, setAfterPay?: any) => {
    (window as any).wldp.isWalletConnected()
      .then((res: any) => {
        if (res === true) {
          send(coinInfo, setPayButton, setSelectCoin, setShowOptionList, setAfterPay)
          console.log("send call 1")
        }
        else {
          (window as any).wldp.connectionWallet('connect', 'ethereum')
            .then((account: any) => {
              if (account) {
                console.log("send call 2")
                send(coinInfo, setPayButton, setSelectCoin, setShowOptionList, setAfterPay)
              }
            })
        }
      })

  }

  return (
    <>
      {isVotingPayment
        ? <VotingPayment checkAndPay={checkAndPay} paymentStatus={paymentStatus} setPaymentStatus={setPaymentStatus} />
        : <VotingPayment checkAndPay={checkAndPay} paymentStatus={paymentStatus} setPaymentStatus={setPaymentStatus} />
      }
    </>
  )
}

export default PaymentFun