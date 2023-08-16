import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { texts } from "Components/LoginComponent/texts";
import GeneralPage from "GeneralPage";
import styled from "styled-components";
import earn from "assets/images/earn.png";
import { useTranslation } from "common/models/Dictionary";
import Button, { Buttons } from "Components/Atoms/Button/Button";
import copy from "copy-to-clipboard";
import NotificationContext, { ToastType } from "Contexts/Notification";
import UserContext from "Contexts/User";
import AppContext from "Contexts/AppContext";
import Copy from "Components/icons/copy";
import classes from "./partners.module.css"
import signUpImage from "assets/images/signup.svg"
import inviteUser from "assets/images/inviteUser.svg"
import Gift from "assets/images/Gift.svg"
import whatsApp from "assets/images/whatsapp.svg"
import twitter from "assets/images/twitter.png"
import facebook from "assets/images/facebook.svg"
import XTwitter from "assets/images/x-twitter.svg"

const PoolBox = styled.div`
  overFlow-x:hidden;
  min-height: 76px;
  padding:10px;
  color: white;
  box-shadow: 0px 3px 6px #00000029;
  border-radius:10px;
`;

const Titles = styled.div`
  font-size: 14px;
  color: black;
  text-transform: uppercase;

`;
const I = styled.i`
  cursor: pointer;
  font-size:22px;
`;
const
  Partners = () => {
    const translate = useTranslation();
    const { showToast } = useContext(NotificationContext);
    const { user } = useContext(UserContext);
    const { setLogin } = useContext(AppContext)
    const referralUrl = `${document.location.protocol}//${document.location.host}/?refer=${user?.uid}`;
    const url = referralUrl
    const shareText = `Hey,%0ajoin me on Coin Parliament and earn rewards for your opinion!%0aLet's vote together!`
    const [showShare, setShowShare] = useState(false);
    return (
      <div className={classes.partnersMain}>
        <PoolBox style={{ paddingTop: '5em' }}>
          <div className={classes.stepContainer}>
            <div className={classes.tableCell}>
              <button className={classes.step}>
                <img src={signUpImage} style={{ width: '3em' }} />
              </button>
              <a className={classes.buttonText}>SIGN UP</a>
              <div className={classes.stepConnecterNext}></div>
            </div>
            <div className={classes.tableCell}>
              <button className={classes.step}>
                <img src={inviteUser} />
              </button>
              <a className={classes.buttonText}>INVITE YOUR FRIENDS</a>
              <div className={classes.stepConnecterPrev}></div>
              <div className={classes.stepConnecterNext}></div>
            </div>
            <div className={classes.tableCell}>
              <button className={classes.step}>
                <img src={Gift} />
              </button>
              <a className={classes.buttonText}>ENJOY YOUR BENEFIT</a>
              <div className={classes.stepConnecterPrev}></div>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <span className={classes.headerTitle}>We believe in Partnerships!</span>
          </div>
          <div className="d-flex justify-content-center align-items-center ">
            <div className={`row mt-5`} style={{ width: (window.screen.width >= 1200 ? '60%' : '') }}>
              <div className="col-md-7">
                <span className={classes.subHeaderText}>How does the Coin Parliament partners' program work?</span>
                <div className={classes.description}>
                  <ol>
                    <li>Sign up to become a member of Coin Parliament .</li>
                    <li>Invite your friends from any social media platform using your unique referral link.</li>
                    <li>
                      Enjoy the benefits of the Coin Parliament partner program .
                      <ul style={{ listStyleType: 'disc', padding: '0px', paddingLeft: '1em' }}>
                        <li>Accelerating your mining progress</li>
                        <li>Every referred vote will contribute to your CMP progress. Upon completion of 100 CMP (closing block), you will be eligible for rewards.</li>
                        <li>Receive 50% of all your friends' total purchases directly to your wallet.</li>
                      </ul>
                    </li>

                  </ol>
                </div>
              </div>
              <div className="col-md-5 text-center">
                <img src={earn} alt="" width={window.screen.width > 767 ? "400px" : "300px"} />
              </div>
            </div>

          </div>
          <p className={`${classes.footerText} text-center`}>Your friends will be an integral part of your progress and income <span className={classes.foreverText}>FOREVER!</span></p>
          <p className={`${classes.footerText} text-center m-0`}> That’s it, </p>
          <div className="d-flex justify-content-center" style={{ position: 'relative' }}>
            <button
              id="my-tooltip-click"
              className={classes.inviteButton}
              style={{ width: window.screen.width <= 425 ? '10em' : 'auto' }}
              onClick={() => {
                if (!user?.uid) {
                  setLogin(true)
                  return
                } else {
                  setShowShare(prev => !prev);
                }
                return;
                copy(referralUrl);
                showToast(
                  'Your referral link is copied to the clipboard.',
                  ToastType.SUCCESS
                );
              }}
            >
              <span>INVITE YOUR FRIENDS NOW!</span>{window.screen.width <= 425 && <br />}
              <span className="material-icons-outlined me-2">share</span>
              <span className="material-symbols-outlined">arrow_drop_down</span>
            </button>
            {showShare && <div className={classes.shareBox} style={window.screen.width <= 425 ? {
              marginLeft: '2em',
              top: '9em',
            } : {
              marginLeft: '16em',
              top: '4em',
            }}>
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
          <div className="d-flex  mt-3 mb-5 m-auto d-flex justify-content-center ">
          </div>
        </PoolBox>
      </div >
    );

    return (
      <GeneralPage>

      </GeneralPage>
    );
  };

export default Partners;
