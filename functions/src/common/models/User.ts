import admin from "firebase-admin";
import * as jwt from "jsonwebtoken";

import { UserProps, UserTypeProps } from "../interfaces/User.interface";
import env from "../../env/env.json";
// import consts from "../config/constants.json"
// import { sendEmail } from "../services/emailServices";
// import { adminForgotPasswordTemplate } from "../emailTemplates/adminForgotPassword";

import FirestoreDataConverter = admin.firestore.FirestoreDataConverter;
// import { errorLogging } from "../helpers/commonFunction.helper";
// import { errorLogging } from "../helpers/commonFunction.helper";
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
    const admins = await admin
      .firestore()
      .collection("settings")
      .doc("admins")
      .get();
    return !!admins.data()?.admins.includes(user);
  } catch (e) {
    console.log(e);
    return false;
  }
};

const auth = admin.auth();

export async function sendEmailVerificationLink(email: string) {
  try {
    // Get user data from Firebase Authentication
    const userRecord = await auth.getUserByEmail(email);

    // Create a JWT token with user data
    const token = jwt.sign(
      { uid: userRecord.uid, email: userRecord.email },
      env.JWT_AUTH_SECRET
    );

    // Construct the verification link with the JWT token
    const verificationLink = `${env.BASE_SITE_URL}/verify?token=${token}`;

    // Send the verification email to the user
    // Implement your email sending logic here

    console.log("Verification link:", verificationLink);
  } catch (error) {
    console.error("Error sending verification link:", error);
  }
}

interface JwtPayload {
  id: string;
}

export async function verifyUserWithToken(token: string) {
  try {
    // Verify the JWT token
    const decodedToken: any = (await jwt.verify(
      token,
      env.JWT_AUTH_SECRET
    )) as JwtPayload;

    // Use the UID from the decoded token to verify the user in Firebase Authentication
    auth
      .updateUser(decodedToken.uid, { emailVerified: true })
      .then((userRecord) => {
        console.log("User successfully verified:", userRecord.toJSON());
      })
      .catch((error) => {
        console.error("Error verifying user:", error);
      });
  } catch (error) {
    console.error("Error decoding or verifying token:", error);
  }
}

// export const sendEmailVerificationLink = async (email:string,uid:string)=>{
//   try {
//     if(!email) return errorLogging("sendEmailVerificationLink","Error","email is required");
//     //testing only
//     const getAllUser = await admin.auth().listUsers();
//     console.log("getAllUser : ",getAllUser);
//     const checkUserExistById = await admin.auth().getUser(uid);
//     const checkUserExistByEmail = await admin.auth().getUserByEmail(email);

//     console.log("checkUserExistById : ",checkUserExistById);
//     console.log("checkUserExistByEmail : ",checkUserExistByEmail);
//     // if(!checkUserExist) return errorLogging("sendEmailVerificationLink","Error","user does not exist");

//     return {
//       users :{
//         byId : checkUserExistById,
//         byEmail : checkUserExistByEmail
//       }
//     }

//   } catch (error) {
//     errorLogging("sendEmailVerificationLink","Error",error)
//   }
// };
