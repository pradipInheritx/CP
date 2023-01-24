import {Form, OverlayTrigger, Tooltip} from "react-bootstrap";
import React, {useContext} from "react";
import AppContext from "../Contexts/AppContext";
import SelectTimeframes from "./Coins/SelectTimeframes";
import {default as CPVote} from "./Coins/Vote";
import {Title} from "../Pages/SingleCoin";
import { useParams } from "react-router-dom";

export const colors = ["#6352e8", "white"];

type VoteFormProps<T> = {
  option1: T;
  option2: T;
  id: string;
  texts: {
    yourVote: string;
    selectTimeFrame: string;
    tooltip: string;
  };
  canVote: boolean;
  selectedTimeFrame?: number;
  setSelectedTimeFrame: (n: number) => void;
  selectedOption?: number;
  setSelectedOption: (n: number) => void;
  submit: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  width?: number | string;
};
const VoteForm = function <
  T extends {
    image: string | React.ReactNode;
    alt: string;
    title?: JSX.Element;
  }
>({
  option1,
  option2,
  id,
  texts,
  canVote,
  selectedTimeFrame,
  setSelectedTimeFrame,
  selectedOption,
  setSelectedOption,
  children,
  disabled,
  width,
  submit,
}: VoteFormProps<T>) {
  const { timeframes } = useContext(AppContext);
  let params = useParams();
  const [symbol1, symbol2] = (params?.id || "").split("-");
  return (
    <Form
      className="mt-3"
      id={id}
      noValidate={true}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div className="mt-4" style={{minWidth:'342px',marginLeft:symbol2?'-22px':''}}>
        <SelectTimeframes
          {...{
            selected: selectedTimeFrame,
            timeframes,
            selectTimeframe: (timeframe) => {
              setSelectedTimeFrame(timeframe.index);
            },
            title: texts.selectTimeFrame,
          }}
        />
      </div>
      <div className="mt-4 pt-2">
        <div className="mb-3">
          <Title>{texts.yourVote}</Title>
        </div>
        <OverlayTrigger
          overlay={(props) =>
            disabled ? (
              <Tooltip id="button-tooltip" {...props}>
                {texts.tooltip}
              </Tooltip>
            ) : (
              <></>
            )
          }
        >
          <div >
            <CPVote
              {...{
                selectedOption,
                setSelectedOption,
              }}
              width={width || 266}
              disabled={!canVote || disabled}
              disabledText={texts.tooltip}
              options={[
                {
                  icon:
                    typeof option1.image === "string" ? (
                      <img src={option1.image} alt={option1.alt} />
                    ) : (
                     <> <p>{option1.image}</p> <p>VOTE</p></>
                    ),
                  buttonProps: {
                    children: undefined,
                  },
                },
                {
                  icon:
                    typeof option2.image === "string" ? (
                      <img src={option2.image} alt={option2.alt} />
                    ) : (
                      <> <p>{option2.image}</p> <p>VOTE</p></>
                    ),
                  buttonProps: {
                    children: undefined,
                  },
                },
              ]}
            >
              {children}
            </CPVote>
          </div>
        </OverlayTrigger>
      </div>
    </Form>
  );
};

export default VoteForm;
