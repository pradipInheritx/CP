import { SignupPayload, assignRef, validateSignup, verifySportEmail } from "./Login";
import firebaseStockParliament, { db, assignStock } from "firebaseStockParliament"

import { Callback } from "./utils";
import { User, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getReferUser, saveUserData } from "Contexts/User";
import stockParliament from "firebaseStockParliament";
import { generateUsername } from "common/utils/strings";

import { useContext } from "react";
export const SignupRegularForStockParliament = async (
    payload: SignupPayload,
    callback: Callback<User>,
    userData?: { [key: string]: any },
    parentEmailId?: any
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
            // await sendEmailVerification(auth?.currentUser);
            const referUser = await getReferUser(stockParliament.firestore(), parentEmailId);
            await saveUserData((auth?.currentUser?.uid || ''), db, {
                // displayName: await generateUsername(),
                ...userData,
                firstTimeLogin: true,
                parent: referUser?.uid,
                uid: auth?.currentUser?.uid
            });
            // await assignStock({ parent: referUser?.uid, child: auth?.currentUser?.uid })
            await assignRef(referUser?.uid, auth?.currentUser?.uid, process.env.REACT_APP_STOCK_API || '')
            await verifySportEmail(auth?.currentUser?.uid, (auth?.currentUser?.email || ''), (process.env.REACT_APP_STOCK_API || ''));
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