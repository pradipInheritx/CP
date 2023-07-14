import { SignupPayload, validateSignup } from "./Login";
import firebaseSportParliament, { db } from "firebaseSportParliament"

import { Callback } from "./utils";
import { User, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { saveUsername } from "../../Contexts/User";
export const SignupRegularForSportParliament = async (
    payload: SignupPayload,
    callback: Callback<User>
) => {
    try {
        validateSignup(payload);
        const auth = firebaseSportParliament.auth();
        const userCredential = await auth.createUserWithEmailAndPassword(
            payload.email,
            payload.password
        );
        if (auth?.currentUser) {
            await sendEmailVerification(auth?.currentUser);
        }
        const documentRef = firebaseSportParliament.firestore().collection('users').doc(auth?.currentUser?.uid);
        // // Update the field in the document
        await documentRef.update({
            firstTimeLogin: true
        });
        if (auth?.currentUser?.uid) {
            saveUsername(auth?.currentUser?.uid, '', '')
        }
        //@ts-ignore
        callback.successFunc(userCredential.user);
        return true;
    } catch (e) {
        // @ts-ignore
        if (e?.code) {
            // @ts-ignore
            const matches = e.code.replace("auth/", "");
            const lastmatches = matches.replace(/\b(?:-)\b/gi, " ");
            callback.errorFunc({ message: lastmatches } as Error);
        }
        return false;
    }
};