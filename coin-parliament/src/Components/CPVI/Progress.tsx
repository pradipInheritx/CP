import React from "react";
import { Totals } from "../../Contexts/CoinsContext";
import { ProgressBar } from "react-bootstrap";
import styled from "styled-components";
import { abbrNum } from "../../common/utils/numbers";
import VS from "../icons/VS";

export type ProgressProps = {
  totals: { [key: string]: Totals };
  symbol1: string;
  symbol2: string;
  pct?:number;
};

const Container = styled.div`
max-width:345px;
margin:auto;
  background: transparent
    linear-gradient(180deg, var(--color-6352e8) 0%, #3712b3 100%) 0% 0%
    no-repeat padding-box;
  box-shadow: 0 3px 6px #00000029;
  border-radius: 6px;
  opacity: 1;
  width: 100%;
  padding: 16px 21px;
`;

const CPVI = styled.div`
  font: var(--font-style-normal) normal var(--font-weight-normal)
    var(--font-size-17) / var(--line-spacing-10) var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  color: var(--color-ffffff);
  text-align: left;
  opacity: 1;
  line-height: 24px;
`;

const Votes = styled.div`
  font: var(--font-style-normal) normal var(--font-weight-normal)
    var(--font-size-12) / var(--line-spacing-10) var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  color: var(--color-ffffff);
  text-align: left;
  opacity: 1;
  line-height: 24px;
`;

const Symbol1 = styled.div`
  font: var(--font-style-normal) normal medium var(--font-size-12) /
    var(--line-spacing-10) var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  color: var(--color-ffffff);
  text-align: left;
  opacity: 1;
  position: relative;
  &::before {
    position: absolute;
    height: 27px;
    width: 0;
    border: 1px solid var(--color-ffffff);
    opacity: 1;
    content: "\\00a0";
    top: calc(-100% - 6px);
    left: 50%;
  }
`;

const Symbol2 = styled.div`
  font: var(--font-style-normal) normal medium var(--font-size-12) /
    var(--line-spacing-10) var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  color: var(--color-ffffff);
  text-align: left;
  opacity: 1;
  position: relative;
  &::after {
    position: absolute;
    height: 27px;
    width: 0;
    border: 1px solid var(--color-ffffff);
    opacity: 1;
    content: "\\00a0";
    top: calc(-100% - 6px);
    right: 50%;
  }
`;

const Bar = styled(ProgressBar)`
  border-radius: 0;
  margin-bottom: 9px;
`;

const VSContainer = styled.div`
  margin-top: -47px;
  margin-bottom: -13px;
`;

const Progress = ({ totals, symbol1, symbol2,pct }: ProgressProps) => {
  const { success, total } =
    totals[`${symbol1}-${symbol2}`] ||
    totals[`${symbol2}-${symbol1}`] ||
    ({} as Totals);
  // const pct = (100 * (success || 0)) / (total || 1);
  
  return (
    <Container>
      <div className="justify-content-between align-content-between d-flex mb-3">
        <CPVI>SVI</CPVI>
        <Votes>{abbrNum(total || 0)} votes</Votes>
      </div>
      <div>
        <div className="px-3">
          <Bar>
         
            <ProgressBar
              style={{ background: "var(--ebb)", color:'#6352E8' }}
              now={pct}
              key={1}
              label={`${Math.floor(pct ||0)}%`}
            />
           
            <ProgressBar
              style={{ background: "#6352E8",color:'#6352E8' }}
              now={1}
              key={2}
               label={`${pct}%`}
            />
             <ProgressBar
              style={{ background: "var(--ebb)",color:'#6352E8' }}
              now={100-(pct||0)}
              key={3}
               label={`${Math.ceil(100-(pct||0))}%`}
            />
          </Bar>
          
        </div>
        <VSContainer className="w-100 d-flex justify-content-center" >
        <VS color="var(--color-d4d0f3)" pct={pct}/>
       {(pct || 0)<80 && (pct||0)>20 && <div style={{color:'#6352E8', position:'absolute', marginTop:'21px'}}>VS</div>}
        {/* <div style={{color:'#6352E8', marginTop:'21px'}}>{pct}</div>
        <div style={{color:'#6352E8', marginTop:'21px'}}>{100-(pct||0)}</div> */}
        </VSContainer>
        <div className="w-100 d-flex justify-content-between mb-3">
          <Symbol1>{symbol1}</Symbol1>
          <Symbol2>{symbol2}</Symbol2>
        </div>
      </div>
    </Container>
  );
};

export default Progress;
