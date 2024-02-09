import React, { ChangeEvent, Children } from "react";
import { Col, Container, Form, FormControlProps, Row ,InputGroup} from "react-bootstrap";
import styled from "styled-components";
import { Input } from "../Atoms/styles";

export type TextFieldProps = {
  
  pattern?: string;
  label?: string;
  name?: string;
  color?: string;
  children?: React.ReactNode;
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

export const GroupInput = styled(InputGroup)`
margin:auto;


  & select{
    border-top-left-radius:10px;
    width:70px;
    background: var(--color-ffffff) 0% 0% no-repeat padding-box;
  border: 1px solid var(--color-e3e3e3);
  border-right:none;
  box-shadow: inset 0 3px 6px #00000029;
  
  opacity: 1;
  }
  & Input{
    
  background: var(--color-ffffff) 0% 0% no-repeat padding-box;
  border: 1px solid var(--color-e3e3e3);
  border-left:none;
  box-shadow: inset 0 3px 6px #00000029;
  
  opacity: 1;
  }
  
`;

const SelectTextfield = ({
  pattern,
  label,
  name,
  color,

  children,
}: TextFieldProps) => {
  

  

  return (
    <Form.Group className="mb-2 d-flex" controlId={name}>
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
          <Col style={{maxWidth:window.screen.width>979&& name !== "Stay on the safe side"?'40%':''}}>
          <GroupInput className="mb-3">
              {children}
          </GroupInput>
          </Col>
        </Row>
      </Container>
    </Form.Group>
  );
};

export default SelectTextfield;
