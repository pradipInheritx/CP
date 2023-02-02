import React from "react";
import styled from "styled-components";
import {Container} from "react-bootstrap";

const Page = styled.div`
  font-size: 13px;
  margin:auto;
  line-height: 21px;
  padding: 24px 47px;
  background: white;
  color: #160133;
  font-weight:100;
  max-width:800px;
  min-height:82vh;
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
