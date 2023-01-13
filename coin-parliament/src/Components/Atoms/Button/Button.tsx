import React, { ReactNode } from "react";
import { ButtonProps } from "react-bootstrap";
import styled from "styled-components";
import { InputAndButton, PoppinsMediumWhite12px } from "../../../styledMixins";

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
  width: 71px;
  height: 70px;
  background: ${(props: { checked: boolean }) =>
    props.checked
      ? "var(--color-6352e8) 0% 0% no-repeat padding-box;"
      : "var(--white) 0% 0% no-repeat padding-box"};
  box-shadow: 0 3px 6px #00000029;
  border-radius: 45px;
  opacity: 1;

  &[disabled] {
    opacity: 0.48;
  }
`;

const TimeframeName = styled.span`
  font-size: var(--font-size-22);
  font-style: normal;
  font-weight: normal;
  line-height: var(--line-spacing-14);
  font-family: var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  color: ${(props: { checked: boolean }) =>
    props.checked ? "var(--white)" : "var(--color-6352e8)"};
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
}: {
  children: React.ReactNode;
  disabled?: boolean;
  checked: boolean;
  setChecked?: (c: boolean) => void;
}) => {
  return (
    <Timeframe
      as={"div"}
      {...{
        disabled,
        checked,
        onClick: () => !disabled && setChecked && setChecked(!checked),
      }}
    >
      <TimeframeName {...{ checked }}>
        {timeframeInitials(children)}
      </TimeframeName>
    </Timeframe>
  );
};

export const timeframeInitials = (timeframe: string | React.ReactNode) => {
  return typeof timeframe === "string"
    ? timeframe
        .split(" ")
        .map((t) => t.includes('hour') || t.includes('week')? t.toUpperCase().slice(0, 1):t.toUpperCase().slice(0, 2))
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
