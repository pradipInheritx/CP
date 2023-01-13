import React from "react";
import { default as CPTimeLeft } from "./TimeLeft";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "Components/CPVI",
  component: CPTimeLeft,
} as ComponentMeta<typeof CPTimeLeft>;

const Template: ComponentStory<typeof CPTimeLeft> = (args) => {
  let { expirationTime } = args;
  const now = new Date().getTime();
  if (!expirationTime) {
    expirationTime = now + 24 * 60 * 60 * 1000;
  }
  return <CPTimeLeft {...{ expirationTime }} />;
};

export const TimeLeft = Template.bind({});

TimeLeft.args = {};
