import React, { useMemo, useState } from "react";
import { default as CPVote } from "../Coins/Vote";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { colors } from "../VoteForm";
import Bear from "../icons/Bear";
import Bull from "../icons/Bull";
import { Row } from "react-bootstrap";
import { VS } from "./PairsForm";

export default {
  title: "Components/Pairs",
  component: CPVote,
} as ComponentMeta<typeof CPVote>;

const Template: ComponentStory<typeof CPVote> = () => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<number>();
  const [selectedOption, setSelectedOption] = useState<number>();

  const disabled = useMemo(
    () => selectedTimeFrame === undefined,
    [selectedTimeFrame]
  );

  return (
    <CPVote
      {...{
        disabled,
        selectedTimeFrame,
        setSelectedTimeFrame,
        selectedOption,
        setSelectedOption,
      }}
      width={124 * 2 + 18 + 30 + 40}
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
    >
      <VS>
        <Row className="justify-content-center align-items-center h-100">
          <img
            src="https://coin-parliament.com/svg/vs.svg"
            alt="vs"
            style={{ width: "100%", opacity: disabled ? 0.7 : 1 }}
          />
        </Row>
      </VS>
    </CPVote>
  );
};

export const Vote = Template.bind({});

Vote.args = {};
