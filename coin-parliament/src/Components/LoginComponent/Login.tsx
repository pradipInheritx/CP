import { LoginProviders, providers } from "../../common/models/Login";
import LoginForm from "./LoginForm";
// import { Button, ListGroup } from "react-bootstrap";
import { texts } from "./texts";
import React, { FormEvent, useContext, useEffect, useState } from "react";
import { useTranslation } from "../../common/models/Dictionary";
import { AuthProvider, PhoneAuthProvider, PhoneMultiFactorGenerator, User } from "firebase/auth";
import LoginWith from "./LoginWith";
import styled from "styled-components";
import { PoppinsBoldBlueViolet14px, PoppinsMediumBlack12px, PoppinsNormalBlueViolet12px } from "../../styledMixins";
import { User as AuthUser } from "@firebase/auth";
import { Callback } from "../../common/models/utils";
import NotificationContext, { ToastType } from "../../Contexts/Notification";
import { ToastContent, ToastOptions } from "react-toastify/dist/types";
import { capitalize } from "lodash";
import { FormControl, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import AppContext from "../../Contexts/AppContext";
import { Buttons } from "../Atoms/Button/Button";
import logo from "../../assets/svg/sporange.png";
import v2elogo from "../../assets/svg/VTElogo.png";


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
const Image = styled.img`
  // display: inline;
`;

const LoginButton = styled.div`
border:none;
border-radius:5px;
  background: var(--white);
  color: var(--black);
  width: 100%;
  align-items: center;
  justify-content: start;
  cursor: pointer;
  &:hover{
    color: #fff;
    background-color: #d4d0f3;
    border-color: #d4d0f3;
  }
`;
const ContinueWith = styled.div`
  ${PoppinsNormalBlueViolet12px};
  min-height: 19px;
  align-self: flex-end;
  margin-left: 32px;
  min-width: 131px;
  letter-spacing: 0;
  white-space: nowrap;
`;
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
  const { setLoginRedirectMessage, loginRedirectMessage, withLoginV2e, setWithLoginV2e , setLogin} = useContext(AppContext);
  const [smsVerification, setSmsVerification] = useState('')
  const [verificationCode, setVerificationCode] = useState("");
  console.log(smsVerification)
  useEffect(() => {

    return () => {
      setLoginRedirectMessage('')
    }
  }, [])
  const handleClose = () => {
    setSmsVerification('')

  };
  return (
    <div
      className="text-center"
      style={{width:"300px"}}
    >
      {loginRedirectMessage && <H1 className='.tooltip-inner'>You need to login to {loginRedirectMessage}.</H1>}
      {!withLoginV2e &&
        <>
          {Object.values(LoginProviders).map((provider, i) => {
            return (
              <div key={i} className="mb-2 w-100" id='login'>
                <LoginWith
                  provider={provider}
                  onClick={() =>
                // @ts-ignore
                authProvider(setUser, providers[provider], showToast, setSmsVerification, () => {
                  setLogin(false)
                })
              }
                />
              </div>
            );
          })}
          <div className="mb-2 w-100">
            <LoginButton style={{ boxShadow: window.screen.width > 979 ? '0px 3px 6px #00000029' : '' }}
              onClick={() => {
                setWithLoginV2e(!withLoginV2e)
              }}
            >

              {!withLoginV2e && <div className="d-flex py-2 px-2"
                style={{
                  marginLeft: "16px"
                }}
              >
                <Image src={v2elogo} alt="" width={"25px"} className="pl-1" />
                <ContinueWith>CONTINUE WITH VoteToEarn</ContinueWith>
              </div>}
            </LoginButton>
          </div>
          <div className="my-3 align-self-center">
            <OR className="mx-auto">{translate("or")}</OR>
          </div>
        </>
      }

      <div className="mb-3 w-100">
        <LoginForm
          callback={{
            successFunc: (params) => setUser(params),
            errorFunc: (e) => showToast(e.message, ToastType.ERROR),
          }}
          login={login}
        />
      </div>
      {withLoginV2e ?
        <ForgetPasswordText className="d-flex justify-content-center align-items-center cursor-pointer" onClick={() => setWithLoginV2e(false)}>
          <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>arrow_back</span>Go back
        </ForgetPasswordText>
        :
        <>
          <div className='d-flex justify-content-center'>
            <ForgetPasswordText onClick={() => setForgetPassword(true)}>{`${capitalize(translate('Forget password?'))}`}</ForgetPasswordText>
          </div>
          <div className='d-flex  mt-2'>
            <DontHaveAccountText className="mr-5"> {`${capitalize(translate(texts.noAccount))} `}</DontHaveAccountText>
            <SignUp onClick={() => setSignup(true)}>{`${capitalize(translate(texts.signUp))}`}</SignUp>
          </div>
        </>
      }
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
    </div>
  );
};

export default Login;
