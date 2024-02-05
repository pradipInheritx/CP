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


export const createPushNotificationOnCallbackURL = async (requestBody: any) => {
  try {
    if (requestBody.pushNotificationCallbackUrl && requestBody.userId) {
      console.info("Request Body", requestBody);

      await firestore()
        .collection("userPushNotificationCallbackURL").add({ userId: "", payloadKey: "", uniqueId: "", childUserEmail: "", notificationType: "", amount: "", currency: "", commission: "", serverTimestamp: firestore.FieldValue.serverTimestamp() });
      return "Push Notification Send Successfully";
    } else {
      return "UserId & Callback URL not found";
    }
  } catch (error) {
    return error;
    // res.status(500).send({
    //   status: false,
    //   message: "Something went wrong",
    //   result: error,
    // });
  }
}