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

const
  Partners = () => {
    const translate = useTranslation();
    const { showToast } = useContext(NotificationContext);
    const { user} = useContext(UserContext);
    const referralUrl = `${document.location.protocol}//${document.location.host}/?refer=${user?.uid}`;
    return (    
    <GeneralPage >               
      <PoolBox style={{marginRight:'-27px', marginLeft:'-27px' }}>
        {/* <h2 className="d-flex justify-content-center"> {(`${texts.Partners}`).toUpperCase()}</h2> */}
        <div className="d-flex justify-content-center mt-4">          
          <h6 className="">            
              {/* {texts.WEBELIEVEINPARTNERSHIPS} */}
              We believe in Partnerships!
          </h6>
        </div>
        <div className="d-flex justify-content-center">
          <img src={earn} alt="" width={window.screen.width>767? "400px":"300px" }/>
        </div>        
        <p className="my-4 text-center">How does the Coin Parliament partners' program work?</p>                 
          <p className="text-center"><strong> Signup • Invite your friends • Enjoy the benefits</strong></p>   
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
            <p className="">Your friends will be an integral part of your progress and income <strong>FOREVER!</strong></p>  
            </div>                        
          </div>  
          <p className="text-center"> That’s it, </p>
        <div className="d-flex justify-content-center">
        <Button 
          className="fw-bold"
         onClick={() => {
          copy(referralUrl);
          showToast(
            `${referralUrl} ${translate(texts.CopiedClipboard)}`,
            ToastType.SUCCESS
          );
              }}
            >
              INVITE YOUR FRIENDS NOW!
            </Button>  
          </div>  
          </PoolBox>
    </GeneralPage>
  );
};

export default Partners;
