import React from "react";
import { Buttons } from "../Atoms/Button/Button";
import styled, { css } from "styled-components";
import { useTranslation } from "../../common/models/Dictionary";
import { ButtonGroup, ButtonToolbar } from "react-bootstrap";
import { texts } from "../LoginComponent/texts";

export type StatusNavProps = {
  userTypes: string[];
  setChosen: (c?: string) => void;
  chosen?: string;
};

const BTN = css`
  height: 12px;
  min-height: 12px;
  padding: 0 12px;
  font-weight: 400;
  letter-spacing: var(--character-spacing-0);
  text-align: center;
  opacity: 1;
  font-size: 12px;
  line-height: 12px;
  color: white;
  border: 0;
  text-transform: capitalize;
`;

const Chosen = styled(Buttons.Primary)`
  ${BTN};
`;

const UnChosen = styled(Buttons.Primary)`
  ${BTN};
  opacity: 0.4;
`;

const Toolbar = styled(ButtonToolbar)`
  flex-wrap: nowrap;
  overflow: scroll;
  background: #6352E8;
  padding: 12px;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ButtonGroupMr1 = styled(ButtonGroup)`
  margin-right: 4px;
`;
const StatusNav = ({ userTypes, setChosen, chosen }: StatusNavProps) => {
  const translate = useTranslation();
  return (
    <Toolbar
      className={`${window.screen.width < 767 ? "" : "d-flex justify-content-center"}`}

    >
      {/* {userTypes.includes(chosen || "") && (
        <ButtonGroupMr1>
          <UnChosen onClick={() => setChosen()}>            
            {texts.ViewAll}
          </UnChosen>
        </ButtonGroupMr1>
      )}
      {!chosen && (
        <ButtonGroupMr1>
          <Chosen onClick={() => setChosen()}>
            
            {texts.ViewAll}
          </Chosen>
        </ButtonGroupMr1>
      )} */}
      {userTypes.map((u, i) => {

        if (chosen === u) {
          return (
            <ButtonGroupMr1 key={i}>
              <Chosen onClick={() => setChosen(u)}>{translate((u + "S"))}</Chosen>
            </ButtonGroupMr1>
          );
        } else {
          return (
            <ButtonGroupMr1 key={i}>
              <UnChosen onClick={() => setChosen(u)}>
                {translate(u + "S")}
              </UnChosen>
            </ButtonGroupMr1>
          );
        }
      })}
    </Toolbar>
  );
};

export default StatusNav;
