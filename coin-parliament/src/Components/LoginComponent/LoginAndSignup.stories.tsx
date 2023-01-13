import React, { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { default as CPLoginAndSignup } from "./LoginAndSignup";
import { action } from "@storybook/addon-actions";
import { validateSignup } from "../../common/models/Login";
import AppContext, { AppContextProps } from "../../Contexts/AppContext";

export default {
  title: "Pages",
  component: CPLoginAndSignup,
} as ComponentMeta<typeof CPLoginAndSignup>;

const Template: ComponentStory<typeof CPLoginAndSignup> = () => {
  const [signup, setSignup] = useState(false);

  return (
    <AppContext.Provider
      value={
        {
          signup,
          setSignup,
        } as unknown as AppContextProps
      }
    >
      <CPLoginAndSignup
        authProvider={async () => action("authProvider")("authenticated")}
        loginAction={async () => {
          action("loginRegular")("authenticated");
        }}
        signupAction={async (payload) => {
          try {
            validateSignup(payload);
            action("loginRegular")("authenticated");
          } catch (e) {
            alert((e as Error).message);
          }
        }}
      />
    </AppContext.Provider>
  );
};

export const LoginAndSignup = Template.bind({});
