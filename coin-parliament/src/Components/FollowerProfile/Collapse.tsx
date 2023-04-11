import React from "react";
import { Accordion } from "react-bootstrap";
import { useTranslation } from "../../common/models/Dictionary";
import styled from "styled-components";

type CollapseProps = {
  title: string;
  children: React.ReactNode;
};

const Title = styled(Accordion.Header)`
  & .accordion-button {
    font: var(--font-style-normal) normal medium 9px/19px
      var(--font-family-poppins);
    letter-spacing: var(--character-spacing-0);
    color: var(--color-6352e8);
    text-align: left;
    font-size: 9px;
    text-transform: uppercase;
    opacity: 1;
    background: transparent;
    border: 0;
    box-shadow: none;
    display: flex;
    justify-content: space-around;
    max-width: 200px;
    margin: 0 auto;
    &:after {
      flex-shrink: 0;
      width: 9px;
      height: 9px;
      margin-left: 0;
      margin-right: 0;
      transition: none;
      background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%236352E8'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
    }
  }
`;

const Body = styled(Accordion.Body)``;

const Item = styled(Accordion.Item)`
  border: 0;
  background: transparent;
`;

const Container = styled(Accordion)``;

const Collapse = ({ title, children }: CollapseProps) => {
  const translate = useTranslation();
  return (
    <Container flush>
      <Item eventKey="0">
        <Title>{translate(title)}</Title>
        <Body>{children}</Body>
      </Item>
    </Container>
  );
};

export default Collapse;
