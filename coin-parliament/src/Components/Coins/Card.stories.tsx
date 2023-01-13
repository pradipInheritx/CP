import React, { useState } from "react";
import { default as CPCard } from "./Card";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { allCoins, coins, totals } from "../Coins/testData";
import { action } from "@storybook/addon-actions";

export default {
  title: "Components/Coins/Card",
  component: CPCard,
} as ComponentMeta<typeof CPCard>;

const Template: ComponentStory<typeof CPCard> = (args) => {
  const [favorite, setFavorite] = useState(false);
  return (
    <CPCard
      {...{
        ...args,
        favorite,
        setFavorite,
        coins,
        allCoins,
        totals,
        onClick: () => action("clicked")("should be redirected to coin page"),
      }}
    />
  );
};

export const Card = Template.bind({});

Card.args = {
  symbol: "BTC",
  single: false,
};
