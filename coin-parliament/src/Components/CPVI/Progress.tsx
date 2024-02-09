import React, { useState } from "react";
import { Totals } from "../../Contexts/CoinsContext";
import { ProgressBar } from "react-bootstrap";
import styled from "styled-components";
import { abbrNum } from "../../common/utils/numbers";
import VS from "../icons/VS";

export type ProgressProps = {
  totals: { [key: string]: Totals };
  progressData?: {
    success: number
    total: number
  }
  symbol1: string;
  symbol2?: string;
  pct?: any;
  compare?: boolean;
  isSingleCoinVote?: boolean;
};

const Container = styled.div`
max-width: ${window.screen.width < 767 ? "345px" : "400px"};
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

const Progress = ({ totals, progressData, symbol1, symbol2, pct, compare = true, isSingleCoinVote = false }: ProgressProps) => {

  const { success, total } = progressData || totals[`${symbol1}-${symbol2}`] ||
    totals[`${symbol2}-${symbol1}`] ||
    totals[`${symbol1}`] ||
    ({} as Totals);
  // const pct = (100 * (success || 0)) / (total || 1);
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <Container>
      {
        showTooltip &&
        <div
          style={{
            display: "relative",
          }}
        >
          <div className="newtooltip2"
            style={{
              maxWidth: `${window.screen.width > 767 ? "26%" : "90%"}`,
              marginTop: `${window.screen.width > 767 ? "1.5em" : "1.5em"}`,
              textAlign: 'justify',
              marginRight: '4em'
            }}
          >
            {isSingleCoinVote ?
                <p style={{
                lineHeight:"2"
              }}>
                  The SVI aggregates voting profiles using a weighted algorithm that considers factors like volume, time frame, and success rate. It represents this data as a line graph ranging from 0 to 100. An SVI reading above 50 suggests that more users are optimistic about the coin's potential to increase in value (BULL). Conversely, a reading below 50 indicates a more pessimistic sentiment <span>{"(BEAR)"}</span>.
              </p> :
                <p style={{
                  lineHeight: "2"
                }}>
                Similarly, the SVI for pairs uses the same algorithm to aggregate voting profiles. The line graph ranges from 0 to 100. Here, an SVI reading above 50 implies that more users believe one coin in the pair will outperform the other. It doesn't specify whether it's bullish or bearish but focuses on relative performance.
              </p>}
          </div>
        </div>
      }
      <div className="justify-content-between align-content-between d-flex mb-3">
        <CPVI style={{ cursor: 'pointer' }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip((prev) => !prev)}
        >
          SVI (i)
        </CPVI>
        <Votes></Votes>
      </div>
      <div>
        <div className="px-3">
          <Bar>
           {Math.floor(pct || 0) > 0 && <ProgressBar
              style={{ background: "var(--ebb)", color: '#6352E8' }}
              now={pct}
              key={1}
              label={`${Math.floor(pct || 0)}%`}
            />}

            {Math.floor(pct || 0) > 0 && Math.ceil(100 - (pct || 0)) > 0 && <ProgressBar
              style={{ background: "#6352E8", color: '#6352E8' }}
              now={1}
              key={2}
              label={`${pct}%`}
            />}

            {symbol2 && Math.ceil(100 - (pct || 0)) > 0  && <ProgressBar
              style={{ background: "var(--ebb)", color: '#6352E8' }}
              now={100 - (pct || 0)}
              key={3}
              label={`${Math.ceil(100 - (pct || 0))}%`}
            />}
          </Bar>

        </div>
        {/* <VSContainer className="w-100 d-flex justify-content-center" > */}
        {/* {<VS color="var(--color-d4d0f3)" pct={pct} compare={compare} />} */}
        {/* {((pct || 0) < 80 && (pct || 0) > 20 && symbol2) && <div style={{ color: '#6352E8', position: 'absolute', marginTop: '21px' }}>VS</div>} */}
        {/* <div style={{color:'#6352E8', marginTop:'21px'}}>{pct}</div>
        <div style={{color:'#6352E8', marginTop:'21px'}}>{100-(pct||0)}</div> */}
        {/* </VSContainer> */}
        <div className="w-100 d-flex justify-content-between mb-3">
          <Symbol1>{symbol1}</Symbol1>
          {symbol2 && <Symbol2>{symbol2}</Symbol2>}
        </div>
      </div>

    </Container>
  );
};

export default Progress;