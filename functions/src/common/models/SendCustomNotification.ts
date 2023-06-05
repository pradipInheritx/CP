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

export const sendNotificationForFollwersFollowings = async (
  userId: any, coin: any
) => {
  console.log("Notification for following & followers");
  const follwersFollwing: any = [];
  console.log("userID & Coin", userId, coin)
  const userFindQuery = await firestore().collection("users").doc(userId).get();
  const userData: any = userFindQuery.data();
  console.log(userData);

  userData.subscribers.forEach((user: any) => {
    follwersFollwing.push(user);
  });
  userData.children.forEach((user: any) => {
    follwersFollwing.push(user);
  });

  follwersFollwing.forEach(async (id: any) => {
    console.log("id:", id)
    let userQuery = await firestore().collection("users").doc(id).get();
    var follwersFollwingUserData: any = userQuery.data();
    var token = follwersFollwingUserData.token;

    console.log("userData:", userData)
    console.log("token:", token)
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
  });
};




async function subscribersNotification(subscribers: string[], userName: string) {
  console.log("Beging subscribers notification")
  subscribers.forEach(async (user: string) => {
    const userDetailsQuery = await firestore().collection("users").doc(user).get();
    const userData: any = userDetailsQuery.data();
    const token = userData.token;
    const message: messaging.Message = {
      token,
      notification: {
        title: `You just earnd ${"1.12"} CMP from ${userName}`,
        body: "",
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
      id: user,
      body: "",
      title: `You just earnd ${"1.12"} CMP from ${userName}`,
      message,
    });

  })
  console.log("Finished subscribers notification")
}



export const voteExpireAndGetCpmNotification = async (userId: string, cpm: number, coin: string) => {
  console.log("Push Notification of voteExpireAndGetCpmNotification")


  const userFindQuery = await firestore().collection("users").doc(userId).get();
  const userData: any = userFindQuery.data();
  console.log("UserData:", userData);
  let token = userData.token;

  if (userData.subscribers.length) subscribersNotification(userData.subscribers, userData.displayName)


  const message: messaging.Message = {
    token,
    notification: {
      title: `💰 You just earnd ${cpm} cpm 🤑`,
      body: `${coin} more CPM to complete the mission and claim your rewards!`,
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
    body: `${coin} more CPM to complete the mission and claim your rewards!`,
    title: `💰 You just earnd ${cpm} cpm 🤑`,
    message,
  });
  console.log("End Push Notification of voteExpireAndGetCpmNotification")
}

export const errorLogging = async (
  funcName: string,
  type: string,
  error: any
) => {
  console.info(funcName, type, error);
};


// function getUserListById(userList: any) {
//   return [...new Map(userList.map((item: any) => [item["userId"], item])).values()]
// }

export const checkUserStatusIn24hrs = async (todayTimeFrame: number, yesterdayTimeFrame: number) => {
  const getAllVotesIn24Hours: any[] = [];
  const getAllVotesIn24HoursQuery: any = await firestore()
    .collection('votes')
    .where("voteTime", ">", todayTimeFrame)
    .where("voteTime", "<", yesterdayTimeFrame)
    .orderBy('voteTime', 'desc')
    .get();

  getAllVotesIn24HoursQuery.docs.map((vote: any) => {
    const { userId, status } = vote.data();
    getAllVotesIn24Hours.push({ userId, status });
  });

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
          await sendNotificationForTitleUpgrade(getuserDetails, message, title)
        }
      }
    }
  }


  // const uniqueUserListData = getUserListById(getAllVotesIn24Hours)

  // console.log("uniqueUserListData ==>", uniqueUserListData)

  // await uniqueUserListData.forEach(async (data: any) => {
  //   const getUserDetailsQuery = await firestore().collection("users").doc(data.userId).get();
  //   const getuserDetails = getUserDetailsQuery.data()
  //   await sendNotificationForTitleUpgrade(getuserDetails)
  // })
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
