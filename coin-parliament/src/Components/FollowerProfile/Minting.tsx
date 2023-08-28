/** @format */

import React, { useContext, useState } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";
import styled from "styled-components";
import PieChart from "./PieChart";
import Collapse from "./Collapse";
import { useTranslation } from "../../common/models/Dictionary";
import { InputAndButton, PoppinsMediumWhite12px } from "../../styledMixins";
import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import UserContext from "../../Contexts/User";
import { functions } from "../../firebase";
import { httpsCallable } from "@firebase/functions";
import { stubFalse } from "lodash";
import { texts } from "../LoginComponent/texts";
import  './Style.css';
const Container = styled.div`
  box-shadow: ${(props: { width: number }) =>
    `${props.width > 767}?"0 3px 6px #00000029":"none"`};
  border-radius: 6px;
  opacity: 1;
  padding: ${(props: { width: number }) =>
    `${props.width > 767 ? "12px 28px 89.5px" : "0"}`};
  background: ${(props: { width: number }) =>
    `${props.width > 767 ? "#160133" : "none"}`};
  color: #d4d0f3;
`;

const Title = styled.div`
  color: var(--color-ffffff);
  font: normal normal normal 14px/14px Poppins;
  font-size: 14px;
  line-height: 1;
  letter-spacing: 0;
  text-transform: uppercase;
  opacity: 1;
  text-align: center;
`;
const BtnLabel = styled(Form.Check.Label)`
  ${InputAndButton}
  ${PoppinsMediumWhite12px}
  padding: 7.7px 19px;
  justify-content: center;
  align-items: center;
  min-height: 19px;
  letter-spacing: 0;
  white-space: nowrap;
  text-transform: capitalize;
  color: var(--blue-violet);
  cursor: pointer;
`;
const BtnLabelPrimary = styled.button`
  width: 212px;
  font-size: 15px;
  background-color: var(--white);
  color: var(--blue-violet);
  border: none !important;
  position: relative;
  padding: 7.7px 19px;
  justify-content: center;
  align-items: center;
  min-height: 19px;
  letter-spacing: 0;
  white-space: nowrap;
  text-transform: capitalize;
  color: var(--blue-violet);
  cursor: pointer;
  &:disabled {
    
    background: var(--unnamed-color-ffffff) 0% 0% no-repeat padding-box;
    background: #FFFFFF 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #00000029;
    border-radius: 4px;
    opacity: 0.3;
}
`;
const Dot = styled.div`
  border-radius: 50%;
  position: absolute;
  font-size: 9px;
  top: -5px;
  right: -5px;
  // text-shadow: -1px 0 1px white;
  font-weight: 300;
  color: white;

  width: 16px;
  height: 16px;
  padding: 2px;

  background: red;
  // border: 2px solid #666;
  // color: #666;
  text-align: center;
`;
const I = styled.i`
  border-radius: 50%;
  position: absolute;
  font-size: 11px;
  top: 0px;
  right: -20px;

  font-weight: 300;
  color: #6352e8;

  width: 16px;
  height: 16px;

  text-align: center;
`;
type MintingProps = {
  score: number;
  setRewardTimer?: any;
  rewardTimer?: any;
  claim?: number;
};
const claimReward = httpsCallable(functions, "claimReward");
const Minting = ({
  score,
  setRewardTimer,
  rewardTimer,
  claim,
}: MintingProps) => {
  const { width = 194 } = useWindowSize();
  const translate = useTranslation();
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);  
  const [tooltipShow, setTooltipShow] = React.useState(false);

  return (
    <React.Fragment>
      <Container {...{ width }}>
        <div
          className='d-flex justify-content-center align-items-center flex-column'
          style={{ position: "relative", marginTop: width < 767 ? "13px" : "" }}
        >
          {
            tooltipShow &&
          <div
            style={{
                display: "relative",
          }}
          >
              <div className="newtooltip2"
              style={{
                // right: "0%",
                // width:"80%",
                // marginLeft: "-30%",
                // marginTop: "-4%",
                
                width:`${window.screen.width > 767 ? "150%":"165%"}`,
                marginLeft: `${window.screen.width > 767 ? "-30%":"-80%"}`,
                // left: `${window.screen.width > 767 ? "-10":"-25"}`,
                marginTop:`${window.screen.width > 767 ? "15%":"17%"}`,
                }}
              >
                  {/* <p>Your CMP count</p> */}
                <p className="mt-1 text-end lh-base">                  
                  This dynamic system amplifies your rewards as you actively vote and impact the game. 
                </p>                
                  <p className="mt-3 text-end lh-base">
                  Watch your CMP grow with every influential vote, unlocking Parliament Coins, extra votes, and exclusive cards at key milestones. 
                </p> 
                
                  <p className="mt-3 text-end lh-base">
                  As you climb through user levels, CMP reflects your dedication, making your experience in Coin Parliament uniquely rewarding and engaging.
                  </p>
                  
              </div>
              </div>
            }
          <Title
            className='box_title d-md-block text-white d-none mb-4'
            {...{ width }}
          >
            {/* {translate("CP Minting")} */}
            {/* {translate("CP Minting")} */}
            {texts.CPMinting}
          </Title>
          
          
          <I className='bi bi-info-circle'
           onMouseDown={(e) => {
             setTooltipShow(false)
            }}
            onMouseUp={(e) => {
             setTooltipShow(true)
            }}
            onMouseEnter={() => setTooltipShow(true)}
            onMouseLeave={() => setTooltipShow(false)} 
          ></I>
          
          <PieChart
            percentage={score || 0}
            pax={0} // TODO: ask
            width={width > 767 ? 194 : 154}
          />
        </div>
        {/* {width > 767 && (
          <BtnLabelPrimary
            className='w-100'
            style={{ boxShadow: "0px 3px 6px #00000029", marginTop: "1px" }}
            onClick={async () => {
              if (claim) {
                setLoading(true);
                
                const result = await claimReward({ uid: user?.uid });
                setRewardTimer(result);
                setLoading(false);
                
              }
            }}
            disabled={!claim || loading}
          >
            {!!claim && <Dot>{claim}</Dot>}
            {loading ? "CLAIMING REWARDS..." : "CLAIM YOUR REWARDS"}
          </BtnLabelPrimary>
        )} */}
      </Container>
      {/* {width < 767 && (
        <div
          style={{ marginTop: width > 767 ? 16 : 7.5, marginBottom: "16.31px" }}
        >
          <BtnLabelPrimary
            className='w-100'
            style={{ boxShadow: "0px 3px 6px #00000029" }}
            onClick={async () => {
              if (claim) {
                setLoading(true);
                
                const result = await claimReward({ uid: user?.uid });
                setRewardTimer(result);
                setLoading(false);
                
              }
            }}
            disabled={!claim || loading}
          >
            {!!claim && <Dot>{claim}</Dot>}
            {loading ? "CLAIMING REWARDS..." : "CLAIM YOUR REWARDS"}
          </BtnLabelPrimary>
        </div>
      )} */}
    </React.Fragment>
  );
};

export default Minting;
