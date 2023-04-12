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
import Tabs from "./Tabs";
import GoogleAuthenticator from "./GoogleAuthenticator";
import ChangePassword from "./ChangePassword";

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
  const [tabsArray,setTabsArray]=useState<any>([])
  const auth = getAuth();
  console.log('auth',u?.providerData[0]?.providerId=='password' )
  const authProvider=u?.providerData[0]?.providerId=='password'? true :false
  useEffect(() => {
    setTabsArray(authProvider?[
      {
        eventKey: "password",
        title: "Password",
        pane: (
         <ChangePassword/>
        ),
      },
      {
        eventKey: "2fa",
        title: "2FA",
        pane: (
          <>
          <GoogleAuthenticator/>
          </>
        // 
        ),
      },
    ]:[
      {
        eventKey: "2fa",
        title: "2FA",
        pane: (
          <GoogleAuthenticator/>
        ),
      },
    ])
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
                      
      <Tabs
      defaultActiveKey={authProvider?"password":'2fa'}
      id="profile-follow"
      onSelect={() => {}}
      tabs={tabsArray}
                            />
    
      {/* <Modal show={show} onHide={handleClose} style={{top:'25%',maxWidth:window.screen.width<979?'100vw':''}}>
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
      </Modal> */}
    </>
  );
};

export default Security;
