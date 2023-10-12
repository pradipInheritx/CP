/** @format */

import React, { FormEvent, useContext, useEffect, useState } from "react";
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

import {
  Col,
  Container,
  Form,
  FormControl,
  InputGroup,
  Modal,
  Row,
} from "react-bootstrap";

import NotificationContext from "../../Contexts/Notification";
import User, { UserProps } from "../../common/models/User";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Label } from "../Forms/Textfield";
import Button, { Buttons } from "../Atoms/Button/Button";
import styled from "styled-components";
import { InputAndButton, PoppinsMediumWhite12px } from "../../styledMixins";
import { getAuth, updatePassword } from "firebase/auth";

import {
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
} from "firebase/auth";
import axios from 'axios';
import QRCode from "qrcode";

const title = {
  [LoginModes.LOGIN]: texts.login,
  [LoginModes.SIGNUP]: texts.signUp,
};

export type Login2faProps = {
  setLogin?: any;
  setMfaLogin?: any;
};

const Login2fa = ({
  setLogin,
  setMfaLogin
}: Login2faProps) => {
  const translate = useTranslation();
  const location = useLocation();
  const search = location.search;
  const { setUser, } = useContext(UserContext);
  const { signup, setSignup, setShowMenuBar } = useContext(AppContext);
  const [forgetPassword, setForgetPassword] = useState(false);
  const mode = signup ? LoginModes.SIGNUP : LoginModes.LOGIN;
  const refer = new URLSearchParams(search).get("refer");
  const { userInfo, user: u, setUserInfo } = useContext(UserContext);
  const { showToast } = useContext(NotificationContext);
  const user = userInfo ? new User({ user: userInfo }) : ({} as User);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [textData, setTextData] = useState<string>('');
  const [secretKey, setSecretKey] = useState<string>('')
  const auth = getAuth();
  const [copied, setCopied] = useState(false)


  const url = `https://us-central1-${process.env.REACT_APP_FIREBASE_PROJECT_ID}.cloudfunctions.net/api/v1/admin/auth/generateGoogleAuthOTP`
  const otpurl = `https://us-central1-${process.env.REACT_APP_FIREBASE_PROJECT_ID}.cloudfunctions.net/api/v1/admin/auth/verifyGoogleAuthOTP`

  // const createPost = async (id:string) => {
  //   const data ={
  //     "userId": id,
  //     "userType": "USER"
  // }
  //   try {
  //     const response = await axios.post(url, data);
  //     console.log(response.data);
  //     setSecretKey(response.data.result.base32)
  //     QRCode.toDataURL(response.data.result.otpauth_url).then((dataUrl: string) => {
  //       setQrCodeDataUrl(dataUrl);

  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  const verifyOtp = async (token: string) => {
    try {
      const response = await axios.post(otpurl, {
        "userId": userInfo?.uid,
        "token": token,
        "userType": "USER"
      });
      // console.log(response.data);
      // const newUserInfo = {
      //   ...(userInfo as UserProps),
      //   mfa: true as boolean,
      // };
      window.localStorage.setItem('mfa_passed', 'false')
      setLogin(false)
      setMfaLogin(false)
      setShowMenuBar(false)
    } catch (error: any) {
      showToast(
        error.response.data.message, ToastType.ERROR
      );
      console.error(error.response);
    }
  };

  // console.log('user',userInfo,u)
  useEffect(() => {

    if (u?.photoURL !== 'mfa') {
      setLogin(false)
      setMfaLogin(false)
      console.log('2facalled2')
      return
    }
    else { setMfaLogin(true) }
    window.localStorage.setItem('mfa_passed', 'true')
    setShowMenuBar(true)
    // createPost(u?.uid as string)
    return () => setCopied(false)
  }, [])

  if (u?.photoURL !== 'mfa') {
    setLogin(false)
    return <>wait</>
  }

  return (
    <Stack
      gap={2}
      className=' justify-content-center'
      style={{ height: "100vh", background: "var(--light-purple)" }}
    >
      <div className=''>
        <div className=''>
          <Container
            style={{ minHeight: window.screen.width < 979 ? "59vh" : "67vh" }}
          >
            <Row style={{ justifyContent: "center" }}>
              <Col sm={6}>
                <Form.Group controlId="MFA">
                  <Form.Check>




                    <> <Row style={{ marginTop: '150px' }}>
                      <Col className="mt-2">
                        <Label>Please enter the 6-digit code generated by your authenticator app below to verify your identity and complete the 2FA process.
                        </Label>

                      </Col>
                    </Row>
                      <Row>
                        <Col>
                          <Container className="p-0">

                            <Row className="mb-5">
                              <div className='d-flex' style={{ marginTop: '30px' }}>
                                <FormControl

                                  value={textData}
                                  onChange={(e) => setTextData(e.target.value)}

                                />  <Buttons.Primary onClick={(e) => verifyOtp(textData)}>Verify</Buttons.Primary>
                                {/* <input type="text" value={secretKey} />
      <button onClick={(e) => navigator.clipboard.writeText(secretKey)}>Copy</button> */}
                              </div>
                              {/* <input type="text"  />
      <button onClick={(e) => verifyOtp(textData)}>Verify</button> */}
                            </Row>
                          </Container>
                        </Col>
                      </Row>
                    </>
                  </Form.Check>
                </Form.Group>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </Stack>
  );
};

export default Login2fa;
