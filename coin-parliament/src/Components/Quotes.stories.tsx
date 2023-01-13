import React from "react";
import {default as CPQuotes} from "./Quotes";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {quotes} from "../common/consts/contents";

export default {
  title: "Components/Home",
  component: CPQuotes,
} as ComponentMeta<typeof CPQuotes>;

const Template: ComponentStory<typeof CPQuotes> = () => (
  <CPQuotes {...{quotes}}/>
);

export const Quotes = Template.bind({});

Quotes.args = {};
