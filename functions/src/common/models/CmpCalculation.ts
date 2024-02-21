import * as admin from "firebase-admin";
import { errorLogging } from "../helpers/commonFunction.helper";
import { sendMintForPaxToAdmin, sendMintForPaxToUser } from "./Reward";
import { addPaxTransactionWithPendingStatus } from "./PAX";
import { sendCPMToFoundationOfUser } from "./Admin/Foundation";
import { sendNotificationForCpm } from "./SendCustomNotification";


export async function checkAndUpdateRewardTotal(userId: string) {
    try {
        const getUserRef = admin.firestore().collection('users').doc(userId);
        const getUserDetails: any = (await getUserRef.get()).data();

        const scoreString = getUserDetails?.voteStatistics?.score.toString();
        console.log('scoreString : ', scoreString)
        const removePointsValue = scoreString.split('.')[0];
        const newRewardTotal = parseInt(removePointsValue.slice(0, removePointsValue.length - 2) || "0");
        console.log("newRewardTotal : ", newRewardTotal)


        await getUserRef
            .set(
                {
                    rewardStatistics: {
                        total: newRewardTotal,
                        claimed: getUserDetails?.rewardStatistics?.claimed || 0,
                    },
                },
                { merge: true }
            ).then(() => {
                console.log("Total and Claimed are updated Successfully");
            })
        return {
            status: true,
            message: "Total and Claimed are updated Successfully",
            result: null
        };
    } catch (error) {
        console.error("checkAndUpdateRewardTotal failed to update the reward total. Error", error);
        return {
            status: false,
            message: "checkAndUpdateRewardTotal failed to update the reward total.",
            result: error
        }
    }
}

export const getUserAndCalculatePax = async (paxDetails: any, currentVoteCMP: number) => {
    try {
        const getUser = (await admin.firestore().collection("users").doc(paxDetails.userId).get()).data();
        if (!getUser) {
            return errorLogging("getUserAndCalculatePax", "ERROR", "User not found");
        }
        console.log("getUser currentVoteCMP,score and total : ", currentVoteCMP, " || ", getUser?.voteStatistics?.score, " || ", getUser?.rewardStatistics?.total);
        const score = getUser?.voteStatistics?.score + currentVoteCMP
        const checkCMP = score - (getUser?.rewardStatistics?.total * 100);
        console.log("score, checkCMP : ", score, " || ", checkCMP)
        console.log("99 < checkCMP && checkCMP < 200: ", 99 < checkCMP && checkCMP < 200)

        if (99.99 < checkCMP && checkCMP < 200) {
            console.log("pax calling")
            await sendNotificationForCpm(paxDetails.userId); // Block complete notification
            await sendCPMToFoundationOfUser(paxDetails.userId, currentVoteCMP); // add 0.1% cpm to foundation
            let getResultAfterSentPaxToUser: any;
            let getResultAfterSentPaxToAdmin: any;

            if (paxDetails.isUserUpgraded === true) {
                // Call to user mintFor Address
                getResultAfterSentPaxToUser = await sendMintForPaxToUser(paxDetails);
                await addPaxTransactionWithPendingStatus(paxDetails)
                console.info("getResultAfterSentPaxToUser", getResultAfterSentPaxToUser);
                return getResultAfterSentPaxToUser
            }
            if (paxDetails.isUserUpgraded === false) {
                // Call to Admin mintFor Address
                getResultAfterSentPaxToAdmin = await sendMintForPaxToAdmin(paxDetails);
                await addPaxTransactionWithPendingStatus(paxDetails);
                console.info("getResultAfterSentPaxToAdmin", getResultAfterSentPaxToAdmin);
                return getResultAfterSentPaxToAdmin
            }
        }

    } catch (error) {
        return errorLogging("getUserAndCalculatePax", "ERROR", error);
    }
}