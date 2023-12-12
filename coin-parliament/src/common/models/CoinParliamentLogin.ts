import { SignupPayload, assignRef, validateSignup, verifySportEmail } from "./Login";
import firebaseCoinParliament, { auth, db, assignCoinParliament } from "firebaseCoinParliament"

import { Callback } from "./utils";
import { User, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getReferUser, saveUserData, saveUsername } from "../../Contexts/User";
import coinParliament from "firebaseCoinParliament";
import axios from "axios";
import { generateUsername } from "common/utils/strings";
import { useContext } from "react";
export const SignupRegularForCoinParliament = async (
    payload: SignupPayload,
    callback: Callback<User>,
    userData?: { [key: string]: any },
    parentEmailId?:any
) => {    
    try {
        console.log(parentEmailId,'parentEmailIdcoin');
        validateSignup(payload);
        const auth = firebaseCoinParliament.auth();
        const userCredential = await auth.createUserWithEmailAndPassword(
            payload.email,
            payload.password
        );
        if (auth?.currentUser) {
            // await sendEmailVerification(auth?.currentUser);
            const referUser = await getReferUser(coinParliament.firestore(), parentEmailId);
            
            await saveUserData((auth?.currentUser?.uid || ''), db, {
                // displayName: await generateUsername(),
                ...userData,
                firstTimeLogin: true,
                parent: referUser?.uid,
                uid: auth?.currentUser?.uid
            });
            // await assignCoinParliament({ parent: referUser?.uid, child: auth?.currentUser?.uid })

            await assignRef(referUser?.uid, auth?.currentUser?.uid, process.env.REACT_APP_COIN_API || '')
            await verifySportEmail(auth?.currentUser?.uid, (auth?.currentUser?.email || ''), (process.env.REACT_APP_COIN_API || ''));
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