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
