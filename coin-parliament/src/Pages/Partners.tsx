import React, { useContext } from "react";
import {Link} from "react-router-dom";
import { texts } from "../Components/LoginComponent/texts";
import GeneralPage from "../GeneralPage";
import styled from "styled-components";
import earn from "../assets/images/earn.png";
import { useTranslation } from "../common/models/Dictionary";

import Button, { Buttons } from "../Components/Atoms/Button/Button";
import copy from "copy-to-clipboard";
import NotificationContext, { ToastType }   from "../Contexts/Notification";
import UserContext from "../Contexts/User";
import AppContext from "../Contexts/AppContext";
import Copy from "../Components/icons/copy";


const PoolBox = styled.div`
  overFlow-x:hidden;
  min-height: 76px;
  padding:10px;
  background-color: #6352e8;
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
    const { user} = useContext(UserContext);
    const {setLogin}=useContext(AppContext)
    const referralUrl = `${document.location.protocol}//${document.location.host}/?refer=${user?.uid}`;
    const url =referralUrl
    const shareText=`Hey,%0ajoin me on Coin Parliament and earn rewards for your opinion!%0aLet's vote together!`
    return (    
    <GeneralPage >               
      <PoolBox style={{marginRight:'-27px', marginLeft:'-27px' }}>
        {/* <h2 className="d-flex justify-content-center"> {(`${texts.Partners}`).toUpperCase()}</h2> */}
        <div className="d-flex justify-content-center mt-4">          
          <h5 className="text-center">            
              {/* {texts.WEBELIEVEINPARTNERSHIPS} */}
             <strong style={{textTransform:'uppercase', fontSize: "1.25rem"}}> We believe in Partnerships!</strong>
          </h5>
        </div>
        <p className="text-center my-1" style={{fontWeight:500 ,  
    display: 'flex',
    alignItems: 'center',
    justifyContent:'center'}}>
        <Button 
          className="fw-bold"
          style={{    background: 'none',
            height: 'auto',
            border: 'none',
            color: 'white',
            width:'95px'
          }}
            >
              Signup
            </Button> 
        •
        <Button 
          className="fw-bold"
          style={{
            whiteSpace: 'pre-wrap',
            /* height: auto; */
            border: 'none',
            width: '130px',
            background: 'none',
            color: 'white'
          }}
            >
              Invite your friends
            </Button> 
      
        •
        <Button 
          className="fw-bold"
          style={{
            whiteSpace: 'pre-wrap',
            /* height: auto; */
            border: 'none',
            width: '130px',
            background: 'none',
            color: 'white'
          }}
            >
              Enjoy the benefits
            </Button> 
       </p> 
        <div className="d-flex justify-content-center">
          <img src={earn} alt="" width={window.screen.width>767? "400px":"300px" }/>
        </div>        
        <p className="my-4 text-center">How does the Coin Parliament partners' program work?</p>                 
          {/* <p className="text-center"><strong> Signup • Invite your friends • Enjoy the benefits</strong></p>    */}
        <div className="d-flex justify-content-center">
        <div className="" style={{width:`${window.screen.width>767?"75%":"95%"}`}}>                            
                <p className="lh-base ">1. Sign up to become a member of Coin Parliament .</p>
                <p className="lh-base ">2. Invite your friends from any social media platform using your unique referral link.</p>
                <p className="lh-base ">3. Enjoy the benefits of the Coin Parliament partner program .</p>              
              <p className="lh-base ">
                <ul >
                  <li className="mb-3">Accelerating your mining progress</li>
                  <p>Every referred vote will contribute to your CMP progress. Upon completion of 100 CMP (closing block), you will be eligible for rewards.</p>
                  <li>Receive 50% of all your friends' total purchases directly to your wallet.</li>
                </ul>
              </p>
            <p className="text-center">Your friends will be an integral part of your progress and income <strong>FOREVER!</strong></p>  
            </div>                        
          </div>  
          <p className="text-center"> That’s it, </p>
        <div className="d-flex justify-content-center">
        <Button 
          className="fw-bold"
         onClick={() => {
          if(!user?.uid){
setLogin(true)
return
          }
          copy(referralUrl);
          showToast(
           'Your referral link is copied to the clipboard.',
            ToastType.SUCCESS
          );
              }}
            >
              INVITE YOUR FRIENDS NOW!
            </Button>  
          </div> 
         {user?.uid && <div className="d-flex  mt-3 mb-5 m-auto d-flex justify-content-center ">
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
            src={ process.env.PUBLIC_URL + '/images/icons/facebookWhite.png'}
            onClick={() =>
              window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${url}&t=${shareText}`,
                "_blank"
              )
            }
            style={{ cursor: "pointer" }}
            />
          </div>
          
        </div> }
          </PoolBox>
    </GeneralPage>
  );
};

export default Partners;
