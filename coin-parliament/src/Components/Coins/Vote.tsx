import React, { useContext, useEffect, useState } from "react";
import { Buttons, Props } from "../Atoms/Button/Button";
import styled, { css } from "styled-components";
import { colors } from "../VoteForm";
import { Col, Row } from "react-bootstrap";
import NotificationContext, { ToastType } from "../../Contexts/Notification";
import NotLoggedInPopup from "../App/NotLoggedInPopup";
import UserContext from "../../Contexts/User";
import AppContext from "../../Contexts/AppContext";
import { useParams } from "react-router-dom";
import { handleSoundClick, VoteButton } from "../../common/utils/SoundClick";

export type VoteOption = {
  icon: React.ReactNode;
  buttonProps: Props;
};

export type VoteProps = {
  width?: number | string;
  options: VoteOption[];
  borderColor?: string;
  selectedOption?: number;
  setSelectedOption: (n: number) => void;
  disabled?: boolean;
  children?: React.ReactNode;
  disabledText?: string;
};

const size = css`
  min-width: 124px;
  height: 76px;
`;

const Option = css`
  border: ${(props: { borderColor: string; selected: boolean }) =>
    `1px solid ${props.borderColor}`};
  background: ${(props: { borderColor: string; selected: boolean }) =>
    props.selected ? colors[0] : colors[1]};
  flex-grow: 1;
  flex-basis: 0;
  min-width: 0;
  // box-shadow: 0 3px 6px #00000029;
  box-shadow: rgb(67 47 229) 0px 4px 1px, rgba(0,0,0,0.22) 0px 6px 12px;
  transition: all .2s ease;

  & svg g path {
    stroke: ${(props: { borderColor: string; selected: boolean }) =>
    props.selected ? colors[1] : colors[0]};
  }
`;

const Option0 = styled(Buttons.RadiusTopRight)`
  ${size};
  ${Option};
  flex-direction: column;
  &:active{
    position: relative;
top: 2px;
  box-shadow: rgb(67 47 229) 0px 3px 1px, rgba(0,0,0,0.22) 0px 6px 12px;
  }
  &:disabled {
    pointer-events: none;  
    cursor:pointer;
  }
  &:not([disabled]) {
    animation: bull_shake_left 2s ease 2s 3 alternate forwards;
  }
  &:hover {
  background:#6352E8;
  color:white;
 box-shadow: rgb(67 47 229) 0px 4px 1px, rgb(170 164 220) 0px 8px 6px;
  }`;

const Option1 = styled(Buttons.RadiusBottomLeft)`
  ${size};
  ${Option};
  flex-direction: column;
  &:disabled {
    pointer-events: none;  
    cursor:pointer;
}
 &:active{
    position: relative;
    top: 2px;
      box-shadow: rgb(67 47 229) 0px 3px 1px, rgba(0,0,0,0.22) 0px 6px 12px;
  }
  &:not([disabled]) {
    animation: bull_shake_right 2s ease 2s 3 alternate forwards;
  }
  &:hover {
    background:#6352E8;
    color:white;
       box-shadow: rgb(67 47 229) 0px 4px 1px, rgb(170 164 220) 0px 8px 6px;
    }
    &:hover .svg-path {
      stroke: white !important;
    }
`;

const Vote = ({
  width = "100%",
  options,
  borderColor = "var(--blue-violet)",
  selectedOption,
  setSelectedOption,
  disabled,
  disabledText,
  children,
}: VoteProps) => {
  const [option0, option1] = options;
  const { user, votesLast24Hours, userInfo } = useContext(UserContext);

  // const { voteRules, followerUserId, login, showReward, setShowReward, headerExtraVote, setHeaderExtraVote, inOutReward, setInOutReward } = useContext(AppContext);
  let params = useParams();
  const [symbol1, symbol2] = (params?.id || "").split("-");
  const { showModal, showToast } = useContext(NotificationContext);
  const [clickedOption1, setClickedOption1] = useState(false);
  const [clickedOption0, setClickedOption0] = useState(false);
  const [voteNumber, setVoteNumber] = useState(0)
  var urlName = window.location.pathname.split('/');
  const followerPage = urlName.includes("followerProfile")
  const pageTrue = urlName.includes("pairs") || urlName.includes("coins")
  const { setLoginRedirectMessage, remainingTimer, loginRedirectMessage, setLogin, afterVotePopup, setAfterVotePopup, voteRules, login } = useContext(AppContext);

  useEffect(() => {
    const voted = Number(votesLast24Hours.length) < Number(voteRules?.maxVotes) ? Number(votesLast24Hours.length) : Number(voteRules?.maxVotes)
    // @ts-ignore
    setVoteNumber(Number(voteRules?.maxVotes || 0) + Number(userInfo?.rewardStatistics?.extraVote || 0) - Number(voted) || 0)
    // console.log('votenumber',voteNumber, Number(voted))
  }, [voteRules?.maxVotes, userInfo?.rewardStatistics?.extraVote, votesLast24Hours.length]);

  const openPopup = () => {
    if (voteNumber == 0 && remainingTimer && pageTrue && urlName.length > 2 && user?.uid && !login) {
      setAfterVotePopup(true)
    }

  }

  return (
    <div
    // className="container"
    // style={{width: typeof width === "number" ? `${width}px` : `${width}px`}}
    // style={{width:window.screen.width<979?'306px':'400px'}}      

    >
      <Row className="">
        <Col onClick={() => { if (!user?.uid) { setLoginRedirectMessage('cast your vote'); setLogin(true) } }} style={{ width: "50%" }}>
          <div className="d-flex justify-content-around align-items-center 1"

            // style={{width:`${window.screen.width<676?"50%":"100%"}`}}
            // style={{ width: "50%" }}
            style={{ width: "100%" }}
          >
            <Option0

              {...{
                ...option0.buttonProps,
                onClick: () => {
                  openPopup()
                  if (voteNumber > 0) {
                    VoteButton()
                    if (disabled && disabledText) {
                      if (!user) {


                        setLoginRedirectMessage('test');
                        setLogin(true);
                      } else {
                        showToast(disabledText, ToastType.ERROR);
                      }
                      return;
                    }
                    setSelectedOption(0);
                    setClickedOption0(true);
                    setTimeout(() => setClickedOption0(false), 1000);
                  }
                },
                // onKeyUp: () => {
                //   VoteButton()
                // },
                className: ["p-3 confetti-button svg-button", clickedOption0 ? "animate" : ""].join(" "),
                borderColor,
                selected: selectedOption === 0,
                disabled,
              }}
            >
              {option0.icon}
            </Option0>
          </div>
        </Col>
        {children}
        <Col onClick={() => { if (!user?.uid) { setLoginRedirectMessage('cast your vote'); setLogin(true) } }} style={{ width: "50%" }}>
          <div className="d-flex justify-content-center align-items-center"
            style={{ width: "100%" }}
          >
            <Option1
              {...{
                ...option1.buttonProps,
                onClick: () => {
                  openPopup()
                  if (voteNumber > 0) {
                    VoteButton()
                    if (disabled && disabledText) {
                      if (!user) {
                        showModal(<NotLoggedInPopup />);
                      } else {
                        showToast(disabledText, ToastType.ERROR);
                      }
                      return;
                    }
                    setSelectedOption(1);
                    setClickedOption1(true);
                    setTimeout(() => setClickedOption1(false), 1000);
                  }
                },
                // onKeyUp: () => {
                //   VoteButton()
                // },
                className: ["p-3 confetti-button", clickedOption1 ? "animate" : ""].join(" "),
                borderColor,
                selected: selectedOption === 1,
                disabled,
              }}
              style={{ borderBottomLeftRadius: symbol2 ? '38px' : '', borderTopLeftRadius: symbol2 ? '0' : '' }}
            >
              {option1.icon}
            </Option1>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Vote;
