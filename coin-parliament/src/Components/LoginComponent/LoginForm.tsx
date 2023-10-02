import { Form } from "react-bootstrap";
import React, { FormEvent } from "react";
import { User } from "firebase/auth";
import { Callback } from "../../common/models/utils";
import { useTranslation } from "../../common/models/Dictionary";
import { texts } from "./texts";
import { capitalize, upperCase } from "lodash";
import InputField from "../Atoms/Input/InputField";
import { Buttons } from "../Atoms/Button/Button";
import { User as AuthUser } from "@firebase/auth";

const LoginForm = ({
  callback,
  login,
}: {
  callback: Callback<User>;
  login: (
    e: FormEvent<HTMLFormElement>,
    callback: Callback<AuthUser>
  ) => Promise<void>;
}) => {
  const translate = useTranslation();

  const strings = {
    email: capitalize(translate(texts.email)),
    login: upperCase(translate(texts.login)),
    password: capitalize(translate(texts.password)),
  };

  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        await login(e, callback);
      }}
    >
      <Form.Group className="mb-3 w-100" controlId="login-email">
        <InputField
          style={{ color: 'var(--blue-violet)', boxShadow: window.screen.width > 979 ? '0px 3px 6px #00000029' : '' }}
          fullWidth={true}
          type="email"
          placeholder={strings.email}
          name="email"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3 w-100" controlId="login-password">
        <InputField
          fullWidth={true}
          style={{ color: 'var(--blue-violet)', boxShadow: window.screen.width > 979 ? '0px 3px 6px #00000029' : '' }}
          type="password"
          placeholder={strings.password}
          name="password"
          required
        />
      </Form.Group>
      <Buttons.Primary fullWidth={true} type="submit">
        {strings.login}
      </Buttons.Primary>
    </Form>
  );
};

export default LoginForm;
