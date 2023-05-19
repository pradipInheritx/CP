import React, { ReactNode, useContext, useEffect, useLayoutEffect, useState } from "react";
import { ButtonProps } from "react-bootstrap";
import { useParams } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import CoinContext from "../../../Contexts/CoinsContext";
import { formatCurrency, precision } from "../../../common/models/Coin";
import { InputAndButton, PoppinsMediumWhite12px } from "../../../styledMixins";
import AppContext from "../../../Contexts/AppContext";
import { VoteResultProps } from "../../../common/models/Vote";

export type Props = Partial<ButtonProps> & {
  children: ReactNode | undefined;
  fullWidth?: boolean;
};

const CPButton = styled.button`
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
  min-width: ${(props: Props) => (props.fullWidth ? "100%" : "0")};

  &:active {
    box-shadow: 0 3px 6px var(--dark-gray);
  }

  &:hover {
    background-color: var(--light-purple);
  }

  &:disabled {
    box-shadow: none;
    opacity: 0.7;
  }
`;

const ClickableText = styled(CPButton)`
  background-color: transparent;
  padding: 0;
  min-height: initial;
  height: initial;
  border: 0;
  border-radius: 0;
  outline: none;
  color: initial;

  &:focus {
    outline: none;
  }

  &:active {
    box-shadow: none;
  }

  &:hover {
    background-color: transparent;
    color: initial;
  }

  &:disabled {
    box-shadow: none;
  }
`;

const BlueVioletButton = styled(CPButton)`
  background-color: var(--blue-violet);
  color: var(--white);
  box-shadow: 0px 3px 6px #00000029;
  font-weight:400;
  border:none !important;
`;

const SuccessButton = styled(CPButton)`
  background-color: var(--success);
  color: var(--white);
`;

const ErrorButton = styled(CPButton)`
  background-color: var(--danger);
  color: var(--white);
`;

const Radius = styled(CPButton)`
  border-radius: 38px;
`;

const RadiusFull = styled(Radius)`
  border-radius: 100%;
`;

const Timeframe = styled(RadiusFull)`
  // animation: bull_shake_left 2s ease 2s 3 alternate forwards;
  width: 71px;
  height: 70px;
  background: ${(props: { checked: boolean, borderDeg: any, borderColor: string }) =>
    props.checked
      ? "var(--color-6352e8) 0% 0% no-repeat padding-box;"
      : `radial-gradient(white 67%, transparent 55%),conic-gradient(${props.borderColor} 0deg ,${props.borderColor} ${props.borderDeg}deg, white ${props.borderDeg}deg ,white 360deg)`};
        
  box-shadow: 0 3px 6px #00000029;
  border-radius: 45px;
  opacity: 1;

  &[disabled] {
    opacity: 0.48 !important;
  }
`;

const TimeframeName = styled.span`

  font-size: var(--font-size-14);
  font-style: normal;
  font-weight: normal;
  line-height: var(--line-spacing-14);
  font-family: var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  color: ${(props: { checked: boolean }) => props.checked ? "var(--white)" : "var(--color-6352e8)"};
  // color:"var(--color-6352e8)";
  text-align: center;
`;

const RadiusTopRight = styled(Radius)`
  border-top-right-radius: 0;
`;

const RadiusBottomRight = styled(Radius)`
  border-bottom-right-radius: 0;
`;

const RadiusTopLeft = styled(Radius)`
  border-top-left-radius: 0;
`;

const RadiusBottomLeft = styled(Radius)`
  border-bottom-left-radius: 0;
`;

const Button = ({ children, ...props }: Props) => {
  return <CPButton {...props}>{children}</CPButton>;
};

export default Button;

const TimeframeButton = ({
  children,
  checked,
  setChecked,
  disabled,
  showTimer,
  cssDegree,
  // votePrice,
  votedDetails,
  buttonDetails,
  PariButtonDetails,
  buttonIndex,
  setHideButton,
  setpopUpOpen,
  vote,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  checked: boolean;
  setChecked?: (c: boolean) => void;
  showTimer?: boolean;
  cssDegree?: any;
  // votePrice?: any;
  votedDetails?: any;
  buttonDetails?: any;
  PariButtonDetails?: any;
  buttonIndex?: number;
  setHideButton?: React.Dispatch<React.SetStateAction<number[]>>;
  setpopUpOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  vote: VoteResultProps
}) => {
  const [borderColor, setborderColor] = useState<string>("white");
  const [borderDeg, setBorderDeg] = useState<number>(0);

  const [livePrice, setLivePrice] = useState<number>(0);
  var params = useParams();
  const { coins, totals } = useContext(CoinContext);
  const [symbol1, symbol2] = (params?.id || "").split("-");


  // @ts-ignore
  const [votePrice, setvotePrice] = useState<any>(coins[params?.id]?.price);
  useEffect(() => {
    if (buttonDetails != undefined) {
      // getDeg(buttonDetails);
      getBorderColor();
    }
    // @ts-ignore
    setLivePrice(coins[params?.id]?.price);

    if (buttonDetails != undefined && buttonDetails?.valueVotingTime) {
      setvotePrice(buttonDetails?.valueVotingTime);
    }
  }, [params, buttonDetails]);

  useEffect(() => {
    runTimer();
  }, [buttonDetails])
  // @ts-ignore
  const getDeg = (value) => {
    if (value != undefined) {
      let t = value?.voteTime / 1000; //mili
      let d = value?.timeframe.seconds; //second already
      let liveTime = Date.now() / 1000;
      let ori = t + d;
      let val = (ori - liveTime) / d;
      let deg = val * 360;
      if (deg > 0) {
        runTimer();
      } else if (setHideButton) {
        setHideButton((prev: number[]): number[] => {
          return prev.filter((item) => {
            return item !== buttonIndex;
          })
        });
      }
      if (deg < 0 && setpopUpOpen && vote && Object.keys(vote).length > 0) {

        setpopUpOpen(true);
      }
      setBorderDeg(Math.round(deg));
    }
  };



  const runTimer = () => {
    const timer = setTimeout(() => {
      getDeg(buttonDetails);
    }, 1000);
  }
  // useEffect(() => {


  //   return () => {
  //     clearTimeout(timer)
  //   }
  // }, [])

  const getBorderColor = () => {
    let PricePer = livePrice / 100;
    if (symbol2 == undefined) {

      if (votePrice + PricePer && livePrice > votePrice - PricePer) {
        setborderColor("#6352e8");
      }
      else {
        if (buttonDetails?.direction == 1) {
          livePrice < votePrice ? setborderColor("#d4d0f3") : setborderColor("#3b17b7");
        } else if (buttonDetails?.direction == 0) {
          livePrice > votePrice ? setborderColor("#d4d0f3") : setborderColor("#3b17b7");
        }

      }
    } else if (symbol2 !== undefined) {
      let bothLivePrice = [coins[symbol1]?.price, coins[symbol2]?.price];
      let bothCurrentPrice = [
        buttonDetails?.valueVotingTime[0],
        buttonDetails?.valueVotingTime[1],
      ];
      let diff = [
        bothCurrentPrice[0] / bothLivePrice[0],
        bothCurrentPrice[1] / bothLivePrice[1],
      ];
      let winner = diff[0] < diff[1] ? 1 : 0;
      const averageValue = Math.abs(diff[0] - diff[1]) * 100;
      if ((averageValue == averageValue)) {
        setborderColor("#6352e8");
      } else {
        if (buttonDetails?.direction == 1) {
          winner == buttonDetails?.direction
            ? setborderColor("#3b17b7")
            : setborderColor("#d4d0f3");
        } else if (buttonDetails?.direction == 0) {
          winner != buttonDetails?.direction
            ? setborderColor("#3b17b7")
            : setborderColor("#d4d0f3");
        }
      }

    }
  };




  return (
    <Timeframe
      as={"div"}
      style={{
        opacity:
          showTimer && checked ? 0.48 : 1,
        background:
          showTimer && checked
            ? `radial-gradient(white 67%, transparent 55%),conic-gradient(${borderColor} 0deg ,${borderColor} ${borderDeg}deg, white ${borderDeg}deg ,white 360deg )`
            : "",
      }}
      {...{
        disabled,
        checked,
        borderDeg,
        borderColor,
        onClick: () => !disabled && setChecked && setChecked(!checked),
      }}
    >
      <TimeframeName
        {...{ checked }}
        style={{ color: showTimer && checked ? "var(--color-6352e8)" : "" }}
      >
        {timeframeInitials(children)}
      </TimeframeName>
    </Timeframe>
  );
};

export const timeframeInitials = (timeframe: string | React.ReactNode) => {
  // console.log(timeframe?.replace(/[^a-zA-Z]/g, ""), "onlynumber")
  return typeof timeframe === "string"
    ? timeframe
      .split(" ")
      .map((t) => t.includes('hour') || t.includes('week') ? t.slice(0, 1) : t.replace(/[^0-9]/g, '') + " " + t.replace(/[^a-zA-Z]/g, '').slice(0, 3))
      .join("")
    : timeframe;



};
export const Buttons = {
  Default: Button,
  Success: SuccessButton,
  Error: ErrorButton,
  Primary: BlueVioletButton,
  RadiusTopRight,
  RadiusBottomRight,
  RadiusTopLeft,
  RadiusBottomLeft,
  ClickableText,
  RadiusFull,
  TimeframeButton,
};
