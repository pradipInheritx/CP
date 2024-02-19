import { firestore } from "firebase-admin";
import { errorLogging } from "../../helpers/commonFunction.helper";

export const getFollowersAndFollowingCount = async (req: any, res: any) => {
    try {
        let allUsers: any = [];
        const getUserSnapshot = await firestore().collection("users").get()

        getUserSnapshot.forEach((user) => {
            allUsers.push({ userId: user.id, firstName: user.data().firstName, lastName: user.data().lastName, followingCount: user.data().children && user.data().children.length ? user.data().children.length : 0, followerCount: user.data().subscribers && user.data().subscribers.length ? user.data().subscribers.length : 0 });
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
            .doc("FollowingCount")
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

export const getFollowersUsers = async (req: any, res: any) => {
    try {
        const { userId } = req.params;

        const getAllFollowers = [];

        const getUserSnapshot = await firestore().collection("users").doc(userId).get()

        const getUserData = await getUserSnapshot.data();

        if (getUserData && getUserData.subscribers && getUserData.subscribers.length) {
            for (let getUser = 0; getUser < getUserData.subscribers.length; getUser++) {
                let userId = getUserData.subscribers[getUser];
                const getUserSubscriberSnapshot = await firestore().collection("users").doc(userId).get();
                const getSubscriberUserData = getUserSubscriberSnapshot.data();
                getAllFollowers.push(getSubscriberUserData);
            }
        }

        res.status(200).send({
            status: true,
            message: "Fetch follower users successfully",
            result: getAllFollowers
        });
    } catch (error) {
        errorLogging("getFollowersUsers", "ERROR", error);
        res.status(500).send({
            status: false,
            message: "Something went wrong in getFollowersUsers",
            result: error,
        });
    }
};

export const getFollowingUsers = async (req: any, res: any) => {
    try {
        const { userId } = req.params;

        const getAllFollowing = [];

        const getUserSnapshot = await firestore().collection("users").doc(userId).get()

        const getUserData = await getUserSnapshot.data();

        if (getUserData && getUserData.parent && getUserData.parent.length) {
            for (let getUser = 0; getUser < getUserData.parent.length; getUser++) {
                let userId = getUserData.parent[getUser];
                const getUserFollowingSnapshot = await firestore().collection("users").doc(userId).get();
                const getFollowingUserData = getUserFollowingSnapshot.data();
                getAllFollowing.push(getFollowingUserData);
            }
        }

        res.status(200).send({
            status: true,
            message: "Fetch following users successfully",
            result: getAllFollowing
        });
    } catch (error) {
        errorLogging("getFollowingUsers", "ERROR", error);
        res.status(500).send({
            status: false,
            message: "Something went wrong in getFollowingUsers",
            result: error,
        });
    }
};

