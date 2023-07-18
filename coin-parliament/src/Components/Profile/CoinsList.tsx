/** @format */

import React, { useContext ,useState,useEffect} from "react";
import { Form, Image, Modal } from "react-bootstrap";
import { useTranslation } from "../../common/models/Dictionary";
import Pairs from "../Pairs/Pairs";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import UserContext from "../../Contexts/User";
import Coins from "../Coins/Coins";
import { calcFavorites } from "../../common/utils/coins";
import AppContext from "../../Contexts/AppContext";
import { HomeContainer } from "../App/App";
import NotificationContext, { ToastType } from "../../Contexts/Notification";
import NotLoggedInPopup from "../App/NotLoggedInPopup";
import Quotes from "../Quotes";
import ContentContext from "../../Contexts/ContentContext";
import { useWindowSize } from "../../hooks/useWindowSize";
import InfluencersCarousel from "../Users/InfluencersCarousel";
import { BorderRadius4px } from "../../styledMixins";
import upgrade1 from "../../assets/svg/upgrade1.svg";
import upgrade2 from "../../assets/svg/upgrade2.svg";
import upgrade3 from "../../assets/svg/upgrade3.svg";
import UpgradeCopy from "./UpgradeCopy";
import PaymentPop from "./PaymentPop";
import { handleSoundClick } from "../../common/utils/SoundClick";
import  upgrade from "../../assets/images/upgrade_small.png";
import  Gift from "../../assets/images/Framegift.png";
import  Frame from "../../assets/images/Frame.png";
import NftFrame from "../../assets/images/NftFrame.png";

import  XXCOIN from "../../assets/images/XXCOIN.png";
import  XXVote from "../../assets/images/XXVote.png";
import  VOUCHER from "../../assets/images/VOUCHER.png";
import { doc, onSnapshot } from "firebase/firestore";
import firebase from "firebase/compat";
import { Buttons } from "Components/Atoms/Button/Button";
import { Logo } from "Components/Pairs/Card";
import { ethers } from 'ethers';
import axios from "axios";
import { showToast } from "App";


const CoinList = styled.div`
  // border:1px solid red;
   width:${window.screen.width < 767 ? "300px" : "400px"};
  background:white;
  color:black;
  padding:10px 15px;
  margin:10px 0px;
  border-radius:10px;
`;



const CoinsList = () => {
  const translate = useTranslation();
  const { user } = useContext(UserContext);
  const { login, firstTimeLogin, setLogin, setLoginRedirectMessage } =
    useContext(AppContext);
  const { showModal } = useContext(NotificationContext);
  const { quotes } = useContext(ContentContext);
  const { width } = useWindowSize();
  const [coinsList, setCoinsList] = useState([])
const [haveMetamask, sethaveMetamask] = useState(true);
  const [accountAddress, setAccountAddress] = useState('');
  const [accountBalance, setAccountBalance] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [modleShow, setModleShow] = useState(false);
  const [selectPayment, setSelectPayment] = useState(0);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [buttonDisabl, setButtonDisabl] = useState(false);
  
  const handleModleClose = () => setModleShow(false);
  const handleModleShow = () => setModleShow(true);  
  
  const { ethereum } = (window as any);  

  useEffect(() => {
    
    const { ethereum } = (window as any);
    const checkMetamaskAvailability = async () => {
      if (!ethereum) {
        sethaveMetamask(false);
      }
      else {        
        sethaveMetamask(true);
      }      
    };
    checkMetamaskAvailability();
  }, []);

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum)
    try {
      if (!ethereum) {
        sethaveMetamask(false);
      }
      if (provider) {
       const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      let balance = await provider.getBalance(accounts[0]);
      let bal = ethers.utils.formatEther(balance); 
      console.log(accounts,"accounts")
      setAccountAddress(accounts[0]);
      setAccountBalance(bal);
      setIsConnected(true);
      handleModleShow() 
      }      
    } catch (error) {
      setIsConnected(false);
    }
  };
  

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
  
  // const handalAmoutValue = (e: any) => {
  //   var validNumber = new RegExp(/^\d*\.?\d*$/);
  //   var value = e.target.value
  //   if (e.target.value === '' || validNumber.test(e.target.value)) {
  //   setAmount(e.target.value)
  //     if (accountBalance < e.target.value) {
  //     setAmountError("Please Check you blance First")
  //   } else {
  //     setAmountError("")
  //   }
  //   }
  // }
  
  const SubmitAmount = () => {
    setButtonDisabl(true)
    const headers = {
      'accept': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjowLCJvcmdfaWQiOjEzLCJpc3MiOiJXRUxMREFQUCIsInN1YiI6InZvdGV0b2Vhcm4iLCJhdWQiOlsiR1JPVVBTIiwiQVBQTElDQVRJT05TIiwiQVVUSCIsIldFQjMiXSwiZXhwIjoxOTkxMDU0ODI1fQ.5G-SlzKoOkk55OsjyqTWvm2OFYIh4QVnCtmqs3vPHNQ',
      'Content-Type': 'application/json',    
    }

    const data = {
  callback_secret: "",
  callback_url: "",
  method: "Transaction",
      params: {
        amount: 0,
    network: "3",
    origincurrency: "eth",
    token: "ETH"
  },
  user: "mailto:mukut@inheritx.com"
    }

axios.post('https://console.dev.welldapp.io/api/transactions', data, {
    headers: headers
  })
  .then((response) => {
    // dispatch({
    //   type: FOUND_USER,
    //   data: response.data[0]
    // })
    showToast(response.data.message, ToastType.INFO);
    console.log(response.data, "apirespons")
    setButtonDisabl(false)
  })
  .catch((error) => {
    console.log(error.message, "apierror")
    showToast(error.message, ToastType.ERROR);
    setButtonDisabl(false)
    // dispatch({
    //   type: ERROR_FINDING_USER
    // })
  })
  }
  
 
  return (
    <div
      style={{
        width: "100%",
    }}
    >      
      {haveMetamask ? <div className="d-flex justify-content-center flex-column align-items-center">      
      {coinsList.map((item:any,index:any) => {      
        return (          
          <> 
            <CoinList>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <Image
                    src={process.env.PUBLIC_URL + `/images/logos/${item?.symbol?.toUpperCase()}.svg`}
                      style={{
                      margin: "0 auto",
                      width:40,
                      height:40,
                    }}
                    onError={(e) =>
                      ((e.target as HTMLImageElement).src = "/images/no_logo.png")                      
                    }
                  />
                  <p className="mx-3">{item.name}</p>
                </div>
              <Buttons.Primary onClick={connectWallet}>Connect</Buttons.Primary>
              </div>
            </CoinList>
          </>
        )
      })}
      </div> 
        :
        <div className="d-flex justify-content-center align-items-center">
        <p>Please consider installing Metamask</p>
        </div>  
      }
      <Modal
          className=""
          show={
            modleShow
          } onHide={handleModleClose}
          fullscreen="md-down"
          backdrop="static"
          // aria-labelledby="contained-modal-title-vcenter"
        centered            
        >
        <div className="d-flex justify-content-end">
          
            <button type="button" className="btn-close" aria-label="Close" onClick={() => {
              handleModleClose()
            }}
            // style={{color:"white" , border:"1px solid red"}}
            >

            </button>
          </div>
          <Modal.Body
        >      
            <h4 className="text-center mb-4">Wallet Details</h4> 
            
            {isConnected && 
              <div className="d-flex flex-column justify-content-center align-items-center">
                <div className="d-flex my-2">
                <h5>
                  {/* {window.screen.width > 767 ? "Wallet" : ""} */}
                  Address : </h5>
                  <p className="mx-3">
                    {accountAddress.slice(0, 4)}...
                    {accountAddress.slice(38, 42)}
                  </p>
                </div>
                <div className="d-flex ">
                <h5>
                  {/* {window.screen.width > 767 ? "Wallet" : ""} */}
                  Balance : </h5>
                  <p className="mx-3">{accountBalance}</p>
              </div>
              <div className="mt-4">
                {/* <Form.Control type="" placeholder="Enter Amount"
                  value={amount}
                  onChange={(e) => {
                    handalAmoutValue(e)
                  }}
                /> */}
                <p>Upgread you account need to Pay 99$</p>
                { Number(accountBalance) < 99 && <span style={{fontSize:"12px",color:"red"}}>you have insufficient balance to make this payment</span>}
              </div>
              </div>
            }

        </Modal.Body>
        < div className="d-flex justify-content-center " >
          <Buttons.Primary
            disabled={
              // amountError !== "" || amount == ""
              buttonDisabl
            }
            className="mx-2"
            onClick={() => {            
            // navigate("/paymentList")
              SubmitAmount()
            }}>Transact</Buttons.Primary>
          </div >
        </Modal>  
      
    </div>
    
  );
};

export default CoinsList;
