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
import { LoginProviders } from "../../common/models/Login";
import LoginWith from "../../Components/LoginComponent/LoginWith";

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
const GenericLoginSignup = () => {
  const { setLogin } = useContext(AppContext);
  const translate = useTranslation();
  const location = useLocation();
  const search = location.search;
  return (
    <Stack
      gap={2}
      className='justify-content-center'
      style={{ minHeight: "70vh", background: "var(--light-purple)", paddingBottom: '1em' }}
    >

      <div className='container-center-horizontal'>
        <div className='login-signin screen'>
          <Styles.Title>{translate("JOIN THE PARLIAMENT".toUpperCase())}</Styles.Title>
          {/* {Object.values(LoginProviders).map((provider, i) => {
            return (
              <div key={i} className="mb-2 w-100" id='login'>
                <LoginWith
                  provider={provider}
                  onClick={() =>
                    // @ts-ignore
                    authProvider(setUser, providers[provider], showToast, setSmsVerification)
                  }
                />
              </div>
            );
          })}
          <OR className="mx-auto">{translate("or")}</OR> */}
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
