import { Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import React, { useContext, useEffect } from "react";
import AppContext from "../Contexts/AppContext";
import SelectTimeframes from "./Coins/SelectTimeframes";
import { default as CPVote } from "./Coins/Vote";
import { Title } from "../Pages/SingleCoin";
import { Link, useParams } from "react-router-dom";
import UserContext from "../Contexts/User";
import RangeSilder from "./Users/RangeSilder";
import Countdown from "react-countdown";
import { VoteResultProps } from "../common/models/Vote";

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
  selectedTimeFrameArray?: any;
  selectedTimeFrame?: number;
  setSelectedTimeFrame: (n: number) => void;
  selectedOption?: number;
  setSelectedOption: (n: number) => void;
  submit: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  width?: number | string;
  cssDegree?: any;
  votePrice?: any;
  votedDetails?: any;
  hideButton?: any;
  setHideButton?: React.Dispatch<React.SetStateAction<number[]>>;
  setpopUpOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  vote: VoteResultProps
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
  selectedTimeFrameArray,
  selectedTimeFrame,
  setSelectedTimeFrame,
  selectedOption,
  setSelectedOption,
  children,
  disabled,
  width,
  submit,
  cssDegree,
  votePrice,
  votedDetails,
  hideButton,
  setHideButton,
  setpopUpOpen,
  vote
}: VoteFormProps<T>) {
  const { timeframes, login, remainingTimer } = useContext(AppContext);
  const { user } = useContext(UserContext);
  let params = useParams();
  const [symbol1, symbol2] = (params?.id || "").split("-");

  // console.log(!hideButton.includes(selectedTimeFrame),"selectedTimeFrame Now")

// console.log(texts?.tooltip, "all Text")
  console.log(user,"selectedTimeFrame")
  return (
    <Form
      className='mt-3'
      id={id}
      noValidate={true}
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      style={{ maxWidth: '450px', margin: '0 auto' }}
    >
      <div className="mt-4" style={{ marginLeft: symbol2 ? '' : '24px', marginRight: symbol2 ? '' : '24px' }}>
        <SelectTimeframes
          {...{
            selected: selectedTimeFrame,
            timeframes,
            selectTimeframe: (timeframe) => {
              setSelectedTimeFrame(timeframe.index);
            },
            title: texts.selectTimeFrame,
            selectedTimeFrameArray: selectedTimeFrameArray,
            cssDegree,
            votePrice,
            votedDetails,
            hideButton,
            setHideButton,
            setpopUpOpen,
            vote
          }}
        />

      </div>
      <div className='mt-4 pt-2'>
        {/* @ts-ignore */}
        <div className='mb-3'>
          {/* <Title>{texts.yourVote}</Title> */}
        </div>
        <OverlayTrigger
          overlay={(props) => 
            disabled ? (
              <Tooltip id='button-tooltip' {...props} >
                {/* @ts-ignore */}
                {user ? <div className="" style={{ marginLeft: '20px', marginTop: "0px", }}><Countdown daysInHours zeroPadTime={2} date={remainingTimer}
                  renderer={({ hours, minutes, seconds, completed }) => {
                    return (
                      <span className="text-uppercase" style={{ color: '#fff', fontSize: '11px', fontWeight: 400 }}>
                        Wait {" "}
                        {hours < 1 ? null : `${hours} :`}
                        {minutes < 10 ? `0${minutes}` : minutes}:
                        {seconds < 10 ? `0${seconds}` : seconds} for 5 votes
                        <br />
                        or
                        {/* buy extra votes now. */}
                        <Link to="/votingbooster" style={{ color: "#fff" }}> buy extra votes now.</Link>
                      </span>
                    );

                  }}
                /></div> : `${texts.tooltip}`}

                {/* <RangeSilder/> */}
                {/* {texts.tooltip} */}
              </Tooltip>
            ) : selectedTimeFrame == undefined ? (
              <Tooltip id='button-tooltip' {...props}>
                {texts.tooltip}
              </Tooltip>
            ) : (
              <></>
            )
          }
        >
          <div className="">
            <CPVote
              {...{
                selectedOption,
                setSelectedOption,
              }}          
              width={width || 266}
              // disabled={!canVote || disabled}
              disabled={
                // !!!user && selectedTimeFrame !== undefined
                //   ? false
                //   : !canVote || disabled
                //     ? true
                //     : false
                !!!user
              }
              disabledText={texts.tooltip}
              options={[
                {
                  icon:
                    typeof option1.image === "string" ? (
                      <img src={option1.image} alt={option1.alt} />
                    ) : (
                      <>
                        {/* <p>vote {option1.image} BEAR</p> */}
                        {/* @ts-ignore */}
                        {option1?.buttonText ? <p>{option1?.buttonText[0]} {option1.image} {option1?.buttonText[1]}</p> : <> Vote<p>{option1.image}</p> </>}
                      </>
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
                      <>
                        {" "}
                        {/* <p>vote {option2.image} BEAR</p> */}
                        {/* @ts-ignore */}
                        {option2?.buttonText ? <p>{option2?.buttonText[0]} {option2.image} {option2?.buttonText[1]}</p> : <> Vote<p>{option2.image}</p> </>}
                      </>
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


// firstRewardCard
// : 
// "FIRE"
// firstRewardCardCollection
// : 
// "Monsoon"
// firstRewardCardId
// : 
// "n13hZSCun5U0KmOoZpYy"
// firstRewardCardSerialNo
// : 
// ""
// firstRewardCardType
// : 
// "EPIC"
// secondRewardExtraVotes
// : 
// 17
// thirdRewardDiamonds
// : 
// 5