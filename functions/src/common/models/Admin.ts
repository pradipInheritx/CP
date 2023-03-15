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
} from "../helpers/commonFunction.helper";
import env from "../../env/env.json";
import constants from "../config/constants.json";
import { sendEmail } from "../services/emailServices";
import { AdminSignupTemplate } from "../emailTemplates/adminSignupTemplate";
import { AdminForgotPasswordTemplate } from "../emailTemplates/adminForgotPassword";
import { hashPassword } from "../../common/helpers/commonFunction.helper";
// import {ws} from "../../common/models/Ajax";

export type adminUserProps = {
  firstName?: string;
  lastName?: string;
  email?: string;
  isAdmin?: boolean;
  adminUserId?: any;
  password?: string;
  webAppAccess: string[];
  status?: string;
  auth_tokens: Object[];
  refresh_tokens: any;
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

    let password = generator.generate({
      length: 10,
      numbers: true,
    });

    let hashedPassword = await hashPassword(password);

    const adminData: adminUserProps = {
      email,
      firstName,
      lastName,
      webAppAccess,
      status,
      password: hashedPassword,
      auth_tokens: [],
      refresh_tokens: null,
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
      AdminSignupTemplate(email, password, "Your account has been created")
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

export async function login(req: any, res: any, next: any) {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const query = await admin
      .firestore()
      .collection("admin")
      .where("email", "==", email)
      .get();

    if (query.empty || query.docs[0].data() == undefined) {
      throw new functions.https.HttpsError(
        "not-found",
        "Entered email id is not registered."
      );
    }
    const snapshot = query.docs[0];
    const adminUser = snapshot.data();

    console.log("Admin User Data ==>", adminUser);

    let passwordCheck = await validPassword(password, adminUser.password);

    console.log("PASSWORD CHECK", passwordCheck);

    if (!passwordCheck) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Enter a valid email or password."
      );
    }

    let authTokenObj = await generateAuthToken(
      adminUser.id,
      adminUser.user_type
    );
    let refresh_tokens = await generateRefreshToken(
      adminUser.id,
      adminUser.user_type
    );

    adminUser.auth_tokens.push(authTokenObj);
    adminUser.refresh_tokens = refresh_tokens;

    await admin
      .firestore()
      .collection("admin")
      .doc(adminUser.id)
      .set(adminUser);

    adminUser.auth_tokens =
      adminUser.auth_tokens[adminUser.auth_tokens.length - 1];

    res.status(200).send(adminUser);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function generateAuthTokens(refresh_tokens: string) {
  const decodedUser = await verifyRefreshToken(refresh_tokens);

  console.log("DECODED USER", decodedUser);

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

    let newToken = await generateAuthToken(adminUser.id, adminUser.user_type);

    return newToken;
  } else {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "Unauthorized, please login."
    );
  }
}

export async function adminForgotPassword(req: any, res: any, next: any) {
  const email = req.body.email;

  try {
    console.log("Forgot Password :::::", email);
    const existingUser = await admin
      .firestore()
      .collection("admin")
      .where("email", "==", email)
      .get();

    if (existingUser.empty) {
      throw new functions.https.HttpsError("not-found", "User does not exist.");
    }
    const snapshot = existingUser.docs[0];
    const userData = snapshot.data();

    userData.updatedAt = parseInt(moment().format("X"));
    console.log("userData", userData);
    let reset_password_token = jwt.sign(
      {
        data: email,
      },
      env.JWT_AUTH_SECRET,
      {
        expiresIn: constants.URL_EXPIRE_TIME,
      }
    );

    userData.reset_password_token = reset_password_token;

    await admin.firestore().collection("admin").doc(userData.id).set(userData);

    const url =
      "https://coinparliamentstaging.firebaseapp.com/" +
      `/reset-password?token=` +
      reset_password_token;

    //sendEmail
    await sendEmail(
      email,
      "Forgot Password",
      AdminForgotPasswordTemplate(url, "Forgot Password")
    );

    res.status(200).send({
      message:
        "Please check your email to reset password, your link will be expired in an hour ",
    });
  } catch (err) {
    throw new functions.https.HttpsError(
      "internal",
      "Something went wrong. Please try again later."
    );
  }
}

export const logout = async (req: any, res: any) => {
  try {
    const existingUser = await admin
      .firestore()
      .collection("admin")
      .where("id", "==", req.user.id)
      .get();

    const snapshot = existingUser.docs[0];
    const userData = snapshot.data();

    userData.auth_tokens = userData.auth_tokens.filter(
      (item: any) => item.token !== req.token
    );

    await admin
      .firestore()
      .collection("admin")
      .doc(userData.id)
      .set(userData)
      .then(() => {
        console.log("Logout Successfully..");
      })
      .catch((error: any) => {
        console.log("logout error....", error);
      });

    // return { message: "Logout Successfully.." }
    res.status(200).send({
      message: "Logout successfully.",
    });
  } catch (error) {
    console.log("logout ", error);
    throw new functions.https.HttpsError(
      "internal",
      "Something went wrong. Please try again later."
    );
  }
};

export const adminChangePassword = async (req: any, res: any) => {
  const oldPassword: string = req.body.oldPassword;
  const newPassword: string = req.body.newPassword;
  try {
    const userData = await admin
      .firestore()
      .collection("admin")
      .doc(req.user.id)
      .get();

    const user = userData.data();
    if (!user) {
      throw new functions.https.HttpsError("not-found", "User does not exist.");
    }

    let passwordCheck = await validPassword(oldPassword, user.password);

    if (!passwordCheck) {
      throw new functions.https.HttpsError(
        "internal",
        "Old password does not match."
      );
    }

    let hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await admin
      .firestore()
      .collection("admin")
      .doc(user.id)
      .set(user)
      .then(() => console.log("ChangePassword done..."))
      .catch((error) => console.log("ChangePassword changed...", error));

    res.status(200).send({
      message: "Your password changed successfully.",
    });
  } catch (error) {
    throw new functions.https.HttpsError(
      "internal",
      "Something went wrong. Please try again later."
    );
  }
};

export const adminResetPassword = async (req: any, res: any) => {
  try {
    const restPassword = await req.body.reset_password_token;
    const newPasswordData = await req.body.newPassword;

    const userRef = await admin
      .firestore()
      .collection("admin")
      .where("reset_password_token", "==", restPassword)
      .get();

    if (userRef.empty) {
      return res.status(404).send("User does not exist.");
    }

    const user = userRef.docs[0].data();
    console.log("USER userRef.docs[0].data() >>>>>>>", user);

    const newPassword = await hashPassword(newPasswordData);
    user.password = newPassword;
    user.reset_password_token = null;

    console.log(
      `user.password >>>> ${user.password} \n user.rest_password >>>> ${user.reset_password_token}`
    );

    await admin
      .firestore()
      .collection("admin")
      .doc(user.id)
      .set(user)
      .then(() => console.log("ResetPassword done..."))
      .catch((error) => console.log("ResetPassword changed...", error));

    res.status(200).send("Your Password reset successfully.");
  } catch (error) {
    throw new functions.https.HttpsError(
      "internal",
      "Something went wrong. Please try again later.>>>>>>>>"
    );
  }
};

export const errorLogging = async (
  funcName: string,
  type: string,
  error: any
) => {
  console.info(funcName, type, error);
};
