import React, { useState } from "react";
import { default as CPCard } from "./Card";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { coins } from "../Coins/testData";
import { action } from "@storybook/addon-actions";

export default {
  title: "Components/Pairs/Card",
  component: CPCard,
} as ComponentMeta<typeof CPCard>;

const Template: ComponentStory<typeof CPCard> = (args) => {
  const [favorite, setFavorite] = useState(false);
  const { coin1, coin2 } = args;
  return (
    <CPCard
      {...{
        ...args,
        favorite,
        setFavorite,
        coin1,
        coin2,
        onClick: () => action("clicked")("should be redirected to coin page"),
      }}
    />
  );
};

export const Card = Template.bind({});

Card.args = {
  coin1: coins.BTC,
  coin2: coins.ETH,
};
