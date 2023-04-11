import React from "react";
import {default as CPMinting} from "./Minting";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {useWindowSize} from "../../hooks/useWindowSize";

export default {
  title: "Components/Profile",
  component: CPMinting,
} as ComponentMeta<typeof CPMinting>;

const Template: ComponentStory<typeof CPMinting> = (args) => {
  const {width = 0} = useWindowSize();
  return (
    <CPMinting {...{width, score: args.score || 50}} />
  );
};

export const Minting = Template.bind({});

Minting.args = {};
