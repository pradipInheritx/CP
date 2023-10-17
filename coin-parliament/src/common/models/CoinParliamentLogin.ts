import { SignupPayload, validateSignup } from "./Login";
import firebaseCoinParliament, { auth, db } from "firebaseCoinParliament"

import { Callback } from "./utils";
import { User, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getReferUser, saveUserData, saveUsername } from "../../Contexts/User";
import coinParliament from "firebaseCoinParliament";
export const SignupRegularForCoinParliament = async (
    payload: SignupPayload,
    callback: Callback<User>,
    userData?: { [key: string]: any }
) => {
    try {
        console.log('coin');
        validateSignup(payload);
        const auth = firebaseCoinParliament.auth();
        const userCredential = await auth.createUserWithEmailAndPassword(
            payload.email,
            payload.password
        );
        if (auth?.currentUser) {
            await sendEmailVerification(auth?.currentUser);
            const referUser = await getReferUser(coinParliament.firestore());
            await saveUserData((auth?.currentUser?.uid || ''), db, {
                ...userData,
                firstTimeLogin: true,
                parent: referUser?.uid,
                uid: auth?.currentUser?.uid
            });
        } else {
            console.log('coin', auth);
        }
        //@ts-ignore
        // callback.successFunc(userCredential.user);
        return true;
    } catch (e) {
        // @ts-ignore
        console.log('coin error', e.code);
        // @ts-ignore
        if (e?.code) {
            // @ts-ignore
            const matches = e.code.replace("auth/", "");
            const lastmatches = matches.replace(/\b(?:-)\b/gi, " ");
            // callback.errorFunc({ message: '' /* lastmatches */ } as Error);
        }
        return false;
    }
};