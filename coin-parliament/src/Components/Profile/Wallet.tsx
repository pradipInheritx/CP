import React from "react";
import {Buttons} from "../Atoms/Button/Button";
import {useTranslation} from "../../common/models/Dictionary";
import {capitalize} from "lodash";
import styled from "styled-components";
import Container from "react-bootstrap/Container";


const Wallet = () => {
  const translate = useTranslation();
  return (
    // <Container fluid style={{ paddingTop: 100}}>
    //    <Title>{"Coming soon".toUpperCase()}</Title>

    //   {/* <Title>Wallet your account <strong>To Earn Crypto & NFT</strong></Title>
    //   <Buttons.Primary fullWidth={true}>{capitalize(translate("Wallet account"))}</Buttons.Primary> */}
    // </Container>
    <Container>
      <div>
        <p>Hello</p>
      </div>
    </Container>
  );
};

export default Wallet;
