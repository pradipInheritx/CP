import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Form, FormControl, Modal, Navbar, Row } from "react-bootstrap";
import UserContext from "../../Contexts/User";
import NotificationContext, { ToastType } from "../../Contexts/Notification";
import User, { UserProps } from "../../common/models/User";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Label } from "../Forms/Textfield";
import { Buttons } from "../Atoms/Button/Button";
import styled from "styled-components";
import { InputAndButton, PoppinsMediumWhite12px } from "../../styledMixins";
import { getAuth, updateProfile } from "firebase/auth";
import infobtn from '../../assets/images/info-btn.png'
import AppStore from '../../assets/images/AppStore.png'
import GooglePlay from '../../assets/images/GooglePlay.png'
// import BigLogo from "../../assets/svg/logoiconx2.png";
import {
  multiFactor,
  PhoneAuthProvider,
  PhoneMultiFactorGenerator,
  RecaptchaVerifier,
} from "firebase/auth";
import { texts } from "../LoginComponent/texts";
import axios from "axios";
import QRCode from "qrcode";
import BigLogo from "../../assets/svg/spblue.svg";
import { generateGoogle2faUrl, otpurl } from "../../common/consts/contents";
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
const GoogleAuthenticator = () => {
  const { userInfo, user: u, setUserInfo } = useContext(UserContext);
  const { showToast } = useContext(NotificationContext);
  const [show, setShow] = useState(false);
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("972");
  const [verificationCodeSent, setVerifiactionCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationIdData, setVerificationIdData] = useState("");
  const [tabsArray, setTabsArray] = useState<any>([]);
  const [secret, setSecret] = useState<string>("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [textData, setTextData] = useState<string>("");
  const [secretKey, setSecretKey] = useState<string>("");
  const auth = getAuth();
  const [copied, setCopied] = useState(false);


  const createPost = async (id: string) => {
    // @ts-ignore
    if (userInfo?.googleAuthenticatorData?.otp_auth_url) {
      // @ts-ignore
      setSecretKey(userInfo?.googleAuthenticatorData?.otp_base32);
      // @ts-ignore
      QRCode.toDataURL(userInfo?.googleAuthenticatorData?.otp_auth_url, { color: { dark: "#7565f7", light: "#ffffff" } }).then(
        (dataUrl: string) => {
          setQrCodeDataUrl(dataUrl);
        }
      );
      return
    }
    const AllData = {
      userId: id,
      userType: "USER",
    };


    try {
      const response = await axios.post(generateGoogle2faUrl, { data: AllData });
      console.log(response.data);
      setSecretKey(response.data.result.base32);
      QRCode.toDataURL(response.data.result.otpauth_url, { color: { dark: "#7565f7", light: "#ffffff" } }
      ).then(
        (dataUrl: string) => {
          setQrCodeDataUrl(dataUrl);
          console.log('qrcode', dataUrl)
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const verifyOtp = async (token: string) => {
    try {
      const response = await axios.post(otpurl, {
        data: {
          userId: userInfo?.uid,
          token: token,
          userType: "USER",
        }
      });
      console.log(response.data);
      const newUserInfo = {
        ...(userInfo as UserProps),
        mfa: true as boolean,
      };
      onSubmit(newUserInfo);
      showToast("2FA enabled successfully.", ToastType.SUCCESS);
    } catch (error: any) {
      showToast(error.response.data.message, ToastType.ERROR);
      console.error(error.response);
    }
  };

  // console.log('user',userInfo,u)
  console.log(userInfo, "!userInfo?.mfa")
  useEffect(() => {
    if (!userInfo?.mfa) createPost(userInfo?.uid as string);
    return () => setCopied(false);
  }, [userInfo?.mfa]);

  const handleClose = () => {
    setShow(false);
    setVerifiactionCodeSent(false);
  };
  const onSubmit = async (newUserInfo: UserProps) => {
    if (u?.uid) {
      updateProfile(u, { photoURL: newUserInfo?.mfa ? "mfa" : "" })
        .then((userRecord) => {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log("Successfully updated user", userRecord);
        })
        .catch((error) => {
          console.log("Error updating user:", error);
        });
      const userRef = doc(db, "users", u?.uid);
      try {
        await updateDoc(userRef, newUserInfo);
        // showToast(texts.UserInfoUpdate);
      } catch (e) {
        // showToast(texts.UserFailUpdate, ToastType.ERROR);
      }
    }
  };

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
      <Form className="mt-1" onSubmit={(e) => e.preventDefault()}>
        <div id="recaptcha-container-id"></div>
        <Container
          style={{ minHeight: window.screen.width < 979 ? "59vh" : "67vh" }}
        >
          <Row style={{ justifyContent: "center" }}>
            <Col sm={6}>
              <Form.Group controlId="MFA">
                <Form.Check>
                  {userInfo?.mfa ? (

                    <><PasswordInfo className='mb-2' style={{
                      width: `${window.screen.width > 767 ? "100%" : "100%"}`
                    }}>
                      <div className='p-3'>
                        <img src={infobtn} alt="" width={"15px"} />
                        &nbsp;
                        <span className='' style={{ fontWeight: "500" }}>Disable Google Authentication</span>
                        <hr />
                        <div>
                          <p>
                            Two-factor authentication is already enabled for your
                            account. You will need to enter the 6-digit code
                            generated by your authenticator app every time you log
                            in to your account.
                          </p>
                          <p className="mb-3">
                            To disable 2FA method you can click on disable button. We
                            strongly recommend keeping 2FA enabled to enhance the
                            security of your account.
                          </p>
                        </div>
                      </div>
                    </PasswordInfo>
                      <Buttons.Primary
                        onClick={(e) => {
                          const newUserInfo = {
                            ...(userInfo as UserProps),
                            mfa: false as boolean,
                          };

                          onSubmit(newUserInfo);
                        }}
                      >
                        Disable
                      </Buttons.Primary></>
                  ) : (
                    <>
                      {" "}


                      <PasswordInfo style={{
                        width: `${window.screen.width > 767 ? "100%" : "100%"}`
                      }}>
                        <div className='p-3'>
                          <img src={infobtn} alt="" width={"15px"} />
                          &nbsp;
                          <span className='' style={{ fontWeight: "500" }}>Enable Google Authentication</span>
                          <hr />
                          <div>
                            <p>Two-factor authentication adds an additional layer of security to your account by requiring more than just a password to sign in.</p>
                            <ul
                              style={{
                                // listStyleType: "none"
                              }}
                            >
                              <li>Install an Authenticator App on your mobile device.</li>
                              <li>Scan the QR code or type in the code manually on your mobile device</li>
                              <li>Write down or save the secret code in case you loss your device.</li>
                              <li>Do not ever share your secret code with anyone. We will never ask for your secret code.</li>
                              {/* <li>Do not post or share your password or send your password to others by email.</li> */}
                            </ul>
                          </div>
                        </div>
                      </PasswordInfo>


                      {/* <Row>
                        <Col className="mt-2">
                          <Label>
                            Please enter the 6-digit code generated by your
                            authenticator app below to verify your identity and
                            complete the 2FA process.
                          </Label>
                          <Label>
                            If you have not set up 2FA, please do so now to
                            enhance the security of your account. You can use
                            any TOTP-based authenticator app, such as Google
                            Authenticator or Authy, to generate codes.
                          </Label>
                        </Col>
                      </Row> */}
                      <Row className="mt-4"
                        style={{
                          overflow: "hidden"
                        }}
                      >
                        <Col>
                          <Container className="p-0">
                            <Row
                              className="m-0"
                              style={{
                                justifyContent: "center",
                                position: "relative",
                              }}
                            >

                              <img
                                src={BigLogo}
                                alt="QR code for Google Authenticator"
                                style={{ maxWidth: "100px", position: 'absolute', top: '35%' }}
                              />
                              <img
                                src={qrCodeDataUrl}
                                alt="QR code for Google Authenticator"
                                style={{ maxWidth: "300px" }}
                              />

                              {/* <div className='mt-2'
                                  style={{
                                    position: "absolute",
                                    top: "85px",
                                    left: `${window.screen.width > 767 ?"39%":"30%"}`,
                                    right: "0",
                                    
                                    // left:"50px"
                                }}  
                                >
                                  <Navbar.Brand >
                                    <img src={BigLogo} alt='' />
                                  </Navbar.Brand>
                                </div> */}
                            </Row>
                            <Row className="my-2 d-flex">
                              <Row>
                                <Col>
                                  <Label>Secret Code</Label>
                                </Col>
                              </Row>
                              <div className="d-flex">
                                <FormControl value={secretKey} />{" "}
                                <Buttons.Error
                                  style={{ marginLeft: "7px" }}
                                  onClick={(e) => {
                                    navigator.clipboard.writeText(secretKey);
                                    setCopied(true);
                                  }}
                                >
                                  {!copied ? "COPY" : "COPIED"}
                                </Buttons.Error>
                                {/* <input type="text" value={secretKey} />
      <button onClick={(e) => navigator.clipboard.writeText(secretKey)}>Copy</button> */}
                              </div>
                            </Row>
                            <Row className="mb-5 mt-4">
                              <Row>
                                <Col>
                                  <Label>Google Authentication Code</Label>
                                </Col>
                              </Row>
                              <div className="d-flex">
                                <FormControl
                                  value={textData}
                                  size="sm"
                                  onChange={(e) => setTextData(e.target.value)}
                                  placeholder="Enter the six-digit code form the application"
                                />{" "}
                                <Buttons.Primary
                                  // className="ml-3"
                                  style={{ background: "#198754", marginLeft: "8px" }}
                                  onClick={(e) => verifyOtp(textData)}
                                >
                                  Enable
                                </Buttons.Primary>
                                {/* <input type="text" value={secretKey} />
      <button onClick={(e) => navigator.clipboard.writeText(secretKey)}>Copy</button> */}
                              </div>
                              {/* <input type="text"  />
      <button onClick={(e) => verifyOtp(textData)}>Verify</button> */}
                            </Row>
                          </Container>
                        </Col>
                      </Row>
                      <div className="text-center">
                        <p>Download and install google authenticator app</p>
                        <div className="d-flex justify-content-center">
                          <div className="m-3" onClick={() => window?.open('https://apps.apple.com/us/app/google-authenticator/id388497605')}>
                            <img src={AppStore} alt="" width="130px" />
                          </div>

                          <div className="m-3" onClick={() => window?.open('https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en&gl=US&pli=1')}>
                            <img src={GooglePlay} alt="" width="120px" />
                          </div>
                        </div>
                      </div>

                    </>
                  )}
                </Form.Check>
              </Form.Group>
            </Col>
          </Row>
        </Container>
      </Form>
      <Modal
        show={show}
        onHide={handleClose}
        style={{
          top: "25%",
          maxWidth: window.screen.width < 979 ? "100vw" : "",
        }}
      >
        <Modal.Header>
          <Modal.Title>2FA</Modal.Title>
        </Modal.Header>
        {verificationCodeSent ? (
          <Modal.Body>
            <p>
              Please enter verification code which is sent to +{countryCode}
              {phone}.
            </p>
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
            <div className="d-flex mt-3 pl-5" style={{ marginLeft: "20px" }}>
              <p className="mr-2">+</p>
              <FormControl
                style={{
                  marginLeft: "5px",
                  marginRight: "5px",
                  maxWidth: "60px",
                }}
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
                verifyCode()
                  .then((res) => {
                    const newUserInfo = {
                      ...(userInfo as UserProps),
                      mfa: true,
                      phone: phone,
                    };
                    setUserInfo(newUserInfo);
                    onSubmit(newUserInfo);
                    showToast(texts.FASecurityAdded);
                  })
                  .catch((err) => showToast(texts.WrongCode, ToastType.ERROR));
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
export default GoogleAuthenticator;
