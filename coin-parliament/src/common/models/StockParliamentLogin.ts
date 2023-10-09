import { SignupPayload, validateSignup } from "./Login";
import firebaseStockParliament, { db } from "firebaseStockParliament"

import { Callback } from "./utils";
import { User, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getReferUser, saveUserData } from "Contexts/User";
import stockParliament from "firebaseStockParliament";
export const SignupRegularForStockParliament = async (
    payload: SignupPayload,
    callback: Callback<User>,
    userData?: { [key: string]: string }
) => {
    try {
        console.log('stock');
        validateSignup(payload);
        const auth = firebaseStockParliament.auth();
        const userCredential = await auth.createUserWithEmailAndPassword(
            payload.email,
            payload.password
        );
        if (auth?.currentUser) {
            await sendEmailVerification(auth?.currentUser);
            const referUser = await getReferUser(stockParliament.firestore());
            await saveUserData((auth?.currentUser?.uid || ''), db, { firstTimeLogin: true, ...userData, parent: referUser?.uid });
            // const userRef = doc(db, "users", auth?.currentUser?.uid);
            // await setDoc(userRef, { firstTimeLogin: true, ...userData }, { merge: true });
        } else {
            console.log('stock', auth);
        }
        //@ts-ignore
        // callback.successFunc(userCredential.user);
        return true;
    } catch (e) {
        // @ts-ignore
        console.log('stock error', e.code);
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