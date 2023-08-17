/** @format */

import React, { useContext ,useState,useEffect} from "react";
import { Image } from "react-bootstrap";
import { useTranslation } from "../../common/models/Dictionary";
import Pairs from "../../Components/Pairs/Pairs";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import UserContext from "../../Contexts/User";
import Coins from "../../Components/Coins/Coins";
import { calcFavorites } from "../../common/utils/coins";
import AppContext from "../../Contexts/AppContext";
import { HomeContainer } from "../../Components/App/App";
import NotificationContext from "../../Contexts/Notification";
import NotLoggedInPopup from "../../Components/App/NotLoggedInPopup";
import Quotes from "../../Components/Quotes";
import ContentContext from "../../Contexts/ContentContext";
import { useWindowSize } from "../../hooks/useWindowSize";
import InfluencersCarousel from "../../Components/Users/InfluencersCarousel";
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
import  Framemoney from "../../assets/images/Framemoney.png";
import NftFrame from "../../assets/images/NftFrame.png";

import  XXCOIN from "../../assets/images/XXCOIN.png";
import  XXVote from "../../assets/images/XXVote.png";
import  VOUCHER from "../../assets/images/VOUCHER.png";
import { useNavigate } from "react-router-dom";

const H2 = styled.h2`
  font-size: var(--font-size-xxl);
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

const UpgradePage = () => {
  const translate = useTranslation();
  const { user ,userInfo} = useContext(UserContext);
  const { login, firstTimeLogin, setLogin, setLoginRedirectMessage } =
    useContext(AppContext);
  const { showModal } = useContext(NotificationContext);
  const { quotes } = useContext(ContentContext);
  const { width } = useWindowSize();
  const [clicked, setClicked] = useState(false)
  const screenWidth = () => (window.screen.width > 979 ? "22%" : "40%");
  const screenHeight = () => (window.screen.width > 979 ? "650px" : "730px");
  const flexType = () => (window.screen.width > 979 ? "end" : "space-around");
useEffect(() => {
  return () => {
    setClicked(false)
  }
}, [])

  const BoxCard = styled.div`
  width:${screenWidth()};
  paddinng-top:20px;
  background-color:#fff;
  border:3px solid #6352E8;
  margin : 10px 0px 10px 0px;
  display:"flex"
  justify-content: ${flexType()};
   flex-wrap: wrap;
  border-radius:6px;
  padding:10px;
  & 
  p {
    color:'#160133';
    text-algin:"left";
    font-size:14px
  }
`;

  const PriceCard = styled.div`
  width:${screenWidth()};
  paddinng-top:20px;
  background:linear-gradient(to bottom, #6352E8 0%, #3712B3 100%);
  display:"flex"
  justify-content: ${flexType()};
   flex-wrap: wrap;
  border-radius:6px;
  font-weight: lighter;
  boxShadow: 0px 3px 6px #00000029;
  
  & 
  div {
    color:#fff;
    font-size:14px;
    padding:14px 18px;
    
  }
`;
  
  const SideBox = styled.div` 
  display:flex;
  justify-content: center;
  align-items: center;
  margin-bottom:50px; 
  padding:20px 10px;  
  // border: 1px solid red; 
  border-bottom:none;
//  border-image-source: linear-gradient(180.99deg, #CAB7FF 2.33%, #4D1A4B 45.7%, rgba(24, 14, 52, 0) 99.15%);
  background: linear-gradient(180.07deg, #543CD6 0.05%, #361F86 48.96%, #160133 99.94%), linear-gradient(180.99deg, #CAB7FF 2.33%, #4D1A4B 45.7%, rgba(24, 14, 52, 0) 99.15%);

  & p {
    font-size:19px;
    background: -webkit-linear-gradient(270deg, #FEFEFE 35.94%, #3C1ABA 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  }

  & span {
    font-size:12px;
    line-height:15px;
  }

`;
  

  let navigate = useNavigate();
  
  const BottomBox = styled.div` 
  // border:1px solid red;
  display:flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  margin-top:${window.screen.width >767 ? "50px" :"10px"};
  margin-bottom:${window.screen.width >767 ? "50px" :"10px"};
  flex-direction: column;
  width:${window.screen.width >767 ? "30%" :"100%"};
  height:${window.screen.width >767 ? "auto" :"130px"};
  & p {
    margin-top:5px;
    font-size:14px;
    text-align:center;
   background: -webkit-linear-gradient(270deg, #FEFEFE 35.94%, #3C1ABA 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  }
`;
  return (
    <>        
      <div
        className='p-0 m-0 w-100 d-flex justify-content-center'
        style={{
          background: "#160133",
          // height: `${screenHeight()}`,
          // width: `${window.screen.width > 979 ? "730px" : "100%"}`,
        }}
      >
        <div
          className=''
          style={{
            background: "#160133",
            width: `${window.screen.width > 979 ? "850px" : "100%"}`,
          }}
        >                    
            <H2
              style={{
                fontSize: "1.25rem",
                marginTop: "0px",
                paddingTop: "30px",
                fontWeight: "bold",
                textTransform:'uppercase'
              }}
            >
              {translate("Become a miner")}
          </H2>
          
          <P
            style={{ fontSize: "15px", fontWeight: "100", marginTop: "10px" }}
            className="px-3 pt-4  pb-3"
            >              
                Upgrade your account to a full mining account and <strong>enjoy the benefits</strong> of being a miner.              
          </P>  
          <div className="d-flex justify-content-around align-items-center flex-wrap"
            style={{
            // display:`${window.screen.width > 767 ? "flex" :""}`
          }}
          >
            <div className="d-flex justify-content-center "
            style={{width:`${window.screen.width > 767 ?"50%" :"100%"}`}}
            >
                <img src={upgrade} alt="" width={window.screen.width>767? "400px":"300px"}/>
            </div>                                         
            <div className=""
            style={{width:`${window.screen.width > 767 ?"50%" :"100%"}`}}
            >
              <div>
                <SideBox>
                  
                    <div
                    style={{ width: "30%" }}
                    className="d-flex justify-content-center align-items-center"
                    >
                  <img src={Framemoney} alt="" width={"70px"}/>
                    </div>
                    <div
                    style={{width:"70%"}}
                    >
                      <p>Lifetime commission</p>
                      <span>Earn 50% lifetime commission of all your friends' total purchases.</span>
                  </div>
              
                </SideBox>
                
                <SideBox>
                  
                    <div
                    style={{ width: "30%" }}
                    className="d-flex justify-content-center align-items-center"
                    >
                  <img src={Frame} alt="" width={"60px"}/>
                    </div>
                    <div
                    style={{width:"70%"}}
                    >
                      <p>Full mining machine</p>
                      <span>Mine PAX BEP20 token</span>
                  </div>
              
                </SideBox>


                <SideBox >
                  
                    <div
                    style={{ width: "30%" }}
                    className="d-flex justify-content-center align-items-center"
                    >

                  <img src={NftFrame} alt="" width={"60px"}/>
                    </div>
                    <div
                    style={{width:"70%"}}
                    >
                    <p>NFT converter</p>
                    <span>Convert your cards collection to NFTs</span>
                  </div>
              
                </SideBox>

                

                <SideBox >                                                    
                    <div 
                    style={{ width: "30%" }}
                    className="d-flex justify-content-center align-items-center"
                    >
                    <img src={Gift} alt="Gift"  width={"60px"}/>
                    </div>
                      
                    <div className=""
                    style={{width:"70%"}}
                    >
                      <p>Purchases</p>
                      <span>Use your parliament coin (V2E) to buy merchandise</span>
                      </div>
                  
                
                </SideBox>

              </div>
            </div>                                         
          </div>

          <H2
              style={{
                fontSize: "1.25rem",
                marginTop: "0px",
                paddingTop: "30px",
                fontWeight: "bold",
                // textTransform:'uppercase'
              }}
            >
              {translate("In addition, you will receive the following gifts")}
          </H2>               
          
          <div className="d-flex justify-content-around my-4 flex-wrap">          
            <BottomBox className="">
              <img src={VOUCHER} alt="" width={"100px"} className="mt-3"/>
              <p className="">Voucher for merchandise purchase</p>
            </BottomBox>  
            <BottomBox className=" ">
              <img src={XXVote} alt="" width={"90px"}/>
              <p className="mt-3">Extra votes</p>
            </BottomBox>  
            <BottomBox className=" ">
              <img src={XXCOIN} alt="" width={"100px"}/>
              <p className="mt-3">Parliament coins (V2E)</p>
            </BottomBox>  
          </div>
          {/* @ts-ignore */}
          {userInfo?.isUpgraded ?
            <div
              style={{
                fontSize: "1.25rem",
                marginTop: "0px",
                // paddingTop: "30px",
                marginBottom:"30px",
                fontWeight: "bold"
                ,
                // textTransform:'uppercase'
              }}
              className="text-center"
            >
                    <p className="py-2" > Congratulations </p>
               <p className="py-2">YOU'RE NOW A MINER</p>
               <p className="py-2">Now you can enjoy the benefits of being a miner.</p>
          </div>
            :
            <div
            className='text-center mb-4'
            style={{
              zIndex: 1,
              fontWeight: "400",
              position: "relative",
              marginTop: "20px",
            }}
          >
            <button
              type='button'
              className='btn '
              onClick={() => {
                if(clicked) return
                // setClicked(true)   
                navigate("/paymentList")             
                handleSoundClick()                
              }}
              style={{
                background:
                  " linear-gradient(to bottom, #6352E8 0%, #3712B3 100%)" /* fallback for old browsers */,
                color: "#fff",
                width: "250px",
                // margin: "20px",
                padding: "5px 0px",
                boxShadow: "0px 3px 6px #00000029",
                fontSize: "25px",
              }}
            >
              <p> UPGRADE NOW </p>
              <span style={{ fontSize: "12px"}}>One time Payment of <del>$199</del> $99</span>
            </button>
          </div> }       
        </div>
      </div>
      {/* {clicked &&
        <PaymentPop
        openPopup={clicked}
        setClicked={setClicked}
      />
      } */}
    </>
  );
};

export default UpgradePage;
