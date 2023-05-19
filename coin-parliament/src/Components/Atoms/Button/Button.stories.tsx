import React, { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Buttons } from "./Button";
import { action } from "@storybook/addon-actions";

const types = {
  Default: Buttons.Default,
  Success: Buttons.Success,
  Error: Buttons.Error,
  Primary: Buttons.Primary,
  ClickableText: Buttons.ClickableText,
};

const MyButton = ({
  disabled,
  text,
  type,
  fullWidth,
}: {
  disabled: boolean;
  text?: string;
  type?: string;
  fullWidth?: boolean;
}) => {
  const Button =
    Object.values(types)[Object.keys(types).indexOf(type || "Default")];

  return (
    <Button
      fullWidth={fullWidth}
      disabled={disabled}
      onClick={action("clicked")}
    >
      {text}
    </Button>
  );
};

export default {
  title: "Atoms/Button",
  component: MyButton,
  argTypes: {
    type: {
      options: Object.keys(types),
      control: { type: "radio" },
      defaultValue: "Default",
    },
  },
} as ComponentMeta<typeof MyButton>;

const Template: ComponentStory<typeof MyButton> = ({
  text,
  disabled,
  type,
  fullWidth,
}) => (
  <MyButton disabled={disabled} type={type} text={text} fullWidth={fullWidth} />
);

const args = {
  text: "Submit",
  disabled: false,
};

export const Default = Template.bind({});

Default.args = {
  ...args,
  type: "Default",
};

export const Primary = Template.bind({});

Primary.args = {
  ...args,
  type: "Primary",
  fullWidth: false,
};

export const FullWidth = Template.bind({});

FullWidth.args = {
  ...args,
  type: "Default",
  fullWidth: true,
};

export const Error = Template.bind({});

Error.args = {
  ...args,
  type: "Error",
};

export const Success = Template.bind({});

Success.args = {
  ...args,
  type: "Success",
};

export const ClickableText = Template.bind({});

ClickableText.args = {
  ...args,
  type: "ClickableText",
};

const MyTimeframeButton = (args: {
  text: string;
  disabled: boolean;
  checked: boolean;
  setChecked: (c: boolean) => void;
}) => {
  const { text, ...rest } = args;
  return <><button>Button</button>{/* <Buttons.TimeframeButton {...rest}>{text}</Buttons.TimeframeButton> */}</>;
};

const TemplateTimeframeButton: ComponentStory<typeof MyTimeframeButton> = (
  args
) => {
  const [checked, setChecked] = useState(false);
  return (
    <MyTimeframeButton
      {...{
        ...args,
        checked,
        setChecked: (c: boolean) => {
          setChecked(c);
        },
      }}
    />
  );
};

export const TimeframeButton = TemplateTimeframeButton.bind({});

TimeframeButton.args = {
  text: "1 hour",
  disabled: false,
};
