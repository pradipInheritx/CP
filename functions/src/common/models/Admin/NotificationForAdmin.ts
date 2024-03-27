import { firestore, messaging } from "firebase-admin";
import { sendNotification } from "../Notification";
import env from '../../../env/env.json'
import { errorLogging } from "../../helpers/commonFunction.helper";


export const userPurchaseNotification = async (userId: string) => {
    try {
        const getAdmin: any = (await firestore().collection('admin').get()).docs.map((admin) => admin.data());
        const getUser: any = (await firestore().collection('users').doc(userId).get()).data();
        const token = getAdmin?.token;
        console.log("admin token: ", token);
        const message: messaging.Message = {
            token,
            notification: {
                title: `${getUser?.displayName} is purchased somethings`,
                body: 'user have purchased somethings',
            },
            webpush: {
                headers: {
                    Urgency: "high",
                },
                fcmOptions: {
                    link: `${env.BASE_SITE_URL}`, // TODO: put link for deep linking
                },
            },
        };
        console.log("notification link: ", `${env.BASE_SITE_URL}`);
        console.log("Message:", message);
        await sendNotification({
            token,
            id: getAdmin.uid,
            title: `${getUser?.displayName} is purchased somethings`,
            body: 'user have purchased somethings',
            message,
        });
    } catch (error) {
        errorLogging(
            "userPurchaseNotification",
            "ERROR",
            error
        )
    }
}

