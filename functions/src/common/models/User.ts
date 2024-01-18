import admin from "firebase-admin";
// import {getAuth,updateProfile} from "firebase/auth"
import { UserProps, UserTypeProps } from "../interfaces/User.interface";
import * as jwt from "jsonwebtoken";
import env from "../../env/env.json";

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



interface JwtPayload {
  id: string;
}

export const userVerifiedLink = async (req: any, res: any) => {
  try {
    const { token } = req.query;
    console.log("token : ", token);
    const decodedToken: any = (await jwt.verify(
      token,
      env.JWT_AUTH_SECRET
    )) as JwtPayload;
    console.log("decoded token : ", decodedToken);

    const getUser = await admin.auth().getUser(decodedToken?.uid);
    if (getUser && getUser.emailVerified) {
      return res.send(200).status({
        status: true,
        message: 'User is verified',
        result: {
          uid : decodedToken?.uid,
          email : getUser?.email,
          emailVerified : getUser?.emailVerified
        }
      })
    }

   const updateUser = await admin.auth().updateUser(decodedToken?.uid,{
      emailVerified : true
    })
    res.send(200).status({
      status: true,
      message: 'User is verified',
      result: updateUser
    })

  } catch (error) {
    errorLogging("userVerifiedLink", "Error", error);
    res.status(500).send(
      {
        status: false,
        message: 'Something went wrong',
        error
      }
    )
  }
}