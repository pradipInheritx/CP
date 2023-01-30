import React, { useContext } from "react";
import styled from "styled-components";
import { useTranslation } from "../../common/models/Dictionary";
import Copy from "../icons/copy";
import copy from "copy-to-clipboard";
import NotificationContext, { ToastType } from "../../Contexts/Notification";
import earn from "../../assets/images/earn.png";

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
          <h6 className="text-uppercase">{translate(text)}</h6>
        </div>
        <div className="d-flex justify-content-center">
          <img src={earn} alt="" />
        </div>
        <div className="d-flex justify-content-center ">
          <h6 className="text-uppercase">{translate("INVITE FRIENDS & EARN!")}</h6>
        </div>
        <div className=" py-2 w-75   m-auto">          
        <p   style={{width:"100%",fontSize:"12px",fontWeight:"100"}}>When they join and upgrade the account, You will earn CPM VOTES and POINTS.</p>
        </div>
        <div className="d-flex  mt-3 mb-5 m-auto d-flex justify-content-center ">
          <div className="mx-3">
            <span
              onClick={() => {
                copy(url);
                showToast(
                  `${url} ${translate("copied to clipboard")}`,
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
                `https://www.facebook.com/sharer/sharer.php?u=${url}`,
                "_blank"
              )
            }
            />
          </div>
          
        </div>
        
      </Titles>
    </PoolBox>
  );
};

export default Share;
