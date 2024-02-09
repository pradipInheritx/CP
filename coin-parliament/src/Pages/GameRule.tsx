import React from "react";
import GeneralPage from "../GeneralPage";
import { Accordion, Container } from "react-bootstrap";
import { gameRules } from "../common/consts/contents";
import styled from "styled-components";

const Page = styled.div`
  font-size: 13px;
  margin:auto;
  line-height: 21px;
  padding: 24px 47px;
  background: white;
  color: #160133;
  font-weight:100;
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
const GameRule = () => {
  return (
    <Page>
      <div style={{ margin: 'auto', maxWidth: '800px' }}>
        <h1> Game Goal</h1>
        <p>The goal of the game is to collect unique cards and convert them into Collectibles.</p>
        <h1>How to Achieve the Goal:</h1>
        <p>To achieve this goal, follow these steps:</p>
        <Accordion defaultActiveKey={["0"]} alwaysOpen>
          {gameRules.map((value, i) => {
            return (
              <Accordion.Item eventKey={i.toString()} key={i}>
                <Header>
                  <Container>{i + 1}. {value.step}</Container>
                </Header>
                <Body>
                  <Container>
                    <div style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: (value.desc || '') }} />
                  </Container>
                </Body>
              </Accordion.Item>
            );
          })}
        </Accordion>

        <div className="pt-3" style={{ textAlign: 'justify' }}>
          <h1>Game Flow and Levels:</h1>
          <p>The game starts with you as a Member.
            You progress by voting, accumulating CMP, and reaching influencer levels.
            Collecting unique cards is a primary focus.
            When you reach 100 CMP, you unlock rewards.
            Upgrading to a Mining account enables automatic card-to-Collectible conversion.
            Higher influencer levels grant better CMP rewards.
            Why Should You Do It and Benefits:</p>

          <p>
            Collecting cards and converting them into Collectibles is rewarding and unique.
            Collectibles are permanently recorded on the blockchain.
            Members can showcase, trade, or sell their Collectibles.
            Being the first owner of a Collectible card earns you lifetime royalties of 50% from its sales, providing a continuous income stream.
            Additionally, you can earn Parliament coins (VTE), extra votes, and discounts on Vote To Earn merchandise.
            The Ambassador Program allows you to refer friends and earn commissions from their purchases, adding to your income potential.
            In summary, Coin Parliament: Vote To Earn is a game where you progress by voting, collecting cards, upgrading to Mining for Collectibles, and enjoying the benefits within the crypto ecosystem, including lifetime royalties from the sale of your Collectible cards.
          </p>
        </div>

      </div>
    </Page>
  );
};

export default GameRule;
