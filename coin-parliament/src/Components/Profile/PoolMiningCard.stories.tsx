import React from "react";
import { default as CPPoolMiningCard } from "./PoolMiningCard";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { leader } from "../Coins/testData";

export default {
  title: "Components/Profile",
  component: CPPoolMiningCard,
} as ComponentMeta<typeof CPPoolMiningCard>;

const Template: ComponentStory<typeof CPPoolMiningCard> = () => (
  <CPPoolMiningCard user={leader} />
);

export const PoolMiningCard = Template.bind({});

PoolMiningCard.args = {};
