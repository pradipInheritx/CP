import React, { useState } from "react";
import { default as CPIcon, Heart } from "./Icon";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "Atoms/Checkbox",
  component: CPIcon,
} as ComponentMeta<typeof CPIcon>;

const Template: ComponentStory<typeof CPIcon> = ({}) => {
  const [checked, setChecked] = useState(false);
  return (
    <Heart
      {...{
        checked,
        setChecked,
      }}
    />
  );
};

export const Icon = Template.bind({});
