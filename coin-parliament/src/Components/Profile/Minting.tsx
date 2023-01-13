import React from "react";
import {useWindowSize} from "../../hooks/useWindowSize";
import styled from "styled-components";
import PieChart from "./PieChart";
import Collapse from "./Collapse";
import {useTranslation} from "../../common/models/Dictionary";
import { InputAndButton, PoppinsMediumWhite12px } from "../../styledMixins";
import {
  Form
} from "react-bootstrap";
const Container = styled.div`
  box-shadow: ${(props: { width: number }) => `${props.width > 767}?"0 3px 6px #00000029":"none"`};
  border-radius: 6px;
  opacity: 1;
  padding: ${(props: { width: number }) => `${props.width > 767 ? "12px 28px 25px" : "0"}`};
  background: ${(props: { width: number }) => `${props.width > 767 ? "#160133" : "none"}`};
  color: #D4D0F3;
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
const BtnLabelPrimary = styled(BtnLabel)`
width:212px;
font-size:15px;
  background-color: var(--white);
  color: var(--blue-violet);
  border: none !important;
  position:relative;
`;
const Dot = styled.div`
  border-radius: 50%;
  position: absolute;
  font-size: 9px;
  top: -5px;
  right: -5px;
  // text-shadow: -1px 0 1px white;
  font-weight:300;
  color: white;
 
    width: 16px;
    height: 16px;
    padding: 2px;

    background: red;
    // border: 2px solid #666;
    // color: #666;
    text-align: center;

    
`;
type MintingProps = {
  score: number,
  setRewardTimer?:any,
  rewardTimer?:number
}

const Minting = ({score,setRewardTimer,rewardTimer}: MintingProps) => {
  const {width = 194} = useWindowSize();
  const translate = useTranslation();

  return (
    <React.Fragment>
      <Container {...{width}}>
        <div className="d-flex justify-content-center align-items-center flex-column">
          <Title className="box_title d-md-block text-white d-none mb-4" {...{width}}>{translate("CP Minting")}</Title>
          <PieChart
            percentage={score || 0}
            pax={0} // TODO: ask
            width={width > 767 ? 194 : 154}
          />
        </div>
       {width>767 && <BtnLabelPrimary
                                htmlFor="mfa-enable"
                                className="w-100"
                                style={{ boxShadow: "0px 3px 6px #00000029" }}
                              >
                                CLAIM YOUR REWARDS
                              </BtnLabelPrimary>}
      </Container>
    {width<767&&  <div style={{marginTop: width > 767 ? 16 : 7.5, marginBottom:'16.31px'}}>
      <BtnLabelPrimary
                                htmlFor="mfa-enable"
                                className="w-100"
                                style={{ boxShadow: "0px 3px 6px #00000029" }}
                                onClick={()=>{setRewardTimer(10)
                                setTimeout(() => {
                                  setRewardTimer(0)
                                }, 10000)
                                }}
                              >
                                <Dot>10</Dot>
                                CLAIM YOUR REWARDS
                              </BtnLabelPrimary>
      </div>}
    </React.Fragment>
  );
};

export default Minting;
