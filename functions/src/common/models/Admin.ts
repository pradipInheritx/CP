import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import moment from 'moment';
import * as jwt from "jsonwebtoken";
import * as generator from 'generate-password';
const { v4: uuidv4 } = require('uuid');

import { validPassword, generateAuthToken, generateRefreshToken, verifyRefreshToken } from "../helpers/commonFunction.helper";
import env from "../../env/env.json";
import constants from "../config/constants.json";
import { sendEmail } from "../services/emailServices";
import { AdminSignupTemplate } from "../emailTemplates/adminSignupTemplate";
import { AdminForgotPasswordTemplate } from "../emailTemplates/adminForgotPassword";
import { hashPassword } from "../../common/helpers/commonFunction.helper";
// import {ws} from "../../common/models/Ajax";


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
    createdAt?: number;
    updatedAt?: number;
};

export const admin_create = async (req: any, res: any, next: any) => {
    try {
        const { firstName, lastName, email, webAppAccess, status, user_type } = req.body;
        console.log("***create Admin User**");

        console.log("req body =====> ", req.body);

        const query = await admin.firestore().collection("admin").where("email", "==", email).get();

        console.log("admin Already Exist....", query)
        if (!query.empty) {
            throw new functions.https.HttpsError("already-exists", 'Admin user with this email id already exists. Please enter different email id.');
        }

        const id = uuidv4();
        console.log("----data:", res)
        let password = generator.generate({
            length: 10,
            numbers: true
        });

        console.log("Password", password);
        let hashedPassword = await hashPassword(password);

        const adminData: adminProps = {
            id,
            email,
            firstName,
            lastName,
            webAppAccess,
            status,
            password: hashedPassword,
            user_type,
            auth_tokens: [],
            refresh_tokens: '',
            createdAt: parseInt(moment().format('X')),
            updatedAt: parseInt(moment().format('X'))
        };
        console.log("----AdminData:", adminData)

        const resp = await admin
            .firestore()
            .collection("admin")
            .doc(id)
            .set(adminData);
        console.log("----resp:", resp)

        const title = 'Your account has been created';
        await sendEmail(email, 'Account created', AdminSignupTemplate(email, password, title));

        res.status(201).send({
            message: "User created successfully. "
        })
    } catch (error) {
        res.status(500).send(error)
    }

    // return resp;
}


export async function admin_login(req: any, res: any, next: any) {
    try {
        const email = req.body.email
        const password = req.body.password
        const query = await admin
            .firestore()
            .collection("admin")
            .where("email", "==", email)
            .get();

        // console.log(`from Admin Login Start \n email.... ${email} \npassword ... ${password} \n Query....${query}`)
        if (query.empty || query.docs[0].data() == undefined) {
            throw new functions.https.HttpsError("not-found", 'Entered email id is not registered.');
        }
        const snapshot = query.docs[0];
        const adminUser = snapshot.data();

        console.log("Admin User Data ==>", adminUser);

        let passwordCheck = await validPassword(password, adminUser.password);

        console.log("PASSWORD CHECK", passwordCheck);

        if (!passwordCheck) {
            throw new functions.https.HttpsError("invalid-argument", 'Enter a valid email or password.');
        }

        let authTokenObj = await generateAuthToken(adminUser.id, adminUser.user_type);
        let refresh_tokens = await generateRefreshToken(adminUser.id, adminUser.user_type);

        adminUser.auth_tokens.push(authTokenObj);
        adminUser.refresh_tokens = refresh_tokens;

        await admin
            .firestore()
            .collection("admin")
            .doc(adminUser.id)
            .set(adminUser);

        adminUser.auth_tokens = adminUser.auth_tokens[adminUser.auth_tokens.length - 1];

        res.status(200).send(adminUser);

    } catch (error) {
        res.status(500).send(error
        )
    }
}


export async function generateAuthTokens(refresh_tokens: string) {
    const decodedUser = await verifyRefreshToken(refresh_tokens)

    console.log("DECODED USER", decodedUser);

    if (!decodedUser) {
        throw new functions.https.HttpsError("unauthenticated", 'Unauthorized, please login.');
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
        throw new functions.https.HttpsError("unauthenticated", 'Unauthorized, please login.');
    }
}

export async function admin_forgotPassword(req: any, res: any, next: any) {
    const email = req.body.email

    try {
        console.log("Forgot Password :::::", email)
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

        userData.updatedAt = parseInt(moment().format('X'))
        console.log("userData", userData)
        let reset_password_token = jwt.sign({
            data: email
        }, env.JWT_AUTH_SECRET, {
            expiresIn: constants.URL_EXPIRE_TIME
        });

        userData.reset_password_token = reset_password_token;

        await admin
            .firestore()
            .collection("admin")
            .doc(userData.id)
            .set(userData);

        const url = "https://coinparliamentstaging.firebaseapp.com/" + `/reset-password?token=`+  reset_password_token

        //sendEmail
        await sendEmail(email, 'Forgot Password', AdminForgotPasswordTemplate(url, "Forgot Password"));

        res.status(200).send({
            message: "Please check your email to reset password, your link will be expired in an hour "
        });

    } catch (err) {
        throw new functions.https.HttpsError("internal", 'Something went wrong. Please try again later.');

    }
}

export const admin_logout = async (req: any, res: any) => {
    try {
        const existingUser = await admin.firestore().collection("admin").where("id", "==", req.user.id).get();

        const snapshot = existingUser.docs[0];
        const userData = snapshot.data();

        userData.auth_tokens = userData.auth_tokens.filter((item: any) => item.token !== req.token)
        
        await admin.firestore()
            .collection("admin")
            .doc(userData.id)
            .set(userData).then(() => {
                console.log("Logout Successfully..")
            }).catch((error: any) => {
                console.log("logout error....", error)
            })

        // return { message: "Logout Successfully.." }
        res.status(200).send({
            message: "Logout successfully."
        })
    } catch (error) {
        console.log("logout ", error)
        throw new functions.https.HttpsError("internal", 'Something went wrong. Please try again later.');
    }
}


export const admin_changePassword = async (req: any, res: any) => {
    const oldPassword: string = req.body.oldPassword;
    const newPassword: string = req.body.newPassword;
    try {
        const userData = await admin
            .firestore()
            .collection("admin")
            .doc(req.user.id)
            .get();

        const user = userData.data()
        if (!user) {
            throw new functions.https.HttpsError("not-found", 'User does not exist.');
        }

        let passwordCheck = await validPassword(oldPassword, user.password);

        if (!passwordCheck) {
            throw new functions.https.HttpsError("internal", "Old password does not match.");
        }

        let hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await admin
            .firestore()
            .collection("admin")
            .doc(user.id)
            .set(user)
            .then(() => console.log("ChangePassword done..."))
            .catch((error) => console.log("ChangePassword changed...", error))

        res.status(200).send({
            message: "Your password changed successfully."
        })
    } catch (error) {
        throw new functions.https.HttpsError("internal", 'Something went wrong. Please try again later.');
    }
};

export const admin_resetPassword = async (req: any, res: any) => {
    const reqBody = req.body
    try {

        const userRef = await admin
            .firestore()
            .collection('admin')
            .where("reset_password_token", "==", reqBody.reset_password_token)
            .get();

        if (userRef.empty || userRef.docs[0].data() == undefined) {
            throw new functions.https.HttpsError("not-found", 'User does not exist.');
        }

        const user = userRef.docs[0].data();

        const newPassword = await hashPassword(reqBody.newPassword);
        user.password = newPassword;
        user.reset_password_token = null;

        await admin
            .firestore()
            .collection("admin")
            .doc(user.id)
            .set(user)
            .then(() => console.log("ResetPassword done..."))
            .catch((error) => console.log("ResetPassword changed...", error))

        res.status(200).send("Your Password reset successfully.")
    } catch (error) {
        throw new functions.https.HttpsError("internal", 'Something went wrong. Please try again later.');
    }
}