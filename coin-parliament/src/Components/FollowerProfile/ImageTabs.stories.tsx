import React from "react";
import { default as CPImageTabs } from "./ImageTabs";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import Votes from "../icons/votes";
import Mine from "../icons/mine";
import Share from "../icons/share";
import Following from "../icons/Following";
import Notifications from "../icons/notifications";

export default {
  title: "Components/Profile",
  component: CPImageTabs,
} as ComponentMeta<typeof CPImageTabs>;

const Template: ComponentStory<typeof CPImageTabs> = () => (
  <CPImageTabs
    {...{
      handleSelect: (eventKey: string | null) => void 0,
      tabs: [
        {
          component: <>votes</>,
          label: "votes",
          icon: <Votes />,
          eventKey: "votes",
        },
        {
          component: <>mining</>,
          label: "mining",
          icon: <Mine />,
          eventKey: "mining",
        },
        {
          component: <>pool mining</>,
          label: "pool mining",
          icon: <Share />,
          eventKey: "pool mining",
        },
        {
          component: <>followers</>,
          label: "followers",
          icon: <Following />,
          eventKey: "followers",
        },
        {
          component: <>notifications</>,
          label: "notifications",
          icon: <Notifications />,
          eventKey: "notifications",
        },
      ],
    }}
  />
);

export const ImageTabs = Template.bind({});

ImageTabs.args = {};
