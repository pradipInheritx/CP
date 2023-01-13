import React from "react";
import { default as CPLogo, Size } from "./Logo";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "Atoms/Logo",
  component: CPLogo,
  argTypes: {
    size: {
      options: ["small", "medium", "large"],
      control: { type: "radio" },
      defaultValue: "small",
    },
  },
} as ComponentMeta<typeof CPLogo>;

const sizes = {
  xxsmall: Size.XXSMALL,
  xsmall: Size.XSMALL,
  small: Size.SMALL,
  medium: Size.MEDIUM,
  large: Size.LARGE,
};

const Template: ComponentStory<typeof CPLogo> = ({ size }) => {
  return <CPLogo {...{ size: sizes[size] }} />;
};

export const Logo = Template.bind({});

Logo.args = {};
