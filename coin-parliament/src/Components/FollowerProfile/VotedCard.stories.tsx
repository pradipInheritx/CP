import React from "react";
import { default as CPVotedCard } from "./VotedCard";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { VoteSnap } from "../../common/models/Vote";
import { Colors } from "../../common/models/UserType";
import CoinsContext, { CoinContextProps } from "../../Contexts/CoinsContext";
import { coins } from "../Coins/testData";

const vote: VoteSnap = {
  id: "xef25dfg35",
  valueExpirationTime: [0.92037, 2.2386],
  userId: "8HDeNuCpyusuG7ObjzbdPzRyVhYC",
  valueVotingTime: [0.50037, 2.2486],
  voteTime: 1641602300800,
  timeframe: { index: 0, chosen: true, seconds: 15, name: "15 seconds" },
  success: true,
  expiration: 1641602315800,
  coin: "ETH-BTC",
  direction: 1,
  status: {
    color: Colors.PLATINUM,
    givenCPM: 1,
    index: 0,
    weight: 1,
    name: "Member",
    share: 50,
  },
  score: 2.5,
};

const MyVotedCard = ({ coin1, coin2 }: { coin1: string; coin2: string }) => {
  const myVote = vote;
  if (coin1 && coin2) {
    myVote.coin = [coin1, coin2].join("-");
    myVote.valueVotingTime = [0.50037, 2.2486];
    myVote.valueExpirationTime = [0.92037, 2.2386];
  } else {
    if ((coin1 && !coin1) || (coin2 && !coin1)) {
      myVote.coin = coin1 ? coin1 : coin2;
      myVote.valueExpirationTime = 0.50037;
      myVote.valueVotingTime = 2.2386;
    }
  }

  return (
    <CoinsContext.Provider value={{ coins } as CoinContextProps}>
      <CPVotedCard vote={myVote} id={vote.id} />
    </CoinsContext.Provider>
  );
};

export default {
  title: "Components/Profile",
  component: MyVotedCard,
} as ComponentMeta<typeof MyVotedCard>;

const Template: ComponentStory<typeof MyVotedCard> = ({ coin1, coin2 }) => (
  <MyVotedCard coin1={coin1} coin2={coin2} />
);

export const VotedCard = Template.bind({});

VotedCard.args = {
  coin1: "BTC",
  coin2: "ETH",
};
