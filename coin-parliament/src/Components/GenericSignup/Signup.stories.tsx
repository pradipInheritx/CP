import React, { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { default as CPSignup } from "./Signup";
import { Stack } from "react-bootstrap";
import { action } from "@storybook/addon-actions";
import "./Login.css";
import { validateSignup } from "../../common/models/Login";
import AppContext, { AppContextProps } from "../../Contexts/AppContext";

export default {
  title: "Components/Login",
  component: CPSignup,
} as ComponentMeta<typeof CPSignup>;

const Template: ComponentStory<typeof CPSignup> = ({ ...args }) => {
  return (
    <Stack
      gap={2}
      className="col-md-5 mx-auto justify-content-center"
      style={{ height: "100vh" }}
    >
      <div className="container-center-horizontal">
        <div className="login-signin screen">
          <CPSignup
          authProvider={async () => action("authProvider")("authenticated")}
            setUser={() => action("authProvider")("authenticated")}
            setSignup={action("setSignUp")}
            signup={async (payload) => {
              try {
                validateSignup(payload);
                action("loginRegular")("authenticated");
              } catch (e) {
                alert((e as Error).message);
              }
            }}
          />
        </div>
      </div>
    </Stack>
  );
};

export const Signup = Template.bind({});
