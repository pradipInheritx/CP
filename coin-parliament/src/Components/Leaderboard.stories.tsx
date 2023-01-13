import React, {useState} from "react";
import {default as CPLeaderboard} from "./Leaderboard";
import {ComponentMeta, ComponentStory} from "@storybook/react";
import {leaders as leaders, userInfo as userInfo1} from "./Coins/testData";
import {remove, union} from "lodash";

export default {
  title: "Components/Users",
  component: CPLeaderboard,
} as ComponentMeta<typeof CPLeaderboard>;

const Template: ComponentStory<typeof CPLeaderboard> = (args) => {
  const [userInfo, setUserInfo] = useState(userInfo1);

  const setChecked = (userId: string, check: boolean) => {
    const newUserInfo = {...(userInfo || {})};
    const currentLeaders = newUserInfo.leader || [];
    if (check) {
      newUserInfo.leader = union(currentLeaders, [userId]);
    } else {
      newUserInfo.leader = remove(currentLeaders, userId);
    }

    setUserInfo(newUserInfo);
  };
  return <CPLeaderboard {...{userInfo, leaders, setChecked, expanded: args.expanded}} />;
};

export const Leaderboard = Template.bind({});

Leaderboard.args = {
  expanded: true,
};
