import React, { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { default as CPCheckbox } from "./Checkbox";

export default {
  title: "Atoms/Checkbox",
  component: CPCheckbox,
} as ComponentMeta<typeof CPCheckbox>;

const Template: ComponentStory<typeof CPCheckbox> = (args) => {
  const [check, setCheck] = useState(false);
  const { children, name } = args;
  return (
    <>
      <CPCheckbox checked={check} name="c0" onClick={() => setCheck(!check)}>
        {children || name || "please check this"}
      </CPCheckbox>
      <CPCheckbox checked={false} name="c1">
        readonly unchecked
      </CPCheckbox>
      <CPCheckbox checked={true} name="c2">
        readonly checked
      </CPCheckbox>
      <CPCheckbox checked={false} name="c3" disabled={true}>
        readonly disabled unchecked
      </CPCheckbox>
      <CPCheckbox checked={true} name="c4" disabled={true}>
        readonly disabled checked
      </CPCheckbox>
    </>
  );
};

export const Checkbox = Template.bind({});
