import { LoginProviders, providers } from "../../common/models/Login";
import LoginForm from "./LoginForm";
// import { Button, ListGroup } from "react-bootstrap";
import { texts } from "./texts";
import React, { FormEvent, useContext, useEffect, useState } from "react";
import { useTranslation } from "../../common/models/Dictionary";
import { AuthProvider, PhoneAuthProvider, PhoneMultiFactorGenerator, User } from "firebase/auth";
import LoginWith from "./LoginWith";
import styled from "styled-components";
import { PoppinsBoldBlueViolet14px, PoppinsMediumBlack12px } from "../../styledMixins";
import { User as AuthUser } from "@firebase/auth";
import { Callback } from "../../common/models/utils";
import NotificationContext, { ToastType } from "../../Contexts/Notification";
import { ToastContent, ToastOptions } from "react-toastify/dist/types";
import { capitalize } from "lodash";
import { FormControl, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import AppContext from "../../Contexts/AppContext";
import { Buttons } from "../Atoms/Button/Button";
import { Link, useNavigate } from "react-router-dom";

const OR = styled.div`
  ${PoppinsMediumBlack12px};
  min-height: 19px;
  align-self: center;
  letter-spacing: 0;
  line-height: 11px;
  white-space: nowrap;
  text-transform: uppercase;
`;
const SignUp = styled.div`
margin-left:5px;
margin-right:7px;
cursor:pointer;
font-weight:600 !important;
// text-decoration:underline;
${PoppinsBoldBlueViolet14px};
`;
const ForgetPasswordText = styled.div`
margin-left:5px;
margin-right:7px;
cursor:pointer;
font-weight:500 !important;
// text-decoration:underline;
${PoppinsBoldBlueViolet14px};
`;
const DontHaveAccountText = styled.div`
 color:black;
`;
const H1 = styled.div`
margin-bottom:10px;
background: var(--color-160133) 0 0% no-repeat padding-box;
border: 2px solid var(--color-6352e8);
box-shadow: 0 3px 6px #00000029;
border-radius: 0 20px 20px 20px;
opacity: 1;
font: var(--font-style-normal) normal var(--font-weight-normal) var(--font-size-11)/var(--line-spacing-13) var(--font-family-poppins);
letter-spacing: var(--character-spacing-0);
color: var(--color-ffffff);
text-align: left;
}
`
export type LoginProps = {
  setForgetPassword: (s: boolean) => void;
  setUser: (user?: User | undefined) => void;
  setSignup: (s: boolean) => void;
  authProvider: (
    setUser: (user: AuthUser) => void,
    provider: AuthProvider,
    showToast: (
      content: ToastContent,
      type?: ToastType,
      options?: ToastOptions | undefined
    ) => void
  ) => Promise<void>;
  login: (
    e: FormEvent<HTMLFormElement>,
    callback: Callback<AuthUser>
  ) => Promise<void>;
};

const Login = ({ setForgetPassword, setUser, setSignup, authProvider, login }: LoginProps) => {
  const translate = useTranslation();
  const { showToast } = useContext(NotificationContext);
  const { setLoginRedirectMessage, loginRedirectMessage, setLoader } = useContext(AppContext);
  const [smsVerification, setSmsVerification] = useState('')
  const [verificationCode, setVerificationCode] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    return () => {
      setLoginRedirectMessage('')
    }
  }, [])
  const handleClose = () => {
    setSmsVerification('')

  };
  return (
    <>
      {loginRedirectMessage && <H1 className='.tooltip-inner'>You need to login to {loginRedirectMessage}.</H1>}
      {Object.values(LoginProviders).map((provider, i) => {
        return (
          <div key={i} className="mb-2 w-100" id='login'>
            <LoginWith
              provider={provider}
              onClick={() => {
                if (setLoader) {
                  setLoader(true);
                }
                // @ts-ignore
                authProvider(setUser, providers[provider], showToast, setSmsVerification, () => {
                  if (setLoader) {
                    setLoader(false);
                  }
                })
              }}
            />
          </div>
        );
      })}
      <div className="my-3 align-self-center">
        <OR className="mx-auto">{translate("or")}</OR>
      </div>
      <div className="mb-3 w-100">
        <LoginForm
          callback={{
            successFunc: (params) => {
              setUser(params);
              navigate('/');
            },
            errorFunc: (e) => showToast(e.message, ToastType.ERROR),
          }}
          login={login}
        />
      </div>
      <div className='d-flex'>
        <ForgetPasswordText onClick={() => setForgetPassword(true)}>{`${capitalize(translate('Forget password?'))}`}</ForgetPasswordText>
      </div>
      <div className='d-flex  mt-2'>
        <DontHaveAccountText className="mr-5"> {`${capitalize(translate(texts.noAccount))} `}</DontHaveAccountText>
        <Link to={'/sign-up'}>
          <SignUp>{`${capitalize(translate(texts.signUp))}`}</SignUp>
        </Link>
      </div>
      <div id="loginId"></div>
      <Modal show={smsVerification ? true : false} onHide={handleClose} style={{ top: '25%', maxWidth: window.screen.width < 979 ? '100vw' : '' }}>
        <Modal.Header >
          <Modal.Title>2FA</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please enter verification code which is sent to your number.</p>
          <FormControl
            className="mt-2"
            type="number"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />
        </Modal.Body>

        <Modal.Footer>
          <Buttons.Default onClick={handleClose}>Close</Buttons.Default>
          <Buttons.Primary
            // disabled={!valid}
            onClick={async () => {
              // @ts-ignore
              const cred = PhoneAuthProvider.credential(smsVerification?.verificationId, verificationCode);
              const multiFactorAssertion =
                PhoneMultiFactorGenerator.assertion(cred);
              // Complete sign-in.
              // @ts-ignore
              return smsVerification?.resolver.resolveSignIn(multiFactorAssertion)
            }}
          >
            CONTINUE
          </Buttons.Primary>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Login;
