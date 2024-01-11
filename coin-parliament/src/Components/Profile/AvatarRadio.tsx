import React from "react";
import { Card, Form } from "react-bootstrap";
import Avatars, { AvatarType } from "../../assets/avatars/Avatars";
import styled from "styled-components";
import { colord } from "colord";
import { UserProps } from "../../common/models/User";

export type AvatarRadioProps = {
  type: AvatarType;
  checked: boolean;
  name: string;
  id: string;
  maxWidth?: number;
  onSubmit: (newUserInfo: UserProps) => Promise<void>;
  onClick: (id: string) => void;
};

const CardBg = styled(Card)`
  background: ${colord("#FFFFFFA3").alpha(0.47).toRgbString()} 0 0% no-repeat
    padding-box;
  // opacity: ${(props: { checked: boolean }) => (props.checked ? 1 : 0.3)};
  box-shadow: 0 3px 6px #00000029;
  border-radius: 6px;
  border:none;
  width: 252px;
  height: 320px;  
  text-align: center;

`;
const Title = styled.div`
  background: transparent
    linear-gradient(180deg, var(--color-6352e8) 0%, #3712b3 100%) 0 0 no-repeat
    padding-box;
  box-shadow: 0 3px 6px #00000029;
  border: 1px solid #707070;
  border-radius: 47px;
  padding: 6px;
  opacity: 1;
  font: var(--font-style-normal) normal var(--font-weight-bold)
    var(--font-size-13) / var(--line-spacing-13) var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  color: var(--color-ffffff);
`;

const Input = styled(Form.Check.Input)`
  width: 24px;
  height: 24px;
  border: 2px solid var(--color-6352e8);
  opacity: 1;
  background: transparent;
  color: transparent;
  cursor: pointer;
  &.form-check-input:checked {
    background-color: var(--color-6352e8);
    border-color: inherit;
    background-image: none;
  }
`;
const AvatarRadio = ({
  type = AvatarType.Angel,
  checked,
  name = "avatars",
  id = AvatarType.Angel,
  maxWidth = 183,
  onSubmit,
  onClick,
}: AvatarRadioProps) => (
  <CardBg className="text-center" style={{ maxWidth }} {...{ checked }}>
    <Card.Header className="d-flex justify-content-end bg-transparent border-0">
      <Form.Check type="radio" id={id}>
        <Input type="radio" name={name} onChange={onSubmit} checked={checked} />
      </Form.Check>
    </Card.Header>
    <Card.Body
      className="p-2 d-flex align-items-center justify-content-center"
      role="button"
      onClick={() => onClick(type)}
    >
      <Avatars type={type} />
    </Card.Body>
    <Card.Footer className="bg-transparent border-0">
      <Title>{`The ${type}`}</Title>
    </Card.Footer>
  </CardBg>
);

export default AvatarRadio;
