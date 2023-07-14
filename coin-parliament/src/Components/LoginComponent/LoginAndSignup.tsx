/** @format */

import React, { FormEvent, useContext, useState } from "react";
import "./Login.css";
import { Stack } from "react-bootstrap";
import UserContext from "../../Contexts/User";
import { LoginModes, SignupPayload } from "../../common/models/Login";
import { useTranslation } from "../../common/models/Dictionary";
import AppContext from "../../Contexts/AppContext";
import Styles from "./styles";
import Login from "./Login";
import Signup from "./Signup";
import { User as AuthUser } from "@firebase/auth";
import { AuthProvider } from "firebase/auth";
import { Callback } from "../../common/models/utils";
import { texts } from "./texts";
import { ToastContent, ToastOptions } from "react-toastify/dist/types";
import { ToastType } from "../../Contexts/Notification";
import { useLocation } from "react-router-dom";
import Refer from "../../Pages/Refer";
import ForgetPassword from "./ForgetPassword";

const title = {
  [LoginModes.LOGIN]: texts.login,
  [LoginModes.SIGNUP]: texts.signUp,
};

export type LoginAndSignupProps = {
  authProvider: (
    setUser: (user: AuthUser) => void,
    provider: AuthProvider,
    showToast: (
      content: ToastContent,
      type?: ToastType,
      options?: ToastOptions | undefined
    ) => void
  ) => Promise<void>;
  loginAction: (
    e: FormEvent<HTMLFormElement>,
    callback: Callback<AuthUser>
  ) => Promise<void>;
  signupAction: (
    payload: SignupPayload,
    callback: Callback<AuthUser>
  ) => Promise<void>;
};

const LoginAndSignup = ({
  authProvider,
  loginAction,
  signupAction,
}: LoginAndSignupProps) => {
  const translate = useTranslation();
  const location = useLocation();
  const search = location.search;
  const { setUser } = useContext(UserContext);
  const { signup, setSignup } = useContext(AppContext);
  const [forgetPassword, setForgetPassword] = useState(false);
  const mode = signup ? LoginModes.SIGNUP : LoginModes.LOGIN;
  const refer = new URLSearchParams(search).get("refer");

  return (
    <Stack
      gap={2}
      className=' justify-content-center border'
      style={{ height: "100vh", background: "var(--light-purple)" }}
    >
      <div className='container-center-horizontal'
      >
        <div className='login-signin screen'>
          {!forgetPassword ? (
            <Styles.Title>{translate(title[mode])}</Styles.Title>
          ) : (
            <Styles.Title>{translate("Forget Password".toUpperCase())}</Styles.Title>
          )}
          {mode === LoginModes.LOGIN && !forgetPassword && (
            <Login
              setForgetPassword={setForgetPassword}
              setUser={setUser}
              setSignup={setSignup}
              authProvider={authProvider}
              login={loginAction}
            />
          )}
          {mode === LoginModes.LOGIN && forgetPassword && (
            <ForgetPassword
              setForgetPassword={setForgetPassword}
              setUser={setUser}
              setSignup={setSignup}
              authProvider={authProvider}
              login={loginAction}
            />
          )}
          {mode === LoginModes.SIGNUP && (
            <>
              {/* {refer && (<Refer />)} */}
              {
                <Signup
                  setUser={setUser}
                  setSignup={setSignup}
                  signup={signupAction}
                  authProvider={authProvider}
                />
              }
            </>
          )}
        </div>
      </div>
    </Stack>
  );
};

export default LoginAndSignup;
