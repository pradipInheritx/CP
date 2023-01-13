import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import {getNumTimeframes, TimeFrame} from "../../common/models/Vote";
import Icon from "../Atoms/Checkbox/Icon";
import {Buttons} from "../Atoms/Button/Button";
import {Title} from "../../Pages/SingleCoin";
import { useParams } from "react-router-dom";

export type SelectTimeframesProps = {
  timeframes: TimeFrame[];
  selectTimeframe: (c: TimeFrame) => void;
  selected?: number;
  title?: string;
  voted?:boolean;
};

const SelectTimeframes = ({
  selected,
  timeframes,
  selectTimeframe,
  title,
  voted
}: SelectTimeframesProps) => {
  let params = useParams();
  const [symbol1, symbol2] = (params?.id || "").split("-");
  const num = getNumTimeframes(timeframes);

  return (
    <Container style={{maxWidth: 386, margin: "0 auto"}}>
      <Row>
        {num === 1 && (
          <input
            type="hidden"
            name="timeframe"
            id="timeframe"
            value={timeframes.filter((t) => t.chosen)[0].index}
          />
        )}
        {num > 1 && title && (
          <div className="mb-3">
            <Title>{title}</Title>
          </div>
        )}
      </Row>
      <Row className={symbol2?'row gx-5':"row gx-5"} id='test' style={{minWidth:'310px'}}>
        {num > 1 &&
          timeframes.map((timeframe, k) => {
            return (
              <Col key={k} className="p-0">
                <Icon
                
                  inline="d-flex justify-content-center"
                  checked={timeframe.index === selected}
                  setChecked={() => {
                    selectTimeframe(timeframe);
                  }}
                  name="timeframe"
                  type="radio"
                  id={"timeframe-" + timeframe.index}
                  value={timeframe.name}
                  iconOn={
                    <Buttons.TimeframeButton disabled={voted?voted:false} {...{ checked: voted?false:true }}>
                      {timeframe.name}
                    </Buttons.TimeframeButton>
                  }
                  iconOff={
                    <Buttons.TimeframeButton {...{ checked: false }}>
                      {timeframe.name}
                    </Buttons.TimeframeButton>
                  }
                />
              </Col>
            );
          })}
      </Row>
    </Container>
  );
};

export default SelectTimeframes;
