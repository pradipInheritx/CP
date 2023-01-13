import React, { useMemo, useState } from "react";
import { default as CPCarousel } from "./Carousel";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import {
  allPairs,
  coins,
  totals,
  user as testUser,
  userInfo as testUserInfo,
} from "../Coins/testData";
import { User } from "firebase/auth";
import CoinsContext, { CoinContextProps } from "../../Contexts/CoinsContext";
import UserContext, { UserContextProps } from "../../Contexts/User";
import { union } from "lodash";
import { PairsRow } from "../../common/models/PairTable";

export default {
  title: "Components/Pairs/Carousel",
  component: CPCarousel,
} as ComponentMeta<typeof CPCarousel>;

const Template: ComponentStory<typeof CPCarousel> = (args) => {
  const [userInfo, setUserInfo] = useState(testUserInfo);
  const [index, setIndex] = useState(0);

  const pairs = useMemo(
    () =>
      allPairs
        .map((p) => p.map((c) => coins[c]))
        .filter((p) => p.every((c) => c)),
    [allPairs, coins]
  );

  const { id, cols, gap, offset, expanded } = args;
  return (
    <CoinsContext.Provider
      value={
        {
          coins,
          allPairs,
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
            cols,
            gap,
            pairs,
            offset,
            user: testUser as unknown as User,
            userInfo,
            data: allPairs.map(([coin1, coin2]) => {
              return {
                coin1,
                coin2,
              } as PairsRow;
            }),
            expanded,
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
  offset: 0,
  expanded: false,
};
