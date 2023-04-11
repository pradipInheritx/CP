import React, {useContext} from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";
import AppContext from "../Contexts/AppContext";
import { texts } from "./LoginComponent/texts";

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
  const {appStats, paxData} = useContext(AppContext);
  return (
    <FooterContainer>
        <p style={{marginBottom:'5px'}}><I
              className="bi-twitter"
              
              onClick={() =>
                window.open(
                  `https://twitter.com/CoinParliament`,
                  "_blank"
                )
              }
            />
            <img
            style={{margin:'5px', marginTop:'-3px'}}
            height='17'
            src={ process.env.PUBLIC_URL + '/images/icons/facebook.svg'}
            // onClick={() =>
            //   window.open(
            //     "https://www.facebook.com/CoinParliament","_blank"
            //   )
            // }
            />
            {/* <img
            style={{marginTop:'-5px'}}
            height='28'
            src={ process.env.PUBLIC_URL + '/images/icons/youtube.svg'}
            onClick={() =>
              window.open(
                "https://www.facebook.com/CoinParliament","_blank"
              )
            }
            /> */}
            <I
              className="bi bi-instagram"
              
              onClick={() =>
                window.open(
                  `https://www.instagram.com/coinparliament/`,
                  "_blank"
                )
              }
            />
            <I
              className="bi bi-tiktok"
              
              onClick={() =>
                window.open(
                  `https://www.tiktok.com/@coinparliament`,
                  "_blank"
                )
              }
            /></p>
      {/* <p>Coin Parliament © 2022 | Block {paxData?.blocksGiven || 0}, 1PAX = 10USD</p>
      <p>Total votes = {appStats?.totalVotes || 0} </p>
      <p>
        <Link to="/about">About</Link>.
        <Link to="/faq">FAQ</Link>.
        <Link
          to="/contact">Contact</Link>.
        <Link
          to="/privacy">Privacy</Link>.
        <Link
          to="/coins">Coins</Link>.
        <Link
          to="/pairs">Pairs</Link>.
        <Link
          to="/influencers">Influencers</Link>.
      </p> */}
      
      <p>PAX BEP20 Total supply 21M | Block number 0 | Next halving 0  </p><p> Minted Quantity 0 | Current block reward 50 | PAX Value 0.04$  </p>
      <p style={{marginTop:'10px',marginBottom:'5px'}}>
       
       <span><Link
         to="/privacy">{texts.Privacy} {' '} </Link>
    </span>
    <span>
    <Link
         to="/privacy">{texts.termsConditions}</Link>
         </span>
     </p>
 




       {/* <p>Copyright © 2022 CoinParliament. All rights reserved.</p> */}
     
            <p>Copyright © 2023 CoinParliament. All rights reserved.</p>
       {/* <p>Coin Parliament © 2022</p> */}
    </FooterContainer>
  );
};

export default Footer;
