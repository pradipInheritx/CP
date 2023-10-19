import { SignupPayload, validateSignup, verifySportEmail } from "./Login";
import firebaseSportParliament, { auth, db } from "firebaseSportParliament"

import { Callback } from "./utils";
import { User, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getReferUser, saveUserData, saveUsername } from "../../Contexts/User";
import sportParliament from "firebaseSportParliament";
import axios from "axios";
export const SignupRegularForSportParliament = async (
    payload: SignupPayload,
    callback: Callback<User>,
    userData?: { [key: string]: any }
) => {
    try {

        validateSignup(payload);
        const auth = firebaseSportParliament.auth();
        const userCredential = await auth.createUserWithEmailAndPassword(
            payload.email,
            payload.password
        );
        if (auth?.currentUser) {
            console.log('sport', auth?.currentUser);
            // await sendEmailVerification(auth?.currentUser);
            const referUser = await getReferUser(sportParliament.firestore());
            await saveUserData((auth?.currentUser?.uid || ''), db, {
                ...userData,
                firstTimeLogin: true,
                parent: referUser?.uid,
                uid: auth?.currentUser?.uid
            });
            await verifySportEmail(auth?.currentUser?.uid, (auth?.currentUser?.email || ''), (process.env.REACT_APP_SPORT_API || ''));
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
