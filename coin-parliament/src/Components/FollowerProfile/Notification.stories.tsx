import React from "react";
import {default as CPNotification} from "./Notification";
import {ComponentMeta, ComponentStory} from "@storybook/react";

export default {
  title: "Components/Profile",
  component: CPNotification,
} as ComponentMeta<typeof CPNotification>;

const Template: ComponentStory<typeof CPNotification> = (args) => (
  <CPNotification {...args}/>
);

export const Notification = Template.bind({});

Notification.args = {
  date: new Date(),
  title: "New Message",
  body: "BTC was UP after your vote Your return is 10 CPM"
};
