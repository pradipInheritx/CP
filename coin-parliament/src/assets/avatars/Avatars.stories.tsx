import React from "react";
import { AvatarType, default as CPAvatars } from "./Avatars";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "Components/Profile",
  component: CPAvatars,
  argTypes: {
    type: {
      options: Object.keys(AvatarType),
      control: { type: "radio" },
      defaultValue: Object.keys(AvatarType)[0],
    },
  },
} as ComponentMeta<typeof CPAvatars>;

const Template: ComponentStory<typeof CPAvatars> = (props) => (
  <CPAvatars {...props} />
);

export const Avatars = Template.bind({});

Avatars.args = {};
