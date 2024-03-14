//import axios from "axios";
import { firestore, messaging } from "firebase-admin";
import { Timestamp } from 'firebase-admin/firestore';

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
      time: firestore.Timestamp.now(),
    });
  } catch (e) {
    console.log("Error sending message:", e, token);
  }
};

export const createPushNotificationOnCallbackURL = async (requestBody: any) => {
  try {
    console.info("Request Body", requestBody);

    const serverNotificationURL = 'http://127.0.0.1:5001/coin-parliament-staging/us-central1/callBackURLFromServerToServer';

    console.info("serverNotificationURL", serverNotificationURL);

    // const getResponse = await axios.post(serverNotificationURL, {
    //   userId: "MoyiWw4OY5TG5o8mCQoqVUAtVuow",
    //   payloadKey: "",
    //   uniqueId: "",
    //   childUserEmail: "",
    //   notificationType: "",
    //   amount: "",
    //   currency: "",
    //   commission: ""
    // })
    // console.info("getResponse", getResponse)


    return {
      status: true,
      message: "",
      result: {}
    };
  } catch (error) {
    console.error("Error Found----->", error);
    return {
      status: 500,
      message: "Something went wrong",
      result: error
    };
  }
}

export const sendEmailAcknowledgementStatus = async (userId: any) => {
  const userEmailAcknowledgementRef = await firestore().collection('userEmailAcknowledgement');

  const acknowledgementEmailSettings = {
    userId: userId,
    sendEmailForVoiceMatter: false,
    sendEmailForUserUpgrade: false,
    sendEmailForAddressNotUpdated: false,
    sendEmailForLifetimePassiveIncome: false,
    sendEmailForEarnRewardsByPaxTokens: false,
    sendEmailForUnloackRewards: false,
    sendEmailForSVIUpdate: false,
    sendEmailForProgressWithFreind: false,
    sendEmailForTopInfluencer: false,
    sendEmailForAfterUpgrade: false,
    timestamp: Timestamp.now()
  };

  userEmailAcknowledgementRef
    .add(acknowledgementEmailSettings)
    .then((docRefAck: any) => {
      console.log('Acknowledgement Document written with ID: ', docRefAck.id);
    })
    .catch((error: any) => {
      console.error('Error adding document: ', error);
    });
}

export const sendEmailForVoiceMatterInLast24Hours = async () => {
  const currentTime = Timestamp.now();
  const twentyFourHoursAgo = new Date(currentTime.toMillis() - 24 * 60 * 60 * 1000);
  const usersRef = await firestore().collection('userEmailAcknowledgement');
  const query = usersRef.where('timestamp', '>=', twentyFourHoursAgo).where('sendEmailForVoiceMatter', '==', false);

  const getAckIds: any = [];

  await query.get()
    .then((userSnapshot: any) => {
      if (userSnapshot.empty) {
        console.log('No users created in the last 24 hours for voice Matters.');
        return;
      }
      userSnapshot.forEach((userAckDoc: any) => {

        getAckIds.push({ ackId: userAckDoc.id, sendEmailForVoiceMatter: true })

        console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());

        // To Do Send Email To User
      });

      let createBatch: any = firestore().batch();

      for (let docRef = 0; docRef < getAckIds.length; docRef++) {
        let ackIdDocRefs: any = firestore().collection('userEmailAcknowledgement').doc(getAckIds[docRef].ackId);
        createBatch.update(ackIdDocRefs, { sendEmailForVoiceMatter: getAckIds[docRef].sendEmailForVoiceMatter });
      }

      createBatch.commit().then(function () {
        console.log("Ack For Voice Matter Email Send Successfully");
      }).catch(function (error: any) {
        console.error("Error While Ack For Voice Matter Email Send  :", error);
      });
    })
    .catch(err => {
      console.error('Error while getting users Ack:', err);
    });
}


export const sendEmailForUserUpgradeInLast48Hours = async () => {
  const currentTime = Timestamp.now();
  const fourtyEightHoursAgo = new Date(currentTime.toMillis() - 48 * 60 * 60 * 1000);
  const usersRef = await firestore().collection('userEmailAcknowledgement');
  const query = usersRef.where('timestamp', '>=', fourtyEightHoursAgo).where('sendEmailForUserUpgrade', '==', false);

  const getAckIds: any = [];

  await query.get()
    .then((userSnapshot: any) => {
      if (userSnapshot.empty) {
        console.log('No users created in the last 48 hours for user upgrade.');
        return;
      }
      userSnapshot.forEach((userAckDoc: any) => {

        getAckIds.push({ ackId: userAckDoc.id, sendEmailForUserUpgrade: true })

        console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());

        // To Do Send Email To User
      });

      let createBatch: any = firestore().batch();

      for (let docRef = 0; docRef < getAckIds.length; docRef++) {
        let ackIdDocRefs: any = firestore().collection('userEmailAcknowledgement').doc(getAckIds[docRef].ackId);
        createBatch.update(ackIdDocRefs, { sendEmailForUserUpgrade: getAckIds[docRef].sendEmailForUserUpgrade });
      }

      createBatch.commit().then(function () {
        console.log("Ack For User Upgrade Email Send Successfully");
      }).catch(function (error: any) {
        console.error("Error While Ack For User Upgrade Email Send  :", error);
      });
    })
    .catch(err => {
      console.error('Error while getting users Ack:', err);
    });
}
