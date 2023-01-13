import React from "react";
import styled from "styled-components";
import {Container} from "react-bootstrap";

const Page = styled(Container)`
  font-size: 13px;
  line-height: 21px;
  padding: 24px 47px;
  background: white;
  color: #160133;
  //margin-bottom: -109px;

  & h1 {
    color: #6352E8;
    font-size: 18px;
    line-height: 21px;
    margin-bottom: 20px;
  }

  & a {
    color: #6352E8;
  }

  & p {
    margin-bottom: 20px;
  }
`;

const GeneralPage = ({children}: { children: React.ReactNode | string }) => {
  return (
    <Page>
      {children}
    </Page>
  );
};

export default GeneralPage;
