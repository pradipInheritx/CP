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
  color: #3b2e7f;
  text-align: center;
  // margin-bottom: 26px;
`;
const Modal = styled.div`  
border-radius: 100px 0px 100px 100px !important;
height:100;
`
// .modal-content{
    
//   border-radius: 100px 0px 100px 100px !important;
// }
// .modal-backdrop.fade{
//   opacity: 0;
// }

// .modal-backdrop{
//   display: none;
//   /* opacity: 1; */
// }


const Upgrade = () => {
  const translate = useTranslation();
  return (
    <Modal  style={{  padding: 40 }}>
      <Title>Coming soon</Title>

      {/* <Title>Upgrade your account <strong>To Earn Crypto & NFT</strong></Title>
      <Buttons.Primary fullWidth={true}>{capitalize(translate("upgrade account"))}</Buttons.Primary> */}
    </Modal>
  );
};

export default Upgrade;
