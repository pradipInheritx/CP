import React, { useContext } from "react";
import styled from "styled-components";
import { useTranslation } from "../../common/models/Dictionary";
import Copy from "../icons/copy";
import copy from "copy-to-clipboard";
import NotificationContext, { ToastType } from "../../Contexts/Notification";
import earn from "../../assets/images/earn.png";
import { texts } from "../LoginComponent/texts";

const PoolBox = styled.div`
  overFlow-x:hidden;
  min-height: 76px;
  
  background-color: #6352e8;
  color: white;
  box-shadow: 0px 3px 6px #00000029
`;

const Titles = styled.div`
  font-size: 20px;
  color: white;
  
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
  return (
    <PoolBox className="mx-auto d-flex justify-content-center" style={{width:window.screen.width<979?'100%':'40%'}}>
      <Titles style={{textAlign:window.screen.width<979?'center':'start'}}>
        <div className="d-flex justify-content-center mt-4">
          <h5 className="">
            {/* {translate('We believe in Partnerships! ')} */}
            {/* {texts.WEBELIEVEINPARTNERSHIPS} */}
            <strong style={{textTransform:'uppercase', fontSize: "1.25rem"}}> We believe in Partnerships!</strong>
          </h5>
        </div>
        <div className="d-flex justify-content-center">
          <img src={earn} alt="" width={window.screen.width>767? "400px":"300px" }/>
        </div>
        <div className="d-flex justify-content-center ">
          <h6 className="mx-4" style={{fontWeight:300,fontSize:'14px',textAlign:'center'}}>Invite your friends to become <strong>Coin Parliament</strong> members and enjoy the benefits of being our partner.</h6>         
        </div>
        <div className="d-flex justify-content-center my-3" style={{paddingLeft:"40px"}}>          
          <ul style={{fontWeight:300,fontSize:'14px',textAlign:'start'}}>
            <li>Accelerating your mining progress</li>
            <li>Lifetime passive income rev-share program, receive <strong>50%</strong> of all your friends' total purchases directly to your wallet.</li>
          </ul>
        </div>
        <div className="px-3">          
        <p   style={{width:"100%",fontSize:"14px",fontWeight:"100", textAlign:"center"}}>Your friends will be an integral part of your progress and income <strong>FOREVER!</strong></p>
        </div>

        <div className="d-flex justify-content-center my-3">
          <strong className="mx-4" style={{fontSize:'14px',textAlign:'center'}}>SHARE NOW TO START EARNING!</strong>         
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
          
        </div>
        
      </Titles>
    </PoolBox>
  );
};

export default Share;
