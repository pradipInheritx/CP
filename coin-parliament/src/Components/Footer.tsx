import React, {useContext, useEffect, useState} from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";
import AppContext from "../Contexts/AppContext";
import { texts } from "./LoginComponent/texts";
import XTwitter from "../assets/images/x-twitter-white.svg"
import axios from "axios";

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
  const [footerData, setFooterData] = useState(
    {
        paxDistribution: "",
      default: "",
      maxPaxDistribution: "",
      block: "",
      initialize: "",
      used: ""
}
  )

  useEffect(() => {
    showData()    
    return () => {      
    }
}, [])

  const showData = () => {
    axios.post("https://us-central1-votetoearn-9d9dd.cloudfunctions.net/getCurrentPaxDistribution", {
      data: {}
    }).then((res: any) => {
      console.log(res.data.result, "resultdata")
      setFooterData(res.data.result)
    }).catch((err: any) => {
      console.log(err, "resultdata")
    })
  }

  console.log(footerData, "footerData")
  
  const  formatNumberAbbreviated=(number:number)=> {
    if (number >= 1e9) {
      return (number / 1e9) + 'B';
    } else if (number >= 1e6) {
      return (number / 1e6) + 'M';
    } else if (number >= 1e3) {
      return (number / 1e3) + 'K';
    }
    return number.toString();
  }

  return (
    <FooterContainer>
         <p style={{ marginBottom: '5px' }}>
        <img src={XTwitter} height='22' width={'15'} className="me-1 pb-1" style={{ cursor: 'pointer' }}
          onClick={() =>
            window.open(
              `https://twitter.com/VoteToEarn`,
              "_blank"
            )
          } 
          />
        <img
          style={{ margin: '5px', marginTop: '-3px',cursor:"pointer" }}
          height='17'
          src={process.env.PUBLIC_URL + '/images/icons/facebook.svg'}
        onClick={() =>
          window.open(
            "https://www.facebook.com/VoteToEarn","_blank"
          )
        }
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

          // onClick={() =>
          //   window.open(
          //     `https://www.instagram.com/coinparliament/`,
          //     "_blank"
          //   )
          // }
        />
        <I
          className="bi bi-tiktok"

          // onClick={() =>
          //   window.open(
          //     `https://www.tiktok.com/@coinparliament`,
          //     "_blank"
          //   )
          // }
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
      
      {/* <p> PAX BEP20 Total supply : 21M | Minted quantity : 0   </p><p> Current block number : 0 | Next halving : in 210,000 blocks  </p> */}
      <p> PAX BEP20 Total supply : {formatNumberAbbreviated(Number(footerData?.default))} | Minted quantity : {footerData?.used}   </p><p> Current block number : {footerData?.block} | Next halving : in {footerData?.maxPaxDistribution} blocks  </p>
      <p>Current block reward {footerData?.paxDistribution} | Current value 8.28$</p>
      {/* <p>Current block reward 50 | Current value 8.28$</p> */}
     


      <p style={{marginTop:'10px',marginBottom:'5px'}}>
       
       {/* <span><Link
         to="/privacy">Privacy Policy</Link>
    </span>
    {' '}| {' '}
    <span>
    <Link
         to="/terms-and-condition">Terms & Conditions</Link>
         </span> */}
     </p>
 




       {/* <p>Copyright © 2022 CoinParliament. All rights reserved.</p> */}
     
            <p>Copyright © 2023 SportsParliament. All rights reserved.</p>
       {/* <p>Coin Parliament © 2022</p> */}
    </FooterContainer>
  );
};

export default Footer;
