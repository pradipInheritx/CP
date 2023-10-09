import React, { useContext, useState } from "react";
import SignupForm from "./SignupForm";
import { texts, urls } from "../../Components/LoginComponent/texts";
import { useTranslation } from "../../common/models/Dictionary";
import { AuthProvider, User } from "firebase/auth";
import { LoginProviders, providers, SignupPayload } from "../../common/models/Login";
import { Callback } from "../../common/models/utils";
import { User as AuthUser } from "@firebase/auth";
import NotificationContext, { ToastType } from "../../Contexts/Notification";
import styled from "styled-components";
import { PoppinsBoldBlueViolet14px, PoppinsMediumBlack12px } from "../../styledMixins";
// import LoginWith from "./LoginWith";
import { ToastContent, ToastOptions } from "react-toastify";
import { Form } from "react-bootstrap";
import InputField from "../Atoms/Input/InputField";
import { capitalize } from "lodash";
import { Buttons } from "../Atoms/Button/Button";
import Checkbox from "../Atoms/Checkbox/Checkbox";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { httpsCallable } from "firebase/functions";
import { functions } from "../../firebase";
import UserContext from "../../Contexts/User";
import AppContext from "../../Contexts/AppContext";





export type SignupProps = {
  setUser: (user?: User | undefined) => void;
  setSignup: (s: boolean) => void;
  signup: (
    payload: SignupPayload,
    callback: Callback<AuthUser>
  ) => Promise<void>;
  authProvider: (
    setUser: (user: AuthUser) => void,
    provider: AuthProvider,
    showToast: (
      content: ToastContent,
      type?: ToastType,
      options?: ToastOptions | undefined
    ) => void
  ) => Promise<void>;
};
const assign = httpsCallable(functions, "assignReferrer");
const Signup = () => {

  const translate = useTranslation();
  const { showToast } = useContext(NotificationContext);
  const { setLogin } = useContext(AppContext);
  const [signupWithProviders, setSignupWithProviders] = useState(true)
  const [email, setEmail] = useState('')
  const [agree, setAgree] = useState(true);
  const [signupLoading, setSignupLoading] = useState(false)
  const search = useLocation().search;
  const refer = new URLSearchParams(search).get("refer");
  const navigate = useNavigate();
  const strings = {
    email: capitalize(translate(texts.email)),
    confirmPassword: capitalize(translate(texts.confirmPassword.toUpperCase())),
    password: capitalize(translate(texts.password.toUpperCase())),
    continue: capitalize(translate(texts.continue.toUpperCase())),
    agree: capitalize(translate(texts.agree.toUpperCase())),
  };
  return (
    <>
      {signupWithProviders ?
        <>
          <Form
            onSubmit={async (e) => {
              e.preventDefault();
              if (agree) {

              }
              setEmail(((e.target as HTMLFormElement).elements.namedItem('email') as HTMLInputElement).value)
              setSignupWithProviders(false)
            }}
            className="w-100"
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
            <div className="my-1">
              <Buttons.Primary fullWidth={true} type="submit"  >
                {strings.continue.toUpperCase()}
              </Buttons.Primary>
            </div>
            <Form.Group className="mb-2 mt-3 text-center" controlId="agree" >
              <Checkbox name="agree" checked={agree} onClick={() => setAgree(!agree)} >
                <p className='mb-1'> I agree to <Link to={urls.termsConditions} style={{ color: 'var(--blue-violet)' }}>
                  {translate('terms & conditions')}
                </Link>  and
                </p>
                <p><Link to={'/privacy'} style={{ color: 'var(--blue-violet)' }}>
                  privacy policy
                </Link> of the site</p>
              </Checkbox>
            </Form.Group>
          </Form>
        </>
        :
        <SignupForm
          emailValue={email}
          signupLoading={signupLoading}
          setSignupLoading={setSignupLoading}
          // signup={signup}
          callback={{
            successFunc: async (params) => {
              console.log(params, "we are not get")
              // if (refer && params?.uid) await assign({ parent: refer, child: params.uid });
              // setLogin(true);
              setSignupLoading(false);
              navigate('/');
            },
            errorFunc: (e) => {
              showToast(e.message, ToastType.ERROR)
              setSignupLoading(false);
            },
          }}
        />}
    </>
  );
};

export default Signup;
