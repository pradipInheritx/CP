import { Form } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { Callback } from "../../common/models/utils";
import { SignupPayload } from "../../common/models/Login";
import InputField from "../Atoms/Input/InputField";
import { texts, urls } from "./texts";
import Checkbox from "../Atoms/Checkbox/Checkbox";
import { useTranslation } from "../../common/models/Dictionary";
import { Buttons } from "../Atoms/Button/Button";
import { capitalize } from "lodash";
import { User as AuthUser } from "@firebase/auth";
import { Link } from "react-router-dom";
import { validatePassword } from "Components/Profile/utils";
import { passwordValidation } from "Components/Profile/utils";
import { showToast } from "App";
import { ToastType } from "Contexts/Notification";
import ReCAPTCHA from "react-google-recaptcha";

const SignupForm = ({
  emailValue,
  callback,
  signup,
  signupLoading,
  setSignupLoading,
}: {
  emailValue: string;
  callback: Callback<User>;
  signupLoading?: any;
  setSignupLoading?: (k: boolean) => void;
  signup: (
    payload: SignupPayload,
    callback: Callback<AuthUser>
  ) => Promise<boolean>;

}) => {
  const translate = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [recaptcha, setrecaptcha] = useState(false)

  const [agree, setAgree] = useState(false);
  useEffect(() => {
    setEmail(emailValue)
  }, [])
  const strings = {
    email: capitalize(translate(texts.email)),
    confirmPassword: capitalize(translate(texts.confirmPassword.toUpperCase())),
    password: capitalize(translate(texts.password.toUpperCase())),
    continue: capitalize(translate(texts.continue.toUpperCase())),
    agree: capitalize(translate(texts.agree.toUpperCase())),
  };

  const handleReCaptcha = () => {
    console.log("change")
    setrecaptcha(true)
  }
  
  return (
    <Form
      onSubmit={async (e) => {
        e.preventDefault();
        const validatePassword = passwordValidation(password, password2);
        if (validatePassword !== true) {
          showToast(validatePassword, ToastType.ERROR);
          return;
        }
        if (signupLoading) return
        // @ts-ignore
        setSignupLoading(true)
        await signup(
          {
            email,
            password,
            passwordConfirm: password2,
            agree,
          },
          callback
        );
      }}
      className="w-100"
    >
      <Form.Group className="mb-3" controlId="email">
        <InputField
          style={{ color: 'var(--blue-violet)', boxShadow: window.screen.width > 979 ? '0px 3px 6px #00000029' : '' }}
          placeholder={translate(strings.email)}
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="password">
        <InputField
          style={{ color: 'var(--blue-violet)', boxShadow: window.screen.width > 979 ? '0px 3px 6px #00000029' : '' }}
          placeholder={translate(strings.password)}
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="passwordConfirm">
        <InputField
          style={{ color: 'var(--blue-violet)', boxShadow: window.screen.width > 979 ? '0px 3px 6px #00000029' : '' }}
          placeholder={translate(strings.confirmPassword)}
          type="password"
          name="passwordConfirm"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
        />
      </Form.Group>

      <div style={{marginTop:"15px"}}>
      <ReCAPTCHA
        sitekey={process.env.REACT_APP_RECAPTCHA_KEY || ""}
        onChange={handleReCaptcha}
      />
      </div>

      <div className="mt-4 mb-3">
        <Buttons.Primary fullWidth={true} type="submit" 
        disabled={!agree}
        >
          {signupLoading ? 'Wait...' : strings.continue.toUpperCase()}
        </Buttons.Primary>
      </div>

      <Form.Group className="mb-2  text-center" controlId="agree">
        <Checkbox disabled={!recaptcha} name="agree" checked={agree} onClick={() => setAgree(!agree)} >
          <p className='mb-1'> I agree to <Link to={urls.termsConditions} style={{ color: 'var(--blue-violet)' }}>
            {translate('terms & conditions')}
          </Link>  and
          </p>
          <p><Link to={'/privacy'} style={{ color: 'var(--blue-violet)' }}>
            privacy policy
          </Link> of the site</p>
          {/* {translate(strings.agree)
            .split("{terms & conditions}")
            .map((t, i) => (
              <React.Fragment key={i}>
                {t.toUpperCase()}{" "}
                {!i && (
                  <Link to={urls.termsConditions} style={{color: 'var(--blue-violet)'}}>
                    {translate(texts.termsConditions.toUpperCase())}
                  </Link>
                )}
              </React.Fragment>
            ))} */}
        </Checkbox>
      </Form.Group>
    </Form>
  );
};

export default SignupForm;
