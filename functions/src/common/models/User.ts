import { firestore } from "firebase-admin";
import FirestoreDataConverter = firestore.FirestoreDataConverter;
import admin from "firebase-admin";
import * as jwt from "jsonwebtoken";
import env from "../../env/env.json";
import { sendEmail } from "../services/emailServices";
import { userVerifyEmailTemplate } from "../emailTemplates/userVerifyEmailTemplate";

// import {DictionaryKeys} from "./Dictionary";

export type UserTypeProps = {
  index: number;
  name: string;
  givenCPM: number;
  weight: number;
  color?: Colors;
  share: number;
  minVote?: number;
};

export enum Colors {
  PLATINUM = "Platinum",
  GOLD = "Gold",
  SILVER = "Silver",
}

export type UserProps = {
  uid?: string;
  paid?: boolean;
  displayName?: string;
  address?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
  phone?: string;
  country?: string;
  children: string[];
  status?: UserTypeProps;
  parent?: string;
  mfa: boolean;
  voteStatistics?: VoteStatistics;
  leader?: string[];
  subscribers?: string[];
  favorites: string[];
  token?: string;
  wallet?: string;
  rewardStatistics?: RewardStatistics;
  firstTimeLogin?: boolean;
  refereeScrore?: number;
  googleAuthenticatorData?: any,
  voteValue?: number,
  wellDAddress?: wellDAddressType,
  referalReceiveType?: referalReceiveType;
  isVoteToEarn?: boolean;
};

export type wellDAddressType = []

export type referalReceiveType = {
  name: string,
  amount: string,
  days: string,
  limitType: string
}


export type RewardStatistics = {
  total: number;
  claimed: number;
  cards: string[];
  extraVote: number;
  diamonds: number;
};

export type VoteStatistics = {
  total: number;
  successful: number;
  score: number;
  rank: number;
  commission: number;
  pax: number;
};

export interface JwtPayload {
  id: string;
}


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
    const admins = await firestore().collection("settings").doc("admins").get();
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
    const verificationLink = `${env.USER_VERIFICATION_BASE_URL_STOCKPARLIAMENT}/api/v1/user/verified?token=${token}`;

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
