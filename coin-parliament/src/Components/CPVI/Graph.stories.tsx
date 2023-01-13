import React from "react";
import { default as CPGraph } from "./Graph";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { cpviData } from "../Pairs/testData";
import { UTCTimestamp } from "lightweight-charts";
import { totals } from "../Coins/testData";

export default {
  title: "Components/CPVI",
  component: CPGraph,
} as ComponentMeta<typeof CPGraph>;

const Template: ComponentStory<typeof CPGraph> = ({ width }) => (
  <CPGraph
    {...{
      width,
      totals,
      symbol: "HNT",
      data: cpviData
        .map((d) => {
          return {
            time: (new Date(Number(d.time)).getTime() / 1000) as UTCTimestamp,
            value: d.value,
          };
        })
        .sort((a, b) => a.time - b.time),
    }}
  />
);

export const Graph = Template.bind({});

Graph.args = {
  width: 294,
};
