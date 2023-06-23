import * as admin from "firebase-admin";
import moment from "moment";
import * as jwt from "jsonwebtoken";
import * as generator from "generate-password";

import {
  validPassword,
  generateAuthToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashPassword,
} from "../../helpers/commonFunction.helper";
import env from "../../../env/env.json";
import constants from "../../config/constants.json";
import { sendEmail } from "../../services/emailServices";
import { adminSignupTemplate } from "../../emailTemplates/adminSignupTemplate";
import { adminForgotPasswordTemplate } from "../../emailTemplates/adminForgotPassword";
import speakeasy from "speakeasy";

export type adminUserProps = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: number;
  isAdmin?: boolean;
  adminUserId?: string;
  password?: string;
  webAppAccess: string[];
  status?: string;
  authTokens?: string[];
  refreshToken: string;
  createdAt?: number;
  updatedAt?: number;
};

export const adminCreate = async (req: any, res: any, next: any) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      webAppAccess,
      status,
      isAdmin,
      adminUserId,
    } = req.body;

    const query = await admin
      .firestore()
      .collection("admin")
      .where("email", "==", email)
      .get();

    if (!isAdmin && !adminUserId) {
      return res.status(400).json({
        status: false,
        message:
          "If you are registering subadmin. Please provide the valid super admin user ID",
        result: null,
      });
    }

    if (!query.empty) {
      return res.status(409).json({
        status: false,
        message:
          "Admin user with this email id already exists. Please enter different email id",
        result: null,
      });
    }

    const password = generator.generate({
      length: 10,
      numbers: true,
    });
    console.log("Password >>>>", password);

    const hashedPassword = await hashPassword(password);

    const adminData: adminUserProps = {
      email,
      phone,
      firstName,
      lastName,
      webAppAccess,
      status,
      password: hashedPassword,
      authTokens: [],
      refreshToken: "",
      isAdmin,
      adminUserId,
      createdAt: parseInt(moment().format("X")),
      updatedAt: parseInt(moment().format("X")),
    };

    const getResponse = await admin
      .firestore()
      .collection("admin")
      .add(adminData);

    const getAdminAdded = await getResponse.get();

    await sendEmail(
      email,
      "Account created",
      adminSignupTemplate(email, password, "Your account has been created")
    );

    const getAdminData = { id: getAdminAdded.id, ...getAdminAdded.data() };

    res.status(201).send({
      status: true,
      message: "User created successfully. ",
      result: getAdminData,
    });
  } catch (error) {
    errorLogging("adminCreate", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
};

export async function login(req: any, res: any) {
  try {
    const { email, password } = req.body;

    const query = await admin
      .firestore()
      .collection("admin")
      .where("email", "==", email)
      .get();

    const getAdminUserData = query.docs;
    if (getAdminUserData && getAdminUserData.length == 0) {
      return res.status(409).json({
        status: false,
        message: "Please enter valid email address",
        result: null,
      });
    }
    const snapshot = query.docs[getAdminUserData.length - 1];
    const adminUser = snapshot.data();
    const adminUserId = snapshot.id;

    const isPasswordValid = await validPassword(password, adminUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: false,
        message: "Please enter valid email and password",
        result: null,
      });
    }

    const currentAdminUser = Object.assign({}, adminUser);
    delete currentAdminUser.authTokens;
    delete currentAdminUser.refreshToken;

    const authTokenObj = await generateAuthToken({
      id: adminUserId,
      ...currentAdminUser,
    });

    const refreshToken = await generateRefreshToken({
      id: adminUserId,
      ...currentAdminUser,
    });

    adminUser.authTokens.push(authTokenObj);
    adminUser.refreshToken = refreshToken;

    await admin.firestore().collection("admin").doc(adminUserId).set(adminUser);

    res.status(200).send({
      status: true,
      message: "User logged in successfully",
      result: { id: adminUserId, ...adminUser },
    });
  } catch (error) {
    errorLogging("login", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
}

export async function generateAuthTokens(req: any, res: any) {
  const { refreshToken } = req.body;
  try {
    const decodedUser: any = await verifyRefreshToken(refreshToken);

    const user = decodedUser.userAdmin;
    const id = user.id;

    if (!decodedUser) {
      return res.status(401).send({
        status: false,
        message: "Unauthorized, please login.",
        result: null,
      });
    }
    const query = await admin.firestore().collection("admin").doc(id).get();

    if (!query) {
      return res.status(404).send({
        status: false,
        message: "User not found.",
        result: null,
      });
    }
    const adminUser = query.data();
    const currentAdminUser = Object.assign({}, adminUser);
    delete currentAdminUser.authTokens;
    delete currentAdminUser.refreshToken;

    const newToken = await generateAuthToken(currentAdminUser);

    res.status(200).send({
      status: true,
      message: "new token generated.",
      result: newToken,
    });
  } catch (error) {
    errorLogging("generateAuthTokens", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
}

export async function adminForgotPassword(req: any, res: any) {
  const { email } = req.body;

  try {
    const query = await admin
      .firestore()
      .collection("admin")
      .where("email", "==", email)
      .get();

    const getAdminUserData = query.docs;
    if (getAdminUserData && getAdminUserData.length == 0) {
      return res.status(404).json({
        status: false,
        message: "User does not exist",
        result: null,
      });
    }

    const snapshot = query.docs[0];
    const userData = snapshot.data();
    const adminUserId = snapshot.id;

    userData.updatedAt = parseInt(moment().format("X"));

    const reset_password_token = jwt.sign(
      {
        data: email,
      },
      env.JWT_AUTH_SECRET,
      {
        expiresIn: constants.URL_EXPIRE_TIME,
      }
    );

    userData.reset_password_token = reset_password_token;

    await admin.firestore().collection("admin").doc(adminUserId).set(userData);

    const url =
      "https://coinparliamentstaging.firebaseapp.com/" +
      "/reset-password?token=" +
      reset_password_token;

    await sendEmail(
      email,
      "Forgot Password",
      adminForgotPasswordTemplate(url, "Forgot Password")
    );

    res.status(200).send({
      status: true,
      message:
        "Please check your email to reset password, your link will be expired in an hour ",
      result: null,
    });
  } catch (error) {
    errorLogging("adminForgotPassword", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
}

export const adminChangePassword = async (req: any, res: any) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const adminData = await admin
      .firestore()
      .collection("admin")
      .doc(req.user.id)
      .get();

    const user = adminData.data();
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User does not exist.",
        result: null,
      });
    }

    const passwordCheck = await validPassword(oldPassword, user.password);

    if (!passwordCheck) {
      return res.status(401).json({
        status: false,
        message: "Old password does not match.",
        result: null,
      });
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await admin
      .firestore()
      .collection("admin")
      .doc(req.user.id)
      .set(user)
      .then(() => console.log("ChangePassword done..."))
      .catch((error) => console.log("ChangePassword changed...", error));

    res.status(200).send({
      status: true,
      message: "Your password changed successfully.",
      result: null,
    });
  } catch (error) {
    errorLogging("adminChangePassword", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
};

export const adminResetPassword = async (req: any, res: any) => {
  try {
    const { reset_password_token, newPassword } = await req.body;
    const query = await admin
      .firestore()
      .collection("admin")
      .where("reset_password_token", "==", reset_password_token)
      .get();

    if (query.empty) {
      return res.status(404).json({
        status: false,
        message: "User does not exist.",
        result: null,
      });
    }

    const snapshot = query.docs[0];
    const userData = snapshot.data();
    const adminUserId = snapshot.id;

    const newHashPassword = await hashPassword(newPassword);
    userData.password = newHashPassword;
    userData.reset_password_token = null;

    await admin.firestore().collection("admin").doc(adminUserId).set(userData);

    res.status(200).send({
      status: true,
      message: "Your Password reset successfully.",
      result: null,
    });
  } catch (error) {
    errorLogging("adminResetPassword", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
};

export const logout = async (req: any, res: any) => {
  try {
    const { id } = req.user;

    const existingUser = await admin
      .firestore()
      .collection("admin")
      .doc(id)
      .get();

    const userData: any = existingUser.data();

    userData.authTokens = userData.authTokens.filter(
      (item: any) => item.token !== req.token
    );

    await admin
      .firestore()
      .collection("admin")
      .doc(req.user.id)
      .set(userData)
      .then(() => {
        console.log("Logout Successfully In Callback");
      })
      .catch((error: any) => {
        errorLogging("logout", "ERROR", error);
      });

    res.status(200).send({
      status: true,
      message: "User logged out successfully",
      result: null,
    });
  } catch (error) {
    errorLogging("logout", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
};

export const generateGoogleAuthOTP = async (req: any, res: any) => {
  try {
    const { userId, userType } = req.body;
    if (!userId || !userType) {
      return res.status(400).json({
        status: false,
        message: "userId and userType are required.",
        result: null,
      });
    }
    console.log(" userId, userType =>", userId, userType);

    let adminUserData: any;
    if (userType === "ADMIN") {
      adminUserData = await admin
        .firestore()
        .collection("admin")
        .doc(userId)
        .get();
    } else if (userType === "USER") {
      adminUserData = await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .get();
    } else {
      return res.status(400).json({
        status: false,
        message: "Please provide valid userType.",
        result: null,
      });
    }
    console.log(" adminUserData =>", adminUserData);

    const getUserData: any = adminUserData.data();
    console.info("getUserData", getUserData);
    const { ascii, hex, base32, otpauth_url } = speakeasy.generateSecret({
      issuer: "inheritx.com",
      name: getUserData.firstName,
      length: 15,
    });

    console.log(" getUserData =>", getUserData);

    getUserData.googleAuthenticatorData = {
      otp_ascii: ascii,
      otp_auth_url: otpauth_url,
      otp_base32: base32,
      otp_hex: hex,
    };

    console.log("googleAuthenticatorData =>", getUserData);

    if (userType === "ADMIN") {
      await admin.firestore().collection("admin").doc(userId).set(getUserData);
    } else if (userType === "USER") {
      await admin.firestore().collection("users").doc(userId).set(getUserData);
    } else {
      return res.status(400).json({
        status: false,
        message: "Please provide valid userType.",
        result: null,
      });
    }

    res.status(200).send({
      status: true,
      message: "OTP generated successfully",
      result: {
        base32: base32,
        otpauth_url: otpauth_url,
      },
    });
  } catch (error) {
    errorLogging("generateGoogleAuthOTP", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Error in generateGoogleAuthOTP API ",
      result: error,
    });
  }
};

export const verifyGoogleAuthOTP = async (req: any, res: any) => {
  try {
    const { userId, token, userType } = req.body;
    if (!userId) {
      return res.status(404).json({
        status: false,
        message: "UserId must be required.",
        result: null,
      });
    }

    let adminUserData: any;

    if (userType === "ADMIN") {
      adminUserData =
        await admin
          .firestore()
          .collection("admin")
          .doc(userId)
          .get();
    } else if (userType === "USER") {
      adminUserData = await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .get();
    } else {
      return res.status(400).json({
        status: false,
        message: "Please provide valid userType.",
        result: null,
      });
    }

    const getUserData: any = adminUserData.data();

    const verified = speakeasy.totp.verify({
      secret: getUserData.googleAuthenticatorData.otp_base32!,
      encoding: "base32",
      token,
    });
    console.log("verified", verified)

    if (!verified) {
      return res.status(401).json({
        status: false,
        message: "OTP not verified.",
        result: null,
      });
    }

    getUserData.googleAuthenticateOTPVerified = {
      otp_enabled: true,
      otp_verified: true,
    };

    if (userType === "ADMIN") {
      await admin.firestore().collection("admin").doc(userId).set(getUserData);
    } else if (userType === "USER") {
      await admin.firestore().collection("users").doc(userId).set(getUserData);
    } else {
      return res.status(400).json({
        status: false,
        message: "Please provide valid userType.",
        result: null,
      });
    }

    res.status(200).send({
      status: true,
      message: "OTP verified successfully",
      result: {
        otp_verified: true,
        ...getUserData.googleAuthenticateOTPVerified,
      },
    });
  } catch (error) {
    errorLogging("verifyGoogleAuthOTP", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Error in verifyGoogleAuthOTP API ",
      result: error,
    });
  }
};

export const updateUserCollections = async (req: any, res: any) => {
  try {
    const { updateKey, updateValue } = req.body;
    const object: any = {};
    object[updateKey] = updateValue
    console.log("update key ---------", object)

    //update the the data
    const result = await admin.firestore().collection('users').get().then((snapshot: any) => {
      snapshot.forEach((doc: any) => {
        doc.ref.set(object, { merge: true })
      })
    }).catch((error) => {
      errorLogging("addNewKeyandValueForUsers", "ERROR", error);
    });

    res.status(200).send({
      status: true,
      message: "key and value updated successfully",
      result,
    });
  }
  catch (error) {
    errorLogging("addNewKeyandValueForUsers", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Error in addNewKeyandValueForUsers API ",
      result: error,
    });
  }
}

export const getUserList = async (req: any, res: any) => {
  try {
    const getUserList: any = [];
    await admin.firestore().collection('users').get().then((snapshot: any) => {
      snapshot.forEach((user: any) => {
        getUserList.push(user.data());
      })
    });
    console.log("userList =========", getUserList);
    res.status(200).send({
      status: true,
      message: "Get all users successfully",
      result: getUserList,
    });
  } catch (error) {
    errorLogging("addNewKeyandValueForUsers", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Error in addNewKeyandValueForUsers API ",
      result: error,
    });
  }
}

export const errorLogging = async (
  funcName: string,
  type: string,
  error: any
) => {
  console.info(funcName, type, error);
};
