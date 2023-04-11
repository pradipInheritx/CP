import React from "react";
import { default as CPAvatarRadio } from "./AvatarRadio";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { AvatarType } from "../../assets/avatars/Avatars";

export default {
  title: "Components/Profile",
  component: CPAvatarRadio,
  argTypes: {
    type: {
      options: Object.keys(AvatarType),
      control: { type: "radio" },
      defaultValue: Object.keys(AvatarType)[0],
    },
  },
} as ComponentMeta<typeof CPAvatarRadio>;

const Template: ComponentStory<typeof CPAvatarRadio> = (props) => (
  <CPAvatarRadio {...props} />
);

export const AvatarRadio = Template.bind({});

AvatarRadio.args = {};
