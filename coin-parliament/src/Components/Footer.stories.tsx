import React from "react";
import {default as CPFooter} from "./Footer";
import {ComponentMeta, ComponentStory} from "@storybook/react";

export default {
  title: "Pages/Footer",
  component: CPFooter,
} as ComponentMeta<typeof CPFooter>;

const Template: ComponentStory<typeof CPFooter> = () => (
  <CPFooter/>
);

export const Footer = Template.bind({});

Footer.args = {};
