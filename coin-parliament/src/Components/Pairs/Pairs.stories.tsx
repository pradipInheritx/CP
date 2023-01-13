import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import CoinsContext, { CoinContextProps } from "../../Contexts/CoinsContext";
import UserContext, { UserContextProps } from "../../Contexts/User";
import {
  allCoins,
  allPairs,
  coins,
  totals,
  user as testUser,
  userInfo as testUserInfo,
} from "./testData";
import useState from "storybook-addon-state";
import { union } from "lodash";
import Pairs from "./Pairs";

export default {
  title: "Components/Pairs",
  component: Pairs,
} as ComponentMeta<typeof Pairs>;

const Template: ComponentStory<typeof Pairs> = (args) => {
  const [userInfo, setUserInfo] = useState("userInfo", testUserInfo);

  return (
    <CoinsContext.Provider
      value={
        {
          allPairs,
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
        <Pairs
          {...args}
          onFavClick={(favorites) => {
            const checked = union(
              Array.from(
                document.forms
                  .namedItem("Pairs")
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

export const PairTable = Template.bind({});

PairTable.args = {
  expanded: false,
};
