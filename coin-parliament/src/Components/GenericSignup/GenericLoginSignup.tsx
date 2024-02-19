/** @format */

import React, { FormEvent, useContext, useEffect, useState } from "react";
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
import UserContext, { getReferUser } from "Contexts/User";
import firebase from "firebase/compat";
import { httpsCallable } from "firebase/functions";
import { functions } from "firebase";
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
  const refer = new URLSearchParams(search).get("refer") || "VoteToEarn";
  const [preantId, setPreantId] = useState(null)
  const assign = httpsCallable(functions, "assignReferrer");
  const { parentEmailId,setParentEmailId } = useContext(AppContext);
  const getUserId = async () => {

    const uidValue = refer?.slice(-6);    
    const emailValue = refer?.slice(0, 2);    

    var userdata = { uid: '' };
    if (refer) {
      try {
        const referUser = await firebase
          .firestore()
          .collection('users').where("userName", '==', refer).get();
        if (!referUser.empty) {
          referUser.forEach((doc: any) => {
            userdata = doc.data();
            setPreantId(doc.data().uid)
            setParentEmailId(doc.data().email)
            console.log(userdata, refer,"userdata")
          });
        }
        else if (referUser.empty) {          
          const referUser2 = await firebase
            .firestore()
            .collection('users');
          await referUser2.get().then((snapshot) => {
            let data: any = []
            snapshot.forEach((doc) => {
              data.push({ ...doc.data() });
            });        
            data?.map((item: any, index: number) => {
              if (item.uid?.slice(-6) == uidValue && item.email?.slice(0, 2) == emailValue) {
                setPreantId(item.uid)   
                setParentEmailId(item.email)
                console.log(item.email,"item.email")
              }
            })
          })          
        }
      } catch (err) {
        console.log(err, 'email');
      }
    }
  }
  
  useEffect(() => {
    if (refer) {
      getUserId()
    }
  }, [])  

  

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
                    // authProvider(setUser, providers[provider], showToast)
                    // @ts-ignore
                  { preantId ? authProvider(setUser, providers[provider], showToast,()=>{},()=>{}, assign,parentEmailId) : authProvider(setUser, providers[provider], showToast) }
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
