import React from "react";
import {default as CPUpgrade} from "./Upgrade";
import {ComponentMeta, ComponentStory} from "@storybook/react";

export default {
  title: "Components/Profile",
  component: CPUpgrade,
} as ComponentMeta<typeof CPUpgrade>;

const Template: ComponentStory<typeof CPUpgrade> = () => (
  <CPUpgrade/>
);

export const Upgrade = Template.bind({});

Upgrade.args = {};
