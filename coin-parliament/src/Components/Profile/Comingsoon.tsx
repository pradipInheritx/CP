/** @format */

import React from "react";
import { Buttons } from "../Atoms/Button/Button";
import { useTranslation } from "../../common/models/Dictionary";
import { capitalize } from "lodash";
import styled from "styled-components";
import Container from "react-bootstrap/Container";

const Title = styled.div`
  font: var(--font-style-normal) normal var(--font-weight-normal) 20px/26px
    var(--font-family-poppins);
  font-size: 20px;
  line-height: 26px;
  letter-spacing: var(--character-spacing-0);
  color: var(--color-d4d0f3);
  text-align: center;
  margin-bottom: 26px;
`;

const Upgrade = () => {
  const translate = useTranslation();
  return (
    <Container fluid style={{
      background: "var(--black)", padding: 10,
    width:`${window.screen.width > 767 ? "300px":"100%"}`,
      height: `${window.screen.width > 767 ? "150px" : "150px"}`
    
    }} className="d-flex justify-content-center align-items-center">
      <Title >Coming soon</Title>

      {/* <Title>Upgrade your account <strong>To Earn Crypto & NFT</strong></Title>
      <Buttons.Primary fullWidth={true}>{capitalize(translate("upgrade account"))}</Buttons.Primary> */}
    </Container>
  );
};

export default Upgrade;
