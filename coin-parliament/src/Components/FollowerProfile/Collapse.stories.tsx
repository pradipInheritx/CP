import React from "react";
import { default as CPCollapse } from "./Collapse";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "Components/Profile",
  component: CPCollapse,
} as ComponentMeta<typeof CPCollapse>;

const Template: ComponentStory<typeof CPCollapse> = (args) => (
  <CPCollapse {...{ title: args.title }}>
    <>something</>
  </CPCollapse>
);

export const Collapse = Template.bind({});

Collapse.args = {
  title: "VIEW PAX HISTORY",
};
