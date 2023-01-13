import React, {useState} from "react";
import {default as CPCarousel} from "./Carousel";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {allCoins, coins, totals, user as testUser, userInfo as testUserInfo} from "../Coins/testData";
import Card from "../Coins/Card";
import CoinsContext, {CoinContextProps} from "../../Contexts/CoinsContext";
import UserContext, {UserContextProps} from "../../Contexts/User";
import {action} from "@storybook/addon-actions";

export default {
  title: "Components/Carousel",
  component: CPCarousel,
} as ComponentMeta<typeof CPCarousel>;

const Template: ComponentStory<typeof CPCarousel> = () => {
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
        <CPCarousel>{
          Object.keys(coins).map((key, i) => {
            const {symbol} = coins[key];
            return (
              <Card key={key}
                    favorite={userInfo.favorites.includes(symbol)}
                    setFavorite={action("favorite")}
                    symbol={symbol}
                    coins={coins}
                    totals={totals}
                    onClick={action("click")}
              />
            );
          })
        }</CPCarousel>
      </UserContext.Provider>
    </CoinsContext.Provider>
  );
};

export const Carousel = Template.bind({});

Carousel.args = {};
