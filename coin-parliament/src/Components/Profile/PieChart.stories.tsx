import React from "react";
import { default as CPPieChart } from "./PieChart";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "Components/Profile",
  component: CPPieChart,
} as ComponentMeta<typeof CPPieChart>;

const Template: ComponentStory<typeof CPPieChart> = (args) => (
  <CPPieChart {...args} />
);

export const PieChart = Template.bind({});

PieChart.args = {
  color: "#cc2222",
  percentage: 80,
  width: 154,
  border: 20,
  pax: 50,
};
