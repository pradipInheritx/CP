import React, { useContext, useEffect, useState } from "react";
import {
  Col,
  Container,
  Form,
  FormControl,
  InputGroup,
  Modal,
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
import { getAuth, updatePassword } from "firebase/auth";
import { validatePassword } from "./utils";
import {
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
} from "firebase/auth";
import { texts } from "../LoginComponent/texts";

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

const Security = () => {
  const { userInfo, user: u, setUserInfo } = useContext(UserContext);
  const { showToast } = useContext(NotificationContext);
  const user = userInfo ? new User({ user: userInfo }) : ({} as User);
  const [changePassword, setChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [phone, setPhone] = useState("");
  const [countryCode,setCountryCode]= useState('972')
  const [verificationCodeSent, setVerifiactionCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationIdData, setVerificationIdData] = useState("");
  useEffect(() => {
    setPhone(user?.phone || '')
  }, [])
  const handleClose = () => {
    setShow(false);
    setVerifiactionCodeSent(false)
  };
  const onSubmit = async (newUserInfo: UserProps) => {
    if (u?.uid) {
      const userRef = doc(db, "users", u?.uid);
      try {
        await updateDoc(userRef, newUserInfo);
        showToast(texts.UserInfoUpdate);
      } catch (e) {
        showToast(texts.UserFailUpdate, ToastType.ERROR);
      }
    }
  };
  
  const auth = getAuth();
  const authMFA = () => {
    const recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container-id",
      {
        size: "invisible",
        callback: function () {
          // reCAPTCHA solved, you can proceed with
          // phoneAuthProvider.verifyPhoneNumber(...).
          // onSolvedRecaptcha();
         
        },
      },
      auth
    );
    // @ts-ignore
    multiFactor(auth?.currentUser)
      .getSession()
      .then(function (multiFactorSession) {
        // Specify the phone number and pass the MFA session.
        const phoneInfoOptions = {
          phoneNumber: `+${countryCode}${phone}`,
          session: multiFactorSession,
        };

        const phoneAuthProvider = new PhoneAuthProvider(auth);
        
        // Send SMS verification code.
        return phoneAuthProvider.verifyPhoneNumber(
          phoneInfoOptions,
          recaptchaVerifier
        );
      })
      .then(function (verificationId) {
        console.log("verificationcode", verificationId);
        // Ask user for the verification code. Then:
        setVerificationIdData(verificationId);
        setVerifiactionCodeSent(true);
      })
      .catch((err) => console.log("err", err?.message));
  };
  const verifyCode = () => {
    const cred = PhoneAuthProvider.credential(
      verificationIdData,
      verificationCode
    );
    const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

    // Complete enrollment.
    // @ts-ignore
    return multiFactor(auth?.currentUser).enroll(multiFactorAssertion, phone);
  };
  return (
    <>
      <Form className="mt-1" onSubmit={(e) => e.preventDefault()} >
        <div id="recaptcha-container-id"></div>
        <Container
          style={{ minHeight: window.screen.width < 979 ? "59vh" : "67vh" }}
        >
          <Row style={{ justifyContent: "center" }}>
            <Col sm={6} className="mt-5">
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
                          disabled={!changePassword}
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
                          disabled={!changePassword}
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
                          disabled={!changePassword}
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
                          onClick={async (e) => {
                            e.preventDefault();
                            if (!changePassword) {
                              setChangePassword(true);
                            } else {
                              if (
                                u &&
                                userInfo?.displayName &&
                                validatePassword(
                                  confirmPassword,
                                  newPassword,                                  
                                  userInfo?.displayName
                                )
                              ) {
                                await updatePassword(u, newPassword);
                                showToast(texts.PasswordUpdatSuccess);
                                setChangePassword(false);
                              } else {
                                showToast(
                                  texts.PasswordMustContain,ToastType.ERROR
                                );
                              }
                            }
                          }}
                        >
                          {changePassword ? "submit" : "change"}
                        </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={3} className="mt-2">
                      <Label>2FA</Label>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Container className="p-0">
                        <Row className="m-0">
                          <Col className="p-0">
                            <Form.Check.Input
                              style={{ display: "none" }}
                              type="radio"
                              name="mfa"
                              id="mfa-enable"
                              checked={user?.mfa || true}
                              onChange={async (e) => {
                               
                                const newUserInfo = {
                                  ...(userInfo as UserProps),
                                  mfa: true,
                                };
                                setUserInfo(newUserInfo);
                                await onSubmit(newUserInfo);
                              }}
                            />
                            {user?.mfa && (
                              <BtnLabelPrimary
                                htmlFor="mfa-enable"
                                className="w-100"
                                style={{ boxShadow: "0px 3px 6px #00000029" }}
                              >
                                Enable
                              </BtnLabelPrimary>
                            )}
                            {!user?.mfa && (
                              <BtnLabel
                                onClick={async (e) => {
                                  // authMFA();
                                  setShow(true);
                                  // const newUserInfo = {
                                  //   ...(userInfo as UserProps),
                                  //   mfa: true,
                                  // };
                                  // setUserInfo(newUserInfo);
                                  // await onSubmit(newUserInfo);
                                }}
                                htmlFor="mfa-enable"
                                className="w-100"
                                style={{ boxShadow: "0px 3px 6px #00000029" }}
                              >
                                Enable
                              </BtnLabel>
                            )}
                          </Col>
                          <Col className="p-0">
                            <Form.Check.Input
                              style={{ display: "none" }}
                              type="radio"
                              name="mfa"
                              id="mfa-disable"
                              checked={!user?.mfa || false}
                              
                            />
                            {!user?.mfa && (
                              <BtnLabelPrimary
                                htmlFor="mfa-disable"
                                className="w-100"
                                style={{ boxShadow: "0px 3px 6px #00000029" }}
                              >
                                Disable
                              </BtnLabelPrimary>
                            )}
                            {user?.mfa && (
                              <BtnLabel
                                onClick={async (e) => {
                                  // @ts-ignore
                                  var options = multiFactor(auth?.currentUser).enrolledFactors;
// Present user the option to unenroll.
console.log('option',options)
// @ts-ignore
return multiFactor(auth?.currentUser).unenroll(options[0])
  .then(function(res) {
    // User successfully unenrolled selected factor.
    
    const newUserInfo = {
      ...(userInfo as UserProps),
      mfa: false,
    };
    setUserInfo(newUserInfo);
     onSubmit(newUserInfo);
  }).catch(function(error) {
    // Handler error.
  });
                                
                                }}
                                htmlFor="mfa-disable"
                                className="w-100"
                                style={{ boxShadow: "0px 3px 6px #00000029" }}
                              >
                                Disable
                              </BtnLabel>
                            )}
                          </Col>
                        </Row>
                      </Container>
                    </Col>
                  </Row>
                </Form.Check>
              </Form.Group>
            </Col>
          </Row>
        </Container>
      </Form>
      <Modal show={show} onHide={handleClose} style={{top:'25%',maxWidth:window.screen.width<979?'100vw':''}}>
        <Modal.Header >
          <Modal.Title>2FA</Modal.Title>
        </Modal.Header>
        {verificationCodeSent ? (
          <Modal.Body>
            <p>Please enter verification code which is sent to +{countryCode}{phone}.</p>
            <FormControl
              className="mt-2"
              type="number"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </Modal.Body>
        ) : (
          <Modal.Body>
            <p>Please enter your phone number for 2FA.</p>
            <div className='d-flex mt-3 pl-5' style={{marginLeft:'20px'}}>
              <p className='mr-2'>+</p>
              <FormControl
              style={{marginLeft:'5px',marginRight:'5px',maxWidth:'60px'}}
              className="w-25 mr-2"
              type="tel"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            />
            <FormControl
              className="ml-2 w-50"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            </div>
          </Modal.Body>
        )}
        <Modal.Footer>
          <Buttons.Default onClick={handleClose}>Close</Buttons.Default>
          <Buttons.Primary
            // disabled={!valid}
            onClick={async () => {
              if (verificationCodeSent) {
                verifyCode().then(res=>{
                  const newUserInfo = {
                    ...(userInfo as UserProps),
                    mfa: true,
                    phone:phone,
                  };
                  setUserInfo(newUserInfo);
                   onSubmit(newUserInfo);
                  showToast(texts.FASecurityAdded)}).catch(err=>showToast(texts.WrongCode, ToastType.ERROR));
                handleClose();
              } else {
                authMFA();
              }
              // await triggerSaveUsername();
            }}
          >
            CONTINUE
          </Buttons.Primary>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Security;
