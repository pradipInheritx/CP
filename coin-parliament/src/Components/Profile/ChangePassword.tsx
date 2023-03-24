import React, { useState, useEffect, useContext } from 'react';
import {
  Col,
  Container,
  Form,
  FormControl,
  Row,
} from "react-bootstrap";
import UserContext from "../../Contexts/User";
import NotificationContext, { ToastType } from "../../Contexts/Notification";
import User, { UserProps } from "../../common/models/User";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Label } from "../Forms/Textfield";
import Button, { Buttons } from "../Atoms/Button/Button";
import styled from "styled-components";
import { InputAndButton, PoppinsMediumWhite12px } from "../../styledMixins";
import { getAuth, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { validatePassword } from "./utils";
import {
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
} from "firebase/auth";
import { texts } from "../LoginComponent/texts";
import Tabs from "./Tabs";
import GoogleAuthenticator from "./GoogleAuthenticator";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
const BtnLabel = styled(Form.Check.Label)`
  ${InputAndButton}
  ${PoppinsMediumWhite12px}
  padding: 7.7px 19px;
  justify-content: center;
  align-items: center;
  min-height: 19px;
  letter-spacing: 0;
  white-space: nowrap;
  text-transform: capitalize;
  color: var(--blue-violet);
  cursor: pointer;
`;

const BtnLabelPrimary = styled(BtnLabel)`
  background-color: var(--blue-violet);
  color: var(--white);
  border: none !important;
`;

const ChangePassword = () => {
  const { userInfo, user: u, setUserInfo } = useContext(UserContext);
  const { showToast } = useContext(NotificationContext);
  const [changePassword, setChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  




  return (
    <Form className="mt-1" onSubmit={async (e) => {
      e.preventDefault();
     
        if (
          u &&
          userInfo?.displayName &&
          validatePassword(
            
            newPassword,                                  
            userInfo?.displayName,
            confirmPassword,
          )
        ) {
          
          const auth = getAuth();
  const currentUser= auth?.currentUser
  console.log('password',currentUser)
          const credential = firebase.auth.EmailAuthProvider.credential(
            currentUser?.email!,
            oldPassword
          );
      
          // const auth = firebase.auth();
          // @ts-ignore
        reauthenticateWithCredential(currentUser,credential)
            .then(() => {
              // @ts-ignore
           updatePassword(u,newPassword)
                .then(() => {
                  setOldPassword("");
                  setNewPassword("");
                  showToast(texts.PasswordUpdatSuccess);
                  // setErrorMessage("");
                })
                .catch((error:any) => {
                  // setErrorMessage(error.message);
                  console.log( error.message)
                  
                  showToast(
                    error.message,ToastType.ERROR
                  );
                });
            })
            .catch((error:any) => {
              console.log( error.message)
              if(error.message=='Firebase: Error (auth/wrong-password).') showToast(
                'Please enter correct Old password.',ToastType.ERROR
              );
              else showToast(
                error.message,ToastType.ERROR
              );
              // setErrorMessage(error.message);
            });





          // await updatePassword(u, newPassword);
          // showToast(texts.PasswordUpdatSuccess);
          setChangePassword(false);
        } else {
          showToast(
            texts.PasswordMustContain,ToastType.ERROR
          );
        }
      
    }} >
    <div id="recaptcha-container-id"></div>
    <Container
      style={{ minHeight: window.screen.width < 979 ? "59vh" : "67vh" }}
    >
      <Row style={{ justifyContent: "center" }}>
        <Col sm={6} className="mt-0">
          <Form.Group controlId="MFA">
            <Form.Check>
              <Row>
                <Col>
                  <Label>Old Password</Label>
                </Col>
              </Row>
              <Row>
                <Col>                                            
                  <>
                    <FormControl
                      type="password"
                      value={oldPassword || ""}
                      onChange={(e) => setOldPassword(e.target.value)}
                     required
                    />                           
                  </>                                            
                </Col>
              </Row>
              <Row>
                <Col>
                  <Label>New Password</Label>
                </Col>
              </Row>
              <Row>
                <Col>                                            
                  <>
                    <FormControl
                      type="password"
                      value={newPassword || ""}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />                           
                  </>                                            
                </Col>
              </Row>
              <Row>
                <Col>
                  <Label>Confirm Password</Label>
                </Col>
              </Row>
              <Row>
                <Col>                                           
                  <>
                    <FormControl
                      type="password"
                      value={confirmPassword || ""}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />                           
                  </>                                             
                </Col>
              </Row>
              <Row>
                <Col className="d-flex justify-content-between mt-3">
                  <>                            
                {changePassword && (
                  
                    <Button
                      onClick={(e) => {
                        e.preventDefault();
                        setChangePassword(false);
                      }}
                    >
                      <span aria-hidden="true">Cancel</span>
                    </Button>
                    )}
                    </>
                    <Button
                    
                    >
                     SUBMIT
                    </Button>
                </Col>
              </Row>

            </Form.Check>
          </Form.Group>
        </Col>
      </Row>
    </Container>
  </Form>
  );
};
export default ChangePassword;
