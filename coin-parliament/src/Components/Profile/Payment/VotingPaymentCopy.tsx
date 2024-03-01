/** @format */

import React, { useContext, useEffect, useState } from "react";
import { Col, Image, Modal, Row } from "react-bootstrap";
import { useTranslation } from "../../../common/models/Dictionary";
import Pairs from "../../Pairs/Pairs";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import UserContext from "../../../Contexts/User";
import Coins from "../../Coins/Coins";
import { calcFavorites } from "../../../common/utils/coins";
import { mainnet, ContractABI } from '../../Profile/utils';
import AppContext from "../../../Contexts/AppContext";
import { HomeContainer } from "../../App/App";
import NotificationContext, { ToastType } from "../../../Contexts/Notification";
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
import firebase from "firebase/compat/app";
import { auth, db, firestore } from "../../../firebase";
import Swal from "sweetalert2";
import axios, { Axios } from "axios";
import PaymentFail from "./PaymentFail";
import PaymentSuccess from "./PaymentSuccess";
import upgrade from "../../../assets/images/upgrade_small.png";
import VoteBg from '../../../assets/images/VoteBg.png';
import votebgMob from '../../../assets/images/votebgMob.png';
import VoteStar from '../../../assets/images/VoteStar.png';
import VoteToP from '../../../assets/images/VoteTop.png';
import { doc, getDoc } from "firebase/firestore";
import { createWeb3Modal, defaultConfig, useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider, useWeb3ModalError, useWeb3ModalEvents, useDisconnect } from '@web3modal/ethers5/react';
import { ethers } from "ethers";
import { showToast } from "../../../App";
import { texts } from "Components/LoginComponent/texts";
import { collection, onSnapshot } from "firebase/firestore";
import SmallBackArrow from '../../../Components/icons/SmallBackArrow';
import CoinsContext from "Contexts/CoinsContext";


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
    width:${window.screen.width > 767 ? "244px" : "250px"};
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

const CardInput = styled.input`
width:100%;
border:0px 0px 0px 0px;
padding:10px;
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
  cardPayment: Function,
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
  cardPayment,
}) => {

    const translate = useTranslation();
    const { user, userInfo } = useContext(UserContext);
  const { login, firstTimeLogin, setLogin, setLoginRedirectMessage, paymentCoinList, setPaymentCoinList, } =
    useContext(AppContext);
  const { coins} = useContext(CoinsContext);
    const { showModal } = useContext(NotificationContext);
    const { quotes } = useContext(ContentContext);
    const { width } = useWindowSize();
    const [isLoading, setIsLoading] = useState(false)
  const [coinsList, setCoinsList] = useState(mainnet)
    const [selectPayment, setSelectPayment] = useState(0);
  const [showChangeCoin, setShowChangeCoin] = useState(false);

    const [payamount, setPayamount] = useState(0);
    const [payType, setPayType] = useState();
    const [extraVote, setExtraVote] = useState(0);
    const [extraPer, setExtraPer] = useState(0);
    const [showText, setShowText] = useState(false);
    const [comingSoon, setComingSoon] = useState(false);
  const [chainNetworkTest, setChainNetworkTest] = useState(false);
  // const metamaskCoin = mainnet?.find((network?: any) => network?.chainId == chainId)
    const [metaCoin, setMetaCoin] = useState("none");
    const [transactionInst, setTransactionInst] = useState(false);
  const [showPayButoom, setShowPayButoom] = useState(false);
    const [paymentCurruntTime, setPaymentCurruntTime] = useState<any>();

    // const 
    const screenWidth = () => (window.screen.width > 979 ? "25%" : "30%");
    const screenHeight = () => (window.screen.width > 979 ? "650px" : "730px");
    const flexType = () => (window.screen.width > 979 ? "end" : "space-around");
    let navigate = useNavigate();
  const events = useWeb3ModalEvents()
  const { address, chainId, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()

    // useEffect(() => {
    //   // window.scrollTo({ top: 500, behavior: 'smooth' });
    //   window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    // }, [payType, selectPayment,])
  
  useEffect(() => {
    // window.scrollTo({ top: 500, behavior: 'smooth' });
    if (coinInfo) {
      if (window.screen.width > 767) {
        window.scrollTo({ top: 650, behavior: 'smooth' });
      }
      else {
        window.scrollTo({ top: 630, behavior: 'smooth' });
      }
    }
  }, [coinInfo, chainId, selectPayment])


    useEffect(() => {
      // (window as any)?.wldp?.send_uid(`${user?.email}`).then((data: any) => {
      //   console.log(data, "senduid")
      // })
      // @ts-ignore
      let AllInfo = JSON.parse(localStorage.getItem("PayAmount"))
      console.log(AllInfo, "AllInfo")
      setPayamount(AllInfo[0])
      setPayType(AllInfo[1])
      setExtraVote(AllInfo[2])
      setExtraPer(AllInfo[3])
    }, [])

  console.log(selectCoin,"selectCoincheck")
  
    // const getCoinList = async () => {
    //   const coinsDocRef = doc(firestore, 'settings', 'paymentCoins');

    //   try {
    //     const snapshot = await getDoc(coinsDocRef);
    //     const allList = snapshot.data()?.mainnet;
    //     console.log(allList,"allList")
    //     // const filterCoin = allList.filter((item: any) => item.name === "ETH"); // Adjust filter condition
    //     // setCoinsList(filterCoin || allList);
    //     setCoinsList(allList);

    //   } catch (error) {
    //     console.log(error, "error");
    //   }
    // };

    // useEffect(() => {      
    //   // getCoinList()
    // }, [])


  const handleClick = async () => {
    console.log("web function")
    window.scrollTo({ top: 50, behavior: 'smooth' });
    if (isConnected) {        
      if (coinInfo.chainId != chainId) {        
        setShowText(true)
        setPaymentStatus({ type: "", message: '' });
        setPayButton(true);
        setIsLoading(true)
        switchNetwork(coinInfo.chainId).then((res?:any) => {                      
          if (res == null) {              
            sendTransaction()
          }
      })
      }
      else {
        setIsLoading(true)
        setShowText(true)
        setPaymentStatus({ type: "", message: '' });
        setPayButton(true);
        sendTransaction()        
      }
    } else {      
      open()
      // switchNetwork(coinInfo.chainId)
      // open({view:"Networks"})

      setTransactionInst(true)
      }
    };

  useEffect(() => {
    if (events?.data?.event == "CONNECT_SUCCESS" && transactionInst) {     
        if (coinInfo.chainId != chainId) {
          setIsLoading(true)
          setShowText(true)
          setPayButton(true);
          setPaymentStatus({ type: "", message: '' });

          switchNetwork(coinInfo.chainId).then((res) => {  
            // console.log(res, chainId , coinInfo.chainId, "check chainID")
            
            if (res == null) {              
              sendTransaction()
            }
          })
        }
        else {
          setShowText(true)
          setPaymentStatus({ type: "", message: '' });
          setPayButton(true);
          setIsLoading(true)
          sendTransaction()
        }      
    }
    // return () => {
    //   setTransactionInst(false)
    // }
  }, [events])
  

  const handleClickMob = async () => {
    console.log("Mobile function ")
    const data = mainnet?.find((network?: any) => network?.chainId == chainId && localStorage.getItem("CoinPay") == network?.name)
    window.scrollTo({ top: 50, behavior: 'smooth' });
    if (isConnected) {
      if (localStorage.getItem("CoinPay") != data?.name) {
        open({ view: "Networks" })
        // setShowText(true)
        // setPaymentStatus({ type: "", message: '' });
        // setPayButton(true);
        // setIsLoading(true)        
        setChainNetworkTest(true)
        // switchNetwork(coinInfo.chainId).then((res) => {
        //   sendTransaction()
        // })
      }
      else {        
        setIsLoading(true)
        setShowText(true)
        setPaymentStatus({ type: "", message: '' });
        setPayButton(true);
        sendTransaction()
      }      
    } else {
      open()
      // switchNetwork(coinInfo.chainId)
      // open({view:"Networks"})
      // setTransactionInst(true)
    }
  };
  
    const startAgainAction = () => {
      navigate(-1)
      setSelectCoin("none");
    }

    const paymentSuccessAction = () => {
      navigate("/profile/history")
      setSelectCoin("none");
    }

  const { open, close } = useWeb3Modal()
  const {disconnect} = useDisconnect()
  

  
  console.log(events,"allevents")
  


  useEffect(() => {
    // let CoinPay = localStorage.getItem("CoinPay")
    if (chainId && isConnected) {
      const data = mainnet?.find((network?: any) => network?.chainId == chainId)
      if (!data) return
      if (selectCoin == "none") {        
        setSelectCoin(data?.chainId == 1 && localStorage.getItem("CoinPay") == "USDT ERC20" ? "USDT ERC20" : data?.currency)         
        setCoinInfo(data?.chainId == 1 && localStorage.getItem("CoinPay") == "USDT ERC20" ? {
          chainId: 1,
          name: 'USDT ERC20',
          currency: 'USDT ERC20',
          explorerUrl: 'https://etherscan.io',
          rpcUrl: 'https://cloudflare-eth.com'
        } : data)
      }
      setMetaCoin(data?.name)
      if (localStorage.getItem("CoinPay") == data?.name || (localStorage.getItem("CoinPay") == "USDT ERC20" && data.chainId==1)) {        
        setChainNetworkTest(false)
      }
      }

  }, [chainId, isConnected, localStorage.getItem("CoinPay")])
  

    console.log(address, chainId, isConnected, "address,chainId,isConnected")
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
        userEmail: `${user?.email}`,
        walletType: `wallet connect`,
        amount: coinInfo?.chainId == 1115511 ? "0.0001" : Number(payamount && Number(payamount)/coins[`${coinInfo?.symbol}`].price).toFixed(18),
        // amount: 0.0001,
        // @ts-ignore
        network: `${coinInfo.chainId || ""}`,
        // @ts-ignore
        origincurrency: `${coinInfo?.currency.toLowerCase()}`,
        token: `${coinInfo?.name}`,
        event: 'Approved',
        transactionType: payType,
        numberOfVotes: extraVote,
        paymentDetails: detail,

      }
    console.log("afterPayment Data : ",data)
      axios.post(`${process.env.REACT_APP_API}/payment/update/user/afterPayment`, data,
        {
          headers: headers
        }).then(async (response) => {
          // setApiCalling(false)
          // console.log(,"response.data.data")
          console.log(response.data, "response.data")
          // transactionId.current = response.data
          setIsLoading(false)
          setPaymentStatus({ type: "success", message: "" })
          setShowText(false)
          setPayButton(false);
          // setShowForWait(true)
        })
        .catch((error) => {
          // setPaymentStatus({ type: 'error', message: '' });
          console.log(error, "response.data")
          // setShowForWait(true)
          // setApiCalling(false)
          // setPayButton(false)
        })
    }
    async function sendTransaction() {    
      setTransactionInst(false)
      setTimeout(() => {
        setIsLoading(false)
        setShowText(false)
        setPayButton(false)
        console.log("take more that 5 sec")
      }, 5000);
      let ethereum = (window as any).ethereum;
      console.log(coinInfo,"coinInfoUSDT ERC20")
      try {
        const provider = new ethers.providers.Web3Provider(walletProvider || ethereum)
        const wallet = provider.getSigner();
        const amountInCrypto = coinInfo?.chainId == 1115511 ?"0.0001":Number(payamount && Number(payamount) / coins[`${coinInfo?.symbol}`].price).toFixed(18)
        if (coinInfo?.currency == "USDT ERC20") {
          
          const usdtContractAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'; 
          const usdtContractABI = ContractABI;
          const usdtContract = new ethers.Contract(usdtContractAddress, usdtContractABI, wallet);          
          const recipientAddress = "0x83ae40345c9a78a3Eda393fbaCF65E77d3242c6d";
          const amountToSend = ethers.utils.parseUnits(amountInCrypto);
          console.log(amountToSend,"amountToSend")
          console.log(coinInfo?.currency, "coinInfo?.currency")
          // const gasLimit = await usdtContract.estimateGas.transfer(
          //   "0x83ae40345c9a78a3Eda393fbaCF65E77d3242c6d",
          //   amountToSend
          // );
          // console.log("Estimated Gas Limit:", gasLimit.toString());
          const trax = {
            to: usdtContractAddress,
            value: ethers.utils.parseUnits(amountInCrypto),
            data: usdtContract.interface.encodeFunctionData('transfer', [recipientAddress, amountToSend]),
            // gasLimit: estimatedGasLimit,
            gasLimit: ethers.utils.parseEther(amountInCrypto),
          };
          const txResponse = await wallet.sendTransaction(trax);
  
          // Handle the transaction response
          console.log('Transaction hash:', txResponse.hash);
          if (txResponse.hash) {
            payNow({ ...txResponse, orderId: `VTE-${(payType || '')?.substring(0, 2)}-${txResponse.hash?.substring(0, 4)}` })          
          }
        }
        else {          
          const transaction = {
            chainId: coinInfo?.chainId,
            to: process.env.REACT_APP_TESTETH_ACCOUNT_KEY,
            value: ethers.utils.parseUnits(amountInCrypto), // Sending 0.0001 MATIC
          };
          console.log("transaction Data : ", transaction, amountInCrypto)
          const txResponse = await wallet.sendTransaction(transaction);  
          // Handle the transaction response
          console.log('Transaction hash:', txResponse.hash);
          if (txResponse.hash) {
            payNow({ ...txResponse, orderId: `VTE-${(payType || '')?.substring(0, 2)}-${txResponse.hash?.substring(0, 4)}` })          
          }
        }                   
        console.log('Transaction mined!');

      } catch (error: any) {
        console.log('errorror', error)
        const errorMessageWithoutTextAfterBracket = error.message.split('[')[0];        
        const errorCodeGet = error.code;        
        setIsLoading(false)
        setShowText(false)        
        setPayButton(false);

        if (errorCodeGet == -32603) {          
          setPaymentStatus({ type: "error", message: error.data.error})
        }
        else {          
          setPaymentStatus({ type: "error", message: errorMessageWithoutTextAfterBracket?.includes('user rejected transaction') ? 'User rejected transaction' : errorMessageWithoutTextAfterBracket == "Internal JSON-RPC error." ? "Insufficient funds for gas" : errorMessageWithoutTextAfterBracket })
        }
      }
      
      

  } 

  const switchNetwork = async (chainId:number) => {
    let ethereum = (window as any).ethereum;
    const provider = new ethers.providers.Web3Provider(walletProvider || ethereum)
    
    console.log(chainId,"chainIdchainList")
    try {
      if (!provider) throw new Error('Provider is not initialized.');
      // Switch network
      const chainData = await provider.send('wallet_switchEthereumChain', [{ chainId: `0x${chainId.toString(16)}` }]);
      return chainData
      // console.log('Switched to network:', chainId);
    }
    catch (error) {
      let codeError = ""
      console.error('Error switching network:', error);       
      // @ts-ignore
      const errorCode = error?.code;
      // @ts-ignore
      const errorMessage = error?.message;
      if (errorCode == 4902) {        
        setPaymentStatus({ type: "error", message: `Please add ${coinInfo.name} in your metamask to do payment with this network` })
        setIsLoading(false)
        setShowText(false)
        setPayButton(false);
      }       
      else {
        setPaymentStatus({ type: "error", message: "User rejected the request" })
        setIsLoading(false)
        setShowText(false)
        setPayButton(false);
      }
      return codeError
    }
  };
  
    useEffect(() => {
      if (userInfo?.uid && paymentCurruntTime) {
        const colRef = collection(db, "callbackHistory")
        //real time update    
        console.log(userInfo, "userInfodata")

        onSnapshot(colRef, (snapshot) => {
          snapshot.docs.forEach((doc) => {
            // setTestData((prev) => [...prev, doc.data()])
            console.log(doc.data()?.data?.p1 == userInfo?.uid ? doc.data()?.data?.p2 : "", "useralldata")
            if (doc.data()?.data?.p1 == userInfo?.uid && doc.data()?.data?.p2 == paymentCurruntTime) {
              console.log(doc.data()?.data, "livepaymentdata")
              if (doc.data()?.data?.order_status == "Approved" || doc.data()?.data?.order_status == "Completed") {
                setIsLoading(false)
                window.scrollTo({ top: 650, behavior: 'smooth' });
                setPaymentStatus({ type: "success", message: '' });
              }
              if (doc.data()?.data?.order_status == "Declined") {
                console.log(doc.data()?.data, "DeclinedData")
                window.scrollTo({ top: 650, behavior: 'smooth' });
                setIsLoading(false)
                setPaymentStatus({ type: "error", message: '' });
              }
            } else {
              // console.log(doc.data(),"doc.data()")
            }
          })
        })
      }
    }, [userInfo?.uid, paymentCurruntTime])

    const getPayment = () => {
      const data = {
        userId: userInfo?.uid,
        email: userInfo?.email,
        amount: payamount,
        transactionType: payType,
        numberOfVotes: extraVote,
        timestamp: (new Date().getTime()).toString(),
      }
      console.log(data, "datacehck")
      const headers = {
        "accept": "application/json",
      }
      axios.post(`/payment/make/createTempPaymentTransaction/onCreditCard`, data,
        {
          headers: headers
        }).then(async (response) => {
          console.log(response, "getresponse")
          window.open(`${response.data?.redirectUrl}`, '_blank');
          const regex = /p2=([^&]*)/;
          const match = response?.data?.redirectUrl.match(regex);

          if (match) {
            const valueAfterP2 = match[1];
            setPaymentCurruntTime(valueAfterP2)
            console.log("P2 value", valueAfterP2)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }

  
    return (
      <>
        {isLoading && <div style={{
          position: 'fixed',
          height: '90%',
          // border: "2px solid red",
          display: 'flex',
          textAlign: 'center',
          justifyContent: 'center',
          // top: '0px',
          right: '0px',
          bottom: '0px',
          zIndex: '9999',
          overflow: 'hidden',
          width: '100%',
          alignItems: 'center',
          backgroundColor: "rgba(0,0,0,0.6)"
        }}>
          <span className="loading" style={{
            color: "White", zIndex: "2220px", fontSize: '1.5em',
            // marginTop: "50px"
          }}>
            {texts.waitForIt}
          </span>
        </div>}
        
        {/* <button onClick={addEthereumNetwork}>Switch to Ethereum Mainnet</button> */}
        {/* <button onClick={() => {getGessFee()}}>Open network</button> */}
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
              justifyContent: `${window.screen.width < 767 ? "center" : payType == "EXTRAVOTES" ? "center" : "end"}`
            }}
          >
            {payType == "EXTRAVOTES" ? <img src={votingbooster} alt="" className=""
              onLoad={() => {
                // console.log("image load Done")
                window.scrollTo({ top: 750, behavior: 'smooth' });
            }}
            />

              : <img src={upgrade} alt="" width={window.screen.width > 767 ? "400px" : "300px"}
                onLoad={() => {
                  // console.log("image load Done")
                  window.scrollTo({ top: 750, behavior: 'smooth' });
                }}
              />}
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
              {showPayButoom == false ? <Opctiondiv className="">
                <div className="justify-content-center align-items-center d-flex"
                  style={{
                    cursor: "pointer",
                    marginBottom: '10px',
                    // borderBottom: "1px solid white",
                    background: `${selectPayment == 1 && "linear-gradient(180.07deg, #543CD6 0.05%, #361F86 48.96%, #160133 99.94%)"}`,
                    padding:`${window.screen.width < 767 ? "45px 10px" :""}`
                  }}
                  onClick={() => {
                    setSelectPayment(1)
                    setShowPayButoom(true)
                    // setComingSoon(true)                        
                  }}
                >
                  <i className="bi bi-coin"></i>
                  <p className="mx-2">Cryptocurrency</p>
                </div>
                {!!(payamount > 24) && <div className="d-flex flex-column align-items-center justify-content-center"
                  style={{
                    cursor: "pointer",
                    marginBottom: "10px",
                    background: `${selectPayment == 2 && "linear-gradient(180.07deg, #543CD6 0.05%, #361F86 48.96%, #160133 99.94%)"}`,
                  }}
                  onClick={() => {
                    if (payamount > 0) {
                      // setSelectPayment(2)

                      window.scrollTo({ top: 100, behavior: 'smooth' });
                      setIsLoading(true)
                      getPayment()
                      // setPaymentCurruntTime(new Date().getTime())

                    }
                    else {
                      setComingSoon(true)
                    }
                  }}
                >
                  <span className="d-flex align-items-center justify-content-center">
                    <i className="bi bi-credit-card-fill me-2"></i> No Crypto? No problem.
                  </span>
                  <span className="circleBtn mt-2">
                    <span className="inn_btn">Buy Crypto</span>
                  </span>



                </div>}
              </Opctiondiv>
                :
                <div className="w-100 m-auto d-flex justify-content-center align-items-center flex-column">
                  <div>
                  <SmallBackArrow />
                  <span className="                  
                   text-center"
                    style={{
                      cursor: "pointer", 
                      // border: "1px solid white",
                      // padding: "7px 7px",
                      marginLeft:"4px",
                      borderRadius:"5px"
                      
                  }}
                    onClick={() => {
                    setShowPayButoom(false)
                      setSelectPayment(0)
                      // setSelectCoin("none")
                    }}>Back</span>
                  </div>   
                  {isConnected == true && selectCoin !=="none" && <Sidediv style={{ display: 'flex', justifyContent: 'center' }} className="mt-3">

                    <div className={`pay-custom-select-container mb-3`} style={{
                      width: '23em',
                      zIndex: 10,
                    }} >                     
                      <div
                        // className={showOptionList ? " pay-selected-text text-center" : selectCoin !== "none" ? "pay-selected-textv2 text-center" : "pay-selected-text text-center"}
                        className="pay-selected-text text-center"
                        onClick={() => {
                          if (payButton) {
                            return
                          }
                          // open({ view: 'Networks' })
                          setShowOptionList(prev => !prev)
                        }

                        }
                      >
                        {/* {!showOptionList && selectCoin != "none" ? `Pay $${payamount} using ${selectCoin}` : "Select coin"} */}
                        Change Coin
                      </div>
                      {showOptionList && (
                        <ul className="pay-select-options"
                          style={{

                            maxHeight: "200px",
                            top: `${selectCoin == "none" ? `${mainnet.length > 5 ? "-200px" : `-${mainnet.length * 44}px`}` : ""}`,
                            borderRadius: `${selectCoin == "none" ? "8px 8px 8px 8px " : "0px 0px 8px 8px "}`,
                            borderTop: "none",
                            border: " 1px solid #cab7ff",
                          }}
                        >
                          {mainnet?.map((option: any, index: number) => {

                            return (
                              <>
                                <li
                                  style={{

                                  }}
                                  className="pay-custom-select-option"
                                  data-name={option.name}
                                  key={index}
                                  onClick={async () => {
                                    // if (chainId == option.chainId || window.screen.width > 768) {
                                    setSelectCoin(option.currency)
                                      setCoinInfo(option)
                                      // setChainNetworkTest(false)
                                    // } 
                                    setShowOptionList(!showOptionList)
                                    localStorage.setItem("CoinPay", option.name)                                     
                                    // else {                            
                                    //   open({view:"Networks"})
                                    //   setShowOptionList(!showOptionList)
                                    //   setChainNetworkTest(true)
                                    //   localStorage.setItem("CoinPay", option.name)                                     
                                    // }
                                    // switchNetwork(option.chainId)
                                  }}
                                >
                                  {option.currency}

                                </li>
                              </>
                            );

                          })}
                        </ul>
                      )}
                    </div>
                  </Sidediv>}
                </div>
            }
            </Boxdiv>

            {selectPayment == 1 &&
              <Boxdiv className="mt-4 mb-4"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Sidediv style={{ display: 'flex', justifyContent: 'center' }}>

                  <div className={`pay-custom-select-container mb-3`} style={{
                    width: '23em',
                    zIndex: 4,
                  }} >
                    {/* {selectCoin != "none" && <div
                      style={{ marginBottom: '10px', cursor: 'pointer' }}
                      className={showOptionList ? " pay-selected-text text-center" : selectCoin !== "none" ? "pay-selected-textv2 text-center" : "pay-selected-text text-center"}
                      onClick={() => {
                        if (payButton) {
                          return
                        }
                        open({ view: 'Networks' })
                        // setShowOptionList(prev => !prev)
                      }

                      }
                    >
                      Change coin
                    </div>} */}
                    <div
                      className={showOptionList ? " pay-selected-text text-center" : selectCoin !== "none" ? "pay-selected-textv2 text-center" : "pay-selected-text text-center"}
                      onClick={() => {
                        if (payButton) {
                          return
                        }
                        if (isConnected == false) {
                          
                          setShowOptionList(prev => !prev)
                        }
                        // open({ view: 'Networks' })
                      }

                      }
                    >
                      {!showOptionList && selectCoin != "none" ? `Pay $${payamount} using ${selectCoin}` : "Select coin"}
                    </div>
                    {isConnected == false && showOptionList && (
                      <ul className="pay-select-options"
                        style={{

                          maxHeight: "200px",                        
                          top: `${selectCoin == "none" ? `${mainnet.length > 5 ? "-200px" : `-${mainnet.length*44}px`}` : ""}`,
                          borderRadius: `${selectCoin == "none" ? "8px 8px 8px 8px " : "0px 0px 8px 8px "}`,
                          borderTop: "none",
                          border: " 1px solid #cab7ff",
                        }}
                      >
                        {mainnet?.map((option: any, index: number) => {
                                        
                            return (
                              <>
                              <li
                                style={{
                                
                                  }}                                  
                                className="pay-custom-select-option"
                                data-name={option.name}
                                key={index}
                                onClick={async () => {
                                  setSelectCoin(option.currency)
                                  setCoinInfo(option)
                                  setShowOptionList(!showOptionList)  
                                  localStorage.setItem("CoinPay", option.name)
                                  setChainNetworkTest(false)
                                  // switchNetwork(option.chainId)
                                }}
                              >
                                  {option.currency}
  
                                </li>
                              </>
                            );
                          
                        })}
                      </ul>
                    )}
                  </div>
                </Sidediv>
                {/* <Divbutton>
                  <button
                    style={{
                      background: "#543cd6",
                      color: "white",
                      opacity: `${payButton ? "0.6" : "1"}`
                    }}
                    
                  onClick={() => {
                    open({ view: 'Networks' })
                }}
                >Select Coin</button>
                </Divbutton> */}


                {/* {selectPayment == 1 && showText == false && window.screen.width < 767 && <p
                  style={{
                    padding: "10px",
                    fontSize: "10px",
                    textAlign: "center"
                  }}
                >Please select the desired network in your wallet before initiating any payments.</p>} */}

                {/* {address&& chainId&& isConnected &&
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
                 selectCoin != "none" && window.innerWidth < 768 && !isConnected && <div
                    className={`${window.screen.width > 767 ? "" : "mt-3"} d-flex justify-content-center`}
                  >
                    <ButttonDiv className="mt-1">
                      <button
                        disabled={payButton}
                        style={{
                          // opacity: `${payButton ? "0.6" : "1"}`
                        }}
                        onClick={() => {
                          // handleClick()                          
                          // if (window.innerWidth < 767) {                            
                          //   open({view:"Networks"})
                          // } else {
                          // }
                          open()                                                      
                        }}
                      >

                        {payButton ? "Connecting..." : 'Connect Wallet!'}
                      </button>
                    </ButttonDiv>
                  </div >
                }
                {chainNetworkTest &&
                  // <span>Please select same coin as your {coinInfo?.name} network or  switch network to {localStorage.getItem("CoinPay")} network manually from your wallet</span>
                  <span className="text-center mt-3"

                  >
                    {/* Note: To pay with {selectCoin} change to {localStorage?.getItem("CoinPay") == "USDT ERC20" ? "Ethereum" : localStorage?.getItem("CoinPay")} network manually in your wallet, or choose a different coin from {metaCoin} network. */}
                    Note:
                    To pay with {selectCoin}, change your wallet manually to {localStorage?.getItem("CoinPay") == "USDT ERC20" ? "Ethereum" : localStorage?.getItem("CoinPay")} network, or change to a different coin from {metaCoin} network.
                  </span>
                }

                {
                  window.innerWidth < 768 && isConnected && coinInfo?.chainId != chainId && !chainNetworkTest &&  <div
                    className={`${window.screen.width > 767 ? "" : "mt-3"} d-flex justify-content-center`}
                  >
                    <ButttonDiv className="mt-1">
                      <button
                        disabled={payButton}
                        style={{
                          // opacity: `${payButton ? "0.6" : "1"}`
                        }}
                        onClick={() => {
                          handleClickMob()                                                                               
                        }}
                      >

                        {payButton ? "Changeing..." : 'Change network'}
                      </button>
                    </ButttonDiv>
                  </div >
                }                                
                {
                  payType == "EXTRAVOTES" && selectCoin != "none" &&

                  <>                  
                    {
                      (window.innerWidth > 768 || isConnected) && !chainNetworkTest && ((window.innerWidth < 768 && coinInfo?.chainId == chainId) || window.innerWidth > 768)&& <div
                        className={`${window.screen.width > 767 ? "" : "mt-3"} d-flex justify-content-center`}
                      >
                        <ButttonDiv className="mt-1"
                          style={{
                            // opacity: `${chainNetworkTest ? 0.7 :1}`
                        }}
                        >
                          <button
                            disabled={payButton}
                            style={{
                              // opacity: `${payButton ? "0.6" : "1"}`
                            }}
                            onClick={() => {
                              if (!chainNetworkTest) {                                
                                if (window.innerWidth < 768) {                                
                                  handleClickMob()
                                } else {
                                  handleClick()
                                }
                              }
                            }}
                          >

                            {payButton ? "PAY NOW..." : 'PAY NOW!'}
                          </button>
                        </ButttonDiv>
                      </div >
                    }                                      
                  </>
                }

                {payType !== "EXTRAVOTES" && selectCoin != "none" &&
                  <>

                  {(window.innerWidth > 768 || isConnected) && !chainNetworkTest && (window.innerWidth < 768 && coinInfo?.chainId == chainId || window.innerWidth > 768) && 
                    <div
                      className={`${window.screen.width > 767 ? "" : "mt-3"} d-flex justify-content-center`}
                    >
                    <ButttonDivSec className="mt-1"
                      style={{
                        // opacity: `${chainNetworkTest ? 0.7 : 1}`
                      }}
                    >
                        <button
                          onClick={() => {
                            // upgradeProfile(99, 0)
                          // handleClick()
                          if (!chainNetworkTest) { 
                            if (window.innerWidth < 768) {
                              handleClickMob()
                            } else {
                              handleClick()
                            }
                          }
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
                    </div>}
                  </>
                }
              </Boxdiv>}

            {selectPayment == 2 &&
              <Boxdiv className="mt-4 mb-4"
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {payType == "EXTRAVOTES" &&
                  <div
                    className={`${window.screen.width > 767 ? "" : "mt-3"} d-flex justify-content-center`}
                  >
                    {/* <a href={`https://direct.palaris.io/api?ref_id=${2}&email=${userInfo?.email}&ftype=${1}&famount=${payamount}&ctype=${2}&p1=${userInfo?.uid}&p2=${new Date().getTime() , payType,payamount}`}
                      target="_blank"
                      style={{
                        textDecoration:"none",
                      }}
                    > */}
                    {/* <ButttonDiv className="mt-1">
                          <button
                            disabled={payButton}                                              
                          onClick={() => {    
                            window.scrollTo({ top: 100, behavior: 'smooth' });  
                            setIsLoading(true)    
                            getPayment()
                            // setPaymentCurruntTime(new Date().getTime())
                            }}
                          >
                            {payButton ? "BUY NOW..." : 'BUY NOW !'}
                          </button>
                      </ButttonDiv> */}
                    {/* </a>  */}

                  </div >
                }

                {payType !== "EXTRAVOTES" &&
                  <>
                    <div
                      className={`${window.screen.width > 767 ? "" : "mt-3"} d-flex justify-content-center`}
                    >
                      {/* <a href={`https://direct.palaris.io/api?ref_id=${2}&email=${userInfo?.email}&ftype=${1}&famount=${payamount}&ctype=${2}&p1=${userInfo?.uid}&p2=${new Date().getTime(), payType, payamount}`}
                      target="_blank"
                      style={{
                        textDecoration:"none",
                      }}
                    >                       */}
                      {/* <ButttonDivSec className="mt-1">
                      <button
                          onClick={() => {
                            window.scrollTo({ top: 100, behavior: 'smooth' });  
                            setIsLoading(true)
                            getPayment()
                            // setPaymentCurruntTime(new Date().getTime())
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
                    </ButttonDivSec> */}
                      {/* </a>  */}
                    </div>
                  </>
                }
              </Boxdiv>
            }


          </div>}

        <div>
          <Modal
            show={
              comingSoon
            } onHide={() => { setComingSoon(false) }}
            backdrop="static"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <div className="d-flex justify-content-end" style={{ zIndex: 100 }}>
              <button type="button" className="btn-close " aria-label="Close" onClick={() => {

                setComingSoon(false)

              }
              }></button>
            </div>
            <Modal.Body className="d-flex  justify-content-center align-items-center"
            >

              <p className="py-2" style={{ fontSize: "20px", textAlign: "center" }}>Coming soon</p>

            </Modal.Body>
          </Modal>
        </div>

        <div className="pb-3">
          {paymentStatus?.type === 'success' && <PaymentSuccess paymentSuccessAction={paymentSuccessAction} message={paymentStatus?.message} />}
          {paymentStatus?.type === 'error' && <PaymentFail tryAgainAction={handleClick} startAgainAction={startAgainAction} message={paymentStatus?.message} />}
        </div>
      </>

    );
  };

export default VotingPaymentCopy;

