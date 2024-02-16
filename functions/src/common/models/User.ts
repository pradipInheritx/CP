import admin from "firebase-admin";
import * as jwt from "jsonwebtoken";

import { UserProps, UserTypeProps } from "../interfaces/User.interface";
import env from "../../env/env.json";
import { sendEmail } from "../services/emailServices";
import { userVerifyEmailTemplate } from "../emailTemplates/userVerifyEmailTemplate";

import FirestoreDataConverter = admin.firestore.FirestoreDataConverter;
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

export const sendEmailVerificationLink = async (email:string)=>{
  try {
    console.log("user email : ", email);
    // Get user data from Firebase Authentication
    const userRecord = await admin.auth().getUserByEmail(email);
    console.log("user record : ", userRecord)

    // Check if the user registered with Google
    if (userRecord.providerData.some(provider => provider.providerId === 'google.com')) {
      console.log("User registered with Google. Skipping verification email.");
      return { skipped: true }; 
    }


    // Create a JWT token with user data
    const token = jwt.sign(
      { uid: userRecord.uid, email: userRecord.email },
      env.JWT_AUTH_SECRET
    );

    // Construct the verification link with the JWT token
    const verificationLink = `${env.USER_VERIFICATION_BASE_URL}/api/v1/user/verified?token=${token}`;

    if (email && verificationLink) {
      await sendEmail(
        email,
        "Verify Your Account",
        userVerifyEmailTemplate(email, verificationLink, "Your account has been created. Please verify your email for login.")
      );
      console.info("Send Email Successfully");
    }

    console.log("Verification link:", verificationLink);
    return { verificationLink }
  } catch (error) {
    console.error("Error sending verification link:", error);
    return { error }
  }
}