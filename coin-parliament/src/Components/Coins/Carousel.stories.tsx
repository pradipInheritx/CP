import React, { useState } from "react";
import { default as CPCarousel } from "./Carousel";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import {
  allCoins,
  coins,
  totals,
  user as testUser,
  userInfo as testUserInfo,
} from "../Coins/testData";
import { User } from "firebase/auth";
import { BearVsBullRow } from "../../common/models/CoinTable";
import CoinsContext, { CoinContextProps } from "../../Contexts/CoinsContext";
import UserContext, { UserContextProps } from "../../Contexts/User";
import { union } from "lodash";

export default {
  title: "Components/Coins/Carousel",
  component: CPCarousel,
} as ComponentMeta<typeof CPCarousel>;

const Template: ComponentStory<typeof CPCarousel> = (args) => {
  const [userInfo, setUserInfo] = useState(testUserInfo);
  const [index, setIndex] = useState(0);

  const { id, cols, gap, numRows } = args;
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
        <CPCarousel
          {...{
            id,
            index,
            setIndex: (i: number) => {
              setIndex(i);
            },
            numRows,
            cols,
            gap,
            coins,
            totals,
            user: testUser as unknown as User,
            userInfo,
            data: allCoins.map((c) => {
              return {
                symbol: c,
              } as BearVsBullRow;
            }),
            navigate: () => void 0,
            onFavClick: (favorites: string[]) => {
              const checked = union(
                Array.from(
                  document.forms
                    .namedItem(id + "")
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
            },
          }}
        />
      </UserContext.Provider>
    </CoinsContext.Provider>
  );
};

export const Carousel = Template.bind({});

Carousel.args = {
  id: "carousel",
};
