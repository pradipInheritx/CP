import React, { useContext } from "react";
import { default as CPFirstTimeLogin } from "./FirstTimeLogin";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import "./Login.css";
import { action } from "@storybook/addon-actions";
import { toast, ToastContainer } from "react-toastify";
import { generateUsername } from "../../common/utils/strings";
import NotificationContext, { ToastType } from "../../Contexts/Notification";

const SimulateFirstTimeLogin = ({ fail }: { fail: boolean }) => {
  const { showToast } = useContext(NotificationContext);
  return (
    <>
      <CPFirstTimeLogin
      setFirstTimeAvatarSelection=''
        saveUsername={async () => {
          if (fail) {
            showToast("failed", ToastType.ERROR);
          } else {
            action("saveUsername")("saved");
            showToast("success");
          }
        }}
        generate={generateUsername}
      />
      <ToastContainer />
    </>
  );
};

export default {
  title: "Pages",
  component: SimulateFirstTimeLogin,
} as ComponentMeta<typeof SimulateFirstTimeLogin>;

const Template: ComponentStory<typeof SimulateFirstTimeLogin> = ({ fail }) => {
  return <SimulateFirstTimeLogin {...{ fail }} />;
};

export const FirstTimeLogin = Template.bind({});

FirstTimeLogin.args = {
  fail: false,
};
