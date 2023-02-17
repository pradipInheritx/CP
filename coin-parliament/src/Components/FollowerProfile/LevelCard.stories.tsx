import React from "react";
import { default as CPLevelCard } from "./LevelCard";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Colors } from "../../common/models/UserType";

export default {
  title: "Components/Profile",
  component: CPLevelCard,
} as ComponentMeta<typeof CPLevelCard>;

const Template: ComponentStory<typeof CPLevelCard> = (args) => (
  <CPLevelCard {...args} />
);

export const LevelCard = Template.bind({});

LevelCard.args = {
  userInfo: {
    country: "",
    lastName: "",
    leader: [
      "BtusY7OfwS2yfygnSqiNNNH6PSPe",
      "7OGmkBLvmz2pxtjXy1oaBDhO6f3z",
      "ybfgz1BXuR5AmYCKcXzAZSnk3vYv",
    ],
    address: "",
    subscribers: [],
    displayName: "subject thin",
    mfa: false,
    token:
      "cWHlYVrY35Q8J23H7p59fW:APA91bFYQlJyctdJHjVfeY_9FpDDzw4-8Knnl64lCumsBDcX6FoFCFpkam4QJwlV24Nz-syGE7_YmhHoqOVySCljYmHZbcFUMwmlAR5wl0qs_eTWRbRmTCFK1VpVro4JNXaTNVwcVhPT",
    firstName: "",
    children: [],
    phone: undefined,
    lang: "english",
    email: "avi111@gmail.com",
    status: {
      color: Colors.SILVER,
      givenCPM: 1,
      index: 0,
      weight: 1,
      name: "Member",
      share: 50,
    },
    voteStatistics: {
      score: 53,
      total: 62,
      rank: 0,
      commission: 0,
      successful: 50,
      pax: 53,
    },
    favorites: ["ADA-SOL"],
    avatar: "Hodler",
  },
  userTypes: [
    {
      color: Colors.SILVER,
      givenCPM: 1,
      index: 0,
      weight: 1,
      name: "Member",
      share: 50,
    },
    {
      color: Colors.SILVER,
      givenCPM: 2,
      index: 1,
      weight: 2,
      name: "Speaker",
      share: 20,
    },
    {
      color: Colors.GOLD,
      givenCPM: 3,
      index: 2,
      weight: 3,
      name: "Council",
      share: 15,
    },
    {
      color: Colors.GOLD,
      givenCPM: 4,
      index: 3,
      weight: 4,
      name: "Ambassador",
      share: 10,
    },
    {
      color: Colors.PLATINUM,
      givenCPM: 5,
      index: 4,
      weight: 5,
      name: "Minister",
      share: 5,
    },
  ],
};
