import React, {useContext, useState} from "react";
import {Buttons, Props} from "../Atoms/Button/Button";
import styled, {css} from "styled-components";
import {colors} from "../VoteForm";
import {Col, Row} from "react-bootstrap";
import NotificationContext, {ToastType} from "../../Contexts/Notification";
import NotLoggedInPopup from "../App/NotLoggedInPopup";
import UserContext from "../../Contexts/User";
import AppContext from "../../Contexts/AppContext";
import { useParams } from "react-router-dom";

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
  box-shadow: 0 3px 6px #00000029;

  & svg g path {
    stroke: ${(props: { borderColor: string; selected: boolean }) =>
      props.selected ? colors[1] : colors[0]};
  }
`;

const Option0 = styled(Buttons.RadiusTopRight)`
  ${size};
  ${Option};
  flex-direction: column;
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
  }`;

const Option1 = styled(Buttons.RadiusBottomLeft)`
  ${size};
  ${Option};
  flex-direction: column;
  &:disabled {
    pointer-events: none;  
    cursor:pointer;
}
  &:not([disabled]) {
    animation: bull_shake_right 2s ease 2s 3 alternate forwards;
  }
  &:hover {
    background:#6352E8;
    color:white;
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
  const {user} = useContext(UserContext);
  let params = useParams();
  const [symbol1, symbol2] = (params?.id || "").split("-");
  const {showModal, showToast} = useContext(NotificationContext);
  const [clickedOption1, setClickedOption1] = useState(false);
  const [clickedOption0, setClickedOption0] = useState(false);
  
  const {setLoginRedirectMessage,loginRedirectMessage,setLogin} = useContext(AppContext);
  
  return (
    <div
      className="container"
      // style={{width: typeof width === "number" ? `${width}px` : `${width}px`}}
      style={{width:window.screen.width<979?'306px':'400px'}}      
    >
      <Row >
        <Col onClick={()=>{ if(!user?.uid){setLoginRedirectMessage('Cast a vote.'); setLogin(true)}}}>
          <div className="d-flex justify-content-center align-items-center 1" >
            <Option0
        
              {...{
                ...option0.buttonProps,
                onClick: () => {
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
                },
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
        <Col onClick={()=>{ if(!user?.uid){setLoginRedirectMessage('Cast a vote.'); setLogin(true)}}}>
          <div className="d-flex justify-content-center align-items-center">
            <Option1
              {...{
                ...option1.buttonProps,
                onClick: () => {
                  if (disabled && disabledText) {
                    if (!user) {
                      showModal(<NotLoggedInPopup/>);
                    } else {
                      showToast(disabledText, ToastType.ERROR);
                    }
                    return;
                  }
                  setSelectedOption(1);
                  setClickedOption1(true);
                  setTimeout(() => setClickedOption1(false), 1000);
                },
                className: ["p-3 confetti-button", clickedOption1 ? "animate" : ""].join(" "),
                borderColor,
                selected: selectedOption === 1,
                disabled,
              }}
              style={{borderBottomLeftRadius:symbol2?'38px':'',borderTopLeftRadius:symbol2?'0':''}}
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
