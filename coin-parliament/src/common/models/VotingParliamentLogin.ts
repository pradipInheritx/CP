import { SignupPayload, assignRef, validateSignup, verifySportEmail } from "./Login";
import firebaseVotingParliament, { auth, db, assignVoting } from "firebaseVotingParliament"

import { Callback } from "./utils";
import { User, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getReferUser, saveUserData, storeAllPlatFormUserId } from "Contexts/User";
import  votingParliament from "firebaseVotingParliament";

import { showToast } from "App";
import { ToastType } from "Contexts/Notification";
import { generateUsername } from "common/utils/strings";
import { useContext } from "react";
export const SignupRegularForVotingParliament = async (
    payload: SignupPayload,
    callback: Callback<User>,
    userData?: { [key: string]: any },
    parentEmailId?: any
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
            // await sendEmailVerification(auth?.currentUser).then((data) => {
            //     // showToast("Successfully sent  verification link on your mail");
            // });            
            const referUser = await getReferUser(votingParliament.firestore(), parentEmailId);
            await saveUserData((auth?.currentUser?.uid || ''), db, {
                // displayName: await generateUsername(),
                ...userData,
                firstTimeLogin: true,
                isVoteToEarn: true,
                parent: referUser?.uid,
                uid: auth?.currentUser?.uid
            });            
            // await assignVoting({ parent: referUser?.uid, child: auth?.currentUser?.uid })
            await assignRef(referUser?.uid, auth?.currentUser?.uid, process.env.REACT_APP_VOTING_API || '')
            await verifySportEmail(auth?.currentUser?.uid, (auth?.currentUser?.email || ''), (process.env.REACT_APP_VOTING_API || ''));
            // const userRef = doc(db, "users", auth?.currentUser?.uid);
            // await setDoc(userRef, { firstTimeLogin: true, ...userData }, { merge: true });
        } else {
            console.log('voting', auth);
        }
        if (auth?.currentUser?.email) {
            await storeAllPlatFormUserId(auth?.currentUser?.email);
        }
        // showToast("User register successfully.", ToastType.SUCCESS);
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