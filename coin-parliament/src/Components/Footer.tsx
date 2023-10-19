import React, { useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import AppContext from "../Contexts/AppContext";
import { texts } from "./LoginComponent/texts";
import XTwitter from "assets/images/x-twitter-white.svg"

const FooterContainer = styled.footer`
  bottom: 0;
  width: 100%;
  background: transparent linear-gradient(180deg, var(--color-6352e8) 0%, #3712b3 100%) 0% 0% no-repeat padding-box;
  opacity: 1;
  padding-top: 24px;
  padding-bottom: 17px;
  
  & p {
    font: var(--font-style-normal) normal var(--font-weight-normal) 10px /
      var(--line-spacing-16) var(--font-family-poppins);
    font-size: 10px;
    line-height: 1.6;
    letter-spacing: var(--character-spacing-0);
    color: var(--color-ffffff);
    text-align: center;
    opacity: 1;

    & a {
      color: var(--color-ffffff);
      text-decoration: blink;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;
const I = styled.i`
  cursor: pointer;
  font-size:17px;
  margin:5px;
`;
const Footer = () => {
  const { appStats, paxData } = useContext(AppContext);
  return (
    <FooterContainer style={{ position: 'fixed' }}>
      <p style={{ marginBottom: '5px' }}>
        <img src={XTwitter} height='22' width={'15'} className="me-1 pb-1" style={{ cursor: 'pointer' }}
          onClick={() =>
            window.open(
              `https://twitter.com/votetoearn`,
              "_blank"
            )
          } />
        <img
          style={{ margin: '5px', marginTop: '-3px' }}
          height='17'
          src={process.env.PUBLIC_URL + '/images/icons/facebook.svg'}
        />
        <I
          className="bi bi-instagram"

          onClick={() =>
            window.open(
              `https://www.instagram.com/votetoearn/`,
              "_blank"
            )
          }
        />
        <I
          className="bi bi-tiktok"

          onClick={() =>
            window.open(
              `https://www.tiktok.com/@votetoearn`,
              "_blank"
            )
          }
        /></p>

      <p> PAX BEP20 Total supply : 21M | Minted quantity : 0   </p><p> Current block number : 0 | Next halving : in 210,000 blocks  </p>
      <p>Current block reward 50 | Current value 8.28$</p>
      <p>Copyright © {new Date().getFullYear()} Vote to Earn. All rights reserved.</p>
    </FooterContainer>
  );
};

export default Footer;
