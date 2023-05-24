import { firestore } from "firebase-admin";

export const getFollowersAndFollowingCount = async (req: any, res: any) => {
    try {
        let allUsers: any = [];
        const getUserSnapshot = await firestore().collection("users").get()

        getUserSnapshot.forEach((user) => {
            allUsers.push({ userId: user.id, firstName: user.data().firstName, lastName: user.data().lastName, followingCount: user.data().children.length, followerCount: user.data().subscribers.length });
        });

        res.status(200).send({
            status: true,
            message: "Fetch followers & following count successfully",
            result: allUsers
        });
    } catch (error) {
        errorLogging("getFollowersCount", "ERROR", error);
        res.status(500).send({
            status: false,
            message: "Something went wrong in getFollowersCount",
            result: error,
        });
    }
};

export const getFollowingCount = async (req: any, res: any) => {
    try {
        let FollowingCountData = req.body;

        await firestore()
            .collection("settings")
            .doc("pushNotification")
            .set(FollowingCountData, { merge: true });

        const getUpdatedRef = await firestore()
            .collection("settings")
            .doc("FollowingCount")
            .get();

        const getUpdatedData = getUpdatedRef.data();

        res.status(200).send({
            status: true,
            message: "fetch Following Count successfully",
            result: getUpdatedData,
        });
    } catch (error) {
        errorLogging("getFollowersCount", "ERROR", error);
        res.status(500).send({
            status: false,
            message: "Something went wrong in getFollowersCount",
            result: error,
        });
    }
};

export const errorLogging = async (
    funcName: string,
    type: string,
    error: any
) => {
    console.info(funcName, type, error);
};














