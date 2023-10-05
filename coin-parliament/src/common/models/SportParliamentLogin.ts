import { SignupPayload, validateSignup } from "./Login";
import firebaseSportParliament, { auth, db } from "firebaseSportParliament"

import { Callback } from "./utils";
import { User, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { saveUserData, saveUsername } from "../../Contexts/User";
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

            const userRef = doc(db, "users", auth?.currentUser?.uid);
            await setDoc(userRef, { firstTimeLogin: true, ...userData }, { merge: true });
        } else {
            console.log('sport', auth);
        }
        //@ts-ignore
        callback.successFunc(userCredential.user);
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

export const SignupUsingThirdParty = ({ displayName, email, photoURL }: { displayName: string, email: string, photoURL: string }) => {


}