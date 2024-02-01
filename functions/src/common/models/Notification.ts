import { firestore, messaging } from "firebase-admin";

export const sendNotification = async ({
  token,
  id,
  body,
  title,
  message,
}: {
  token: string;
  id: string;
  title: string;
  body:
  | string
  | {
    body: string;
    requireInteraction: boolean;
  };
  message: messaging.Message;
}) => {
  try {
    const response = await messaging().send(message);
    console.log("Successfully sent message:", response, token);
    await firestore().collection("notifications").doc().set({
      user: id,
      message: {
        title,
        body,
      },
      time: firestore.FieldValue.serverTimestamp(),
    });
  } catch (e) {
    console.log("Error sending message:", e, token);
  }
};


export const createPushNotificationOnCallbackURL = async (req: any, res: any) => {
  try {
    await firestore()
      .collection("userPushNotificationCallbackURL").add({ userId: "", PushNotificationDetails: "", callbackURL: "", serverTimestamp: firestore.FieldValue.serverTimestamp() });

    res.status(200).send({
      status: true,
      message: "Push Notification Callback URL Created Successfully",
      result: "",
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Something went wrong",
      result: error,
    });
  }
}