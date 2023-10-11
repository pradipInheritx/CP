/** @format */

import React, { FormEvent, useContext, useState } from "react";
// import "./Login.css";
import { Stack } from "react-bootstrap";
import { useTranslation } from "../../common/models/Dictionary";
import Styles from "./styles";
import Signup from "./Signup";
import { texts } from "../../Components/LoginComponent/texts";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { PoppinsBoldBlueViolet14px, PoppinsMediumBlack12px } from "../../styledMixins";
import AppContext from "../../Contexts/AppContext";
import { LoginProviders, providers } from "../../common/models/Login";
import LoginWith from "../../Components/LoginComponent/LoginWith";
import { LoginProps } from "Components/LoginComponent/Login";
import { User as AuthUser } from "@firebase/auth";
import { AuthProvider, } from "firebase/auth";
import { ToastContent, ToastOptions } from "react-toastify/dist/types";
import { Callback } from "../../common/models/utils";
import NotificationContext, { ToastType } from "../../Contexts/Notification";
import UserContext from "Contexts/User";
const Login = styled.div`
  margin-left:5px;
  margin-right:7px;
  cursor:pointer;
  font-weight:600 !important;
  // text-decoration:underline;
  ${PoppinsBoldBlueViolet14px};
`;
const OR = styled.div`
  ${PoppinsMediumBlack12px};
  min-height: 19px;
  align-self: center;
  letter-spacing: 0;
  line-height: 11px;
  white-space: nowrap;
  text-transform: uppercase;
`;
const HaveAccountText = styled.div`
 color:black;
`;
const GenericLoginSignup = ({ authProvider }:
  {
    authProvider: (
      setUser: (user: AuthUser) => void,
      provider: AuthProvider,
      showToast: (
        content: ToastContent,
        type?: ToastType,
        options?: ToastOptions | undefined
      ) => void
    ) => Promise<void>
  }) => {
  const { setLogin } = useContext(AppContext);
  const translate = useTranslation();
  const location = useLocation();
  const search = location.search;
  const { setUser } = useContext(UserContext);
  const { showToast } = useContext(NotificationContext);
  return (
    <Stack
      gap={2}
      className='justify-content-center'
      style={{ minHeight: "80vh", background: "var(--light-purple)", paddingBottom: '1em' }}
    >

      <div className='container-center-horizontal'>
        <div className='login-signin screen'>
          <Styles.Title>{translate("JOIN THE PARLIAMENT".toUpperCase())}</Styles.Title>
          {Object.values(LoginProviders).map((provider, i) => {
            return (
              <div key={i} className="mb-2 w-100" id='login'>
                <LoginWith
                  provider={provider}
                  onClick={() =>
                    authProvider(setUser, providers[provider], showToast)
                  }
                />
              </div>
            );
          })}
          <OR className="mx-auto">{translate("or")}</OR>
          <Signup />
          <div className='d-flex'>
            <HaveAccountText className="mr-5"> {`${translate(texts.haveAccount)} `}</HaveAccountText>
            <Link to={'/login'}>
              <Login > {`${translate(texts.login)}`}</Login>
            </Link>
          </div>
        </div>
      </div >
    </Stack >
  );
};

export default GenericLoginSignup;
