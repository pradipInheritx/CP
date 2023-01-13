import React, { useState } from "react";
import { default as CPSelectTimeframes } from "./SelectTimeframes";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { TimeFrame } from "../../common/models/Vote";
import { timeframes } from "./testData";

export default {
  title: "Components/Coins",
  component: CPSelectTimeframes,
} as ComponentMeta<typeof CPSelectTimeframes>;

const Template: ComponentStory<typeof CPSelectTimeframes> = () => {
  const [selected, setSelected] = useState<number>();
  const selectTimeframe = (timeframe: TimeFrame) => {
    setSelected(timeframe.index);
  };

  return (
    <>
      <CPSelectTimeframes {...{ timeframes, selectTimeframe, selected }} />
      {timeframes.length <= 1 && (
        <span>
          It's ok, you see nothing because there are no timeframes or just one
          timeframe
        </span>
      )}
    </>
  );
};

export const SelectTimeframes = Template.bind({});

SelectTimeframes.args = {};
