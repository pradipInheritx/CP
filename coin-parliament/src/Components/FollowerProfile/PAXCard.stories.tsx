import React from "react";
import { default as CPPAXCard } from "./PAXCard";
import { ComponentMeta, ComponentStory } from "@storybook/react";

export default {
  title: "Components/Profile",
  component: CPPAXCard,
} as ComponentMeta<typeof CPPAXCard>;

const Template: ComponentStory<typeof CPPAXCard> = (args) => (
  <CPPAXCard {...args} />
);

export const PAXCard = Template.bind({});

PAXCard.args = {
  PAX: 150,
  walletId: "sdlkksjfhkdjfhsd;sd12345678",
};
