import admin from "firebase-admin";
import * as jwt from "jsonwebtoken";

import { UserProps, UserTypeProps } from '../interfaces/User.interface'
import env from "../../env/env.json";
import consts from "../config/constants.json"
import { sendEmail } from "../services/emailServices";
import { adminForgotPasswordTemplate } from "../emailTemplates/adminForgotPassword";

import FirestoreDataConverter = admin.firestore.FirestoreDataConverter;
import { errorLogging } from "../helpers/commonFunction.helper";
export const userConverter: FirestoreDataConverter<UserProps> = {
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): UserProps {
    const data = snapshot.data() || {};
    return data as UserProps;
  },
  toFirestore(modelObject: UserProps): FirebaseFirestore.DocumentData {
    return modelObject;
  },
};

export const userTypeConverter: FirestoreDataConverter<{
  userTypes: UserTypeProps[];
}> = {
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): {
    userTypes: UserTypeProps[];
  } {
    const data = snapshot.data() || {};
    return data as { userTypes: UserTypeProps[] };
  },
  toFirestore(modelObject: {
    userTypes: UserTypeProps[];
  }): FirebaseFirestore.DocumentData {
    return modelObject;
  },
};

export const defaultUserType = {};
// export const defaultUserType: UserTypeProps = {
//   color: Colors.SILVER,
//   givenCPM: 1,
//   index: 0,
//   name: DictionaryKeys.SPEAKER,
//   weight: 1,
//   share: 35,
//   minVote: 20,
// };

export const isAdmin: (user: string) => Promise<boolean> = async (
  user: string
) => {
  try {
    const admins = await admin.firestore().collection("settings").doc("admins").get();
    return !!admins.data()?.admins.includes(user);
  } catch (e) {
    console.log(e);
    return false;
  }
};

// user verification link and email
export async function sendEmailVerificationLink(email: string) {
  try {
    // make verification link using jwt and user data
    // send email
    if (!email) errorLogging("sendEmailVerificationLink", "ERROR", "email is required")
    // const user = admin.auth().getUserByEmail(email)
    //   .then((snapshot) => snapshot.toJSON());
    // console.log("sendEmailVerificationLink : user : ", user)
    // if (!user) return errorLogging("sendEmailVerificationLink", "ERROR", "User not found")
    const token = jwt.sign({ data: email }, env.JWT_AUTH_SECRET, { expiresIn: consts.USER_VERIFICATION_LINK_EXPIRE_TIME })
    const url =
      env.BASE_SITE_URL +
      "/user-verification-link?token=" +
      token;
    await sendEmail(
      email,
      "Verification Link",
      adminForgotPasswordTemplate(url, "Verification Link")
    );
  } catch (error) {
    return errorLogging("sendEmailVerificationLink", "ERROR", error)
  }
}
interface JwtPayload {
  id: string;
}
export async function getEmailVerificationLink(req: any, res: any) {
  try {
    const { token } = req.query;
    const user: any = jwt.verify(
      token,
      env.JWT_AUTH_SECRET
    ) as JwtPayload;
    console.log("user : ", user);
    if (!user) errorLogging("getEmailVerificationLink", "ERROR", "user not found")
    await admin.auth().updateUser(user?.data.email, {
      emailVerified: true
    });
  } catch (error) {
    return errorLogging("getEmailVerificationLink", "ERROR", error)
  }
}