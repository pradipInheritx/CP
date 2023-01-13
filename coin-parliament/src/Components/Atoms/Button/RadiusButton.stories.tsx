import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import { Buttons } from "./Button";
import { action } from "@storybook/addon-actions";

const { RadiusTopRight, RadiusBottomRight, RadiusTopLeft, RadiusBottomLeft } =
  Buttons;

const directions = {
  RadiusTopRight,
  RadiusBottomRight,
  RadiusTopLeft,
  RadiusBottomLeft,
};

const RadiusButton = ({
  disabled,
  text,
  direction,
}: {
  disabled: boolean;
  text: string;
  direction: string;
}) => {
  const Button =
    Object.values(directions)[Object.keys(directions).indexOf(direction)];

  return (
    <Button disabled={disabled} onClick={action("clicked")}>
      {text}
    </Button>
  );
};

const args = {
  text: "Submit",
  disabled: false,
};

export default {
  title: "Atoms/Button",
  component: RadiusButton,
  argTypes: {
    direction: {
      options: Object.keys(directions),
      control: { type: "radio" },
      defaultValue: Object.keys(directions)[0],
    },
  },
} as ComponentMeta<typeof RadiusButton>;

const Template: ComponentStory<typeof RadiusButton> = ({
  text,
  disabled,
  direction,
}) => <RadiusButton disabled={disabled} direction={direction} text={text} />;

export const Radius = Template.bind({});

Radius.args = {
  ...args,
  direction: Object.keys(directions)[0],
};
