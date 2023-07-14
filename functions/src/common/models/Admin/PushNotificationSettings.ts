import { firestore } from "firebase-admin";

export const updatePushNotificationSetting = async (req: any, res: any) => {
    try {
        let PushNotificationSettingData = req.body;

        await firestore()
            .collection("settings")
            .doc("pushNotification")
            .set(PushNotificationSettingData, { merge: true });

        const getUpdatedRef = await firestore()
            .collection("settings")
            .doc("pushNotification")
            .get();

        const getUpdatedData = getUpdatedRef.data();

        res.status(200).send({
            status: true,
            message: "Push notification updated successfully",
            result: getUpdatedData,
        });
    } catch (error) {
        errorLogging("updatePushNotificationSetting", "ERROR", error);
        res.status(500).send({
            status: false,
            message: "Something went wrong in updatePushNotificationSetting",
            result: error,
        });
    }
};

export const getAllPushNotificationSetting
    = async (req: any, res: any) => {
        try {
            const getUpdatedRef = await firestore()
                .collection("settings")
                .doc("pushNotification")
                .get();

            const getUpdatedData = getUpdatedRef.data();

            res.status(200).send({
                status: true,
                message: "Fetch notification updated successfully",
                result: getUpdatedData,
            });
        } catch (error) {
            errorLogging("getAllPushNotificationSetting", "ERROR", error);
            res.status(500).send({
                status: false,
                message: "Something went wrong in getAllPushNotificationSetting",
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
