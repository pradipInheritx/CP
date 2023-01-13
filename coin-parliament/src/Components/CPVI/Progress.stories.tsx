import React from "react";
import { default as CPProgress } from "./Progress";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { totals } from "../Pairs/testData";

export default {
  title: "Components/CPVI",
  component: CPProgress,
} as ComponentMeta<typeof CPProgress>;

const Template: ComponentStory<typeof CPProgress> = ({ symbol1, symbol2 }) => (
  <CPProgress {...{ totals, symbol1, symbol2 }} />
);

export const Progress = Template.bind({});

Progress.args = {
  symbol1: "BTC",
  symbol2: "ETH",
};
