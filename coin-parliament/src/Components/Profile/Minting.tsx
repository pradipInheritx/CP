/** @format */

import React, { useContext, useState } from "react";
import { useWindowSize } from "../../hooks/useWindowSize";
import styled from "styled-components";
import PieChart from "./PieChart";
import Collapse from "./Collapse";
import { useTranslation } from "../../common/models/Dictionary";
import { InputAndButton, PoppinsMediumWhite12px } from "../../styledMixins";
import { Form } from "react-bootstrap";
import UserContext from "../../Contexts/User";
import { functions } from "../../firebase";
import { httpsCallable } from "@firebase/functions";
import { stubFalse } from "lodash";
import { texts } from "../LoginComponent/texts";
import { handleSoundClick } from "../../common/utils/SoundClick";
import AppContext from "../../Contexts/AppContext";
const Container = styled.div`
  box-shadow: ${(props: { width: number }) =>
    `${props.width > 767}?"0 3px 6px #00000029":"none"`};
  border-radius: 6px;
  opacity: 1;
  padding: ${(props: { width: number }) =>
    `${props.width > 767 ? "12px 28px 25px" : "0"}`};
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
  const {showReward,setShowReward,setRewardExtraVote } = useContext(AppContext);

  return (
    <React.Fragment>
      <Container {...{ width }}>
        <div
          className='d-flex justify-content-center align-items-center flex-column'
          style={{ position: "relative", marginTop: width < 767 ? "13px" : "" }}
        >
          <Title
            className='box_title d-md-block text-white d-none mb-4'
            {...{ width }}
          >
            {/* {translate("CP Minting")} */}
            {texts.CPMinting}
          </Title>
          <I className='bi bi-info-circle'></I>
          <PieChart
            percentage={score || 0}
            pax={0} // TODO: ask
            width={width > 767 ? 194 : 154}
          />
        </div>
        {width > 767 && (
          <BtnLabelPrimary
            className='w-100'
            style={{ boxShadow: "0px 3px 6px #00000029", marginTop: "8px" }}
            onClick={async () => {
              handleSoundClick()
              if (claim) {
                setLoading(true);
                console.log("reward");
                const result = await claimReward({ uid: user?.uid });
                setShowReward(1);     
                // @ts-ignore
                setRewardExtraVote(result?.data?.secondRewardExtraVotes);
                setRewardTimer(result);
                setLoading(false);
                console.log("rewardresult", result);
              }
            }}
            disabled={!claim || loading ||rewardTimer}
          >
            {!!claim && <Dot>{claim}</Dot>}
            {loading ? `${texts.CLAIMINGREWARDS}` : `${texts.CLAIMYOURREWARDS}`}
          </BtnLabelPrimary>
        )}
      </Container>
      {width < 767 && (
        <div
          style={{ marginTop: width > 767 ? 17 : 8.5, marginBottom: "16.31px" }}
        >
          <BtnLabelPrimary
            className='w-100 mt-2'
            style={{ boxShadow: "0px 3px 6px #00000029" }}
            onClick={async () => {
              if (claim) {
                setLoading(true);
                console.log("reward");
                const result = await claimReward({ uid: user?.uid });
                setShowReward(1);     
                // @ts-ignore
                setRewardExtraVote(result?.data?.secondRewardExtraVotes);
                setRewardTimer(result);
                setLoading(false);
                console.log("rewardresult", result);
              }
            }}
            disabled={!claim || loading ||rewardTimer}
          >
            {!!claim && <Dot>{claim}</Dot>}
            {/* {loading ? "CLAIMING REWARDS..." : "CLAIM YOUR REWARDS"} */}
            {loading ? `${texts.CLAIMINGREWARDS}` : `${texts.CLAIMYOURREWARDS}`}
          </BtnLabelPrimary>
        </div>
      )}
    </React.Fragment>
  );
};

export default Minting;
