import React, { useContext, useEffect, useState } from "react";
import COINPARLIAMENT from "assets/images/COINPARLIAMENT.webp";
import SPORTPARLIAMENT from "assets/images/SPORTPARLIAMENT.webp";
import STOCKPARLIAMENT from "assets/images/STOCKPARLIAMENT.webp";
import VOTINGPARLIAMENT from "assets/images/VOTINGPARLIAMENT.webp";
import styled from "styled-components";
import { Buttons } from "Components/Atoms/Button/Button";
import UserContext from "Contexts/User";
import axios from "axios";
import { auth } from "firebase";
import AppContext from "../Contexts/AppContext";
import ShareBlue from "../assets/svg/ShareBlue.svg";
import ShareGold from "../assets/svg/ShareGold.svg";
import { ToastType } from "Contexts/Notification";
import { showToast } from "App";
import copy from "copy-to-clipboard";
import whatsApp from "../assets/images/whatsapp.svg"
import facebook from "../assets/images/facebook.svg"
import XTwitter from "../assets/images/x-twitter.svg"
import './styles.css';

// const Button = styled.a`
//   flex-direction: column;
//   justify-content: center;
//   border: 1px solid white;
//   border-radius: 5px;
//   background-color: #160133;
//   padding: 1em;
//   text-decoration: none;
//   color: white;
//   cursor: pointer;
//   text-align: center;
//   min-width: 9em;
//   &:hover {
//     background: white;
//     color: #160133;
//     box-shadow: rgb(67 47 229) 0px 4px 1px, rgb(170 164 220) 0px 8px 6px;
//   }
// `;
const ButttonDiv = styled.div`
  
  width: 130px;
  height: 50px;
  border: 3px solid white;
  display: flex;
  justify-content: center;
  border-radius: 50px;
  background: linear-gradient(
    180deg,
    rgba(82, 99, 184, 1) 0%,
    rgba(178, 102, 245, 1) 100%
  );
  animation: home-image 1s infinite;
  transition: background 1s;

  @keyframes home-image {
    0% {
      background: linear-gradient(
        180deg,
        rgba(82, 99, 184, 1) 0%,
        rgba(178, 102, 245, 1) 100%
      );
      color: #b869fc;
    }
    100% {
      background: linear-gradient(
        180deg,
        rgba(212, 176, 92, 1) 0%,
        rgba(243, 236, 60, 1) 100%
      );
      color: #daa636;
    }
  }

  button {
    
    background: white;
    border: 1px solid white;
    border-radius: 50px;
    padding: 0px;
    margin: 4px 0px;
    font-size: 14px !important;
    color: red;
    width: 118px;
    height:36px;
    color: #b869fc;
    font-family: "Lilita One";
    font-family: Rounded Mplus 1c;
    font-size: 15px;
    transition: color 1s;

    & img {
      width: 17px;
      margin-left: 10px;
      color: red;
    }

    animation: colorText 1s infinite ;

    @keyframes colorText {
      0% {
        color: #b869fc;
      }
      100% {
        color: #daa636;
        //  color:#DAA636;
      }
    }
  }
`;

// const Sites = [
//   {
//     img: COINPARLIAMENT,
//     des: 'Coin Parliament is a web 3-based vote to earn game where you can make better investment decisions, mint NFTs, and earn rewards by voting and following top influencers.',
//     title: 'COIN PARLIAMENT',
//     redirect: 'https://coinparliamentstaging.firebaseapp.com/',
//     // redirect: 'http://localhost:3001/',
//     domain: process.env.REACT_APP_COIN_API,
//     name: 'coin',
//   },
//   {
//     img: SPORTPARLIAMENT,
//     des: 'Sport Parliament is an innovative web 3-based platform that allows sports fans to vote on their favorite teams and athletes while earning rewards and staying up-to-date on the latest news and trends.',
//     title: 'SPORT PARLIAMENT',
//     redirect: 'https://sportparliament.com/',
//     domain: process.env.REACT_APP_SPORT_API,
//     name: 'sport',
//   },
//   {
//     img: STOCKPARLIAMENT,
//     des: 'Stock Parliament is a revolutionary web 3-based platform that combines social voting and investing to help you make better investment decisions, earn rewards, and stay ahead of the curve in the fast-paced world of stocks.',
//     title: 'STOCK PARLIAMENT',
//     redirect: 'https://stockparliament.com/',
//     domain: process.env.REACT_APP_STOCK_API,
//     name: 'stock',
//   },
//   {
//     img: VOTINGPARLIAMENT,
//     des: 'The ultimate voting platform for a wide range of topics, including celebrities, music, politics, religion, world economy, and more. Express your opinions, make your voice heard, and earn rewards for your participation. ',
//     title: 'VOTING PARLIAMENT',
//     redirect: 'https://votingparliament.com/',
//     // redirect: 'http://localhost:3001/',
//     domain: process.env.REACT_APP_VOTING_API,
//     name: 'voting',
//   },
// ];
enum SiteTypes {
  coin = "coin",
  sport = "sport",
  stock = "stock",
  voting = "voting",
}
function Home() {
  const [showShare, setShowShare] = useState<boolean | string>(false);
  const { setLogin } = useContext(AppContext);
  const { user } = useContext(UserContext);
  const [sites, setSites] = useState<{ [key: string]: any }>({
    [SiteTypes.coin]: {
      img: COINPARLIAMENT,
      des: "Coin Parliament is a web 3-based vote to earn game where you can make better investment decisions, mint NFTs, and earn rewards by voting and following top influencers.",
      title: "COIN PARLIAMENT",
      redirect: "https://coinparliament.com/",
      // redirect: 'http://localhost:3001/',
      domain: process.env.REACT_APP_COIN_API,
      name: "coin",
    },
    [SiteTypes.sport]: {
      img: SPORTPARLIAMENT,
      des: "Sport Parliament is an innovative web 3-based platform that allows sports fans to vote on their favorite teams and athletes while earning rewards and staying up-to-date on the latest news and trends.",
      title: "SPORT PARLIAMENT",
      redirect: "https://sportparliament.com/",
      domain: process.env.REACT_APP_SPORT_API,
      name: "sport",
    },
    [SiteTypes.stock]: {
      img: STOCKPARLIAMENT,
      des: "Stock Parliament is a revolutionary web 3-based platform that combines social voting and investing to help you make better investment decisions, earn rewards, and stay ahead of the curve in the fast-paced world of stocks.",
      title: "STOCK PARLIAMENT",
      redirect: "https://stockparliament.com/",
      domain: process.env.REACT_APP_STOCK_API,
      name: "stock",
    },
    [SiteTypes.voting]: {
      img: VOTINGPARLIAMENT,
      des: "The ultimate voting platform for a wide range of topics, including celebrities, music, politics, religion, world economy, and more. Express your opinions, make your voice heard, and earn rewards for your participation. ",
      title: "VOTING PARLIAMENT",
      redirect: "https://votingparliament.com/",
      // redirect: 'http://localhost:3001/',
      domain: process.env.REACT_APP_VOTING_API,
      name: "voting",
    },
  });

  const [loading, setLoading] = useState("");
  const redirectUserToSite = (site: { [key: string]: string }) => {
    setLoading(site.name);
    let userIds = JSON.parse(localStorage.getItem("userId") || "{}");
    axios
      .post(`${site.domain}isLoggedInFromVoteToEarn`, {
        data: {
          userId: userIds[site.name],
          email: auth.currentUser?.email,
        },
      })
      .then((response) => {
        if (response?.data?.result?.token) {
          setSites((prev) => {
            return {
              ...prev,
              [site.name]: {
                ...site,
                redirect: `${site.redirect}?token=${response?.data?.result?.token}`,
              },
            };
          });
          // Sites[index].redirect = `${redirectUrl}?token=${response?.data?.result?.token}`
          // window.location.replace(`${redirectUrl}?token=${response?.data?.result?.token}`);
        }
        setLoading("");
      })
      .catch(() => {
        setLoading("");
      });
  };
  useEffect(() => {
    redirectUserToSite(sites.coin);
    redirectUserToSite(sites.sport);
    redirectUserToSite(sites.stock);
    redirectUserToSite(sites.voting);
  }, []);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageSources = [
    ShareGold,
    ShareBlue,
    // Add more image sources as needed
  ];
  // @ts-ignore
  const getAllId = JSON.parse(localStorage.getItem("userId"))
  // @ts-ignore
  const getAllDisplayName = JSON.parse(localStorage.getItem("DisplayName"))

  const [shareIcon, setshareIcon] = useState({

    coin:{
      name: "/cplog.png",
      id: getAllId?.coin,
      displayName: getAllDisplayName?.coin,
      url: "coinparliament.com"
    },
   sport: {
      name: "/SPlogo.png",
      id: getAllId?.sport,
     displayName: getAllDisplayName?.sport,
      url: "sportparliament.com"
    },
    voting:{
      name: "/vplogo.png",
      id: getAllId?.voting,
      displayName: getAllDisplayName?.voting,
      url: "votingparliament.com"
    },
    stock:{
      name: "/sptlogo.png",
      id: getAllId?.stock,
      displayName: getAllDisplayName?.stock,
      url: "stockparliament.com"
    }
  })  

  useEffect(() => {
    const interval = setInterval(() => {
      // Step 4: Update the image index, resetting to 0 if it reaches the end
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % imageSources.length
      );
    }, 1000); // 1000ms = 1 second

    // Step 5: Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [currentImageIndex]);

  const referralUrl = (value: any, url?: any, displayName?: any) => {    
    if (url != "") {          
      return `${document.location.protocol}//${url}/?refer=${value}&userName=${displayName}`
    }
  };  
const shareText = `Hey,%0ajoin me on Coin Parliament and earn rewards for your opinion!%0aLet's vote together!`

  return (
    <div className="d-flex flex-column justify-content-center align-items-center p-5 h-100">
      <h1 className="pb-4">TOP VTE APPS</h1>
      <div className="row">
        {Object.keys(sites).map((key: string, index) => {          
          return (
            <div
              key={index}
              className="card mb-3 col-sm-6"
              style={{
                background: "#160133",
                color: "white",
                textAlign: "justify",
              }}
            >
              <div className="row no-gutters">
                <div className="col-lg-6 p-0">
                  <img
                    src={sites[key].img}
                    className="card-img pt-3"
                    alt="img"
                    style={{ height: "92%" }}
                  />
                </div>
                <div className="col-lg-6 p-0 d-flex">
                  <div className="card-body d-flex flex-column justify-content-center">
                    <h6 style={{ marginRight: "1em", textAlign: "center" }}>
                      {sites[key].title}
                    </h6>
                    <p className="card-text" style={{ marginTop: "5px" }}>
                      {sites[key].des}
                    </p>

                    <div
                      className="d-flex mt-2 align-items-center"
                      style={{ gap: "4px" }}
                    >
                      <ButttonDiv className="mt-1 m-auto">
                        <button
                          >
                          <a
                            href={sites[key].redirect}
                            target="_blank"
                            style={{ textDecoration: "none" }}
                          >
                            {loading === sites[key]?.name ? (
                              <span className="loading">wait...</span>
                            ) : (
                              "VOTE NOW !"
                            )}
                          </a>
                        </button>
                      </ButttonDiv>

                      <ButttonDiv className="mt-1 m-auto">
                        <button
                          onClick={() => {
                            if (!user?.uid) {
                              setLogin(true);
                              return;
                            } else {
                              setShowShare((prev) => !prev ?sites[key]?.name : false );
                            }
                          }}
                          
                        >
                          EARN NOW !
                          <img
                            src={imageSources[currentImageIndex]}
                            alt=""
                            width={"20px"}
                            className=""
                          />
                        </button>
                      </ButttonDiv>

                      {showShare == sites[key]?.name  && <div className={"HomeshareBox"} style={window.screen.width < 300 ? {
                        marginLeft: '2em',
                        top: '26.5em',                        
                        zIndex : 1000,
                      } : (window.screen.width <= 425 ? {
                        marginLeft: '8em',
                          top: '26.5em',
                          zIndex: 1000,
                      } : {
                        marginLeft: '10em',
                            top: '14.5em',                        
                            zIndex: 1000,
                      })}>
                        <div className="d-flex flex-column pt-3">                          
                          <div className="d-flex py-2" key={index}>
                            {/* @ts-ignore */}
                            {/* <img src={shareIcon[`${key}`].name} alt="" width={"25px"} /> */}
                              <span className="material-symbols-outlined text-secondary me-2"
                              onClick={() => {
                                {/* @ts-ignore */ }
                                copy(referralUrl(shareIcon[`${key}`].id, shareIcon[`${key}`].url, shareIcon[`${key}`].displayName));
                                  showToast(
                                    'Your referral link is copied to the clipboard.',
                                    ToastType.SUCCESS
                                  );
                                }}>
                                content_copy
                            </span>
                            {/* @ts-ignore */}
                            <a href={`https://api.whatsapp.com/send/?phone&text=${`${shareText} ${referralUrl(shareIcon[`${key}`].id, shareIcon[`${key}`].url, shareIcon[`${key}`].displayName)}`.replace(" ", "+")}&app_absent=0`} target="_blank" onClick={() => setShowShare(false)}>
                                <img src={whatsApp} className="me-2" />
                            </a>
                            {/* @ts-ignore */}
                            <a href={`https://twitter.com/intent/tweet?url=${referralUrl(shareIcon[`${key}`].id, shareIcon[`${key}`].url, shareIcon[`${key}`].displayName)}?check_suite_focus=true&text=${shareText}`} target="_blank" onClick={() => setShowShare(false)}>
                                <img src={XTwitter} width={'25px'} height={'25px'} className="me-2" />
                            </a>
                            {/* @ts-ignore */}
                            <a href={`https://www.facebook.com/sharer/sharer.php?u=${referralUrl(shareIcon[`${key}`].id, shareIcon[`${key}`].url, shareIcon[`${key}`].displayName)}&t=${shareText}`} target="_blank" onClick={() => setShowShare(false)}>
                                <img src={facebook} className="me-2" />
                              </a>
                            </div>                          
                        </div>
                      </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
