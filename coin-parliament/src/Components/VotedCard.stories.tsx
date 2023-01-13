import React from "react";
import { default as CPVotedCard } from "./VotedCard";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { coins, totals } from "./Coins/testData";
import { VoteResultProps } from "../common/models/Vote";

export default {
  title: "Components/CPVI",
  component: CPVotedCard,
} as ComponentMeta<typeof CPVotedCard>;

const vote = {
  userId: "8HDeNuCpyusuG7ObjzbdPzRyVhYC",
  timeframe: {
    index: 0,
    chosen: true,
    seconds: 3600,
    name: "1 hour",
  },
  coin: "SHIB",
  direction: 0,
  status: {
    color: "2",
    givenCPM: 1,
    index: 0,
    weight: 1,
    name: "Member",
    share: "50",
  },
  valueVotingTime: 22.35,
  voteTime: 1647552577190,
  expiration: new Date().getTime() + 60 * 60 * 1000,
} as unknown as VoteResultProps;

const Template: ComponentStory<typeof CPVotedCard> = ({ symbol1, symbol2 }) => (
  <CPVotedCard
    {...{
      vote,
      coins,
      totals,
      symbol1,
      symbol2,
      voteId: "rgerger",
    }}
  />
);

export const VotedCard = Template.bind({});

VotedCard.args = {
  symbol1: "BTC",
  symbol2: "ETH",
};
