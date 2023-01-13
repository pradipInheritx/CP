import React, { useContext } from "react";
import styled from "styled-components";
import { useTranslation } from "../../common/models/Dictionary";
import Copy from "../icons/copy";
import copy from "copy-to-clipboard";
import NotificationContext, { ToastType } from "../../Contexts/Notification";

const PoolBox = styled.div`
  width: 322px;
  height: 76px;
  border-radius: 6px;
  background-color: #6352e8;
  color: white;
  line-height: 76px;
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
    <PoolBox className="mx-auto" style={{width:window.screen.width<979?'322px':'40%'}}>
      <Titles style={{textAlign:window.screen.width<979?'center':'start'}}>
        <div className="d-inline-block mx-3 ml-md-1">
          <h6 className="text-uppercase">{translate(text)}</h6>
        </div>
        <div className="d-inline-block">
          <div className="d-inline-block" style={{margin:window.screen.width<979?'0px 10px':'0px 30px 0px 80px'}}>
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
          <div className="d-inline-block " style={{margin:window.screen.width<979?'0px 10px':'0px 30px'}}>
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
          <div className="d-inline-block " style={{margin:window.screen.width<979?'0px 10px':'0px 30px'}}>
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
          <div className="d-inline-block mx-2">
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
