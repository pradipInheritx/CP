import React from "react";
import { default as CPShare } from "./Share";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "Components/Profile",
  component: CPShare,
} as ComponentMeta<typeof CPShare>;

const Template: ComponentStory<typeof CPShare> = () => (
  <CPShare {...{ url: "#", text: "share & earn", shareText: "" }} />
);

export const ShareAndEarn = Template.bind({});

ShareAndEarn.args = {};
