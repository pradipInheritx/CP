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
  const [countryCode, setCountryCode] = useState('972')
  const [verificationCodeSent, setVerifiactionCodeSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationIdData, setVerificationIdData] = useState("");
  const [tabsArray, setTabsArray] = useState<any>([])
  const auth = getAuth();
  console.log('auth', u?.providerData[0]?.providerId == 'password')
  const authProvider = u?.providerData[0]?.providerId == 'password' ? true : false
  useEffect(() => {
    setTabsArray(authProvider ? [
      {
        eventKey: "password",
        title: "Password",
        pane: (
          <ChangePassword />
        ),
      },
      {
        eventKey: "2fa",
        title: "2FA",
        pane: (
          <>
            <GoogleAuthenticator />
          </>
          // 
        ),
      },
    ] : [
      {
        eventKey: "2fa",
        title: "2FA",
        pane: (
          <GoogleAuthenticator />
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
        defaultActiveKey={authProvider ? "password" : '2fa'}
        id="profile-follow"
        onSelect={() => { }}
        tabs={tabsArray}
      />

    </>
  );
};

export default Security;
