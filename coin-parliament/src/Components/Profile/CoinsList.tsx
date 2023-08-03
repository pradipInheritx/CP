/** @format */

import React, { useContext, useState, useEffect } from "react";
import { Form, Image, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";

import firebase from "firebase/compat";
import { Buttons } from "Components/Atoms/Button/Button";
import axios from "axios";
import UserContext from "Contexts/User";
import { auth } from "firebase";
import { showToast } from "App";
import { ToastType } from "Contexts/Notification";

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
  width:${window.screen.width >767 ? "60%":"98%"};
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
  width:${window.screen.width > 767 ? "33%" : "98%"};
  margin:${window.screen.width > 767 ? "" : "auto"};
  font-size:15px;
  & div{
    padding:13px;
    display:flex;    
  }
`;

const Sidediv = styled.div`
width:${window.screen.width >767 ? "65%":"98%"};
margin:${window.screen.width > 767 ? "" : "auto"};
 margin-left:${window.screen.width >767 ? "20px":""};
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
  width:60%;
  border-radius:10px;

  display:flex;
  justify-content: end;
  & button {
    width:150px;
    margin:20px 0px;
    padding:10px;
    border:none;
    border-radius:5px;
  }
`;


const CoinsList = () => {


  const [coinsList, setCoinsList] = useState([])
  const [selectPayment, setSelectPayment] = useState(0);
  const [CheckCoin, setCheckCoin] = useState(0);
  const [selectCoin, setSelectCoin] = useState("none");
  const [coinInfo, setCoinInfo] = useState([]);  
  const infoWallet = localStorage.getItem("wldp-cache-provider")
  const [walletName, setWalletName] = React.useState(infoWallet && infoWallet || []);
  const { userInfo, user } = useContext(UserContext);
  const [payamount, setPayamount ] = useState(99);
  const [payButton, setPayButton ] = useState(false);
const ApiUrl = "https://us-central1-coin-parliament-staging.cloudfunctions.net/api/v1/"

// Insufficient balance 

  // Buy more tokens here or swap from other tokens with balance on this account here


//  For put email in userid 
  
  useEffect(() => {
    const getCoinList = firebase
      .firestore()
      .collection("settings").doc("coins")
    getCoinList.get()
      .then((snapshot) => {
        const allList = snapshot.data()?.coins;
        setCoinsList(allList && allList);
      }).catch((error) => {
        console.log(error, "error");
      });

  }, [])

//  For put email in userid 

  useEffect(() => {
    (window as any)?.wldp?.send_uid(`${user?.email}`).then((data:any) => {       
      console.log(data,"username")
    })  
  }, [])

  //  For connect with wallet 

  useEffect(() => {    
    if (!localStorage.getItem("wldp-cache-provider") && selectCoin!="none") {
      mybtn("connect").then((data: any) => {
        // @ts-ignore
        setWalletName(localStorage.getItem("wldp-cache-provider"))
      })
    }
  }, [selectCoin])

  const mybtn = (window as any)?.wldp?.connectionWallet
    
//  for do payment 

const payNow = () => {
    const headers = {
  'Content-Type': 'application/json',  
      "accept": "application/json",
  // @ts-ignore
 "Authorization": `Bearer ${auth?.currentUser?.accessToken}`,
    }

//     const data = {
//   method: "getTransaction",
//   callback_secret: "",
//   callback_url: "",
//   user:`${user?.email}`,
//       params: {
//     // @ts-ignore
//       origincurrency: `${coinInfo?.symbol.toLowerCase()}`,
//         amount: "0.105",
//       // @ts-ignore
//       token: `${coinInfo?.symbol}`,
//       network: "5"
//   }
// }
  
  const data = {
    userId: `${user?.uid}`,
    userEmail: `${sessionStorage.getItem("wldp_user")}`,
    walletType: `${localStorage.getItem("wldp-cache-provider")}`,
    amount: payamount,
    network: "5",
    // @ts-ignore
    origincurrency: `${coinInfo?.symbol.toLowerCase()}`,
    token: "ETH"
}
  
axios.post("https://us-central1-coin-parliament-staging.cloudfunctions.net/api/v1/payment/makePayment", data, {
    headers: headers
  })
  .then((response) => {
    // console.log(response.data ,"response")
    setPayButton(false)
    showToast(response?.data?.message)
  })
  .catch((error) => {
    showToast(error.message,ToastType.ERROR)
    console.log(error
      , "errorpayment")
  })
  }
  
  const GetBalance = (accoutnId:any , token:any) => {
    const headers = {
  'Content-Type': 'application/json',  
      "accept": "application/json",
  // @ts-ignore
 "Authorization": `Bearer ${auth?.currentUser?.accessToken}`,
    }  
axios.get(`${ApiUrl}payment/balance/${accoutnId}/ethereum/${token}`,{
    headers: headers
  })
  .then((response) => {
    const balance = response?.data?.data?.balance;
    if (balance >= payamount) {
      payNow()
    } else {
      showToast(`Your account balance is : ${balance} , This is insufficient balance for this payment`, ToastType.ERROR)  
      setPayButton(false)
    }
  })
  .catch((error) => {
    showToast(error.message,ToastType.ERROR)
    console.log(error
      , "errorpayment")
  })
  }  

  const send = () => {
    const obj = {
      method: "getTransaction",      
      user: `${sessionStorage.getItem("wldp_user")}`,
      params: {
        // @ts-ignore
        origincurrency: `${coinInfo?.symbol.toLowerCase()}`,
        amount: payamount,
        // @ts-ignore
        // token:"ETH",
        token:`${coinInfo?.symbol.toUpperCase()}`,
        network: "5"
      },
      application: "votetoearn",
      uid:`${sessionStorage.getItem("wldp_wsid")}`,
    };
    console.log(obj, "alldata");
    (window as any).wldp.send_msg(obj).then((res: any) => {
      // @ts-ignore
      GetBalance(`${sessionStorage.getItem("wldp_account")}`, `${coinInfo?.symbol.toUpperCase()}`)    
      
    }).catch((err:any) => {
      console.log(err, "allerr")
      
    })
  };


  return (
    <div
      style={{
        width: "100%",
      }}
      className="d-flex justify-content-center flex-column align-items-center"
    >               
      <Boxdiv className="mt-5">
        <Opctiondiv>
          <div
            style={{
              cursor:"pointer",
              borderBottom: "1px solid white",
              background:`${selectPayment && "linear-gradient(180.07deg, #543CD6 0.05%, #361F86 48.96%, #160133 99.94%)"}`,
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
        { selectCoin == "none" &&<Sidediv>          
          <Form.Select aria-label="Default select"              
            size="lg"
                  onChange={ async (e)  => {
                    // @ts-ignore
                    setSelectCoin(coinsList[e.target.value].name); setCoinInfo(coinsList[e.target.value])
                    if (e.target.value) {
                      await mybtn("disconnect", "true")
                await mybtn("connect").then((data: any) => {
                  // @ts-ignore
                  setWalletName(localStorage.getItem("wldp-cache-provider"))
                })
                    }
                  }}
                  style={{
                    // width:"150px"
                    background: "none",
                    color: "white",
                    outline: "none",
                  }}
              >
                  <option value="none">Select Coin</option>
            {selectPayment && coinsList.map((item: any, index: any) => {                  
                    return <option value={index} key={index}>{item.name}</option>
                })               }
                </Form.Select>

        </Sidediv>}

        {selectCoin != "none" && <Paymentdiv>
          <div className="d-flex flex-column justify-content-center align-items-center">
              <p
                  className="my-1"
                  style={{
                  fontSize:"20px"
                }}
                >Pay 99$ using {selectCoin}</p>
                  <p className="my-1">Your are connected with : {walletName} </p>

                  <p className="my-1">If you want to choose another wallet ?  <span
                    style={{
                      color: "#3366CC",
                      cursor:"pointer",
                      }}
                  onClick={async () => {                  
                    await mybtn("disconnect", "true")
                    await mybtn("connect").then((data: any) => {
                      // @ts-ignore
                      setWalletName(localStorage.getItem("wldp-cache-provider"))
                    })
                  }}
                      >  &nbsp; Click here </span></p>
          </div>
        </Paymentdiv> }       
      </Boxdiv>
      {selectCoin != "none" &&
      <Divbutton>
        <button
          style={{
            marginRight: "20px",
            border: "1px solid #543cd6",
            color: "#543cd6",
            background: "none",
            }}
            onClick={() => {
                setSelectCoin("none")
                // mybtn("disconnect", "true")
                setCoinInfo([])
              }}
        >Cancel</button>
        <button
          style={{
            background: "#543cd6",
              color: "white",
            opacity:`${payButton ?"0.6":"1"}`
            }}
            disabled={payButton}
            onClick={() => {
              send()
               setPayButton(true)
            }}
        >Pay Now</button>
      </Divbutton>
      }
      
      </div>    
  );
};

export default CoinsList;
