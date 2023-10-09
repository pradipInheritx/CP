import { SignupPayload, validateSignup } from "./Login";
import firebaseVotingParliament, { auth, db } from "firebaseVotingParliament"

import { Callback } from "./utils";
import { User, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getReferUser, saveUserData } from "Contexts/User";
import votingParliament from "firebaseVotingParliament";
export const SignupRegularForVotingParliament = async (
    payload: SignupPayload,
    callback: Callback<User>,
    userData?: { [key: string]: string }
) => {
    try {
        console.log('voting');
        validateSignup(payload);
        const auth = firebaseVotingParliament.auth();
        const userCredential = await auth.createUserWithEmailAndPassword(
            payload.email,
            payload.password,
        );
        if (auth?.currentUser) {
            await sendEmailVerification(auth?.currentUser);
            const referUser = await getReferUser(votingParliament.firestore());
            await saveUserData((auth?.currentUser?.uid || ''), db, { firstTimeLogin: true, ...userData, parent: referUser?.uid });
            // const userRef = doc(db, "users", auth?.currentUser?.uid);
            // await setDoc(userRef, { firstTimeLogin: true, ...userData }, { merge: true });
        } else {
            console.log('voting', auth);
        }
        //@ts-ignore
        callback.successFunc(userCredential.user);
        return true;
    } catch (e) {
        console.log('voting error');
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