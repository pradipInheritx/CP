/** @format */

import React, { FormEvent, useContext, useEffect, useState } from "react";
import "./Login.css";
import { Modal, Stack } from "react-bootstrap";
import UserContext from "../../Contexts/User";
import { LoginModes, LoginProviders, SignupPayload, providers } from "../../common/models/Login";
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
import LoginWith from "./LoginWith";
import { Buttons } from "../Atoms/Button/Button";
import { showToast } from "../../App";
import "./style.css"

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
  const { signup, setSignup, withLoginV2e , setLogin, setWithLoginV2e } = useContext(AppContext);
  const [forgetPassword, setForgetPassword] = useState(false);
  const mode = signup ? LoginModes.SIGNUP : LoginModes.LOGIN;
  const refer = new URLSearchParams(search).get("refer");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {  
    if (withLoginV2e) {
      handleShow()
    }
  }, [withLoginV2e])

  return (
    <Stack
      gap={2}
      className=' justify-content-center'
      style={{ height: "100vh", background: "var(--light-purple)" }}
    >
      <div className='container-center-horizontal'>
        <div className='login-signin screen'>

          {!withLoginV2e ? <div>
            {!forgetPassword ? (
              <Styles.Title>{translate(title[mode])}</Styles.Title>
            ) : (
              <Styles.Title>{translate("Forget Password")}</Styles.Title>
            )}
          </div> : forgetPassword ? <Styles.Title>{translate("Forget Password")}</Styles.Title> : signup ? <Styles.Title>{translate(title[mode])}</Styles.Title> :
            <div className="d-flex flex-column justify-content-center align-items-end">
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",width:"100%"}}>
                <img src={`/images/icons/vtelogo.png`} alt="" />
                </div>
              <Styles.Title style={{ marginTop: '1em',fontSize:`${window.screen.width <767 && "17px"}`,textTransform:"none"}}>{translate("Login with your VoteToEarn  account")}</Styles.Title>
            </div>
          }


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
      <Modal show={show} onHide={handleClose}
        
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"        
        contentClassName={`${window.screen.width > 767 ? "loginPopupTop" : "loginPopup"}`}
        
      >                        
        <Modal.Body>          
          <p className="text-center">If you have used the Google signup option to create your V2E account, please log in using the option below.</p>
          <br />
          {Object.values(LoginProviders).map((provider, i) => {
            console.log(provider,"provider")
            return (
              <div key={i} className="mb-2 w-100" id='login'>
                <LoginWith
                  provider={provider}
                  onClick={() =>                    
                    // @ts-ignore
                    authProvider(setUser, providers[provider], showToast, setShow, () => {
                      setLogin(false)                                            
                      setWithLoginV2e(!withLoginV2e)
                    })
                  }
                />
              </div>
            );
          })}
          <div className="d-flex justify-content-center mt-4">
          <Buttons.Primary onClick={handleClose}>
            Close
          </Buttons.Primary>          
          </div>
        </Modal.Body>        
      </Modal>
    </Stack>
  );
};

export default LoginAndSignup;
