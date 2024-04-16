import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import InputField from "./InputField";

export default {
  title: "Atoms/Input",
  component: InputField,
} as ComponentMeta<typeof InputField>;

const Template: ComponentStory<typeof InputField> = (args) => (
  <InputField {...args} />
);

export const Input = Template.bind({});

Input.args = {
  type: "text",
  // placeholder: "Email",
  name: "email",
  required: true,
};
