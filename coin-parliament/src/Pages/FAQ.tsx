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
          Knowledge Hub
          {/* - Coin Parliament: Vote To Earn */}
        </h5>
      </div>
      <div
        style={{
          color: "black",
          padding:"0px 25px 0px 40px"
      }}
      >
        <p className="my-3">
          VoteToEarn (V2E) introduces an innovative platform that seamlessly combines cryptocurrency mining and social voting through WEB.3 technology. Let's break down how this unique system works.
        </p>
        <p className="my-3">
          Users actively participate in the Coin Mining Process (CMP) to mine PAX (BEP20) tokens, with progress influenced by factors like the type of miner and the impact of votes on the Social Voting Indicator (SVI).
        </p>
      <p className="my-3">
          Upon reaching 100 CMP, users sign a proof of vote (PoV) block, unlocking associated block rewards. These votes and CMP contribute not only to token mining but also to the primary goal of the game – collecting unique cards and completing an album.
        </p>
        <p className="my-3">        
          Reaching 100 CMP comes with exciting game rewards, including unique cards, extra votes, and game coins (VTE). These game coins (VTE) add functionality, allowing users to trade within the app and enhance their overall gaming and mining experience by acquiring missing cards from others.
        </p>
        
        
        <p className="my-3">
          Coin Parliament, the world’s first Vote To Earn (V2E) WEB.3 social game, brings several benefits to its members:
        </p>

        
        <strong className="my-3 bold">
          1. Social Voting Indicator (SVI)
        </strong>

        <p className="mt-1 mb-3">
          A unique indicator reflecting community sentiment for a specific cryptocurrency, based on various factors like volume, time frame, and voter success rates.
        </p>

        <strong className="my-3">
          2. Collectibles Cards
        </strong>

        <p className="mt-1 mb-3">          
          Upgrading to full mining status allows users to create valuable blockchain assets from their card collection. Being the first owner of a Collectible card entitles them to 50% royalties from its sale.
        </p>

        <strong className="my-3">
        3. VTE (Valuable Game Coins)s activity and success
        </strong>

        <p className="mt-1 mb-3">
          These coins can be used to purchase merchandise and more within the app.
        </p>


        <strong className="my-3">          
          4. PAX Mining
        </strong>

        <p className="mt-1 mb-3">          
          Members actively mine PAX tokens through voting.
        </p>

        <strong className="my-3">          
          5. Ambassador Program
        </strong>

        <p className="mt-1 mb-3">          
          Offering an exceptional referral plan, members can earn 50% of their friends' total purchases by sharing their referral link.
        </p>

        <strong className="my-3">          
          6. Updates
        </strong>

        <p className="mt-1 mb-3">          
          Regular notifications from influencers, categorized into different levels, update daily based on members' activity and success.
        </p>

        <strong className="my-3">          
          7. Fun
        </strong>

        <p className="mt-1 mb-3">          
          Coin Parliament ensures a lively and interactive platform for its users.
        </p>

        <strong className="my-3">          
          8. Donations
        </strong>

        <p className="mt-1 mb-3">          
          Users can contribute to charitable foundations of their choice, with the platform donating an extra 10% for each minted PAX token, allowing them to make a meaningful impact through their participation in Coin Parliament.
        </p>

        <p className="my-3">          
        In essence, Coin Parliament's approach intertwines cryptocurrency mining with a gamified collection aspect, creating a dynamic and rewarding environment for its members to explore and enjoy.
        </p>

        
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
      <div className="pt-3 pb-4" style={{
        textAlign: 'justify', color: '#212529', fontSize: '1.3em',
          padding: `${window.screen.width <767 && "0px 25px 0px 40px"}`
      }}>
        <p>
          These revised FAQs should accurately reflect the details of Coin Parliament: Vote To Earn. If you have any more questions or need assistance, please feel free to reach out to our support team. Enjoy your gaming experience!
        </p>
      </div>

    </FQbox>
  );
};

export default FAQ;
