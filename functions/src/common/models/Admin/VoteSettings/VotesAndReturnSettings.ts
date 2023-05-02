import { firestore } from "firebase-admin";


export const getVotesAndReturnSettings = async (req: any, res: any) => {
    try {
        const getVoteAndReturnQuery = await firestore().collection("settings").doc("settings").get();
        const getVoteAndReturnData = getVoteAndReturnQuery.data();

        res.status(200).send({
            status: true,
            message: "Vote and return settings data are successfully.",
            result: getVoteAndReturnData,
        });
    } catch (error) {
        errorLogging("getVotesAndReturnSettings", "ERROR", error);
        res.status(500).send({
            status: false,
            message: "Error while fetching vote and return settings:",
            error: error,
        });
    }
}

export const updateVotesAndReturnSettings = async (req: any, res: any) => {
    try {
        const {
            settings,
            orderBookWeight,
            pctReferralActivity,
            signupReferral,
            CPMReturnFailure,
            CPMReturnInRange,
            CPMReturnSuccess,
            givenCPM,
            maxVotes } = req.body

        const CPMSettings = {
            orderBookWeight,
            pctReferralActivity,
            signupReferral
        }

        const VoteRules = {
            CPMReturnFailure,
            CPMReturnInRange,
            CPMReturnSuccess,
            givenCPM,
            maxVotes

        }

        let getVoteAndReturnQuery: any;
        if (settings == "CPMSettings") {
            getVoteAndReturnQuery = await firestore()
                .collection("settings")
                .doc("settings")
                .update(settings, firestore.FieldValue.arrayUnion(CPMSettings));
        }
        else {
            getVoteAndReturnQuery = await firestore()
                .collection("settings")
                .doc("settings")
                .update(settings, firestore.FieldValue.arrayUnion(VoteRules));
        }


        res.status(200).send({
            status: true,
            message: "Vote and return settings data are successfully.",
            result: getVoteAndReturnQuery,
        });
    } catch (error) {
        errorLogging("updateVotesAndReturnSettings", "ERROR", error);
        res.status(500).send({
            status: false,
            message: "Error while updating vote and return settings:",
            error: error,
        });
    }
}
export const errorLogging = async (
    funcName: string,
    type: string,
    error: any
) => {
    console.info(funcName, type, error);
};