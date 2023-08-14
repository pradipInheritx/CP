import { firestore, messaging } from "firebase-admin";
import { userConverter } from "./User";
import { sendNotification } from "./Notification";
import { upgradeMessage, downGradeMessage } from "../consts/config";
// import { object } from "firebase-functions/v1/storage";

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
  const userFindQuery = await firestore().collection("users").doc(userId).get();
  const userData: any = userFindQuery.data();
  console.log(userData);

  userData.subscribers.forEach((user: any) => {
    follwersFollwing.push(user);
  });
  userData.leader.forEach((user: any) => {
    follwersFollwing.push(user);
  });
  console.log("Array Following--------", follwersFollwing)

  //remove Duplicate Values and user himself
  follwersFollwing = follwersFollwing.filter((item: any,
    index: any) => (follwersFollwing.indexOf(item) === index) && item !== userId);

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
              link: "#", // TODO: put link for deep linking
            },
          },
        };
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

  let voteStatistics: any = userData?.voteStatistics ? userData.voteStatistics : "";
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
        link: "#", // TODO: put link for deep linking
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


      for (let vote = 0; vote < (userVoteList.length - 1); vote++) {
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
          link: "#", // TODO: put link
        },
      },
    };
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
        link: "#", // TODO: put link for deep linking
      },
    },
  };
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
        link: "#", // TODO: put link for deep linking
      },
    },
  };
  console.log("Message:", message);
  await sendNotification({
    token,
    message,
    body: "Claim your rewards now!",
    title: "Wow",
    id: userId,
  });
};

// Error Function
export const errorLogging = async (
  funcName: string,
  type: string,
  error: any
) => {
  console.info(funcName, type, error);
};