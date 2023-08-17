import React, { useContext, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "../../common/models/Dictionary";
import Copy from "../icons/copy";
import copy from "copy-to-clipboard";
import NotificationContext, { ToastType } from "../../Contexts/Notification";
import earn from "../../assets/images/earn.png";
import { texts } from "../LoginComponent/texts";
import classes from "Pages/partners/partners.module.css"
import signUpImage from "assets/images/signup.svg"
import inviteUser from "assets/images/inviteUser.svg"
import Gift from "assets/images/Gift.svg"
import whatsApp from "assets/images/whatsapp.svg"
import twitter from "assets/images/twitter.png"
import facebook from "assets/images/facebook.svg"
import XTwitter from "assets/images/x-twitter.svg"
import AppContext from "Contexts/AppContext";
import UserContext from "Contexts/User";
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
  return (
    <PoolBox>
      <div className="d-flex justify-content-center">
        <span className={classes.headerTitle}>We believe in Partnerships!</span>
      </div>
      <div className="d-flex justify-content-center pt-5 text-center">
        <span className={classes.shareSubHeaderText} style={{ color: '#FEFEFE' }}>Invite your friends to become </span>
      </div>
      <div className="d-flex justify-content-center text-center">
        <span className={classes.shareSubHeaderText} style={{ color: '#684dc9', background: "linear-gradient(180deg, #FEFEFE 35.94%, #3C1ABA 100%)", WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Coin Parliament</span>
      </div>
      <div className="d-flex justify-content-center text-center">
        <span className={classes.shareSubHeaderText} style={{ color: '#FEFEFE' }}>members and enjoy the benefits of being our partner.</span>
      </div>

      <div className="d-flex justify-content-center align-items-center">
        <div className={`row mt-3`} style={{ width: (window.screen.width >= 1200 ? '60%' : '') }}>
          <div className="col-md-6 d-flex  align-items-center">
            <div className={classes.description}>
              <ul>
                <li>Accelerating your mining progress.</li>
                <li> Lifetime passive income rev-share program, receive 50% of all your friends' total purchases directly to your wallet.</li>
              </ul>
            </div>
          </div>
          <div className="col-md-5 text-center">
            <img src={earn} alt="" width={window.screen.width > 767 ? "400px" : "300px"} />
          </div>
        </div>
      </div>
      <p className={`${classes.footerText} text-center`}>Your friends will be an integral part of your progress and income <span className={classes.foreverText}>FOREVER!</span></p>
      <p className={`${classes.footerText} text-center m-0`}> that’s it, </p>
      <div className="d-flex justify-content-center" style={{ position: 'relative' }}>
        <button
          id="my-tooltip-click"
          className={classes.inviteButton}
          style={{ fontSize: window.screen.width <= 425 ? '1em' : '' }}
          onClick={() => {
            if (!user?.uid) {
              setLogin(true)
              return
            } else {
              setShowShare(prev => !prev);
            }
            return;
          }}
        >
          <span>SHARE NOW TO START EARNING!</span>{window.screen.width < 300 && <br />}
          <span className="material-icons-outlined me-2">share</span>
          <span className="material-symbols-outlined">arrow_drop_down</span>
        </button>
        {showShare && <div className={classes.shareBox} style={window.screen.width < 300 ? {
          marginLeft: '2em',
          top: '5em',
        } : (window.screen.width <= 425 ? {
          marginLeft: '13em',
          top: '4em',
        } : {
          marginLeft: '16em',
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
      <div className="d-flex  mt-3 mb-5 m-auto d-flex justify-content-center ">
      </div>
    </PoolBox>
  );
  return (
    <PoolBox className="mx-auto d-flex justify-content-center" style={{ width: window.screen.width < 979 ? '100%' : '40%' }}>
      <Titles style={{ textAlign: window.screen.width < 979 ? 'center' : 'start' }}>
        <div className="d-flex justify-content-center mt-4">
          <h5 className="">
            {/* {translate('We believe in Partnerships! ')} */}
            {/* {texts.WEBELIEVEINPARTNERSHIPS} */}
            <strong style={{ textTransform: 'uppercase', fontSize: "1.25rem" }}> We believe in Partnerships!</strong>
          </h5>
        </div>
        <div className="d-flex justify-content-center">
          <img src={earn} alt="" width={window.screen.width > 767 ? "400px" : "300px"} />
        </div>
        <div className="d-flex justify-content-center ">
          <h6 className="mx-4" style={{ fontWeight: 300, fontSize: '14px', textAlign: 'center' }}>Invite your friends to become <strong>Coin Parliament</strong> members and enjoy the benefits of being our partner.</h6>
        </div>
        <div className="d-flex justify-content-center my-3" style={{ paddingLeft: "40px" }}>
          <ul style={{ fontWeight: 300, fontSize: '14px', textAlign: 'start' }}>
            <li>Accelerating your mining progress</li>
            <li>Lifetime passive income rev-share program, receive <strong>50%</strong> of all your friends' total purchases directly to your wallet.</li>
          </ul>
        </div>
        <div className="px-3">
          <p style={{ width: "100%", fontSize: "14px", fontWeight: "100", textAlign: "center" }}>Your friends will be an integral part of your progress and income <strong>FOREVER!</strong></p>
        </div>

        <div className="d-flex justify-content-center my-3">
          <strong className="mx-4" style={{ fontSize: '14px', textAlign: 'center' }}>SHARE NOW TO START EARNING!</strong>
        </div>
        <div className="d-flex  mt-3 mb-5 m-auto d-flex justify-content-center ">
          <div className="mx-3">
            <span
              onClick={() => {
                copy(url);
                showToast(
                  'Your referral link is copied to the clipboard.',
                  ToastType.SUCCESS
                );
              }}
              style={{ cursor: "pointer" }}
            >
              <Copy />
            </span>
          </div>

          <div className="mx-3">
            <I
              className="bi-whatsapp"

              onClick={() =>
                window.open(
                  `https://api.whatsapp.com/send/?phone&text=${`${shareText} ${url}`.replace(
                    " ",
                    "+"
                  )}&app_absent=0`,
                  "_blank"
                )
              }
            />
            {/* <I
              className="bi-facebook"
              onClick={() =>
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                  "_blank"
                )
              }
            /> */}
          </div>
          <div className="mx-3">
            <I
              className="bi-twitter"
              onClick={() =>
                window.open(
                  `https://twitter.com/intent/tweet?url=${url}?check_suite_focus=true&text=${shareText}`,
                  "_blank"
                )
              }
            />
          </div>
          <div className="mx-3">
            <img
              height='25'
              src={process.env.PUBLIC_URL + '/images/icons/facebookWhite.png'}
              onClick={() =>
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${url}&t=${shareText}`,
                  "_blank"
                )
              }
              style={{ cursor: "pointer" }}
            />
          </div>

        </div>

      </Titles>
    </PoolBox>
  );
};

export default Share;
