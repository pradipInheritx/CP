import React from "react";
import { default as CPAvatarsModal } from "./AvatarsModal";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";

export default {
  title: "Components/Profile",
  component: CPAvatarsModal,
} as ComponentMeta<typeof CPAvatarsModal>;

const Template: ComponentStory<typeof CPAvatarsModal> = () => (
  <CPAvatarsModal
    onSubmit={async (type) => (await action("type"))(type)}
    onClose={action("clicked")}
  />
);

export const AvatarsModal = Template.bind({});

AvatarsModal.args = {};
