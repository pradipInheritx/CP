import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import LoginWith from "./LoginWith";
import { LoginProviders } from "../../common/models/Login";

export default {
  title: "Atoms/Button",
  component: LoginWith,
  argTypes: {
    provider: {
      options: Object.values(LoginProviders),
      control: { type: "radio" },
      defaultValue: LoginProviders.GOOGLE,
    },
    argTypes: { onClick: { action: "clicked" } },
  },
} as ComponentMeta<typeof LoginWith>;

const Template: ComponentStory<typeof LoginWith> = ({ ...args }) => (
  <LoginWith {...args} />
);

export const Login = Template.bind({});
