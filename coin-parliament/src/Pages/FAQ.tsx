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
          Knowledge Hub - Coin Parliament: Vote To Earn
        </h5>
      </div>
      <div
        style={{
          color: "black",
          padding:"0px 25px 0px 40px"
      }}
      >
        <p className="my-3">
          Coin Parliament is the world’s first Vote To Earn Web 3 Social game, members enjoying many benefits by voting on the top Cryptocurrency.
        </p>
        <p className="my-3">
        CMP- You earn CMP by actively participating in voting. Your CMP increases based on the frequency of your votes and their impact levels (Low, Mid, High).
        </p>
      <p className="my-3">
        Here is list of the benefits you get as a member of the Parliament and voting ;
        </p>
        <p className="my-3">        
        1. SVI - Social Voting Indicator-
        a proprietary indicator that compiles voting data based on factors like volume, time frame, and voter success rates. It provides a visual representation of community sentiment for a specific cryptocurrency.
        </p>
        
        
        <p className="my-3">
        2. Collectibles cards - Collectibles are valuable blockchain assets created from your card collection when you upgrade your account to Mining. Being the first owner of a Collectible card entitles you to 50% royalties from the sale.
        </p>

        <p className="my-3">
        3. Valuable game coins that can be used to purchase merchandise and more,
        </p>

        <p className="my-3">
        4. members mining PAX tokens by voting and progressing and earning CMP
        </p>

        <p className="my-3">          
        5. Ambassador- Coin Parliament got the best referral plan in the world! You generate you referral link on the app and share it on your social media platforms such as Instagram, Facebook, TikTok, What’s etc. and you start earning each vote your referral make will Accelerate your mining progress.
        Lifetime passive income rev-share program, receive 50% of all your friends' total purchases directly to your wallet!!
        </p>

        <p className="my-3">
        6. Get notifications from influencers you follow and get to see their votes, the influencers tables divided to 5 levels :
        From speakers, councils, Ambassadors, ministers and chairmen’s. This list update daily according to the parliament members activity and success
        </p>

        <p className="my-3">
        7. FUN- Coin Parliament is fun platform interactive and exciting
        </p>
        <p className="my-3">          
        8. Donations- You can select which charitable foundation you'd like to support, and we will donate an extra 10% (from our account) to your chosen charity. This means that each time a PAX token is minted, you can make a meaningful contribution to the cause you care about the most through your participation in Coin Parliament.
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
