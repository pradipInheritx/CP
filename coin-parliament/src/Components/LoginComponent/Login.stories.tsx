import React from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { default as CPLogin } from "./Login";
import { Stack } from "react-bootstrap";
import { action } from "@storybook/addon-actions";
import "./Login.css";

export default {
  title: "Components/Login",
  component: CPLogin,
} as ComponentMeta<typeof CPLogin>;

const Template: ComponentStory<typeof CPLogin> = ({ ...args }) => (
  <Stack
    gap={2}
    className="col-md-5 mx-auto justify-content-center"
    style={{ height: "100vh" }}
  >
    <div className="container-center-horizontal">
      <div className="login-signin screen">
        <CPLogin
          {...args}
          authProvider={async () => action("authProvider")("authenticated")}
          setUser={() => action("authProvider")("authenticated")}
          setSignup={action("setSignUp")}
          login={async () => {
            action("loginRegular")("authenticated");
          }}
        />
      </div>
    </div>
  </Stack>
);

export const Login = Template.bind({});
