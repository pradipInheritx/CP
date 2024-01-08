import * as admin from "firebase-admin";
import { firestore, messaging } from "firebase-admin";
import { userConverter } from "./User";
import { sendNotification } from "./Notification";
import { upgradeMessage, downGradeMessage } from "../consts/config";
import env from '../../env/env.json'


export type CustomNotification = {
  title: string;
  body: string;
  userIds: string[];
};

export const sendCustomNotificationOnSpecificUsers = async (
  requestBody: CustomNotification
) => {
  try {
    const { title, body, userIds } = requestBody;
    console.info("ReqBody:", title, body, userIds);
    if (title && body && userIds && userIds.length) {
      const allUsers = await firestore()
        .collection("users")
        .where(firestore.FieldPath.documentId(), "in", userIds)
        .withConverter(userConverter)
        .get();
      const getAllUsersTokens: any = [];
      allUsers.docs.forEach((doc) => {
        getAllUsersTokens.push({ id: doc.id, ...doc.data() });
      });

      if (getAllUsersTokens.length) {
        for (const user of getAllUsersTokens) {
          const token = user.token ? user.token : null;
          if (token) {
            const message: messaging.Message = {
              token,
              notification: {
                title,
                body,
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
            await sendNotification({
              token,
              id: user.id,
              body,
              title,
              message,
            });
          } else {
            errorLogging(
              "sendCustomNotificationOnSpecificUsers",
              "FUNCTION",
              "Token not found"
            );
          }
        }
      } else {
        errorLogging(
          "sendCustomNotificationOnSpecificUsers",
          "FUNCTION",
          "No User's Token Found"
        );
      }
    } else {
      errorLogging(
        "sendCustomNotificationOnSpecificUsers",
        "FUNCTION",
        "Please enter title, body & userIds for custom message"
      );
    }
  } catch (error: any) {
    errorLogging("sendCustomNotificationOnSpecificUsers", "FUNCTION", error);
  }
};

// For Followers and Following
export const sendNotificationForFollwersFollowings = async (
  userId: any, coin: any
) => {
  console.log("Notification for following & followers");
  let follwersFollwing: any = [];
  console.log("userID & Coin", userId, coin)
  const checkCoin = coin.split('-')
  const userFindQuery = await firestore().collection("users").doc(userId).get();
  const userData: any = userFindQuery.data();
  console.log(userData);

  userData.subscribers.forEach((user: any) => {
    follwersFollwing.push(user);
  });
  // userData.leader.forEach((user: any) => {
  //   follwersFollwing.push(user);
  // });
  console.log("Array Following--------", follwersFollwing)

  //remove Duplicate Values and user himself
  // follwersFollwing = follwersFollwing.filter((item: any,
  //   index: any) => (follwersFollwing.indexOf(item) === index) && item !== userId);

  follwersFollwing.forEach(async (id: any) => {
    console.log("id:", id)
    let userQuery = await firestore().collection("users").doc(id).get();
    let follwersFollwingUserData: any = userQuery.data();

    if (follwersFollwingUserData) {
      let token = follwersFollwingUserData?.token ? follwersFollwingUserData.token : null;
      if (token) {
        console.log("userData:-------", userData)
        console.log("token:------- ", token)
        console.log(`${userData.displayName} just voted for ${coin} take action now!`)
        const message: messaging.Message = {
          token,
          notification: {
            title: `👫 ${userData.displayName} just voted for ${coin}`,
            body: 'Make Your Voice Heard Too! Vote Now!',
          },
          webpush: {
            headers: {
              Urgency: "high",
            },
            fcmOptions: {
              link: `${env.BASE_SITE_URL}/${checkCoin.length == 2 ? 'pairs' : 'coins'}/${coin}`, // TODO: put link for deep linking
            },
          },
        };
        console.log("notification link: ", `${env.BASE_SITE_URL}/${checkCoin.length == 2 ? 'pairs' : 'coins'}/${coin}`);
        console.log("Message:", message);
        await sendNotification({
          token,
          id,
          body: `Make Your Voice Heard Too! Vote Now!`,
          title: `👫 ${userData.displayName} just voted for ${coin}`,
          message,
        });
      }
      else {
        console.info("USER_TOKEN_NOT_FOUND", `User token not found of this user : ${id}`)
      }
    }
    else {
      console.info("USER_NOT_FOUND", `User not found of this userId : ${id}`)
    }

  });
};

// For Vote Expiry
export const voteExpireAndGetCpmNotification = async (userId: string, voteStatistics: any, cmp: number, coin: string) => {
  console.log("Push Notification of voteExpireAndGetCpmNotification")
  let remainingCMP: any = 0;
  const userFindQuery = await firestore().collection("users").doc(userId).get();
  const userData: any = userFindQuery.data();

  console.log("UserData:", userData);
  let score = voteStatistics.score;
  if (voteStatistics && parseInt(voteStatistics.score) > 100) {
    let currentScore = score % 100;
    remainingCMP = 100 - parseFloat(currentScore.toFixed(2));
  } else {
    remainingCMP = 100 - voteStatistics.score;
  }

  let token = userData.token;
  console.log("Called Token", token)
  // if (userData.subscribers.length) subscribersNotification(userData.subscribers, userData.displayName, cmp)

  const message: messaging.Message = {
    token,
    notification: {
      title: `💰 You just earnd ${cmp} cmp 🤑`,
      body: `${remainingCMP} more CMP to complete the mission and claim your rewards!`,
    },
    webpush: {
      headers: {
        Urgency: "high",
      },
      fcmOptions: {
        link: `${env.BASE_SITE_URL}/profile/mine`, // TODO: put link for deep linking
      },
    },
  };
  console.log("message:", message);

  await sendNotification({
    token,
    id: userId,
    body: `${remainingCMP} more CMP to complete the mission and claim your rewards!`,
    title: `💰 You just earnd ${cmp} cmp 🤑`,
    message,
  });
  console.log("End Push Notification of voteExpireAndGetCpmNotification")
}

export const checkUserStatusIn24hrs = async (todayTimeFrame: number, yesterdayTimeFrame: number) => {
  console.log('-------Start checkUserStatusIn24hrs-------')
  console.log("todayTimeFrame  -  yesterdayTimeFrame == ", todayTimeFrame, yesterdayTimeFrame)
  const getAllVotesIn24Hours: any[] = [];
  const getAllVotesIn24HoursQuery: any = await firestore()
    .collection('votes')
    .where("voteTime", "<", todayTimeFrame)
    .where("voteTime", ">", yesterdayTimeFrame)
    .orderBy('voteTime', 'desc')
    .get();

  getAllVotesIn24HoursQuery.docs.map((vote: any) => {
    const { userId, status } = vote.data();
    getAllVotesIn24Hours.push({ userId, status });
  });

  console.log("getAllVotesIn24Hours ------", getAllVotesIn24Hours)
  // Group the array of objects by the 'userId' property
  let userVoteGroupObj = getAllVotesIn24Hours.reduce((result, item) => {
    (result[item.userId] = result[item.userId] || []).push(item);
    return result;
  }, {});

  console.log("userVoteGroupObj =>", userVoteGroupObj);

  const userTypesQuery = await firestore().collection("settings").doc("userTypes").get();

  let userTypesData: any = userTypesQuery.data();

  userTypesData = userTypesData.userTypes;

  for (let userId in userVoteGroupObj) {
    if (Object.prototype.hasOwnProperty.call(userVoteGroupObj, userId)) {
      const getUserDetailsQuery = await firestore().collection("users").doc(userId).get();
      const getuserDetails = getUserDetailsQuery.data()

      let userVoteList = userVoteGroupObj[userId];


      for (let vote = 0; vote < userVoteList.length; vote++) {
        console.log("vote Index ->", vote);
        console.log("userVoteList old =>", userVoteList[vote]);
        console.log("userVoteList new =>", userVoteList[vote + 1]);
        if (userVoteList[vote].status.name !== userVoteList[vote + 1].status.name) {
          let oldStatusData = userTypesData.find((item: any) => item.name === userVoteList[vote].status.name);
          let newStatusData = userTypesData.find((item: any) => item.name === userVoteList[vote + 1].status.name);

          let status = newStatusData.index > oldStatusData.index ? 'Upgrade' : 'Downgrade';

          let message;
          let title;
          let statusName: any = userVoteList[vote + 1].status.name;
          if (status === 'Upgrade') {
            title = upgradeMessage[statusName];
            message = `Vote to earn more!`;
          } else if (status === 'Downgrade') {
            title = downGradeMessage[statusName];
            message = `Keep Voting to Rise Again!`;
          }
          console.log("call sendNotificationForTitleUpgrade function")
          await sendNotificationForTitleUpgrade(getuserDetails, message, title)
        }
      }
    }
  }
  console.log('-------End checkUserStatusIn24hrs-------');
}

//For Title Update
export const sendNotificationForTitleUpgrade = async (user: any, body: any, title: any) => {
  const { token } = user || {};
  if (token) {
    //const body = "You just earned a Parliament skill badge! Who's next?";

    const message: messaging.Message = {
      token,
      notification: {
        title,
        body,
      },
      webpush: {
        headers: {
          Urgency: "high",
        },
        fcmOptions: {
          link: `${env.BASE_SITE_URL}/profile/mine`, // TODO: put link for deep linking
        },
      },
    };
    console.log("Notification Link from 24 hours : ", `${env.BASE_SITE_URL}/profile/mine`)
    await sendNotification({
      token,
      message,
      body,
      title,
      id: user.uid,
    });
  }
}

// For Pool Earning
export async function poolMiningNotification(parentId: string, childrenName: string, cmp: number) {
  console.log("Beging pool mining notification")

  const userDetailsQuery = await firestore().collection("users").doc(parentId).get();
  const userData: any = userDetailsQuery.data();
  const token = userData.token;
  const message: messaging.Message = {
    token,
    notification: {
      title: `You just earnd ${cmp} CMP from ${childrenName}`,
      body: `You just earnd ${cmp} CMP from ${childrenName}`,
    },
    webpush: {
      headers: {
        Urgency: "high",
      },
      fcmOptions: {
        link: `${env.BASE_SITE_URL}/profile/mine`, // TODO: put link for deep linking
      },
    },
  };
  console.log("notification link: ", `${env.BASE_SITE_URL}/profile/mine`);
  console.log("message:", message);

  await sendNotification({
    token,
    id: parentId,
    body: `You just earnd ${cmp} CMP from ${childrenName}`,
    title: `You just earnd ${cmp} CMP from ${childrenName}`,
    message,
  });
  console.log("Finished pool minig notification")
}

// For Block Complete
export const sendNotificationForCpm = async (userId: any) => {
  const userRef = await firestore().collection("users").doc(userId).get();
  const user: any = userRef.data();
  console.log("userId from sendNotificationForCpm : ", user)
  const token = user.token;
  if (!token) {
    console.log("Token not found");
  }

  const message: messaging.Message = {
    token,
    notification: {
      title: "Wow",
      body: "Claim your rewards now!",
    },
    webpush: {
      headers: {
        Urgency: "high",
      },
      fcmOptions: {
        link: `${env.BASE_SITE_URL}/profile/mine`, // TODO: put link for deep linking
      },
    },
  };
  console.log("notification link: ", `${env.BASE_SITE_URL}/profile/mine`);
  console.log("Message:", message);
  await sendNotification({
    token,
    message,
    body: "Claim your rewards now!",
    title: "Wow",
    id: userId,
  });
};

// 24 hours no activity notification
export const checkInActivityOfVotesAndSendNotification = async () => {
  const currentDate = admin.firestore.Timestamp.now().toMillis();
  console.log("Current date => ", currentDate);

  // const last24HoursMillis = 24 * 60 * 60 * 1000; // 24 hours before
  const last24HoursMillis = 5 * 60 * 1000; // 5 mins before
  console.log("last24HoursMillis => ", last24HoursMillis);

  const last24HoursDate = admin.firestore.Timestamp.fromMillis(currentDate - last24HoursMillis).toMillis();
  console.log("Last 24 hours date => ", last24HoursDate);

  const getUsers = await admin.firestore().collection("users").get();
  const getAllUsers: any = getUsers.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
    };
  });

  for (let user = 0; user < getAllUsers.length; user++) {
    const getLastUserVoteSnapshot = await admin.firestore().collection("votes")
      .where("userId", "==", getAllUsers[user].id)
      .where("voteTime", "<", last24HoursDate)
      .orderBy("voteTime", "desc")
      .limit(1)
      .get();
    console.info("getLastUserVoteSnapshot", getLastUserVoteSnapshot);
    const lastVotedData: any = [];
    getLastUserVoteSnapshot.forEach((doc) => {
      lastVotedData.push({ id: doc.id, ...doc.data() });
      console.info(doc.id, "=>", doc.data());
    });
    if (lastVotedData && lastVotedData.length) {
      const body = "VOTE NOW!";
      const token = getAllUsers[user].token;

      console.info("Token,", token);
      const message: messaging.Message = {
        token,
        notification: {
          title: "🗳 It's Time to Make Your Voice Heard Again! 🗳",
          body,
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
      console.info("Id,", getAllUsers[user].id);
      console.log("checkInActivityOfVotesAndSendNotification link : ", `${env.BASE_SITE_URL}`)
      await sendNotification({
        token,
        message,
        body,
        title: "🗳 It's Time to Make Your Voice Heard Again! 🗳",
        id: getAllUsers[user].id,
      });
    }
  }
};

export const TitleUpgradeNotificationLogic_Testing = async function (todayTimeFrame: number, yesterdayTimeFrame: number) {
  const getAllVotesIn24Hours: { userId: string, status: string, voteTime: number }[] = [];
  // get all data 
  const getAllVotesIn24HoursQuery: any = await firestore()
    .collection('votes')
    .where("voteTime", "<", todayTimeFrame)
    .where("voteTime", ">", yesterdayTimeFrame)
    .orderBy('voteTime', 'desc')
    .get();
  getAllVotesIn24HoursQuery.docs.map((vote: any) => {
    const { userId, status, voteTime } = vote.data();
    getAllVotesIn24Hours.push({ userId, status: status.name, voteTime });
  });
  console.log("getAllVotesIn24Hours ------", getAllVotesIn24Hours)
  // Group the array of objects by the 'userId' property
  const userVoteGroupObj = getAllVotesIn24Hours.reduce((result: any, item: any) => {
    (result[item.userId] = result[item.userId] || []).push(item);
    return result;
  }, {});

  const getAllUserDetails: any = []
  for (const userId in userVoteGroupObj) {
    if (userId && userVoteGroupObj[userId]) {
      const currentStatus = userVoteGroupObj[userId][0];
      const yesterdayStatus = userVoteGroupObj[userId][(userVoteGroupObj[userId].length) - 1];

      const status = currentStatus.index > yesterdayStatus.index ? "Upgrade" : "Downgrade";

      if (status === "Upgrade") {
        getAllUserDetails.push({
          userId,
          title: upgradeMessage[currentStatus.name],
          message: "Vote to earn more!",
        });
      } else if (status === "Downgrade") {
        getAllUserDetails.push({
          userId,
          title: downGradeMessage[currentStatus.name],
          message: "Keep Voting to Rise Again!",
        });
      }
      console.log("call sendNotificationForTitleUpgrade function");
    }
  }
  console.log("getAllUserDetails : ", getAllUserDetails);

  await sendNotificationForTitleUpgrade_test(getAllUserDetails)
}

export const sendNotificationForTitleUpgrade_test = async (getAllUserDetails: any) => {
  for (let user = 0; user < getAllUserDetails.length; user++) {
    const getUserData: any = (await (firestore().collection('users').doc(getAllUserDetails[user].userId).get())).data();
    console.log("getUserData : ", getUserData);

    if (getUserData.token) {
      const message: messaging.Message = {
        token: getUserData.token,
        notification: {
          title: getAllUserDetails[user].title,
          body: getAllUserDetails[user].message,
        },
        webpush: {
          headers: {
            Urgency: "high",
          },
          fcmOptions: {
            link: `${env.BASE_SITE_URL}/profile/mine`, // TODO: put link for deep linking
          },
        },
      };
      console.log("Notification Link from 24 hours : ", `${env.BASE_SITE_URL}/profile/mine`)
      await sendNotification({
        token: getUserData.token,
        message,
        title: getAllUserDetails[user].title,
        body: getAllUserDetails[user].message,
        id: getUserData.uid,
      });
    }
  }
}

export const sendNotificationForMintAddress = async (userId: string) => {
  try {
    if (!userId) {
      errorLogging("sendNotificationForMintAddress", "Error", "userId is required");
    }
    console.log("userId : ", userId);
    const user: any = (await firestore().collection("users").doc(userId).get()).data();
    if (user) {
      errorLogging("sendNotificationForMintAddress", "Error", "user is not found");
    }
    console.log("userWellDAddress : ", user.paxAddress);
    if (!user.paxAddress.address && !user.paxAddress.coin) {
      const message: messaging.Message = {
        token: user.token,
        notification: {
          title: "Add PAX address",
          body: "Please add the PAX address for receive the PAX",
        },
        webpush: {
          headers: {
            Urgency: "high",
          },
          fcmOptions: {
            link: `${env.BASE_SITE_URL}/profile/wallet`, // TODO: put link for deep linking
          },
        },
      };

      await sendNotification({
        token: user.token,
        message,
        title: "Add PAX address",
        body: "Please add the PAX address for receive the PAX",
        id: user.uid,
      });

      return {
        status: false,
        message: "PAX Notification is sent successfully",
        result: ""
      }
    }
    return {
      status: true,
      message: "user have PAX address",
      result: user.paxAddress
    }
  } catch (error) {
    console.log("sendNotificationForMintAddress Error : ", error);
    return errorLogging("sendNotificationForMintAddress", "Error", error)
  }
}
export const sendRefferalNotification = async (userData: any) => {
  try {
    console.log("-----Start Refferal Notification -------");
    console.log("userData: ", userData);
    if (!userData[0].id && !userData[1].id) {
      return errorLogging("sendRefferalNotification", "Error", "Parent Id or Child Id must be nedded");
    }

    for (let index = 0; index < userData.length; index++) {
      const user = (await firestore().collection('users').doc(userData[index].id).get()).data()
      if (!user) {
        errorLogging("sendRefferalNotification", "Error", "User not found");
        break;
      }

      const title = userData[index].isParent ? `Earn some amount` : `Paid some amount`;
      const body = userData[index].isParent ? `you earn ${userData[index].amount} amount` : `you paid ${userData[index].amount} amount`;
      const message: messaging.Message = {
        token: user.token,
        notification: {
          title,
          body
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

      await sendNotification({
        token: user.token,
        message,
        title,
        body,
        id: user.uid,
      });
    }

    console.log("-----End Refferal Notification -------");
  } catch (error) {
    console.log("sendRefferalNotification Error : ", error)
    errorLogging("sendRefferalNotification", "Error", error);
  }
}
// Error Function
export const errorLogging = async (
  funcName: string,
  type: string,
  error: any
) => {
  console.info(funcName, type, error);
};