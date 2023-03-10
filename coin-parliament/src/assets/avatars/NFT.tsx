import React from "react";
import { Card } from "react-bootstrap";
import { AvatarType, importFile } from "./Avatars";
import { capitalize } from "lodash";
import styled from "styled-components";

export type NFTProps = {
  setSelectedAvatar:any;
  id: string;
};

const title = (id: string) => `The ${capitalize(id)}`;

const images = {
  [AvatarType.Angel]: "tiger",
  [AvatarType.Trader]: "shark",
  [AvatarType.Hodler]: "ape",
  [AvatarType.Investor]: "eagle",
  [AvatarType.Founder]: "rhino",
};

const texts = {
  [AvatarType.Angel]:
    "A serial entrepreneur, start up blood runs through her veins. She has founded 3 startups in the fashion industry which put her on the list of most powerful women in the world. Ultra high net worth individual, with a strategic network, seeking highly innovative early stage companies to ignite her soul. A huge believer in CP and was one of the larger seed investors.",
  [AvatarType.Trader]:
    "A fast paced, young & confident trader with supernatural abilities to make money under any market conditions. A self made millionaire. Created a name for himself as one of the youngest most influential traders. Not a crowd follower, but a champion at spotting individual market movements that occur on a daily or even hourly time frame. makes fast decisions. Lives by the motto High Risk High reward.",
  [AvatarType.Hodler]:
    "A tech savvy enthusiast, extremely knowledgeable, a true leader by experience. A protector & keeper whilst simultaneously fueling advancement. Consistently guiding and nourishing opportunity with true determination picking up followers wherever he goes.",
  [AvatarType.Investor]:
    "Chairman of one of the world's leading VC’s, Board member of 18 internet & tech companies, portfolio consists predominantly of Crypto and stocks. Is seen as the ‘high priest’ in the investment community. Fast thinker, spots changes in trends ahead of others, but patient with his approach to investing - starts early and looks for fundamental long term growth.",
  [AvatarType.Founder]:
    "Established CP and multiple other successful startups which have collectively IPO’d for over 100 Billion. Passionate about new concepts with a radical imagination & clear vision to revolutionize. Holds a high risk tolerance, extremely knowledgeable and is a hit with the crowds.",
};

const knownFor = {
  [AvatarType.Angel]: "Her Integrity",
  [AvatarType.Trader]: "The Gamer",
  [AvatarType.Hodler]: "The Shepherd",
  [AvatarType.Investor]: "The Priest",
  [AvatarType.Founder]: undefined,
};
const occupation = {
  [AvatarType.Angel]: "Entrepreneur",
  [AvatarType.Trader]: "DJ & Trader",
  [AvatarType.Hodler]: "Programmer, CTO",
  [AvatarType.Investor]: "Venture Capitalist",
  [AvatarType.Founder]: "Businessman, Investor",
};
const hobbies = {
  [AvatarType.Angel]: "Fashion, Arts & Politics",
  [AvatarType.Trader]: "Poker, Making money, Music, adrenaline.",
  [AvatarType.Hodler]: "Music,Iron Man, technology",
  [AvatarType.Investor]: "Skiing, Swimming",
  [AvatarType.Founder]: "Businessman, Investor Philanthropist.",
};

const Container = styled(Card)`
  width: 100%;
  height: auto;
  padding: 5px 5px 38px 5px;
  border-radius: 6px;
  border: #fff solid 6px;
  background: rgb(55, 18, 179);
  background: -webkit-linear-gradient(
    rgba(93, 70, 224, 1) 0%,
    rgba(55, 18, 179, 1) 77%,
    rgba(19, 3, 49, 1) 100%
  );
  background: -o-linear-gradient(
    rgba(93, 70, 224, 1) 0%,
    rgba(55, 18, 179, 1) 77%,
    rgba(19, 3, 49, 1) 100%
  );
  background: linear-gradient(
    rgba(93, 70, 224, 1) 0%,
    rgba(55, 18, 179, 1) 77%,
    rgba(19, 3, 49, 1) 100%
  );
  position: relative;
`;

const Title = styled.div`
  font-size: 24px;
  color: #fff;
  text-transform: uppercase;
  text-align: left;
  font-weight:600;
`;

const Video = styled.video`
  width: 100%;
  max-width: 300px;
  height: 300px;
  margin: 0 auto;
  border-radius: 20px;
`;

const Body = styled(Card.Body)`
flex-direction:column;
  font-size: 14px;
  line-height: 18px;
  color: #fff;
  // margin: 0 20px;
  padding-top:0;
`;

const Footer = styled.div`
  color: var(--color-160133);
  text-align: left;
  letter-spacing: 0;
  text-transform: uppercase;
  opacity: 1;
  background: white;
  border-radius: 0 38px 0 0px;
  width: 164px;
  padding: 8px;
  padding-bottom:0px;
  font: normal normal normal 13px/20px Poppins;
  font-size: 13px;
  position: absolute;
  bottom: 0;
  left: 0;
`;
const CloseButton = styled.span`
  width: 10px;
  align-self:end;
  margin-right:10px;
  font-size:22px;
  font-weight:400;
cursor:pointer;
`;
const Paragraph=styled.p`
font-weight:300;`
const NFT = ({ setSelectedAvatar,id }: NFTProps) => {
  return (
    <Container style={{marginTop:'15px'}}>
     
          <CloseButton aria-hidden="true" onClick={()=>setSelectedAvatar('')}>&times;</CloseButton>
        
      <Body>
        <Title>{title(id)}</Title>
        <Video width="300" height="300" autoPlay={true} loop={true}>
          <source
            src={`${
              importFile(`./videos/${images[id as AvatarType]}`, "mp4")
                .default || ""
            }`}
            type="video/mp4"
          />
        </Video>
        <Paragraph className="mb-2">{texts[id as AvatarType]}</Paragraph>
        <div>
          <Paragraph>Known for - {knownFor[id as AvatarType]}</Paragraph>
          <Paragraph>Occupation - {occupation[id as AvatarType]}</Paragraph>
          <Paragraph>Hobbies - {hobbies[id as AvatarType]}</Paragraph>
        </div>
      </Body>
      <Footer><span style={{fontWeight:900}}>NFT</span> - COLLECTABLE</Footer>
    </Container>
  );
};

export default NFT;
