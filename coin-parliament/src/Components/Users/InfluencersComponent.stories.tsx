import React, { useState } from "react";
import { default as CPInfluencersComponent } from "./InfluencersComponent";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import {
  leaders,
  userInfo as userInfo1,
  userTypesProps,
} from "../Coins/testData";
import { remove, union } from "lodash";

export default {
  title: "Components/Users",
  component: CPInfluencersComponent,
} as ComponentMeta<typeof CPInfluencersComponent>;

const Template: ComponentStory<typeof CPInfluencersComponent> = () => {
  const [chosen, setChosen] = useState<string | undefined>();
  const [userInfo, setUserInfo] = useState(userInfo1);

  const setChecked = (userId: string, check: boolean) => {
    const newUserInfo = { ...(userInfo || {}) };
    const currentLeaders = newUserInfo.leader || [];
    if (check) {
      newUserInfo.leader = union(currentLeaders, [userId]);
    } else {
      newUserInfo.leader = remove(currentLeaders, userId);
    }

    setUserInfo(newUserInfo);
  };

  return (
    <CPInfluencersComponent
      {...{
        userTypes: userTypesProps,
        chosen,
        setChosen,
        leaders,
        userInfo,
        setChecked,
      }}
    />
  );
};

export const InfluencersComponent = Template.bind({});

InfluencersComponent.args = {};
