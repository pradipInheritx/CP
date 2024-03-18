//import axios from "axios";
import { firestore, messaging } from "firebase-admin";
import { Timestamp } from 'firebase-admin/firestore';
import { sendEmail } from "../services/emailServices";
import { sendEmailForVoiceMatterTemplate } from "../emailTemplates/sendEmailForVoiceMatterTemplate";
import { sendEmailForUserUpgradeTemplate } from "../emailTemplates/sendEmailForUserUpgradeTemplate";
import { sendEmailForAddressNotUpdatedTemplate } from "../emailTemplates/sendEmailForAddressNotUpdated";
import { sendEmailForLifetimePassiveIncomeTemplate } from "../emailTemplates/sendEmailForLifetimePassiveIncomeTemplate";


import env from "./../../env/env.json";

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

export const sendEmailAcknowledgementStatus = async (userObj: any) => {
  const userEmailAcknowledgementRef = await firestore().collection('userEmailAcknowledgement');

  const acknowledgementEmailSettings = {
    userId: userObj.uid,
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
  try {
    const currentTime = Timestamp.now();
    const twentyFourHoursAgo = new Date(currentTime.toMillis() - 24 * 60 * 60 * 1000);
    const usersRef = await firestore().collection('userEmailAcknowledgement');
    const query = usersRef.where('timestamp', '>=', twentyFourHoursAgo);

    const getAckIds: any = [];

    await query.get()
      .then(async (userSnapshot: any) => {
        if (userSnapshot.empty) {
          console.log('No users created in the last 24 hours for voice Matters.');
          return;
        }

        userSnapshot.forEach(async (userAckDoc: any) => {
          let getDataOfUserAsk: any = userAckDoc.data();
          console.log("Get sendEmailForVoiceMatter---->", getDataOfUserAsk.sendEmailForVoiceMatter);
          if (getDataOfUserAsk.sendEmailForVoiceMatter === false) {
            console.log("Get User ID--->", getDataOfUserAsk.userId);
            if (getDataOfUserAsk.userId) {
              getAckIds.push({ ackId: userAckDoc.id, sendEmailForVoiceMatter: true, userId: getDataOfUserAsk.userId });
              console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());
            } else {
              console.log("No user email found for send notification", userAckDoc.id)
            }
          }
        });

        let createBatch: any = firestore().batch();

        const userIds: string[] = getAckIds.map((ack: any) => ack.userId);

        if (userIds && userIds.length) {

          const getUserDocs: any = (
            await firestore().collection("users").where("uid", "in", userIds).get()
          ).docs.map(doc => doc.data());

          console.log("getUserDocs------>", getUserDocs)

          console.log("UserIds Fetch --->", userIds);

          console.log("getAckIds-------->", getAckIds)

          for (let docRef = 0; docRef < getAckIds.length; docRef++) {
            let ackIdDocRefs: any = firestore().collection('userEmailAcknowledgement').doc(getAckIds[docRef].ackId);
            createBatch.update(ackIdDocRefs, { sendEmailForVoiceMatter: getAckIds[docRef].sendEmailForVoiceMatter });

            console.log("Come Here For Send Email For Voice Matters");

            let getUserDetails = await getUserDocs.filter((user: any) => user.uid === getAckIds[docRef].userId);

            console.info("Get User Details:----->", getUserDetails);

            sendEmail(
              getUserDetails[0].email,
              "Your Voice Matters! Cast Your Votes Today on Coin Parliament",
              sendEmailForVoiceMatterTemplate(`${getUserDetails[0].userName}`, env.BASE_SITE_URL)
            );
          }

          createBatch.commit().then(function () {
            console.log("Ack For Voice Matter Email Send Successfully");
          }).catch(function (error: any) {
            console.error("Error While Ack For Voice Matter Email Send  :", error);
          });
        } else {
          console.log("No User Found To Send Email Of Voice Matters");
        }
      })
      .catch(err => {
        console.error('Error while getting users Ack:', err);
      });

  } catch (error: any) {
    console.log("Getting error while send the email to sendEmailForVoiceMatterInLast24Hours", error);
  }
}

export const sendEmailForUserUpgradeInLast48Hours = async () => {
  const currentTime = Timestamp.now();
  const fourtyEightHoursAgo = new Date(currentTime.toMillis() - 48 * 60 * 60 * 1000);
  const usersRef = await firestore().collection('userEmailAcknowledgement');
  const query = usersRef.where('timestamp', '>=', fourtyEightHoursAgo);

  const getAckIds: any = [];

  await query.get()
    .then(async (userSnapshot: any) => {
      if (userSnapshot.empty) {
        console.log('No users created in the last 48 hours for user upgrade.');
        return;
      }

      userSnapshot.forEach(async (userAckDoc: any) => {
        let getDataOfUserAsk: any = userAckDoc.data();
        console.log("Get sendEmailForUserUpgrade---->", getDataOfUserAsk.sendEmailForUserUpgrade);
        if (getDataOfUserAsk.sendEmailForUserUpgrade === false) {
          console.log("Get User ID--->", getDataOfUserAsk.userId);
          if (getDataOfUserAsk.userId) {
            getAckIds.push({ ackId: userAckDoc.id, sendEmailForUserUpgrade: true, userId: getDataOfUserAsk.userId });
            console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());
          } else {
            console.log("No user email found for send notification sendEmailForUserUpgrade", userAckDoc.id)
          }
        }
      });

      let createBatch: any = firestore().batch();

      const userIds: string[] = getAckIds.map((ack: any) => ack.userId);

      if (userIds && userIds.length) {

        const getUserDocs: any = (
          await firestore().collection("users").where("uid", "in", userIds).get()
        ).docs.map(doc => doc.data());

        console.log("getUserDocs------>", getUserDocs)

        console.log("UserIds Fetch --->", userIds);

        console.log("getAckIds-------->", getAckIds)

        for (let docRef = 0; docRef < getAckIds.length; docRef++) {
          let ackIdDocRefs: any = firestore().collection('userEmailAcknowledgement').doc(getAckIds[docRef].ackId);
          createBatch.update(ackIdDocRefs, { sendEmailForUserUpgrade: getAckIds[docRef].sendEmailForUserUpgrade });

          console.log("Come Here For Send Email For Voice Matters");

          let getUserDetails = await getUserDocs.filter((user: any) => user.uid === getAckIds[docRef].userId);

          console.info("Get User Details:----->", getUserDetails);

          sendEmail(
            getUserDetails[0].email,
            "Don't Miss Out on Your PAX Tokens – Upgrade Your Account Today!",
            sendEmailForUserUpgradeTemplate(`${getUserDetails[0].userName}`, env.BASE_SITE_URL)
          );
        }

        createBatch.commit().then(function () {
          console.log("Ack For UserUpgradeInLast48Hours Email Send Successfully");
        }).catch(function (error: any) {
          console.error("Error While Ack For UserUpgradeInLast48Hours Email Send  :", error);
        });
      } else {
        console.log("No User Found To Send Email Of UserUpgradeInLast48Hours");
      }
    })
    .catch(err => {
      console.error('Error while getting users Ack:', err);
    });
}

export const sendEmailForAddressNotUpdatedInLast72Hours = async () => {
  const currentTime = Timestamp.now();
  const SeventyTwoHoursAgo = new Date(currentTime.toMillis() - 72 * 60 * 60 * 1000);
  const usersRef = await firestore().collection('userEmailAcknowledgement');
  const query = usersRef.where('timestamp', '>=', SeventyTwoHoursAgo);

  const getAckIds: any = [];

  await query.get()
    .then(async (userSnapshot: any) => {
      if (userSnapshot.empty) {
        console.log('No users created in the last 72 hours for address not update.');
        return;
      }

      userSnapshot.forEach(async (userAckDoc: any) => {
        let getDataOfUserAsk: any = userAckDoc.data();
        console.log("Get sendEmailForUserUpgrade---->", getDataOfUserAsk.sendEmailForUserUpgrade);
        if (getDataOfUserAsk.sendEmailForUserUpgrade === false) {
          console.log("Get User ID--->", getDataOfUserAsk.userId);
          if (getDataOfUserAsk.userId) {
            getAckIds.push({ ackId: userAckDoc.id, sendEmailForUserUpgrade: true, userId: getDataOfUserAsk.userId });
            console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());
          } else {
            console.log("No user email found for send notification sendEmailForUserUpgrade", userAckDoc.id)
          }
        }
      });

      let createBatch: any = firestore().batch();

      const userIds: string[] = getAckIds.map((ack: any) => ack.userId);

      if (userIds && userIds.length) {

        const getUserDocs: any = (
          await firestore().collection("users").where("uid", "in", userIds).get()
        ).docs.map(doc => doc.data());

        console.log("getUserDocs------>", getUserDocs)

        console.log("UserIds Fetch --->", userIds);

        console.log("getAckIds-------->", getAckIds)

        for (let docRef = 0; docRef < getAckIds.length; docRef++) {

          let ackIdDocRefs: any = firestore().collection('userEmailAcknowledgement').doc(getAckIds[docRef].ackId);
          createBatch.update(ackIdDocRefs, { sendEmailForAddressNotUpdated: getAckIds[docRef].sendEmailForAddressNotUpdated });
          console.log("Come Here For Send Email For Voice Matters");

          let getUserDetails = await getUserDocs.filter((user: any) => user.uid === getAckIds[docRef].userId);

          console.info("Get User Details:----->", getUserDetails);

          sendEmail(
            getUserDetails[0].email,
            "Important: Update Your Wallet Address for Seamless Rewards on Coin Parliament",
            sendEmailForAddressNotUpdatedTemplate(`${getUserDetails[0].userName}`, env.BASE_SITE_URL)
          );
        }

        createBatch.commit().then(function () {
          console.log("Ack For address not updated Email Send Successfully");
        }).catch(function (error: any) {
          console.error("Error While Ack For Address Not Updated Email Send  :", error);
        });

      } else {
        console.log("No User Found To Send Email Of sendEmailForAddressNotUpdatedInLast72Hours");
      }
    })
    .catch(err => {
      console.error('Error while getting users Ack: sendEmailForAddressNotUpdatedTemplate', err);
    });
}

export const sendEmailForLifetimePassiveIncomeInLast92Hours = async () => {
  const currentTime = Timestamp.now();
  const NinetySixHoursAgo = new Date(currentTime.toMillis() - 96 * 60 * 60 * 1000);
  const usersRef = await firestore().collection('userEmailAcknowledgement');
  const query = usersRef.where('timestamp', '>=', NinetySixHoursAgo);

  const getAckIds: any = [];

  await query.get()
    .then(async (userSnapshot: any) => {
      if (userSnapshot.empty) {
        console.log('No users created in the last 96 hours for life time passive income.');
        return;
      }

      userSnapshot.forEach(async (userAckDoc: any) => {
        let getDataOfUserAsk: any = userAckDoc.data();
        console.log("Get sendEmailForLifetimePassiveIncome---->", getDataOfUserAsk.sendEmailForLifetimePassiveIncome);
        if (getDataOfUserAsk.sendEmailForLifetimePassiveIncome === false) {
          console.log("Get User ID--->", getDataOfUserAsk.userId);
          if (getDataOfUserAsk.userId) {
            getAckIds.push({ ackId: userAckDoc.id, sendEmailForLifetimePassiveIncome: true, userId: getDataOfUserAsk.userId });
            console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());
          } else {
            console.log("No user email found for send notification sendEmailForLifetimePassiveIncome", userAckDoc.id)
          }
        }
      });

      let createBatch: any = firestore().batch();

      const userIds: string[] = getAckIds.map((ack: any) => ack.userId);

      if (userIds && userIds.length) {

        const getUserDocs: any = (
          await firestore().collection("users").where("uid", "in", userIds).get()
        ).docs.map(doc => doc.data());

        console.log("getUserDocs------>", getUserDocs)

        console.log("UserIds Fetch --->", userIds);

        console.log("getAckIds-------->", getAckIds)

        for (let docRef = 0; docRef < getAckIds.length; docRef++) {
          let ackIdDocRefs: any = firestore().collection('userEmailAcknowledgement').doc(getAckIds[docRef].ackId);
          createBatch.update(ackIdDocRefs, { sendEmailForLifetimePassiveIncome: getAckIds[docRef].sendEmailForLifetimePassiveIncome });

          console.log("Come Here For Send Email For Passive Income");

          let getUserDetails = await getUserDocs.filter((user: any) => user.uid === getAckIds[docRef].userId);

          console.info("Get User Details:----->Passive Income", getUserDetails);

          sendEmail(
            getUserDetails[0].email,
            "🌟 Your social media can make you Lifetime Passive Income! 🚀",
            sendEmailForLifetimePassiveIncomeTemplate(`${getUserDetails[0].userName}`, env.BASE_SITE_URL)
          );
        }

        createBatch.commit().then(function () {
          console.log("Ack For live time passive income Email Send Successfully");
        }).catch(function (error: any) {
          console.error("Error While Ack For Life Time Passive Income Email Send  :", error);
        });
      } else {
        console.log("No User Found To Send Email Of sendEmailForLifetimePassiveIncomeInLast92Hours");
      }
    })
    .catch(err => {
      console.error('Error while getting users Ack:', err);
    });
}

export const sendEmailForEarnRewardsByPaxTokensInLast168Hours = async () => {
  const currentTime = Timestamp.now();
  const oneSixtyEightHoursAgo = new Date(currentTime.toMillis() - 168 * 60 * 60 * 1000);
  const usersRef = await firestore().collection('userEmailAcknowledgement');
  const query = usersRef.where('timestamp', '>=', oneSixtyEightHoursAgo);

  const getAckIds: any = [];

  await query.get()
    .then((userSnapshot: any) => {
      if (userSnapshot.empty) {
        console.log('No users created in the last 168 hours for Earn Rewards by Your PAX Tokens.');
        return;
      }
      userSnapshot.forEach((userAckDoc: any) => {
        let getDataOfUserAsk = userAckDoc.data();
        if (getDataOfUserAsk.sendEmailForEarnRewardsByPaxTokens === false) {
          // To Do Send Email To User

          getAckIds.push({ ackId: userAckDoc.id, sendEmailForEarnRewardsByPaxTokens: true })

          console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());
        }


        console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());

        // To Do Send Email To User
      });

      let createBatch: any = firestore().batch();

      for (let docRef = 0; docRef < getAckIds.length; docRef++) {
        let ackIdDocRefs: any = firestore().collection('userEmailAcknowledgement').doc(getAckIds[docRef].ackId);
        createBatch.update(ackIdDocRefs, { sendEmailForEarnRewardsByPaxTokens: getAckIds[docRef].sendEmailForEarnRewardsByPaxTokens });
      }

      createBatch.commit().then(function () {
        console.log("Ack For Earn Rewards By Your PAX Tokens Email Send Successfully");
      }).catch(function (error: any) {
        console.error("Error While Ack For Earn Rewards By Your PAX Tokens Email Send  :", error);
      });
    })
    .catch(err => {
      console.error('Error while getting users Ack:', err);
    });
}

export const sendEmailForUnloackRewardsInLast192Hours = async () => {
  const currentTime = Timestamp.now();
  const oneNinetyTwoHoursAgo = new Date(currentTime.toMillis() - 192 * 60 * 60 * 1000);
  const usersRef = await firestore().collection('userEmailAcknowledgement');
  const query = usersRef.where('timestamp', '>=', oneNinetyTwoHoursAgo);

  const getAckIds: any = [];

  await query.get()
    .then((userSnapshot: any) => {
      if (userSnapshot.empty) {
        console.log('No users created in the last 192 hours for Unlock Exclusive Rewards.');
        return;
      }
      userSnapshot.forEach((userAckDoc: any) => {
        let getDataOfUserAsk = userAckDoc.data();
        if (getDataOfUserAsk.sendEmailForUnloackRewards === false) {
          // To Do Send Email To User

          getAckIds.push({ ackId: userAckDoc.id, sendEmailForUnloackRewards: true })

          console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());
        }


        console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());

        // To Do Send Email To User
      });

      let createBatch: any = firestore().batch();

      for (let docRef = 0; docRef < getAckIds.length; docRef++) {
        let ackIdDocRefs: any = firestore().collection('userEmailAcknowledgement').doc(getAckIds[docRef].ackId);
        createBatch.update(ackIdDocRefs, { sendEmailForUnloackRewards: getAckIds[docRef].sendEmailForUnloackRewards });
      }

      createBatch.commit().then(function () {
        console.log("Ack For Unlock Exclusive Rewards Email Send Successfully");
      }).catch(function (error: any) {
        console.error("Error While Ack For Unlock Exclusive Rewards Email Send  :", error);
      });
    })
    .catch(err => {
      console.error('Error while getting users Ack:', err);
    });
}

export const sendEmailForSVIUpdateInLast216Hours = async () => {
  const currentTime = Timestamp.now();
  const twoHundredSixteenHoursAgo = new Date(currentTime.toMillis() - 216 * 60 * 60 * 1000);
  const usersRef = await firestore().collection('userEmailAcknowledgement');
  const query = usersRef.where('timestamp', '>=', twoHundredSixteenHoursAgo);

  const getAckIds: any = [];

  await query.get()
    .then((userSnapshot: any) => {
      if (userSnapshot.empty) {
        console.log('No users created in the last 192 hours for Unlock Exclusive Rewards.');
        return;
      }
      userSnapshot.forEach((userAckDoc: any) => {
        let getDataOfUserAsk = userAckDoc.data();
        if (getDataOfUserAsk.sendEmailForSVIUpdate === false) {
          // To Do Send Email To User

          getAckIds.push({ ackId: userAckDoc.id, sendEmailForSVIUpdate: true })

          console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());
        }


        console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());

        // To Do Send Email To User
      });

      let createBatch: any = firestore().batch();

      for (let docRef = 0; docRef < getAckIds.length; docRef++) {
        let ackIdDocRefs: any = firestore().collection('userEmailAcknowledgement').doc(getAckIds[docRef].ackId);
        createBatch.update(ackIdDocRefs, { sendEmailForSVIUpdate: getAckIds[docRef].sendEmailForSVIUpdate });
      }

      createBatch.commit().then(function () {
        console.log("Ack For Unlock Exclusive Rewards Email Send Successfully");
      }).catch(function (error: any) {
        console.error("Error While Ack For Unlock Exclusive Rewards Email Send  :", error);
      });
    })
    .catch(err => {
      console.error('Error while getting users Ack:', err);
    });
}

export const sendEmailForProgressWithFreindInLast240Hours = async () => {
  const currentTime = Timestamp.now();
  const twoHundredFourtyHoursAgo = new Date(currentTime.toMillis() - 240 * 60 * 60 * 1000);
  const usersRef = await firestore().collection('userEmailAcknowledgement');
  const query = usersRef.where('timestamp', '>=', twoHundredFourtyHoursAgo);

  const getAckIds: any = [];

  await query.get()
    .then((userSnapshot: any) => {
      if (userSnapshot.empty) {
        console.log('No users created in the last 240 hours for Coin Mining Progress with Your Friends Support.');
        return;
      }
      userSnapshot.forEach((userAckDoc: any) => {
        let getDataOfUserAsk = userAckDoc.data();
        if (getDataOfUserAsk.sendEmailForProgressWithFreind === false) {
          // To Do Send Email To User

          getAckIds.push({ ackId: userAckDoc.id, sendEmailForProgressWithFreind: true })

          console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());
        }


        console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());

        // To Do Send Email To User
      });

      let createBatch: any = firestore().batch();

      for (let docRef = 0; docRef < getAckIds.length; docRef++) {
        let ackIdDocRefs: any = firestore().collection('userEmailAcknowledgement').doc(getAckIds[docRef].ackId);
        createBatch.update(ackIdDocRefs, { sendEmailForProgressWithFreind: getAckIds[docRef].sendEmailForProgressWithFreind });
      }

      createBatch.commit().then(function () {
        console.log("Ack For Coin Mining Progress with Your Friends Support Email Send Successfully");
      }).catch(function (error: any) {
        console.error("Error While Ack For Coin Mining Progress with Your Friends Support Email Send  :", error);
      });
    })
    .catch(err => {
      console.error('Error while getting users Ack:', err);
    });
}

export const sendEmailForTopInfluencerInLast264Hours = async () => {
  const currentTime = Timestamp.now();
  const twoHundredSixtyFourHoursAgo = new Date(currentTime.toMillis() - 264 * 60 * 60 * 1000);
  const usersRef = await firestore().collection('userEmailAcknowledgement');
  const query = usersRef.where('timestamp', '>=', twoHundredSixtyFourHoursAgo);

  const getAckIds: any = [];

  await query.get()
    .then((userSnapshot: any) => {
      if (userSnapshot.empty) {
        console.log('No users created in the last 264 hours for Top Influencer.');
        return;
      }
      userSnapshot.forEach((userAckDoc: any) => {
        let getDataOfUserAsk = userAckDoc.data();
        if (getDataOfUserAsk.sendEmailForTopInfluencer === false) {
          // To Do Send Email To User

          getAckIds.push({ ackId: userAckDoc.id, sendEmailForTopInfluencer: true })

          console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());
        }


        console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());

        // To Do Send Email To User
      });

      let createBatch: any = firestore().batch();

      for (let docRef = 0; docRef < getAckIds.length; docRef++) {
        let ackIdDocRefs: any = firestore().collection('userEmailAcknowledgement').doc(getAckIds[docRef].ackId);
        createBatch.update(ackIdDocRefs, { sendEmailForTopInfluencer: getAckIds[docRef].sendEmailForTopInfluencer });
      }

      createBatch.commit().then(function () {
        console.log("Ack For Top Influencer Email Send Successfully");
      }).catch(function (error: any) {
        console.error("Error While Ack For Top Influencer Email Send  :", error);
      });
    })
    .catch(err => {
      console.error('Error while getting users Ack:', err);
    });
}

export const sendEmailForAfterUpgradeOnImmediate = async (userDetails: any) => {

  console.info("userDetails--->", userDetails);

  const usersRef = await firestore().collection('userEmailAcknowledgement');
  const query = usersRef.where('uid', '==', userDetails.uid);
  const getAckIds: any = [];

  await query.get()
    .then((userSnapshot: any) => {
      if (userSnapshot.empty) {
        console.log('No user is for user upgraded.');
        return;
      }
      userSnapshot.forEach((userAckDoc: any) => {
        let getDataOfUserAsk = userAckDoc.data();
        if (getDataOfUserAsk.sendEmailForAfterUpgrade === false) {
          // To Do Send Email To User

          getAckIds.push({ ackId: userAckDoc.id, sendEmailForAfterUpgrade: true })

          console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());
        }

        console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());
      });

      let createBatch: any = firestore().batch();

      for (let docRef = 0; docRef < getAckIds.length; docRef++) {
        let ackIdDocRefs: any = firestore().collection('userEmailAcknowledgement').doc(getAckIds[docRef].ackId);
        createBatch.update(ackIdDocRefs, { sendEmailForAfterUpgrade: getAckIds[docRef].sendEmailForAfterUpgrade });
      }

      createBatch.commit().then(function () {
        console.log("Ack For Account Upgrade Email Send Successfully");
      }).catch(function (error: any) {
        console.error("Error While Ack For Account Upgrade Email Send  :", error);
      });
    })
    .catch(err => {
      console.error('Error while getting users Ack:', err);
    });
}
