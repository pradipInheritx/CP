import React from "react";
import { Accordion, Container } from "react-bootstrap";
import { faq } from "../common/consts/contents";
import styled from "styled-components";

const FQbox = styled.div`
margin:auto;
  max-width:800px;
`;
const Header = styled(Accordion.Header)`
  & .accordion-button {
    color: #6352e8;
    background-color: #fff;
    &::after {
      margin-right: 0;
    }
  }
`;
const Body = styled(Accordion.Body)`

  color: #212529;
`;
const FAQ = () => {
  return (
    <FQbox>
      <Accordion defaultActiveKey={["0"]} alwaysOpen>
        {faq.map((f, i) => {
          return (
            <Accordion.Item eventKey={i.toString()} key={i}>
              <Header>
                <Container>{f.title}</Container>
              </Header>
              <Body>
                <Container>{f.content}</Container>
              </Body>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </FQbox>
  );
};

export default FAQ;
