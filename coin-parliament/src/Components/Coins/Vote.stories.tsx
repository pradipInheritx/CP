import React, { useState } from "react";
import { default as CPVote } from "./Vote";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { colors } from "../VoteForm";
import Bear from "../icons/Bear";
import Bull from "../icons/Bull";

export default {
  title: "Components/Coins",
  component: CPVote,
} as ComponentMeta<typeof CPVote>;

const Template: ComponentStory<typeof CPVote> = () => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<number>();
  const [selectedOption, setSelectedOption] = useState<number>();
  return (
    <CPVote
      {...{
        selectedTimeFrame,
        setSelectedTimeFrame,
        selectedOption,
        setSelectedOption,
      }}
      width={124 * 2 + 18 + 30}
      options={[
        {
          icon: <Bear color={selectedOption === 0 ? colors[1] : colors[0]} />,
          buttonProps: {
            onClick: () => {
              action("bear")();
            },
            children: undefined,
          },
        },
        {
          icon: <Bull color={selectedOption === 1 ? colors[1] : colors[0]} />,
          buttonProps: {
            onClick: () => {
              action("bull")();
            },
            children: undefined,
          },
        },
      ]}
    />
  );
};

export const Vote = Template.bind({});

Vote.args = {};
