//import axios from "axios";
import { firestore, messaging } from "firebase-admin";
import { Timestamp } from 'firebase-admin/firestore';
import { sendEmail } from "../services/emailServices";
import { sendEmailForVoiceMatterTemplate } from "../emailTemplates/sendEmailForVoiceMatterTemplate";
import { sendEmailForUserUpgradeTemplate } from "../emailTemplates/sendEmailForUserUpgradeTemplate";
import { sendEmailForAddressNotUpdatedTemplate } from "../emailTemplates/sendEmailForAddressNotUpdated";
import { sendEmailForLifetimePassiveIncomeTemplate } from "../emailTemplates/sendEmailForLifetimePassiveIncomeTemplate";
import { sendEmailForEarnRewardsByPaxTokensTemplate } from "../emailTemplates/sendEmailForEarnRewardsByPaxTokensTemplate";
import { sendEmailForUnloackRewardsTemplate } from "../emailTemplates/sendEmailForUnloackRewardsTemplate"
import { sendEmailForSVIUpdateTemplate } from "../emailTemplates/sendEmailForSVIUpdateTemplate"
import { sendEmailForProgressWithFriendTemplate } from "../emailTemplates/sendEmailForProgressWithFriendTemplate"
import { sendEmailForTopInfluencerTemplate } from "../emailTemplates/sendEmailForTopInfluencerTemplate"
import { sendEmailForAfterUpgradeTemplate } from "../emailTemplates/sendEmailForAfterUpgradeTemplate"
import { sendEmailForFollowerCountTemplate } from "../emailTemplates/sendEmailForFollowerCountTemplate"

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
    sendEmailForProgressWithFriend: false,
    sendEmailForTopInfluencer: false,
    sendEmailForAfterUpgrade: false,
    isUserLogin: false,
    isUserFirstLoginTime: null,
    isUserFirstVoted: false,
    firstTimeUserVoteTime: null,
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
    const query = usersRef.where('isUserFirstLoginTime', '>=', twentyFourHoursAgo);

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
          if (getDataOfUserAsk.sendEmailForVoiceMatter === false && getDataOfUserAsk.isUserLogin) {
            console.log("Get User ID--->", getDataOfUserAsk.userId);
            if (getDataOfUserAsk.userId) {
              getAckIds.push({ ackId: userAckDoc.id, sendEmailForVoiceMatter: true, userId: getDataOfUserAsk.userId });
              console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());
            } else {
              console.log("No user email found for send notification", userAckDoc.id)
            }
          } else {
            console.log("No user logged in or already email sent in sendEmailForVoiceMatterInLast24Hours", userAckDoc.id)
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
  const twentyFourHoursAgo = new Date(currentTime.toMillis() - 24 * 60 * 60 * 1000);
  const fourtyEightHoursAgo = new Date(currentTime.toMillis() - 48 * 60 * 60 * 1000);

  const usersRef = await firestore().collection('userEmailAcknowledgement');
  const query = usersRef
    .where('firstTimeUserVoteTime', '>=', twentyFourHoursAgo)
    .where('firstTimeUserVoteTime', '<=', fourtyEightHoursAgo);

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
        if (getDataOfUserAsk.sendEmailForUserUpgrade === false && getDataOfUserAsk.isUserFirstVoted) {
          console.log("Get User ID--->", getDataOfUserAsk.userId);
          if (getDataOfUserAsk.userId) {
            getAckIds.push({ ackId: userAckDoc.id, sendEmailForUserUpgrade: true, userId: getDataOfUserAsk.userId });
            console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());
          } else {
            console.log("No user email found for send notification sendEmailForUserUpgradeInLast48Hours", userAckDoc.id)
          }
        } else {
          console.log("No user voted yet or already email sent in sendEmailForVoiceMatterInLast24Hours", userAckDoc.id)
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

        console.log("getAckIds-------->", getAckIds);

        for (let docRef = 0; docRef < getAckIds.length; docRef++) {

          let getUserDetails = await getUserDocs.filter((user: any) => user.uid === getAckIds[docRef].userId);

          if (getUserDetails[0].isUserUpgraded) {
            console.log("User Already Upgraded", getUserDetails[0].uid);
            let ackIdDocRefs: any = firestore().collection('userEmailAcknowledgement').doc(getAckIds[docRef].ackId);
            createBatch.update(ackIdDocRefs, { sendEmailForUserUpgrade: getAckIds[docRef].sendEmailForUserUpgrade });
          } else {
            let ackIdDocRefs: any = firestore().collection('userEmailAcknowledgement').doc(getAckIds[docRef].ackId);
            createBatch.update(ackIdDocRefs, { sendEmailForUserUpgrade: getAckIds[docRef].sendEmailForUserUpgrade });

            console.info("Get User Details:----->", getUserDetails);

            sendEmail(
              getUserDetails[0].email,
              "Don't Miss Out on Your PAX Tokens – Upgrade Your Account Today!",
              sendEmailForUserUpgradeTemplate(`${getUserDetails[0].userName}`, env.BASE_SITE_URL)
            );
          }
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
  const query = usersRef.where('isUserFirstLoginTime', '>=', SeventyTwoHoursAgo);

  const getAckIds: any = [];

  await query.get()
    .then(async (userSnapshot: any) => {
      if (userSnapshot.empty) {
        console.log('No users created in the last 72 hours for address not update.');
        return;
      }

      userSnapshot.forEach(async (userAckDoc: any) => {
        let getDataOfUserAsk: any = userAckDoc.data();
        console.log("Get sendEmailForAddressNotUpdatedInLast72Hours---->", getDataOfUserAsk.sendEmailForAddressNotUpdated);
        if (getDataOfUserAsk.sendEmailForAddressNotUpdated === false && getDataOfUserAsk.isUserLogin) {
          console.log("Get User ID--->", getDataOfUserAsk.userId);
          if (getDataOfUserAsk.userId) {
            getAckIds.push({ ackId: userAckDoc.id, sendEmailForAddressNotUpdated: true, userId: getDataOfUserAsk.userId });
            console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());
          } else {
            console.log("No user email found for send notification sendEmailForAddressNotUpdatedInLast72Hours", userAckDoc.id)
          }
        } else {
          console.log("No user logged in or already email sent in sendEmailForAddressNotUpdatedInLast72Hours", userAckDoc.id)
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
  const query = usersRef.where('isUserFirstLoginTime', '>=', NinetySixHoursAgo);

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
        if (getDataOfUserAsk.sendEmailForLifetimePassiveIncome === false && getDataOfUserAsk.isUserLogin) {
          console.log("Get User ID--->", getDataOfUserAsk.userId);
          if (getDataOfUserAsk.userId) {
            getAckIds.push({ ackId: userAckDoc.id, sendEmailForLifetimePassiveIncome: true, userId: getDataOfUserAsk.userId });
            console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());
          } else {
            console.log("No user email found for send notification sendEmailForLifetimePassiveIncomeInLast92Hours", userAckDoc.id)
          }
        } else {
          console.log("No user logged in or already email sent in sendEmailForLifetimePassiveIncomeInLast92Hours", userAckDoc.id)
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
  const query = usersRef.where('isUserFirstLoginTime', '>=', oneSixtyEightHoursAgo);

  const getAckIds: any = [];

  await query.get()
    .then(async (userSnapshot: any) => {
      if (userSnapshot.empty) {
        console.log('No users created in the last 168 hours for Earn Rewards by Your PAX Tokens.');
        return;
      }

      userSnapshot.forEach(async (userAckDoc: any) => {
        let getDataOfUserAsk: any = userAckDoc.data();
        console.log("Get sendEmailForEarnRewardsByPaxTokensInLast168Hours---->", getDataOfUserAsk.sendEmailForEarnRewardsByPaxTokens);
        if (getDataOfUserAsk.sendEmailForEarnRewardsByPaxTokens === false && getDataOfUserAsk.isUserLogin) {
          console.log("Get User ID--->", getDataOfUserAsk.userId);
          if (getDataOfUserAsk.userId) {
            getAckIds.push({ ackId: userAckDoc.id, sendEmailForEarnRewardsByPaxTokens: true, userId: getDataOfUserAsk.userId });
            console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());
          } else {
            console.log("No user email found for send notification sendEmailForEarnRewardsByPaxTokensInLast168Hours", userAckDoc.id)
          }
        } else {
          console.log("No user logged in or already email sent in sendEmailForEarnRewardsByPaxTokensInLast168Hours", userAckDoc.id)
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
          createBatch.update(ackIdDocRefs, { sendEmailForEarnRewardsByPaxTokens: getAckIds[docRef].sendEmailForEarnRewardsByPaxTokens });
          console.log("Come Here For Send Email For sendEmailForEarnRewardsByPaxTokens");

          let getUserDetails = await getUserDocs.filter((user: any) => user.uid === getAckIds[docRef].userId);

          console.info("Get User Details:----->", getUserDetails);

          sendEmail(
            getUserDetails[0].email,
            "Earn Rewards by Voting and Minting Your PAX Tokens on Coin Parliament",
            sendEmailForEarnRewardsByPaxTokensTemplate(`${getUserDetails[0].userName}`, env.BASE_SITE_URL)
          );
        }

        createBatch.commit().then(function () {
          console.log("Ack For Earn Rewards By Your PAX Tokens Email Send Successfully");
        }).catch(function (error: any) {
          console.error("Error While Ack For Earn Rewards By Your PAX Tokens Email Send  :", error);
        });
      } else {
        console.log("No User Found To Send Email Of sendEmailForEarnRewardsByPaxTokensInLast168Hours");
      }
    })
    .catch(err => {
      console.error('Error while getting users Ack:', err);
    });
}

export const sendEmailForUnloackRewardsInLast192Hours = async () => {
  const currentTime = Timestamp.now();
  const oneNinetyTwoHoursAgo = new Date(currentTime.toMillis() - 192 * 60 * 60 * 1000);
  const usersRef = await firestore().collection('userEmailAcknowledgement');
  const query = usersRef.where('isUserFirstLoginTime', '>=', oneNinetyTwoHoursAgo);

  const getAckIds: any = [];

  await query.get()
    .then(async (userSnapshot: any) => {
      if (userSnapshot.empty) {
        console.log('No users created in the last 192 hours for Unlock Exclusive Rewards.');
        return;
      }

      userSnapshot.forEach(async (userAckDoc: any) => {
        let getDataOfUserAsk: any = userAckDoc.data();
        console.log("Get sendEmailForUnloackRewardsInLast192Hours---->", getDataOfUserAsk.sendEmailForUnloackRewards);
        if (getDataOfUserAsk.sendEmailForUnloackRewards === false && getDataOfUserAsk.isUserLogin) {
          console.log("Get User ID--->", getDataOfUserAsk.userId);
          if (getDataOfUserAsk.userId) {
            getAckIds.push({ ackId: userAckDoc.id, sendEmailForUnloackRewards: true, userId: getDataOfUserAsk.userId });
            console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());
          } else {
            console.log("No user email found for send notification sendEmailForUnloackRewardsInLast192Hours", userAckDoc.id)
          }
        } else {
          console.log("No user logged in or already email sent in sendEmailForUnloackRewardsInLast192Hours", userAckDoc.id)
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
          createBatch.update(ackIdDocRefs, { sendEmailForUnloackRewards: getAckIds[docRef].sendEmailForUnloackRewards });

          let getUserDetails = await getUserDocs.filter((user: any) => user.uid === getAckIds[docRef].userId);

          console.info("Get User Details:----->", getUserDetails);

          sendEmail(
            getUserDetails[0].email,
            "Expand Your Card Collection and Unlock Exclusive Rewards on Coin Parliament",
            sendEmailForUnloackRewardsTemplate(`${getUserDetails[0].userName}`, env.BASE_SITE_URL) // To Do For Change the template
          );
        }

        createBatch.commit().then(function () {
          console.log("Ack For Unlock Exclusive Rewards Email Send Successfully");
        }).catch(function (error: any) {
          console.error("Error While Ack For Unlock Exclusive Rewards Email Send  :", error);
        });
      } else {
        console.log("No User Found To Send Email Of sendEmailForUnloackRewardsInLast192Hours");
      }
    })
    .catch(err => {
      console.error('Error while getting users Ack: sendEmailForUnloackRewardsInLast192Hours', err);
    });
}

export const sendEmailForSVIUpdateInLast216Hours = async () => {
  const currentTime = Timestamp.now();
  const twoHundredSixteenHoursAgo = new Date(currentTime.toMillis() - 216 * 60 * 60 * 1000);
  const usersRef = await firestore().collection('userEmailAcknowledgement');
  const query = usersRef.where('isUserFirstLoginTime', '>=', twoHundredSixteenHoursAgo);

  const getAckIds: any = [];

  await query.get()
    .then(async (userSnapshot: any) => {
      if (userSnapshot.empty) {
        console.log('No users created in the last 192 hours for Unlock Exclusive Rewards.');
        return;
      }

      userSnapshot.forEach(async (userAckDoc: any) => {
        let getDataOfUserAsk: any = userAckDoc.data();
        console.log("Get sendEmailForSVIUpdate---->", getDataOfUserAsk.sendEmailForSVIUpdate);
        if (getDataOfUserAsk.sendEmailForSVIUpdate === false && getDataOfUserAsk.isUserLogin) {
          console.log("Get User ID--->", getDataOfUserAsk.userId);
          if (getDataOfUserAsk.userId) {
            getAckIds.push({ ackId: userAckDoc.id, sendEmailForSVIUpdate: true, userId: getDataOfUserAsk.userId });
            console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());
          } else {
            console.log("No user email found for send notification sendEmailForSVIUpdateInLast216Hours", userAckDoc.id)
          }
        } else {
          console.log("No user logged in or already email sent in sendEmailForSVIUpdateInLast216Hours", userAckDoc.id)
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
          createBatch.update(ackIdDocRefs, { sendEmailForSVIUpdate: getAckIds[docRef].sendEmailForSVIUpdate });

          let getUserDetails = await getUserDocs.filter((user: any) => user.uid === getAckIds[docRef].userId);

          console.info("Get User Details:----->", getUserDetails);

          sendEmail(
            getUserDetails[0].email,
            "Stay Informed with Bitcoin SVI Updates on Coin Parliament",
            sendEmailForSVIUpdateTemplate(`${getUserDetails[0].userName}`, env.BASE_SITE_URL) // To Do For Change the template
          );
        }

        createBatch.commit().then(function () {
          console.log("Ack For Unlock Exclusive Rewards Email Send Successfully");
        }).catch(function (error: any) {
          console.error("Error While Ack For Unlock Exclusive Rewards Email Send  :", error);
        });
      } else {
        console.log("No User Found To Send Email Of sendEmailForSVIUpdateInLast216Hours");
      }
    })
    .catch(err => {
      console.error('Error while getting users Ack:', err);
    });
}

export const sendEmailForProgressWithFriendInLast240Hours = async () => {
  const currentTime = Timestamp.now();
  const twoHundredFourtyHoursAgo = new Date(currentTime.toMillis() - 240 * 60 * 60 * 1000);
  const usersRef = await firestore().collection('userEmailAcknowledgement');
  const query = usersRef.where('isUserFirstLoginTime', '>=', twoHundredFourtyHoursAgo);

  const getAckIds: any = [];

  await query.get()
    .then(async (userSnapshot: any) => {
      if (userSnapshot.empty) {
        console.log('No users created in the last 240 hours for Coin Mining Progress with Your Friends Support.');
        return;
      }

      userSnapshot.forEach(async (userAckDoc: any) => {
        let getDataOfUserAsk: any = userAckDoc.data();
        console.log("Get sendEmailForProgressWithFriend---->", getDataOfUserAsk.sendEmailForProgressWithFriend);
        if (getDataOfUserAsk.sendEmailForProgressWithFriend === false && getDataOfUserAsk.isUserLogin) {
          console.log("Get User ID--->", getDataOfUserAsk.userId);
          if (getDataOfUserAsk.userId) {
            getAckIds.push({ ackId: userAckDoc.id, sendEmailForProgressWithFriend: true, userId: getDataOfUserAsk.userId });
            console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());
          } else {
            console.log("No user email found for send notification sendEmailForProgressWithFriendInLast240Hours", userAckDoc.id)
          }
        } else {
          console.log("No user logged in or already email sent in sendEmailForProgressWithFriendInLast240Hours", userAckDoc.id)
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
          createBatch.update(ackIdDocRefs, { sendEmailForProgressWithFriend: getAckIds[docRef].sendEmailForProgressWithFriend });
          let getUserDetails = await getUserDocs.filter((user: any) => user.uid === getAckIds[docRef].userId);

          console.info("Get User Details:----->", getUserDetails);

          sendEmail(
            getUserDetails[0].email,
            "Accelerate Your Coin Mining Progress with Your Friends' Support!",
            sendEmailForProgressWithFriendTemplate(`${getUserDetails[0].userName}`, env.BASE_SITE_URL) // To Do For Change the template
          );
        }
        createBatch.commit().then(function () {
          console.log("Ack For Coin Mining Progress with Your Friends Support Email Send Successfully");
        }).catch(function (error: any) {
          console.error("Error While Ack For Coin Mining Progress with Your Friends Support Email Send  :", error);
        });
      } else {
        console.log("No User Found To Send Email Of sendEmailForProgressWithFriendInLast240Hours");
      }
    })
    .catch(err => {
      console.error('Error while getting users Ack:', err);
    });
}

export const sendEmailForTopInfluencerInLast264Hours = async () => {
  const currentTime = Timestamp.now();
  const twoHundredSixtyFourHoursAgo = new Date(currentTime.toMillis() - 264 * 60 * 60 * 1000);
  const usersRef = await firestore().collection('userEmailAcknowledgement');
  const query = usersRef.where('isUserFirstLoginTime', '>=', twoHundredSixtyFourHoursAgo);

  const getAckIds: any = [];

  await query.get()
    .then(async (userSnapshot: any) => {
      if (userSnapshot.empty) {
        console.log('No users created in the last 264 hours for Top Influencer.');
        return;
      }
      userSnapshot.forEach(async (userAckDoc: any) => {
        let getDataOfUserAsk: any = userAckDoc.data();
        console.log("Get sendEmailForTopInfluencer---->", getDataOfUserAsk.sendEmailForTopInfluencer);
        if (getDataOfUserAsk.sendEmailForTopInfluencer === false && getDataOfUserAsk.isUserLogin) {
          console.log("Get User ID--->", getDataOfUserAsk.userId);
          if (getDataOfUserAsk.userId) {
            getAckIds.push({ ackId: userAckDoc.id, sendEmailForTopInfluencer: true, userId: getDataOfUserAsk.userId });
            console.log('User Ack:', userAckDoc.id, '=>', userAckDoc.data());
          } else {
            console.log("No user email found for send notification sendEmailForTopInfluencerInLast264Hours", userAckDoc.id);
          }
        } else {
          console.log("No user logged in or already email sent in sendEmailForTopInfluencerInLast264Hours", userAckDoc.id)
        }
      });

      const userIds: string[] = getAckIds.map((ack: any) => ack.userId);

      if (userIds && userIds.length) {

        let createBatch: any = firestore().batch();

        const getUserDocs: any = (
          await firestore().collection("users").where("uid", "in", userIds).get()
        ).docs.map(doc => doc.data());

        console.log("getUserDocs------>", getUserDocs)

        console.log("UserIds Fetch --->", userIds);

        console.log("getAckIds-------->", getAckIds)

        for (let docRef = 0; docRef < getAckIds.length; docRef++) {
          let ackIdDocRefs: any = firestore().collection('userEmailAcknowledgement').doc(getAckIds[docRef].ackId);
          createBatch.update(ackIdDocRefs, { sendEmailForTopInfluencer: getAckIds[docRef].sendEmailForTopInfluencer });

          let getUserDetails = await getUserDocs.filter((user: any) => user.uid === getAckIds[docRef].userId);

          console.info("Get User Details:----->", getUserDetails);

          sendEmail(
            getUserDetails[0].email,
            "Explore the Top Influencers on Coin Parliament!",
            sendEmailForTopInfluencerTemplate(`${getUserDetails[0].userName}`, env.BASE_SITE_URL) // To Do For Change the template
          );
        }

        createBatch.commit().then(function () {
          console.log("Ack For Top Influencer Email Send Successfully");
        }).catch(function (error: any) {
          console.error("Error While Ack For Top Influencer Email Send  :", error);
        });

      } else {
        console.log("No User Found To Send Email Of sendEmailForProgressWithFriendInLast240Hours");
      }


    })
    .catch(err => {
      console.error('Error while getting users Ack:', err);
    });
}

export const sendEmailForAfterUpgradeOnImmediate = async (userDetails: any) => {

  console.log("userDetails-----> In Function", userDetails)

  await sendEmail(
    userDetails.email,
    "Congratulations on Upgrading Your Coin Parliament Account!",
    sendEmailForAfterUpgradeTemplate(`${userDetails.userName ? userDetails.userName : 'User'}`, env.BASE_SITE_URL) // To Do For Change the template
  );

  const usersRef = await firestore().collection('userEmailAcknowledgement');
  const query = usersRef.where('userId', '==', userDetails.uid);

  const updatedData = {
    sendEmailForAfterUpgrade: true
  };

  const querySnapshot = await query.get();

  querySnapshot.forEach(async (doc: any) => {
    try {
      await doc.ref.update(updatedData);
      console.log(`Document of userId : ${userDetails.uid} successfully updated!`);
    } catch (error) {
      console.error('Error updating document:', error);
    }
  });
}

export const sendEmailForUserFollowersCountInWeek = async () => {
  const currentTime = Timestamp.now();
  const oneSixtyEightHoursAgo = new Date(currentTime.toMillis() - 168 * 60 * 60 * 1000);
  const usersRef = await firestore().collection('users');
  const query = usersRef.where('lastTimeSubscribedUser', '>=', oneSixtyEightHoursAgo);
  const allUsersEmailAndSubscriberCount: any = [];

  await query.get()
    .then(async (userSnapshot: any) => {
      if (userSnapshot.empty) {
        console.log('No users created in the last 168 hours for Followers Count.');
        return;
      }
      userSnapshot.forEach(async (user: any) => {
        allUsersEmailAndSubscriberCount.push({ userId: user.uid, userName: user.userName, email: user.email, subscribersCurrentTotalCount: user.subscribersCurrentTotalCount })
      });

      if (allUsersEmailAndSubscriberCount && allUsersEmailAndSubscriberCount.length) {
        for (let user = 0; user < allUsersEmailAndSubscriberCount.length; user++) {
          await sendEmail(
            allUsersEmailAndSubscriberCount[user].email,
            "🌟  New Followers Alert! 🌟",
            sendEmailForFollowerCountTemplate(`${allUsersEmailAndSubscriberCount[user].userName ? allUsersEmailAndSubscriberCount[user].userName : 'User'}`, allUsersEmailAndSubscriberCount[user].subscribersCurrentTotalCount, env.BASE_SITE_URL) // To Do For Change the template
          );
        }
      }

    })
    .catch(err => {
      console.error('Error while getting users data:', err);
    });
}
