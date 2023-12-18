import {
  AuthProvider,
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  getAdditionalUserInfo,
  // TwitterAuthProvider,
  User as AuthUser,
  getMultiFactorResolver,
  PhoneAuthProvider,
  RecaptchaVerifier,
} from "firebase/auth";

import { FormEvent } from "react";
import { Callback } from "./utils";
import { ToastType } from "../../Contexts/Notification";
import { ToastContent, ToastOptions } from "react-toastify/dist/types";
import { getReferUser, saveUserData, saveUsername, storeAllPlatFormUserId } from "../../Contexts/User";
import { httpsCallable } from "firebase/functions";
import { V2EParliament, functions } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import User, { userConverter, UserProps } from "./User";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { showToast } from "../../App";
import { auth } from "firebaseSportParliament";
import { SignupRegularForSportParliament } from "./SportParliamentLogin";
import { SignupRegularForStockParliament } from "./StockParliamentLogin";
import { SignupRegularForVotingParliament } from "./VotingParliamentLogin";
import { SignupRegularForCoinParliament } from "./CoinParliamentLogin";
import { userDefaultData } from "common/consts/contents";
import axios from "axios";
import { generateUsername } from "common/utils/strings";
const sendEmail = httpsCallable(functions, "sendEmail");
const assign = httpsCallable(functions, "assignReferrer");
export enum LoginModes {
  LOGIN,
  SIGNUP,
}

export enum LoginProviders {
  GOOGLE = "google",
  // FACEBOOK = "facebook",
  // TWITTER = "twitter",
}

export const providers = {
  // [LoginProviders.FACEBOOK]: new FacebookAuthProvider(),
  [LoginProviders.GOOGLE]: new GoogleAuthProvider(),
  // [LoginProviders.TWITTER]: new TwitterAuthProvider(),
};

export const Logout = async (setUser?: () => void) => {
  const auth = getAuth();
  return signOut(auth)
    .then(() => {
      if (setUser) {
        setUser();
      }
      // const parentEmail = localStorage.getItem("parentEmail");
      // localStorage.clear();
      // if (parentEmail) {
      //   localStorage.setItem("parentEmail", parentEmail);
      // }
      window.localStorage.setItem('mfa_passed', 'false');
      return true;
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
      return false;
    });
};

export const LoginAuthProvider = async (
  setUser: (user: AuthUser) => void,
  provider: AuthProvider,
  showToast: (
    content: ToastContent,
    type?: ToastType,
    options?: ToastOptions | undefined,

  ) => void,
  setSmsVerification?: (s: string) => void,
  callback?: (s: any) => void,
  refer?: any,
  parentEmailId?:any,
) => {
  // const auth = getAuth();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log(auth);


    if (auth?.currentUser?.photoURL === 'mfa') {
      localStorage.setItem('mfa_passed', 'true');
    } else {
      localStorage.setItem('mfa_passed', 'false');
    }


    const isFirstLogin = getAdditionalUserInfo(result)
    const userRef = doc(db, "users", user.uid);
    const userinfo = await getDoc<UserProps>(userRef.withConverter(userConverter));
    const info = userinfo.data();
    if (isFirstLogin?.isNewUser) {
      if (auth.currentUser) {
        await genericThirdPartyLogin({
          payload: { email: (auth.currentUser?.email || ''), password: '!@#$%^&*#!#%^DF1', passwordConfirm: '!@#$%^&*#!#%^DF1', agree: true, },
          callback: { successFunc: () => { }, errorFunc: () => { } },
          userData: {
            // ...userDefaultData,
            firstTimeLogin: true,
            displayName: (auth.currentUser?.displayName || ''),
            avatar: (auth.currentUser?.photoURL || ''),
          },
          parentEmailId: parentEmailId
        });
      }
      const referUser = await getReferUser(V2EParliament.firestore());

      await saveUserData((auth?.currentUser?.uid || ''), db, {
        // ...userDefaultData,
        firstTimeLogin: true,
        parent: referUser?.uid,
        // email: auth?.currentUser?.email,
        // displayName: (auth.currentUser?.displayName || ''),
        // avatar: (auth.currentUser?.photoURL || ''),
      });
    }
    if (auth?.currentUser?.email) {
      await storeAllPlatFormUserId(auth?.currentUser?.email);
    }
    if (auth?.currentUser?.photoURL === 'mfa') {
      localStorage.setItem('mfa_passed', 'true');
    } else {
      localStorage.setItem('mfa_passed', 'false');
    }
    // await sendEmail().then(()=>console.log('welcome mail')).catch(err=>console.log('welcome error',err))
    if (callback) {

      // console.log('callback called for refeer',user)
      callback({ parent: refer, child: user.uid })
    }

    if (isFirstLogin?.isNewUser) {
      // saveUsername(user.uid, '', '')


      setTimeout(() => {

        setUser(user);
      }, 100);
    } else {

      console.log('user', info)
      // @ts-ignore
      if (info?.mfa) {

        console.log('datacalled')
        // @ts-ignore
        setSmsVerification(true)
      }
      // setUser(user);

    }
  } catch (e) {
    console.log(e, "check this error 2")
    // @ts-ignore

    if (e?.code == 'auth/multi-factor-auth-required') {
      // The user is a multi-factor user. Second factor challenge is required.
      // @ts-ignore
      const resolver = getMultiFactorResolver(auth, e);

      const phoneInfoOptions = {
        multiFactorHint: resolver?.hints[0],
        session: resolver?.session
      };
      // console.log('phonebook',phoneInfoOptions)
      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const recaptchaVerifier = new RecaptchaVerifier(
        "loginId",
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
      // console.log('captcha',recaptchaVerifier)
      phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier)
        .then(function (verificationId) {
          // @ts-ignore
          setSmsVerification({ verificationId, resolver })

          // verificationId will be needed for sign-in completion.
        }).catch(err => console.log('captcha', err));
      //   ...
    }
    else {
      const errorMessage = (e as Error).message;
      console.log('error message', errorMessage)
      showToast(errorMessage == 'Firebase: Error (auth/popup-closed-by-user).' || errorMessage == 'Error (auth/cancelled-popup-request).' ? 'Authentication popup was closed by the user' : errorMessage, ToastType.ERROR);
    }
  }
};

const getValue = (e: FormEvent<HTMLFormElement>, name: string) => {
  return (
    (e.target as HTMLFormElement).elements.namedItem(name) as HTMLInputElement
  ).value;
};

export const LoginRegular = async (
  e: FormEvent<HTMLFormElement>,
  callback: Callback<AuthUser>
) => {
  e.preventDefault();
  const auth = getAuth();
  const email = getValue(e, "email");
  const password = getValue(e, "password");
  var showErroe = false;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const isFirstLogin = getAdditionalUserInfo(userCredential);
    if (auth?.currentUser?.photoURL === 'mfa') {
      localStorage.setItem('mfa_passed', 'true');
    } else {
      localStorage.setItem('mfa_passed', 'false');
    }

    if (auth?.currentUser?.email) {
      await storeAllPlatFormUserId(auth?.currentUser?.email);
    }

    if (auth?.currentUser?.emailVerified) {
      if (isFirstLogin?.isNewUser) {
        const firstTimeLogin: Boolean = true
        const userRef = doc(db, "users", userCredential?.user?.uid);
        await setDoc(userRef, { firstTimeLogin }, { merge: true });
        console.log(isFirstLogin, 'firsttimelogin success')

        setTimeout(() => {
          callback.successFunc(userCredential.user)
        }, 100);
      } else {
        callback.successFunc(userCredential.user)
      }
    } else {
      Logout();
      callback.errorFunc({ message: 'Please verify your email address.' } as Error)
    };
  } catch (err) {


    // @ts-ignore
    console.log(err.message, "allcode")
    // @ts-ignore
    switch (err.code) {
      case 'auth/wrong-password':

        callback.errorFunc({ message: 'Your password is invalid.' } as Error);
        break;
      case 'auth/user-not-found':

        callback.errorFunc({ message: 'This user not found' } as Error);
        break;
      case 'auth/too-many-requests':
        callback.errorFunc({ message: 'Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later .' } as Error);
        break;
      case 'auth/invalid-email':
        callback.errorFunc({ message: 'This Email is not Valid.' } as Error);
        break;
      // @ts-ignore      
      default: showErroe = true;
    }

    // @ts-ignore    
    const matches = err.code.replace("auth/", "");
    const lastmatches = matches.replace(/\b(?:-)\b/gi, " ");
    if (showErroe) {
      callback.errorFunc({ message: lastmatches } as Error);
      showErroe = false
    }
  }
};

export const validateSignup = (payload: SignupPayload) => {
  const email = payload.email;
  const password1 = payload.password;
  const password2 = payload.passwordConfirm;
  if (password1 !== password2) {
    throw new Error("Passwords are not equal");
  }

  if (!payload.agree) {
    throw new Error("You must agree to t&c");
  }

  if (!email) {
    throw new Error("Email is required");
  }

  if (!password1) {
    throw new Error("Password is required");
  }

  return true;
};

export const SignupRegular = async (
  payload: SignupPayload,
  callback: Callback<AuthUser>,
  parentEmailId?: any
) => {
  const auth = getAuth();
  try {
    validateSignup(payload);
    console.log("this function call")
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      payload.email,
      payload.password
    );
    // @ts-ignore
    await sendEmailVerification(auth?.currentUser).then((data) => {
      showToast("Successfully sent  verification link on your mail");
    });

    const referUser = await getReferUser(V2EParliament.firestore(), parentEmailId);    

    
    await saveUserData((auth?.currentUser?.uid || ''), db, {

      firstTimeLogin: true,
      parent: referUser?.uid,
      // displayName: await generateUsername()
    });
    
    await assign({ parent: referUser?.uid, child: auth?.currentUser?.uid })
    // showToast("User register successfully.", ToastType.SUCCESS);
    // @ts-ignore
    // callback.successFunc(auth?.currentUser)
    Logout();
    return true;
  } catch (e) {
    // callback.errorFunc(e as Error);

    // @ts-ignore
    const matches = e.code.replace("auth/", "");
    const lastmatches = matches.replace(/\b(?:-)\b/gi, " ");
    // callback.errorFunc({ message: lastmatches } as Error);
    return false;
  }
};

export const genericLogin = async (payload: SignupPayload, callback: Callback<any>, parentEmailId?: any) => {
  
  console.log(parentEmailId,"parentEmailIdlogin")
  Promise.all([
    SignupRegular(payload, callback, parentEmailId),
    SignupRegularForCoinParliament(payload, callback, {},parentEmailId),
    SignupRegularForSportParliament(payload, callback, {}, parentEmailId),
    SignupRegularForStockParliament(payload, callback, {}, parentEmailId),
    SignupRegularForVotingParliament(payload, callback, {}, parentEmailId)
  ]).then(() => {
    // callback.successFunc({});
  }).catch(() => { })
  // SignupRegular(payload, callback).then(async (res) => {
  //   await SignupRegularForCoinParliament(payload, callback);
  //   await SignupRegularForSportParliament(payload, callback);
  //   await SignupRegularForStockParliament(payload, callback);
  //   await SignupRegularForVotingParliament(payload, callback);
  // }).catch(() => {

  // });
}

export const genericThirdPartyLogin = async ({ payload, callback, userData, parentEmailId }: {
  payload: SignupPayload,
  callback: Callback<AuthUser>,
  userData?: { [key: string]: any }
  parentEmailId?:any
}) => {

  await SignupRegularForCoinParliament(payload, callback, userData, parentEmailId);
  await SignupRegularForSportParliament(payload, callback, userData, parentEmailId);
  await SignupRegularForStockParliament(payload, callback, userData, parentEmailId);
  await SignupRegularForVotingParliament(payload, callback, userData, parentEmailId);
}

export const verifySportEmail = async (uid: string, email: string, domain: string) => {
  if (uid) {
    await axios.post(domain + `/verifyUserEmail`, {
      data: {
        uid,
        email
      }
    }).then(() => {
      console.log(domain + ' email verified');
      return true;
    }).catch(() => {
      console.log(domain + ' email verified failed');
      return false;
    });
  }
}

export const assignRef = async (parent: string, child: string, domain: string) => {
  if (child && parent) {
    await axios.post(domain + `/assignReferrer`, {
      data: {
        parent,
        child
      }
    }).then(() => {
      console.log(domain + ' assignRef');
      return true;
    }).catch(() => {
      console.log(domain + ' assignRef');
      return false;
    });
  }
}




export type SignupPayload = {
  email: string;
  password: string;
  passwordConfirm: string;
  agree: boolean;
};
