import React from "react";
import styled from "styled-components";
import { Form, FormCheck } from "react-bootstrap";
import { PoppinsMediumBlack12px } from "../../../styledMixins";

const Input = styled(FormCheck.Input)`
  ${PoppinsMediumBlack12px}
  width: 13px;
  height: 13px;
  background-color: var(--white);
  border: 1px solid #707070;
  &:checked {
  }
`;

const Label = styled(FormCheck.Label)`
  ${PoppinsMediumBlack12px}
  min-height: 19px;
  align-self: flex-end;
  margin-left: 12px;
  min-width: 214px;
  letter-spacing: 0;
  line-height: 11px;
  white-space: nowrap;
`;

const Container = styled(Form.Check)`
  height: 20px;
  margin-left: 4px;
  display: flex;
  align-items: flex-start;
  min-width: 239px;
`;
export type CheckboxProps = {
  children?: React.ReactNode;
  name: string;
  disabled?: boolean;
  checked: boolean;
  onClick?: (c: boolean) => void;
  required?: boolean;
};

export const Checkbox = ({
  children,
  name,
  disabled,
  checked,
  onClick,
  required,
}: CheckboxProps) => {
  return (
    <Container type="checkbox">
      <Input
        onClick={onClick}
        checked={checked}
        type="checkbox"
        name={name}
        id={name}
        disabled={disabled}
        bsPrefix="cp-checkbox"
        required={required}
      />
      {children && (
        <Label htmlFor={name} bsPrefix="cp-label">
          {children}
        </Label>
      )}
    </Container>
  );
};

export default Checkbox;
