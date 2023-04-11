import React from "react";
import { default as CPInfo } from "./Info";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "Components/Profile",
  component: CPInfo,
} as ComponentMeta<typeof CPInfo>;

const Template: ComponentStory<typeof CPInfo> = () => (
  <CPInfo {...{ friends: 20, cpm: 225 }} />
);

export const Info = Template.bind({});

Info.args = {};
