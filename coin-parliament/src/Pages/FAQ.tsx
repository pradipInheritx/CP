import React from "react";
import { Accordion, Container } from "react-bootstrap";
import { FrequentlyAskQus, faq } from "../common/consts/contents";
import styled from "styled-components";

const FQbox = styled.div`
  margin:auto;
  max-width:800px;
  outline: none;
  box-shadow: none;
`;
const Header = styled(Accordion.Header)`
  & .accordion-button {    
    color: #6352e8;
    // background-color: #fff;
     box-shadow: none;
    border-color: rgba(0,0,0,.125);
    z-index:0;
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
      <div className="pt-5 pb-4" style={{ textAlign: 'center', color: '#5f4de4', fontSize: '13px' }}>
        <h5>
          FAQs - Coin Parliament: Vote To Earn
        </h5>
      </div>
      <Accordion defaultActiveKey={["0"]} alwaysOpen>
        {FrequentlyAskQus.map((value, i) => {
          return (
            <Accordion.Item eventKey={i.toString()} key={i}>
              <Header>
                <Container>{value.question}</Container>
              </Header>
              <Body>
                <Container>
                  <div style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: value.answer }} />
                </Container>
              </Body>
            </Accordion.Item>
          );
        })}
      </Accordion>
      <div className="pt-3 pb-4" style={{ textAlign: 'justify', color: '#212529', fontSize: '1.3em' }}>
        <p>
          These revised FAQs should accurately reflect the details of Coin Parliament: Vote To Earn. If you have any more questions or need assistance, please feel free to reach out to our support team. Enjoy your gaming experience!
        </p>
      </div>

    </FQbox>
  );
};

export default FAQ;
