import React, { ChangeEvent } from "react";
import { Col, Container, Form, FormControlProps, Row } from "react-bootstrap";
import styled from "styled-components";
import { Input } from "../Atoms/styles";

export type TextFieldProps = {
  type?: string;
  pattern?: string;
  label?: string;
  name: string;
  placeholder: string;
  value?: string;
  min?: number;
  max?: number;
  step?: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  color?: string;
  edit?:boolean;
};

export const Label = styled(Form.Label)`
  font: var(--font-style-normal) normal var(--font-weight-normal)
    var(--font-size-13) / 19px var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  color: ${(props: { color: string }) => props.color || "var(--color-160133)"};
  text-align: left;
  text-transform: uppercase;
  opacity: 1;
`;

export const MyInput = styled(Input)`
  background: var(--color-ffffff) 0% 0% no-repeat padding-box;
  border: 1px solid var(--color-e3e3e3);
  box-shadow: inset 0 3px 6px #00000029;
  border-radius: 6px;
  opacity: 1;
`;

const TextField = ({
  pattern,
  name,
  label,
  placeholder,
  value,
  onChange,
  type,
  min,
  max,
  step,
  color,
  edit,
}: TextFieldProps) => {
  let formControl: Partial<FormControlProps> & { name: string; rows?: number } =
    {
      name,
      placeholder,
      value,
      onChange,
    };

  if (type === "textArea") {
    formControl = { ...formControl, as: "textarea", rows: 3 };
  } else {
    formControl = { ...formControl, type: type || "text" };
  }

  return (
    <Form.Group className="mb-3 d-flex" controlId={name}>
      <Container>
        <Row style={{justifyContent:'center'}}>
          <Col style={{maxWidth:window.screen.width>979?'40%':''}}>
            {label && (
              <Label sm="3" color={color}>
                {label}
              </Label>
            )}
          </Col>
        </Row>
        <Row style={{justifyContent:'center'}}>
          <Col style={{maxWidth:window.screen.width>979?'40%':''}}>
          {/* @ts-ignore */}
            <MyInput
              {...formControl}
              pattern={pattern}
              min={min}
              max={max}
              step={step}
              disabled={edit}
            />
          </Col>
        </Row>
      </Container>
    </Form.Group>
  );
};

export default TextField;
