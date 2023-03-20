import * as functions from "firebase-functions";
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

export type adminUserProps = {
  firstName?: string;
  lastName?: string;
  email?: string;
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

    res.status(201).send({
      status: true,
      message: "User created successfully. ",
      result: getAdminAdded.data(),
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

    const authTokenObj = await generateAuthToken({
      id: adminUserId,
      ...adminUser,
    });

    const refreshToken = await generateRefreshToken(adminUser);

    adminUser.authTokens.push(authTokenObj);
    adminUser.refreshToken = refreshToken;

    await admin.firestore().collection("admin").doc(adminUserId).set(adminUser);

    res.status(200).send({
      status: true,
      message: "User logged in successfully",
      result: adminUser,
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

export async function generateAuthTokens(refresh_tokens: string) {
  const decodedUser: any = await verifyRefreshToken(refresh_tokens);

  if (!decodedUser) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Unauthorized, please login."
    );
  }

  const query = await admin
    .firestore()
    .collection("admin")
    .where("id", "==", decodedUser.id)
    .get();

  console.log("QUERY", query.empty);
  if (!query.empty) {
    const snapshot = query.docs[0];
    const adminUser = snapshot.data();

    console.log("Admin User Data ==>", adminUser);

    const newToken = await generateAuthToken(adminUser);

    return newToken;
  } else {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Unauthorized, please login."
    );
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


export const errorLogging = async (
  funcName: string,
  type: string,
  error: any
) => {
  console.info(funcName, type, error);
};

