import React from "react";
import { ButtonGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import { Buttons } from "../Atoms/Button/Button";
import styled from "styled-components";

export type NotLoggedInProps = {
  title?: string;
  content: React.ReactNode;
  wrapper?: boolean;
  buttons?: React.ReactNode[];
  closeButton?: boolean;
};

const H2 = styled.div`
  text-transform: uppercase;
  margin-bottom: 4px;
`;

const Text = styled.div``;
const Wrapper = styled.div`
  text-align: center;
  font-size: 18px;
  color: #6352e8;
  vertical-align: middle;
  line-height: 18px;
`;

const Popup = ({
  title = "OOPS!",
  content,
  wrapper = true,
  buttons,
  closeButton = true,
}: NotLoggedInProps) => {
  return (
    <Wrapper className="d-flex justify-content-center align-items-center flex-column">
      <H2>{title}</H2>
      {wrapper && <Text>{content}</Text>}
      {!wrapper && content}
      {(buttons || closeButton) && (
        <ButtonGroup className="mt-2">
          {buttons?.map((button, i) => (
            <React.Fragment key={i}>{button}</React.Fragment>
          ))}
          {closeButton && (
            <Buttons.Error
              onClick={() => {
                toast.dismiss();
              }}
            >
              Close
            </Buttons.Error>
          )}
        </ButtonGroup>
      )}
    </Wrapper>
  );
};

export default Popup;
