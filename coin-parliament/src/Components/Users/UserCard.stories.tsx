import React, {useState} from "react";
import {default as CPUserCard} from "./UserCard";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {leader} from "../Coins/testData";

export default {
  title: "Components/Users",
  component: CPUserCard,
} as ComponentMeta<typeof CPUserCard>;

const Template: ComponentStory<typeof CPUserCard> = (args) => {
  const {viewAllLink} = args;
  const [checked, setChecked] = useState(false);
  return <CPUserCard {...{leader, checked, setChecked, viewAllLink}} />;
};

export const UserCard = Template.bind({});

UserCard.args = {
  expanded: true,
};
