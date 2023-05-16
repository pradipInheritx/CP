import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { getNumTimeframes, TimeFrame } from "../../common/models/Vote";
import Icon from "../Atoms/Checkbox/Icon";
import { Buttons } from "../Atoms/Button/Button";
import { Title } from "../../Pages/SingleCoin";
import { useParams } from "react-router-dom";
import AppContext from "../../Contexts/AppContext";
import { handleSoundClick } from "../../common/utils/SoundClick";


export type SelectTimeframesProps = {
  timeframes: TimeFrame[];
  selectTimeframe: (c: TimeFrame) => void;
  selected?: number;
  title?: string;
  votedTitle?: string;
  voted?: boolean;
  selectedTimeFrameArray?: any;
  cssDegree?: any;
  votePrice?: any;
  votedDetails?: any;
};

const SelectTimeframes = ({
  selected,
  timeframes,
  selectTimeframe,
  title,
  votedTitle,
  voted,
  selectedTimeFrameArray,
  cssDegree,
  votePrice,
  votedDetails,
}: SelectTimeframesProps) => {
  let params = useParams();
  const [symbol1, symbol2] = (params?.id || "").split("-");
  const num = getNumTimeframes(timeframes);
  const [buttonDetails, setButtonDetails] = useState<any>();
  const [pariButtonDetails, setPariButtonDetails] = useState<any>();
  const { allButtonTime, allPariButtonTime } = useContext(AppContext);

  useEffect(() => {
    setButtonDetails(allButtonTime)
  }, [allButtonTime])

  useEffect(() => {
    setPariButtonDetails(allPariButtonTime);
  }, [allPariButtonTime]);



  // console.log(voted,"checkvoted")
  return (
    // <Container className='timeframAnimation'style={{maxWidth: 386, margin: "0 auto"}}>
    <div>
      <Row>
        {num === 1 && (
          <input
            type='hidden'
            name='timeframe'
            id='timeframe'
            value={timeframes.filter((t) => t.chosen)[0].index}
          />
        )}
        {num > 1 && title && (
          <div className='mb-3'>
            <Title>{voted ? votedTitle : title}</Title>
          </div>
        )}
      </Row>
      <Row
        className={
          voted
            ? "row gx-5"
            : selected === undefined
              ? "row gx-5 glow"
              : "row gx-5"
        }
        id='test'
        style={{ minWidth: "310px" }}
      >
        {num > 1 &&
          timeframes.map((timeframe, k) => {
            return (
              <Col key={k} className='p-0'>
                <Icon
                  inline='d-flex justify-content-center'
                  checked={timeframe.index === selected}

                  setChecked={() => {
                    selectTimeframe(timeframe);
                    handleSoundClick()
                  }}
                  name='timeframe'
                  type='radio'
                  id={"timeframe-" + timeframe.index}
                  value={timeframe.name}
                  iconOn={
                    <Buttons.TimeframeButton
                      disabled={voted ? voted : false}
                      {...{ checked: voted ? false : true }}
                      cssDegree={cssDegree?.length > 0 ? cssDegree[k] : 0}
                      // votePrice={votePrice?.length > 0 ? votePrice[k] : 0}
                      votedDetails={votedDetails?.length > 0 ? votedDetails[k] : 0}
                      buttonDetails={buttonDetails && buttonDetails[k]}
                      PariButtonDetails={pariButtonDetails && pariButtonDetails[k]}
                    >
                      {timeframe.name}
                    </Buttons.TimeframeButton>
                  }
                  iconOff={
                    <Buttons.TimeframeButton
                      {...{
                        checked: selectedTimeFrameArray?.includes(
                          timeframe.index
                        ),
                        cssDegree: cssDegree?.length > 0 ? cssDegree[k] : 0,
                        // votePrice: votePrice?.length > 0 ? votePrice[k] : 0,
                        votedDetails: votedDetails?.length > 0 ? votedDetails[k] : 0,
                        buttonDetails: buttonDetails && buttonDetails[k],
                        PariButtonDetails: pariButtonDetails && pariButtonDetails[k]
                      }}
                      showTimer={true}
                    >
                      {timeframe.name}
                    </Buttons.TimeframeButton>
                  }
                />
              </Col>
            );
          })}
      </Row>

      {/* </Container> */}
    </div>
  );
};

export default SelectTimeframes;
