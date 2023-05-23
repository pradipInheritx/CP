import { firestore, messaging } from "firebase-admin";
import { userConverter } from "./User";
import { sendNotification } from "./Notification";
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
    var userData: any = userQuery.data();
    var token = userData.token;

    console.log("userData:", userData)
    console.log("toekn:", token)
    console.log(`${userData.displayName} just voted for ${coin} take action now!`)
    const message: messaging.Message = {
      token,
      notification: {
        title: `${userData.displayName} just voted for ${coin} take action now!`,
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
    console.log("Message:", message);
    await sendNotification({
      token,
      id,
      body: `${userData.displayName} just voted for ${coin} take action now!`,
      title: `${userData.displayName} just voted for ${coin} take action now!`,
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
      title: `You just earnd ${cpm} cpm`,
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
    title: `You just earnd ${cpm} cpm`,
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


function getUserListById(userList: any) {
  return [...new Map(userList.map((item: any) => [item["userId"], item])).values()]
}

export const checkUserStatusIn24hrs = async (todayTimeFrame: number, yesterdayTimeFrame: number) => {
  const getAllVotesIn24Hours: object[] = [];
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
  const uniqueUserListData = getUserListById(getAllVotesIn24Hours)

  await uniqueUserListData.forEach(async (data: any) => {
    const getUserDetailsQuery = await firestore().collection("users").doc(data.userId).get();
    const getuserDetails = getUserDetailsQuery.data()
    await sendNotificationForTitleUpgrade(getuserDetails)
  })
}

//For Title Update
export const sendNotificationForTitleUpgrade = async (user: any) => {
  const { token } = user.data() || {};
  if (token) {
    const body = "You just earned a Parliament skill badge! Who's next?";

    const message: messaging.Message = {
      token,
      notification: {
        title: "You just earned a Parliament skill badge! Who's next?",
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
      title: "You just earned a Parliament skill badge! Who's next?",
      id: user.userId,
    });
  }
}
