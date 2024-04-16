import React, { useState, useEffect, useContext } from "react";
import {
  ButtonGroup,
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
import {
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { passwordValidation, validatePassword } from "./utils";
import infobtn from "../../assets/images/info-btn.png";
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
const PasswordInfo = styled.div`
  // border:1px solid red;
  // display: flex;
  // justify-content: center;
     margin: auto;
    
    background-color: #d4d0f3;
    border-radius: 7px;
    font-size: 12px;
    font-weight: 100;
    line-height: 2;
  
`;

const ChangePassword = () => {
  const { userInfo, user: u, setUserInfo, setUser } = useContext(UserContext);
  // const { setLogin} =useContext(AppContext);
  const { showToast } = useContext(NotificationContext);
  const [changePassword, setChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
// let navigate = useNavigate();
  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const validatePassword = passwordValidation(newPassword, confirmPassword, (userInfo?.displayName || ''));
    if (u && userInfo?.displayName && validatePassword === true) {
      const auth = getAuth();
      const currentUser = auth?.currentUser
      const credential = firebase.auth.EmailAuthProvider.credential(currentUser?.email!, oldPassword);

      // @ts-ignore
      reauthenticateWithCredential(currentUser, credential)
        .then(() => {
          // @ts-ignore

          if (oldPassword === newPassword) {
            showToast('New password cannot be the same as the old password.', ToastType.ERROR);
            setChangePassword(false);
            return;
          }
          
          updatePassword(u, newPassword)
            .then(() => {
              setOldPassword("");
              setNewPassword("");
              setConfirmPassword('')
              showToast(texts.PasswordUpdatSuccess);
            
              // setErrorMessage("");
            })
            .catch((error: any) => {
              // setErrorMessage(error.message);
              console.log(error.message)

                showToast(
                  error.message, ToastType.ERROR
                );
              
            });
        })
        .catch((error: any) => {
          
          if (error.message === 'Firebase: Error (auth/wrong-password).'|| error.message.toString().includes(`(auth/invalid-login-credentials)`))
            showToast('Please enter correct Old password.', ToastType.ERROR);
          else
            showToast(error.message, ToastType.ERROR);
        });
      setChangePassword(false);
    } else {
      showToast(validatePassword, ToastType.ERROR);
    }

  }

  return (
    <>
      <PasswordInfo style={{ width: `${window.screen.width > 767 ? "44%" : "90%"}` }}>
        <div className='p-3'>
          <img src={infobtn} alt="" width={"15px"} />
          &nbsp;
          <span className='' style={{ fontWeight: "500" }}>Choosing Strong Password</span>
          <hr />
          <div>
            <ul>
              <li>Passwords must be at least 8 characters in length.</li>
              <li>The password must contain a mix of upper and lower case letters, numbers, and/or special characters.</li>
              <li>The password is case-sensitive.</li>
              <li>Successive passwords should not follow a pattern.</li>
              <li>Do not post or share your password or send your password to others by email.</li>
            </ul>
          </div>
        </div>
      </PasswordInfo>

      <Form className="mt-3" onSubmit={onSubmit} >
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
                  <div className={`${window.screen.width < 767 ? "flex-column" : ""} w-100 d-flex mt-2`}>
                    <div
                      style={{ width: `${window.screen.width < 767 ? "100%" : "48%"}` }}
                    >
                      <Row>
                        <Col>
                          <Label>New Password</Label>
                        </Col>
                      </Row>
                      <Row >
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
                    </div>
                    <div

                      style={{ width: `${window.screen.width < 767 ? "100%" : "48%"}`, margin: `${window.screen.width < 767 ? "10px 0px 0px 0px" : "0px 0px 0px 25px"}` }}
                    >
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
                    </div>
                  </div>
                  <Row>
                    <Col className="d-flex justify-content-between mt-3">
                      <>
                        {changePassword && (

                          <Buttons.Primary
                            onClick={(e) => {
                              e.preventDefault();
                              setChangePassword(false);
                            }}
                          >
                            <span aria-hidden="true">Cancel</span>
                          </Buttons.Primary>
                        )}
                      </>
                      <Buttons.Primary
                      >
                        UPDATE
                      </Buttons.Primary>
                    </Col>
                  </Row>

                </Form.Check>
              </Form.Group>
            </Col>
          </Row>
        </Container>
      </Form>
    </>
  );
};
export default ChangePassword;
