import React, { useState } from "react";
import { default as CPStatusNav } from "./StatusNav";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { userTypes } from "../Coins/testData";

export default {
  title: "Components/Users",
  component: CPStatusNav,
} as ComponentMeta<typeof CPStatusNav>;

const Template: ComponentStory<typeof CPStatusNav> = () => {
  const [chosen, setChosen] = useState<string | undefined>();
  return <CPStatusNav {...{ userTypes, chosen, setChosen }} />;
};

export const StatusNav = Template.bind({});

StatusNav.args = {};
