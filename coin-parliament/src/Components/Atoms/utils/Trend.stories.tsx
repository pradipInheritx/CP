import React from "react";
import { default as CPTrend } from "./Trend";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "Atoms",
  component: CPTrend,
} as ComponentMeta<typeof CPTrend>;

const Template: ComponentStory<typeof CPTrend> = (args) => (
  <CPTrend {...args} />
);

export const Trend = Template.bind({});

Trend.args = {
  num: 0,
};
