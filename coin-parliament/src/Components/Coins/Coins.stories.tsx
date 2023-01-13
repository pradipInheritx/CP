import React, { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import CoinsContext, { CoinContextProps } from "../../Contexts/CoinsContext";
import UserContext, { UserContextProps } from "../../Contexts/User";
import {
  allCoins,
  coins,
  totals,
  user as testUser,
  userInfo as testUserInfo,
} from "./testData";
import { union } from "lodash";
import Coins from "../Coins/Coins";

export default {
  title: "Components/Coins",
  component: Coins,
} as ComponentMeta<typeof Coins>;

const Template: ComponentStory<typeof Coins> = (args) => {
  const [userInfo, setUserInfo] = useState(testUserInfo);

  return (
    <CoinsContext.Provider
      value={
        {
          coins,
          allCoins,
          totals,
        } as unknown as CoinContextProps
      }
    >
      <UserContext.Provider
        value={
          {
            user: testUser,
            userInfo,
            setUserInfo,
          } as unknown as UserContextProps
        }
      >
        <Coins
          {...args}
          onFavClick={(favorites) => {
            const checked = union(
              Array.from(
                document.forms
                  .namedItem("Coins")
                  ?.elements.namedItem("favorites") as RadioNodeList
              )

                .filter((i) => (i as HTMLInputElement).checked)
                .map((i) => (i as HTMLInputElement).value)
            );

            let favs = union(favorites, checked);

            if (favs.length === favorites.length) {
              favs = checked;
            }

            setUserInfo({ ...userInfo, favorites: favs });
          }}
        />
      </UserContext.Provider>
    </CoinsContext.Provider>
  );
};

export const CoinTable = Template.bind({});

CoinTable.args = {
  expanded: false,
};
