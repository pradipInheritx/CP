import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "../../common/models/Dictionary";
import Copy from "../icons/copy";
import copy from "copy-to-clipboard";
import NotificationContext, { ToastType } from "../../Contexts/Notification";
import earn from "../../assets/images/earn.png";
import { texts } from "../LoginComponent/texts";
import classes from "Pages/Ambassador/Ambassador.module.css"
import signUpImage from "assets/images/SignupNew.png"
import inviteUser from "assets/images/inviteUser.svg"
import Gift from "assets/images/Gift.svg"
import whatsApp from "assets/images/whatsapp.svg"
import twitter from "assets/images/twitter.png"
import facebook from "assets/images/facebook.svg"
import XTwitter from "assets/images/x-twitter.svg"
import AppContext from "Contexts/AppContext";
import UserContext from "Contexts/User";
import Layer from "assets/images/Layer.png"
import GroupNew from "assets/images/GroupNew.png"
import ShareBlue from "assets/svg/ShareBlue.svg"
import ShareGold from "assets/svg/ShareGold.svg"
import ShareNew from "assets/images/ShareNew.png"
import VBG from "assets/images/VBG.png"
import VBGM from "assets/images/VBGM.png"

const PoolBox = styled.div`
  overFlow-x:hidden;
  min-height: 76px;
  
  // background-color: #6352e8;
  color: white;
  // box-shadow: 0px 3px 6px #00000029
`;

const Titles = styled.div`
  font-size: 20px;
  color: white;
  // text-transform: uppercase;
  
`;

const I = styled.i`
  cursor: pointer;
  font-size:22px;
`;


const ImgBox = styled.div`
  display:flex;
  align-items: center;
  flex-direction: column;
  width:33%;
& img{
width:7em;
}
& p{
  font-size:17px;
}

`;

const H2 = styled.h2`
color: #e6d348;
letter-spacing:3px;
  -webkit-text-fill-color: white; /* Will override color (regardless of order) */
  // -webkit-text-stroke-width: 3px;
  background: -webkit-linear-gradient(180deg, rgba(243,236,60,1) 0%, rgba(212,176,92,1) 100%);
  -webkit-background-clip: text;
  -webkit-text-stroke: 7px transparent;
  text-transform: uppercase;  
  text-shadow: 0px 1px 3px 0px #5B03FF;
  font-family: 'Lilita One';
  text-align: center;
`;

const Span = styled.span`
color: #e6d348;

  -webkit-text-fill-color: white; /* Will override color (regardless of order) */
  -webkit-text-stroke-width: 3px;
   background: -webkit-linear-gradient(270deg, rgba(82,99,184,1) 0%, rgba(178,102,245,1) 100%);
  -webkit-background-clip: text;
  -webkit-text-stroke: 4px transparent;
  text-transform: uppercase;  
  text-shadow: 0px 1px 3px 0px #5B03FF;
  font-family: 'Lilita One';
  text-align: center;
`;

const ButttonDiv = styled.div`
width:200px;
border:3px solid white;
 display: flex;
justify-content: center;
border-radius:50px;
background: linear-gradient(180deg, rgba(82,99,184,1) 0%, rgba(178,102,245,1) 100%);
  animation: color_change 1s infinite ;
transition: background 1s;

@keyframes color_change {
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

 & img{
  width:20px;
  margin-left:10px;
  color:red;
 }

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

type ShareAndEarnProps = {
  url: string;
  text: string;
  shareText: string;
};

const Share = ({ url, text, shareText }: ShareAndEarnProps) => {
  const translate = useTranslation();
  const { showToast } = useContext(NotificationContext);
  const [showShare, setShowShare] = useState(false);
  const { user } = useContext(UserContext);
  const { setLogin } = useContext(AppContext)

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageSources = [
    ShareGold, ShareBlue,
    // Add more image sources as needed
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      // Step 4: Update the image index, resetting to 0 if it reaches the end
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageSources.length);
    }, 1000); // 1000ms = 1 second

    // Step 5: Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [currentImageIndex]);

  return (
    <div
      style={{
        backgroundImage: `${window.screen.width > 767 ? `url(${VBG})` : `url(${VBGM})`}`,
        backgroundRepeat: `${window.screen.width > 767 ? "repeat" : "repeat"}`,
        backgroundPosition: "0 0 0 0",
        backgroundSize: "100%",
        // backgroundSize: "cover",
        // backgroundAttachment: "fixed",
      }}
      className="mb-4"
    >
      <div className="pt-3">
        <H2
          style={{
            fontSize: `${window.screen.width > 767 ? "4rem" : "3.5rem"}`,
          }}
        >BECOME AMBASSADOR</H2>
      </div>
      <div className="pt-5 text-center">
        <span
          // className={classes.shareSubHeaderText}
          className={`${classes.footerAmb} text-center`}
          style={{ color: '#FEFEFE' }}>Invite your friends to become </span>
      </div>
      <div className="text-center">
        <span
          // className={classes.shareSubHeaderText}
          className={`${classes.footerAmb} text-center`}
        // style={{ color: '#684dc9', background: "linear-gradient(180deg, #FEFEFE 35.94%, #3C1ABA 100%)", WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >Voting Parliament</span>
      </div>
      <div className="text-center">
        <span
          // className={classes.shareSubHeaderText}
          className={`${classes.footerAmb} text-center`}
          style={{ color: '#FEFEFE' }}>members and enjoy the benefits of being our Ambassador.</span>
      </div>

      {/* <div className="d-flex justify-content-center">
        <H2 className="mt-5"
          style={{
            fontSize: `${window.screen.width > 767 ? "4rem" : "3.5rem"}`,
            alignItems: "center"
          }}
        >BECOME AMBASSADOR TODAY</H2>
      </div> */}
      <PoolBox style={{ paddingTop: '5em' }}>

        <div className="d-flex justify-content-around m-auto"
          style={{
            width: `${window.screen.width > 767 ? "650px" : "100%"}`
          }}
        >
          <ImgBox>
            <img src={signUpImage} />
            <div className="mt-3"
            >
              <p className="text-center">SIGN UP</p>
            </div>
          </ImgBox>
          {window.screen.width > 767 && <div className="d-flex align-items-center">
            <img src={Layer} style={{ width: '6em' }} />
          </div>}
          <ImgBox>
            <img src={GroupNew} />
            <div className="mt-3"
            >
              <p className="text-center">INVITE YOUR FRIEND</p>
            </div>
          </ImgBox>
          {window.screen.width > 767 && <div className="d-flex align-items-center">
            <img src={Layer} style={{ width: '6em' }} />
          </div>}
          <ImgBox>
            <img src={ShareNew} />
            <div className="mt-3"
            >
              <p className="text-center">START EARNING</p>
            </div>
          </ImgBox>
        </div>
        {window.screen.width < 767 && <div className="d-flex justify-content-center mt-4">
          <img src={Layer} style={{ width: '10em' }} />
        </div>}
        <div className="d-flex justify-content-center mt-5">
          <Span
            style={{
              fontSize: `${window.screen.width > 767 ? "3rem" : "2.5rem"}`,
              alignItems: "center"
            }}
          // className={classes.headerText}
          >50% Lifetime passive income</Span>
        </div>

        <div className="d-flex justify-content-center mt-3" style={{ position: 'relative' }}>
          <ButttonDiv className="mt-1 m-auto">
            <button
              onClick={() => {
                if (!user?.uid) {
                  setLogin(true)
                  return
                } else {
                  setShowShare(prev => !prev);
                }
              }}
            >EARN NOW !

              <img src={imageSources[currentImageIndex]} alt="" width={"20px"} className="" />
            </button>
          </ButttonDiv>
          {showShare && <div className={classes.shareBox} style={window.screen.width < 300 ? {
            marginLeft: '2em',
            top: '5em',
          } : (window.screen.width <= 425 ? {
            marginLeft: '8em',
            top: '4em',
          } : {
            marginLeft: '10em',
            top: '4em',
          })}>
            <span className="material-symbols-outlined text-secondary me-2"
              onClick={() => {
                copy(url);
                showToast(
                  'Your referral link is copied to the clipboard.',
                  ToastType.SUCCESS
                );
              }}>
              content_copy
            </span>
            <a href={`https://api.whatsapp.com/send/?phone&text=${`${shareText} ${url}`.replace(" ", "+")}&app_absent=0`} target="_blank" onClick={() => setShowShare(false)}>
              <img src={whatsApp} className="me-2" />
            </a>
            <a href={`https://twitter.com/intent/tweet?url=${url}?check_suite_focus=true&text=${shareText}`} target="_blank" onClick={() => setShowShare(false)}>
              <img src={XTwitter} width={'25px'} height={'25px'} className="me-2" />
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${shareText}`} target="_blank" onClick={() => setShowShare(false)}>
              <img src={facebook} className="me-2" />
            </a>
          </div>
          }
        </div>

        <div className="d-flex justify-content-center align-items-center">
          <div className={`row mt-5`} style={{ width: (window.screen.width >= 1200 ? '60%' : '') }}>
            <div className="col-md-12"
              style={{
                fontFamily: 'Lilita One',
                letterSpacing: "1px"
              }}
            >
              <span className={`mb-3`}
                style={{
                  fontSize: "20px"
                }}
              >How does it work?</span>
              <div className={classes.description} style={{ fontSize: '1.2em' }}>
                <ol>
                  <div className="d-flex ">
                    <div>
                      <li className={`${classes.textsomechange}`} ><span> Sign  up</span>  to become a member.</li>
                      <li className={`${classes.textsomechange}`}><span>Invite your friends </span> from any social media platform using your unique referral link.</li>
                    </div>
                    {window.screen.width > 767 && <div>
                      <img src={earn} alt="" width={window.screen.width > 767 ? "200px" : "300px"}
                        style={{
                          marginTop: "-70px"
                        }}
                      />
                    </div>}
                  </div>
                  <li className={`${classes.textsomechange}`}>
                    <span> Start earning !</span>
                    <ul style={{ listStyleType: 'disc', padding: '0px', paddingLeft: '1em' }}>
                      <li className={`${classes.textsomechange} mt-2`}>Accelerating your mining progress. Every referred vote will contribute to your CMP progress. Upon completion of <span> 100 CMP (closing block)</span>, you will be eligible for rewards.</li>
                      <li className={`${classes.textsomechange} mt-2`}>
                        <div
                          style={{
                            lineHeight: "1.7"
                          }}
                        >
                          <span >Lifetime</span> passive income rev-share program, receive <span>50% of all your friends' total purchases </span> directly to your wallet.
                        </div>

                      </li>
                    </ul>
                  </li>

                </ol>
              </div>
            </div>
            {window.screen.width < 767 && <img src={earn} alt="" width={window.screen.width > 767 ? "200px" : "300px"} />}
          </div>

        </div>
        {window.screen.width > 767 && <p className={`${classes.footerAmb} text-center`}>Your friends will be an integral part of your progress and income <span className={classes.foreverText}>FOREVER!</span></p>}

        <div className="d-flex justify-content-center mt-3 mb-5" style={{ position: 'relative' }}>
          <ButttonDiv className="mt-1 m-auto">
            <button
              onClick={() => {
                if (!user?.uid) {
                  setLogin(true)
                  return
                } else {
                  setShowShare(prev => !prev);
                }
              }}
            >EARN NOW !

              <img src={imageSources[currentImageIndex]} alt="" width={"20px"} className="" />
            </button>
          </ButttonDiv>
          {showShare && <div className={classes.shareBox} style={window.screen.width < 300 ? {
            marginLeft: '2em',
            top: '5em',
          } : (window.screen.width <= 425 ? {
            marginLeft: '8em',
            top: '4em',
          } : {
            marginLeft: '10em',
            top: '4em',
          })}>
            <span className="material-symbols-outlined text-secondary me-2"
              onClick={() => {
                copy(url);
                showToast(
                  'Your referral link is copied to the clipboard.',
                  ToastType.SUCCESS
                );
              }}>
              content_copy
            </span>
            <a href={`https://api.whatsapp.com/send/?phone&text=${`${shareText} ${url}`.replace(" ", "+")}&app_absent=0`} target="_blank" onClick={() => setShowShare(false)}>
              <img src={whatsApp} className="me-2" />
            </a>
            <a href={`https://twitter.com/intent/tweet?url=${url}?check_suite_focus=true&text=${shareText}`} target="_blank" onClick={() => setShowShare(false)}>
              <img src={XTwitter} width={'25px'} height={'25px'} className="me-2" />
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${shareText}`} target="_blank" onClick={() => setShowShare(false)}>
              <img src={facebook} className="me-2" />
            </a>
          </div>
          }
        </div>
      </PoolBox>
    </div >
  );
};

export default Share;
