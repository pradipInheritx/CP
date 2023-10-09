import { SignupPayload, validateSignup } from "./Login";
import firebaseSportParliament, { auth, db } from "firebaseSportParliament"

import { Callback } from "./utils";
import { User, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getReferUser, saveUserData, saveUsername } from "../../Contexts/User";
import sportParliament from "firebaseSportParliament";
export const SignupRegularForSportParliament = async (
    payload: SignupPayload,
    callback: Callback<User>,
    userData?: { [key: string]: string }
) => {
    try {
        console.log('sport');
        validateSignup(payload);
        const auth = firebaseSportParliament.auth();
        const userCredential = await auth.createUserWithEmailAndPassword(
            payload.email,
            payload.password
        );
        if (auth?.currentUser) {
            await sendEmailVerification(auth?.currentUser);
            const referUser = await getReferUser(sportParliament.firestore());
            await saveUserData((auth?.currentUser?.uid || ''), db, { firstTimeLogin: true, ...userData, parent: referUser?.uid });
            // const userRef = doc(db, "users", auth?.currentUser?.uid);
            // await setDoc(userRef, { firstTimeLogin: true, ...userData }, { merge: true });
        } else {
            console.log('sport', auth);
        }
        //@ts-ignore
        // callback.successFunc(userCredential.user);
        return true;
    } catch (e) {
        // @ts-ignore
        console.log('sport error', e.code);
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