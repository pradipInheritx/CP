import * as functions from "firebase-functions";
import {firestore} from "firebase-admin";  
import moment from 'moment';

import { validPassword, generateAuthToken, generateRefreshToken, verifyRefreshToken } from "../helpers/commonFunction.helper";
import env from "../../env/env.json";
import constants from "../config/constants.json";

const jwt = require('jsonwebtoken');

export type adminProps = {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    webAppAccess: string[];
    status?: number;
    user_type: number;
    auth_tokens: Object[];
    refresh_tokens: string;
    createdAt?:number;
    updatedAt?:number;
};


export async function admin_login(email: string, password: string) {
    const query = await firestore().collection("admin").where("email", "==", email).get();

    if (!query.empty) {
        const snapshot = query.docs[0];
        const adminUser = snapshot.data();

        //console.log("Admin User Data ==>", adminUser);

        let passwordCheck = await validPassword(password, adminUser.password);

        console.log("PASSWORD CHECK", passwordCheck);

        if(!passwordCheck) {
            throw new functions.https.HttpsError("invalid-argument", 'Enter a valid email or password.');
        }

        let authTokenObj = await generateAuthToken(adminUser.id, adminUser.user_type);
        let refresh_tokens = await generateRefreshToken(adminUser.id, adminUser.user_type);

        adminUser.auth_tokens.push(authTokenObj);
        adminUser.refresh_tokens = refresh_tokens;

        await firestore().collection("admin").doc(adminUser.id).set(adminUser);

        adminUser.auth_tokens = adminUser.auth_tokens[adminUser.auth_tokens.length - 1];

        return adminUser;

    } else {
        throw new functions.https.HttpsError("not-found", 'Entered email id is not registered.');
    }

}


export async function generateAuthTokens(refresh_tokens: string) {
    const decodedUser = await verifyRefreshToken(refresh_tokens)

    console.log("DECODED USER", decodedUser);

    if(!decodedUser) {
        throw new functions.https.HttpsError("unauthenticated", 'Unauthorized, please login.');
    }

    const query = await firestore().collection("admin").where("id", "==", decodedUser.id).get();

    console.log("QUERY", query.empty);
    if (!query.empty) {
        const snapshot = query.docs[0];
        const adminUser = snapshot.data();

        console.log("Admin User Data ==>", adminUser);

        let newToken = await generateAuthToken(adminUser.id, adminUser.user_type);

        return newToken;
    } else {
        throw new functions.https.HttpsError("unauthenticated", 'Unauthorized, please login.');
    }
}

export async function forgotPassword(email: string, user_type: number) {
    const existingUser = await firestore()
    .collection("admin")
    .where("email", "==", email)
    .where("user_type", "in", user_type)
    .get();

    if(existingUser.empty) {
        throw new functions.https.HttpsError("not-found", 'User does not exist.');
    }


    const snapshot = existingUser.docs[0];
    const userData = snapshot.data();

    userData.updatedAt = parseInt(moment().format('X'))
    let reset_password_token = jwt.sign({
        data: email
    }, env.JWT_AUTH_SECRET, {
        expiresIn: constants.URL_EXPIRE_TIME
    });

    userData.reset_password_token = reset_password_token;

    await firestore().collection("admin").doc(userData.id).set(userData);

    //sendEmail
    
}

