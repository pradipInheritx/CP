import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express from "express";
import * as bodyParser from "body-parser";
import env from "./env/env.json";
import speakeasy from "speakeasy";
import cors from "cors";
import { pullAll, union, uniq } from "lodash";
import sgMail from "@sendgrid/mail";
import { JWT } from "google-auth-library";
import * as jwt from "jsonwebtoken"; // For JSON Web Token
//import { firestore } from "firebase-admin";

// Interfaces
import {
  Colors,
  UserProps,
  UserTypeProps,
} from "./common/interfaces/User.interface";
import { VoteResultProps } from "./common/interfaces/Vote.interface";
import { Leader } from "./common/interfaces/Coin.interface";

// function import
import "./common/models/scheduleFunction";
import {
  isAdmin,
  userConverter,
  // sendEmailVerificationLink
} from "./common/models/User";
import serviceAccount from "./serviceAccounts/coin-parliament-prod.json";

import {
  getLeaderUsers,
  getLeaderUsersByIds,
  setLeaders,
} from "./common/models/Calculation";
import {
  updateVotesTotal,
  updateVotesTotalForSingleCoin,
  voteConverter,
  getOldAndCurrentPriceAndMakeCalculation,
  getResultAfterVote,
  //addVoteResultForCPVI,
  checkAndUpdateRewardTotal,
} from "./common/models/Vote";
import {
  getAllCoins,
  getAllPairs,
  // prepareCPVI,
  // fetchAskBidCoin,
  // getUpdatedDataFromWebsocket,
  // getAllUpdated24HourRecords,
  // removeTheBefore24HoursData,
} from "./common/models/Coin";
import Refer from "./common/models/Refer";
import {
  subscribeToTopic,
  unsubscribeToTopic,
} from "./common/models/Subscribe";
import {
  addCpmTransaction,
  shouldHaveTransaction,
  addPaxTransactionWithPendingStatus,
  // getPendingPaxTransaction,
  // checkUsersWellDAddress
} from "./common/models/PAX";
import {
  claimReward,
  // addReward,
  cardHolderListing,
  // sendMintForPaxToAdmin,
  // sendMintForPaxToUser
} from "./common/models/Reward";
import {
  cpviTaskCoin,
  cpviTaskPair,
  getCPVIForVote,
  CPVIForCoin,
  // getUniqCoins,
  // getUniqPairsBothCombinations,
} from "./common/models/CPVI";
import {
  sendNotificationForFollwersFollowings,
  sendCustomNotificationOnSpecificUsers,
  checkUserStatusIn24hrs,
  checkInActivityOfVotesAndSendNotification,
  sendNotificationForMintAddress,
} from "./common/models/SendCustomNotification";
import { getCoinCurrentAndPastDataDifference } from "./common/models/Admin/Coin";
import { JwtPayload } from "./common/interfaces/Admin.interface";
import { createPushNotificationOnCallbackURL, sendEmailAcknowledgementStatus, sendEmailForAddressNotUpdatedInLast72Hours, sendEmailForEarnRewardsByPaxTokensInLast168Hours, sendEmailForLifetimePassiveIncomeInLast96Hours, sendEmailForProgressWithFriendInLast240Hours, sendEmailForSVIUpdateInLast216Hours, sendEmailForTopInfluencerInLast264Hours, sendEmailForUnloackRewardsInLast192Hours, sendEmailForUserFollowersCountInWeek, sendEmailForUserUpgradeInLast48Hours, sendEmailForVoiceMatterInLast24Hours } from "./common/models/Notification"

// import {getRandomFoundationForUserLogin} from "./common/models/Admin/Foundation"
import {
  imageUploadFunction,
  avatarUploadFunction,
} from "./common/helpers/fileUploadConfig";
import { getFollowersFollowingsAndVoteCoin } from "./common/models/NotificationCalculation";
import { auth } from "./common/middleware/authentication";

// import { setPaymentSchedulingByCronJob } from "./common/models/PaymentCalculation";
//import { settlePendingTransactionFunction, setPaymentSchedulingByCronJob } from "./common/models/PaymentCalculation";

// import sendGrid Email function and templates 
import { sendEmail } from "./common/services/emailServices"
import { userVerifyEmailTemplate } from "./common/emailTemplates/userVerifyEmailTemplate";
import { userWelcomeEmailTemplate } from "./common/emailTemplates/userWelcomeEmailTemplate";
import { newUserVerifySuccessTemplate } from "./common/emailTemplates/newUserVerifySuccessTemplate";
import { newUserVerifyFailureTemplate } from "./common/emailTemplates/newUserVerifyFailureTemplate";


// Routers files
import Routers from "./routes/index";
import { errorLogging } from "./common/helpers/commonFunction.helper";
import { checkTransactionStatus } from "./common/models/Payments";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL:
    "https://coinparliament-51ae1-default-rtdb.europe-west1.firebasedatabase.app",
});

// initialize express server
const app = express();
const main = express();
// Enable The CORS
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "100mb" }));
main.use(cors({ origin: "*" }));
// End
// Add the path to receive request and set json as bodyParser to process the body
main.use("/v1", app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false, limit: "100mb" }));

/**
 * @author Mukut Prasad
 * @description Added admin routes seperately
 */
app.use("/admin/sub-admin", Routers.subAdminRouter);
app.use("/admin/auth", Routers.authAdminRouter);
app.use("/admin/rewards", Routers.rewardNftAdminRouter);
app.use("/admin/coins", Routers.coinRouter);
app.use("/admin/coinsPair", Routers.coinPairRouter);
app.use("/admin/voteSetting", Routers.timeframeRouter);
app.use("/admin/voteSetting", Routers.perUserVoteRouter);
app.use("/admin/userTypeSettings", Routers.userTypeSettingsRouter);
app.use("/admin/settings", Routers.voteAndSettingsRouter);
app.use("/admin/RewardsDistribution", Routers.rewardsDistributionRouter);
app.use(
  "/admin/PushNotificationSetting",
  Routers.pushNotificationSettingRouter
);
app.use("/admin/FollowTable", Routers.FollowTableRouter);
app.use("/admin/payments", Routers.adminPaymentRouter);
app.use("/admin/foundation", Routers.foundationRouter);
app.use("/payment", Routers.paymentRouter);

// global routers
app.post(
  "/generic/admin/uploadFiles/:forModule/:fileType/:id",
  auth,
  imageUploadFunction
);
app.post("/generic/user/uploadAvatar/:userId", avatarUploadFunction);

// user verification link
app.get("/user/verified", async (req: any, res: any) => {
  try {
    const { token } = req.query;
    const auth = admin.auth();
    if (!token) {
      return res.status(400).send({
        status: false,
        message: "Token is required",
        result: null,
      });
    }

    // Verify the JWT token
    const decodedToken: any = (await jwt.verify(
      token,
      env.JWT_AUTH_SECRET
    )) as JwtPayload;

    // Use the UID from the decoded token to verify the user in Firebase Authentication
    console.log("decode token : ", decodedToken);
    console.log("decodedToken.uid : ", decodedToken.uid)
    auth
      .updateUser(decodedToken.uid, { emailVerified: true })
      .then(async (userRecord) => {
        console.log("User successfully verified:", userRecord.toJSON());
        let userData: any = userRecord.toJSON()
        if (userData?.emailVerified == true) {
          const successTemplate = newUserVerifySuccessTemplate();

          await sendEmail(
            userData.email,
            "Welcome To Coin Parliament!",
            userWelcomeEmailTemplate(`${userData.userName ? userData.userName : 'user'}`, env.BASE_SITE_URL)
          );
          res.send(successTemplate);

        }
      })
  }
  catch (error: any) {
    console.error("Error verifying user:", error);
    const failureTemplate = newUserVerifyFailureTemplate();
    return res.status(400).send(failureTemplate);
  }
});

app.get("/calculateCoinCPVI", async (req, res) => {
  await cpviTaskCoin((result) => res.status(200).json(result));
});
app.get("/calculatePairCPVI", async (req, res) => {
  await cpviTaskPair((result) => res.status(200).json(result));
});
//app.get("/user-verification-link", getEmailVerificationLink);

exports.api = functions.https.onRequest(main);



exports.getAccessToken = () =>
  new Promise(function (resolve, reject) {
    const key = serviceAccount;
    const jwtClient = new JWT(
      key.client_email,
      undefined,
      key.private_key,
      ["https://www.googleapis.com/auth/firebase.messaging"],
      undefined
    );
    jwtClient.authorize(function (err: any, tokens: any) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens?.access_token);
    });
  });

const getMaxVotes = async () => {
  const getVoteAndReturnQuery = await admin
    .firestore()
    .collection("settings")
    .doc("settings")
    .get();
  const getVoteAndReturnData: any = getVoteAndReturnQuery.data();
  return getVoteAndReturnData?.voteRules.maxVotes;
};

// user's email verification link
exports.sendEmailVerificationLink = functions.https.onCall(async (data) => {
  const { email } = data;

  try {
    console.log("user email : ", email);
    // Get user data from Firebase Authentication
    const userRecord = await admin.auth().getUserByEmail(email);
    console.log("user record : ", userRecord);

    // Check if the user registered with Google
    if (
      userRecord.providerData.some(
        (provider) => provider.providerId === "google.com"
      )
    ) {
      console.log("User registered with Google. Skipping verification email.");
      await sendEmail(
        userRecord.email,
        "Welcome To Coin Parliament!",
        userWelcomeEmailTemplate(`${userRecord.displayName ? userRecord.displayName : 'user'}`, env.BASE_SITE_URL)
      );

      return true; 
    }

    // Create a JWT token with user data
    const token = jwt.sign(
      { uid: userRecord.uid, email: userRecord.email },
      env.JWT_AUTH_SECRET
    );

    // Construct the verification link with the JWT token
    const verificationLink = `${env.USER_VERIFICATION_BASE_URL}/api/v1/user/verify?token=${token}`;

    if (email && verificationLink) {
      await sendEmail(
        email,
        "Verify Your Account",
        userVerifyEmailTemplate(
          email,
          verificationLink,
          "Your account has been created. Please verify your email for login."
        )
      );
      console.info("Send Email Successfully");
    }

    console.log("Verification link:", verificationLink);
    return { verificationLink };
  } catch (error) {
    console.error("Error sending verification link:", error);
    return { error };
  }
});



exports.pushNotificationOnCallbackURL = functions.https.onCall(async (data) => {
  await createPushNotificationOnCallbackURL(data);
  return { data }
})
// create user
exports.onCreateUser = functions.auth.user().onCreate(async (user: any) => {
  console.log("create user");
  const status: UserTypeProps = {
    name: "Member",
    weight: 1,
    index: 7,
    givenCPM: 0,
    minVote: 0,
    share: 0,
    color: Colors.PLATINUM,
  };
  const createdAt = new Date().toUTCString()
  const userData: UserProps = {
    uid: user.uid,
    createdAt:createdAt,
    address: "",
    avatar: "",
    bio: "",
    foundationData: "",
    country: "",
    email: user.email,
    firstName: "",
    lastName: "",
    mfa: false,
    displayName: user.displayName,
    userName: "",
    phone: user.phoneNumber,
    subscribers: [],
    children: [],
    voteStatistics: {
      total: 0,
      successful: 0,
      score: 0,
      rank: 0,
      commission: 0,
      pax: 50,
    },
    rewardStatistics: {
      total: 0,
      claimed: 0,
      cards: [],
      extraVote: 0,
      diamonds: 0,
    },
    favorites: [],
    status,
    //isVoteToEarn: user.isVoteToEarn || false,
    firstTimeLogin: true,
    refereeScrore: 0,
    lastVoteTime: 0,
    googleAuthenticatorData: {},
    voteValue: await getMaxVotes(),
    wellDAddress: [],
    referalReceiveType: { name: "", amount: "", days: "", limitType: "" },
  };
  try {
    console.log("new user >>>", userData, user.uid);
    const newUser: any = await admin
      .firestore()
      .collection("users")
      .doc(user.uid)
      .set(userData, { merge: true });

      // Create user statistics data
    await createUserStatistics(userData, user.uid);

    const getUserEmail: any = (
      await admin.firestore().collection("users").doc(user.uid).get()
      ).data();
      console.log("new user email  : ", getUserEmail.email);
      
      // Return if user isVoteToEarn is true
      console.log("get userData",getUserEmail)
      console.log("getUser.isVoteToEarn : ", getUserEmail.isVoteToEarn)
      if (getUserEmail.isVoteToEarn === true) {
        return newUser;
      }
      // Send Email Verification Link to User
      // await sendEmailVerificationLink(getUserEmail.email);
      await sendEmailAcknowledgementStatus(getUserEmail);
    return newUser;


  } catch (e) {
    console.log("create user Error....", e);
    return false;
  }
});

async function createUserStatistics(userData: any, userId: any) {
  try {
    const userStatisticsData = {
      userId: userData.uid,
      name: userData?.userName || "",
      email: userData?.email || "",
      totalVotes: userData?.voteStatistics?.total || 0,    //needs to be updated  for the old users
      accountUpgrade: userData?.isUserUpgraded || false,   //needs to be updated for the old users
      signUpTime: userData?.createdAt || "",
      noOfVotesDays: 0,
      averageVotes: 0,
      extraVotePurchased: false,
    };

    await admin.firestore().collection("userStatistics").doc(userId).set(userStatisticsData);

    console.log("User statistics data added successfully for user:", userId);
  } catch (error) {
    console.log("Error adding user statistics data for user:", userId, error);
    
  }
}


exports.addNewKeysInCollection = functions.https.onCall(async () => {
  try {
    const getAllUsers = (
      await admin.firestore().collection("users").get()
    ).docs.map((user: any) => user.data());
    console.log("getAllUsers length : ", getAllUsers.length);
    if (!getAllUsers) return { message: "No users found" };
    const getStatusQuery: any = (
      await admin.firestore().collection("settings").doc("userTypes").get()
    ).data();
    const getStatusList = getStatusQuery.userTypes;
    for (let index = 0; index < getAllUsers.length; index++) {
      if (typeof getAllUsers[index].status == "string") {
        let status = getStatusList.filter(
          (level: any) =>
            level?.name.toLowerCase() ==
            getAllUsers[index]?.status?.toLowerCase()
        );
        console.log("status : ", status);
        await admin
          .firestore()
          .collection("users")
          .doc(getAllUsers[index].uid)
          .set({ status: status[0] }, { merge: true });
        console.log(`${getAllUsers[index].uid} is updated successfully`);
      } else if (Array.isArray(getAllUsers[index].status)) {
        let status = getStatusList.filter(
          (level: any) =>
            level?.name.toLowerCase() ==
            getAllUsers[index]?.status[0].name.toLowerCase()
        );
        console.log("status : ", status);
        await admin
          .firestore()
          .collection("users")
          .doc(getAllUsers[index].uid)
          .set({ status: status[0] }, { merge: true });
        console.log(`${getAllUsers[index].uid} is updated successfully`);
      }
    }
    return { message: "update operation complete" };
  } catch (error) {
    console.log("addNewKeysInCollection : error", error);
    return { message: "something went wrong : ", error };
  }
});

exports.sendPassword = functions.https.onCall(async (data) => {
  const { password } = data as { password: string };
  return password === "CPVI2022!";
});

exports.isLoggedInFromVoteToEarn = functions.https.onCall(async (data) => {
  const { userId, email } = data as { userId: string; email: string };
  const getUserQuery: any = await admin
    .firestore()
    .collection("users")
    .where("uid", "==", userId)
    .where("email", "==", email)
    .get();
  const getUser = getUserQuery.docs.map((user: any) => user.data());
  if (!getUser.length) return { messsage: "User is not found", token: null };
  const tokenForLogin = await admin
    .auth()
    .createCustomToken(getUser[0].uid)
    .then((token: any) => {
      // Send the custom token to the client
      console.log("Custom Token:", token);
      return token;
    })
    .catch((error) => {
      console.error("Error creating custom token:", error);
      return {
        messsage: "Something Wrong in isLoggedInFromVoteToEarn",
        error,
      };
    });
  // console.log("TOKEN ___ : ", customToken)
  return {
    messsage: "Token generated successfully",
    token: tokenForLogin,
  };
});

exports.setLeadersOnce = functions.https.onCall(async () => {
  await setLeaders();
});

exports.generateGoogleAuthOTP = functions.https.onCall(async (data) => {
  try {
    const { userId, userType } = data;
    if (!userId || !userType) {
      return {
        status: false,
        message: "userId and userType are required.",
        result: null,
      };
    }
    console.log(" userId, userType =>", userId, userType);

    let adminUserData: any;
    if (userType === "ADMIN") {
      adminUserData = await admin
        .firestore()
        .collection("admin")
        .doc(userId)
        .get();
    } else if (userType === "USER") {
      adminUserData = await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .get();
    } else {
      return {
        status: false,
        message: "Please provide valid userType.",
        result: null,
      };
    }
    console.log(" adminUserData =>", adminUserData);

    const getUserData: any = adminUserData.data();
    console.info("getUserData", getUserData);
    const { ascii, hex, base32, otpauth_url } = speakeasy.generateSecret({
      issuer: "inheritx.com",
      name: "Coin Parliament", //getUserData.firstName,
      length: 15,
    });

    console.log(" getUserData =>", getUserData);

    getUserData.googleAuthenticatorData = {
      otp_ascii: ascii,
      otp_auth_url: otpauth_url,
      otp_base32: base32,
      otp_hex: hex,
    };

    console.log("googleAuthenticatorData =>", getUserData);

    if (userType === "ADMIN") {
      await admin.firestore().collection("admin").doc(userId).set(getUserData);
    } else if (userType === "USER") {
      await admin.firestore().collection("users").doc(userId).set(getUserData);
    } else {
      return {
        status: false,
        message: "Please provide valid userType.",
        result: null,
      };
    }

    return {
      status: true,
      message: "OTP generated successfully",
      result: {
        base32: base32,
        otpauth_url: otpauth_url,
      },
    };
  } catch (error) {
    return {
      status: false,
      message: "Error in generateGoogleAuthOTP API ",
      result: error,
    };
  }
});

exports.verifyGoogleAuthOTP = functions.https.onCall(async (data) => {
  try {
    const { userId, token, userType } = data;
    if (!userId) {
      return {
        status: false,
        message: "UserId must be required.",
        result: null,
      };
    }

    let adminUserData: any;

    if (userType === "ADMIN") {
      adminUserData = await admin
        .firestore()
        .collection("admin")
        .doc(userId)
        .get();
    } else if (userType === "USER") {
      adminUserData = await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .get();
    } else {
      return {
        status: false,
        message: "Please provide valid userType.",
        result: null,
      };
    }

    const getUserData: any = adminUserData.data();

    const verified = speakeasy.totp.verify({
      secret: getUserData.googleAuthenticatorData.otp_base32,
      encoding: "base32",
      token,
    });
    console.log("verified", verified);

    if (!verified) {
      return {
        status: false,
        message: "OTP not verified.",
        result: null,
      };
    }
    getUserData.googleAuthenticateOTPVerified = {
      otp_enabled: true,
      otp_verified: true,
    };

    if (userType === "ADMIN") {
      await admin.firestore().collection("admin").doc(userId).set(getUserData);
    } else if (userType === "USER") {
      await admin.firestore().collection("users").doc(userId).set(getUserData);
    } else {
      return {
        status: false,
        message: "Please provide valid userType.",
        result: null,
      };
    }
    return {
      status: true,
      message: "OTP verified successfully",
      result: {
        otp_verified: true,
        ...getUserData.googleAuthenticateOTPVerified,
      },
    };
  } catch (error) {
    return {
      status: false,
      message: "Error in verifyGoogleAuthOTP API ",
      result: error,
    };
  }
});

exports.isAdmin = functions.https.onCall(async (data) => {
  const { user } = data as { user: string };
  return await isAdmin(user);
});

type SubscribeFuncProps = { leader: Leader; userId: string; add: boolean };

exports.verifyUserEmail = functions.https.onCall(async (data) => {
  try {
    const { uid, email } = data;
    if (!uid || !email) {
      return {
        status: false,
        message: "UserId and email must be required.",
        result: null,
      };
    }

    const userDataUpdate = await admin
      .auth()
      .updateUser(uid, {
        emailVerified: true,
      })
      .then((userRecord) => {
        return userRecord.toJSON();
      })
      .catch((error) => {
        return {
          status: false,
          message: "Error while verify the email API ",
          result: error,
        };
      });

    return {
      status: true,
      message: "User email verified successfully",
      result: userDataUpdate,
    };
  } catch (error) {
    return {
      status: false,
      message: "Error while verify the email API ",
      result: error,
    };
  }
});

exports.getUserNames = functions.https.onCall(async (data) => {
  const { userIds = [] } = data as { userIds: string[] };
  try {
    if (userIds && userIds.length > 0) {
      const usersRef = await admin
        .firestore()
        .collection("users")
        .where(admin.firestore.FieldPath.documentId(), "in", userIds)
        .get();

      return usersRef.docs.map((doc) => {
        const { displayName, email } = doc.data();
        return {
          id: doc.id,
          username: displayName || email,
        };
      });
    } else {
      console.log("empty");
      return [];
    }
  } catch (e) {
    console.log(e);
    return [];
  }
});

exports.sendMessage = functions.https.onCall(async (data) => {
  const { token, message } = data;
  const payload = {
    token,
    data: {
      message,
    },
  };

  admin
    .messaging()
    .send(payload)
    .then((messageId) => {
      return { messageId };
    })
    .catch((error) => {
      console.log("error", error);
      return new functions.https.HttpsError("internal", error.message, error);
    });
});

exports.sendCustomNotification = functions.https.onCall(async (requestBody) => {
  await sendCustomNotificationOnSpecificUsers(requestBody);
});



exports.observeTopics = functions.https.onCall(async (data, context) => {
  const { leaders = [] } = data as { leaders: string[] };
  const { auth } = context;

  const { uid } = auth || {};
  if (uid) {
    const userRef = admin
      .firestore()
      .collection("users")
      .doc(uid)
      .withConverter(userConverter);

    const userProps = await userRef.get();
    const token = userProps.data()?.token;

    leaders.forEach((leader) => {
      token && subscribeToTopic(token, leader);
    });
  }
});

exports.subscribe = functions.https.onCall(async (data) => {
  const { leader, userId, add } = data as SubscribeFuncProps;
  const userRef = admin
    .firestore()
    .collection("users")
    .doc(leader.userId)
    .withConverter(userConverter);

  const userProps = await userRef.get();
  const token = userProps.data()?.token;

  if (add) {
    const subscribers = union(userProps.data()?.subscribers, [userId]);
    await userRef.set(
      {
        subscribers,
      },
      { merge: true }
    );

    if (token) {
      subscribeToTopic(token, userId);
    }
  } else {
    await userRef.set(
      {
        subscribers: pullAll(userProps.data()?.subscribers || [], [userId]),
      },
      { merge: true }
    );

    if (token) {
      unsubscribeToTopic(token, userId);
    }
  }
});

exports.onUpdateUser = functions.firestore
  .document("users/{id}")
  .onUpdate(async (snapshot) => {
    const before = snapshot.before.data() as UserProps;
    const after = snapshot.after.data() as UserProps;

    console.info("after", after)
    console.info("Send Email Successfully")

    // await addReward(snapshot.after.id, before, after);
    // await checkAndUpdateRewardTotal(snapshot.after.id)

    // Check if username has been updated
    if (before.userName !== after.userName) {
      const userId = snapshot.after.id;
      const updatedUsername = after.userName;

      // Update name field in userStatistics collection
      await admin.firestore().collection("userStatistics").doc(userId).set(
        { name: updatedUsername },
        { merge: true }
      );
    }

    const [should, amount] = shouldHaveTransaction(before, after);
    if (!should || !amount) {
      return;
    }

    await addCpmTransaction(snapshot.after.id, amount);
  });

exports.onVote = functions.firestore
  .document("votes/{id}")
  .onCreate(async (snapshot) => {
    console.log("function called for firebase");

    await updateVotesTotal();
    const data = snapshot.data() as VoteResultProps;
    console.log("data =>", data);

    const voteTime = admin.firestore.Timestamp.now().toMillis();
    console.log("voteTime =>", voteTime);

    await updateVotesTotalForSingleCoin(data.coin);

    const vote = {
      ...snapshot.data(),
    } as unknown as VoteResultProps;

    console.log("vote =>", vote);

    await snapshot.ref.update(vote);
    //await sendToTokens(vote);

    // await admin
    //   .firestore()
    //   .collection("users")
    //   .doc(vote.userId)
    //   .update({
    //     "voteStatistics.total": admin.firestore.FieldValue.increment(1),
    //   });
    const userRef = admin.firestore().collection("users").doc(vote.userId);

    // Perform the update operation and fetch the updated document in a single call
    let updatedUserDoc = await userRef.update({
      "voteStatistics.total": admin.firestore.FieldValue.increment(1),
    }).then(() => userRef.get());

    // Extract the data from the updated document
    const updatedUserData = updatedUserDoc.data();

    let voteStatistics = updatedUserData?.voteStatistics?.total;

    // Create user statistics data
    await updateUserStatistics(vote.userId, voteStatistics);

    await sendNotificationForFollwersFollowings(vote.userId, data.coin); // Send notification for follower & followings
  });

  // const updateUserStatistics = async (userId: string, voteStatistics: Number) => {
  //   try {
  //     let userVoteList: any[] = [];
  //     let userVoteQuerySnapshot = await admin.firestore().collection("votes").where("userId", "==", userId).get();
  
  //     userVoteList = userVoteQuerySnapshot.docs.map((doc: any) => doc.data());
  
  //     const voteTimes = userVoteList.map((doc) => new Date(doc.voteTime));
  //     console.log("voteTimes>>>>>>>", voteTimes);
  
  //     const uniqueDates = [...new Set(voteTimes.map((date) => date.toDateString()))];
  //     let numberOfDaysVoted = uniqueDates.length;
  
  //     let averageVotes = numberOfDaysVoted !== 0 ? userVoteList.length / numberOfDaysVoted : 0;
  
  //     await admin
  //       .firestore()
  //       .collection("userStatistics")
  //       .doc(userId)
  //       .set({ noOfVotesDays: numberOfDaysVoted, averageVotes: averageVotes, totalVotes: voteStatistics }, { merge: true });
  
  //     console.log("User statistics data updated successfully for user:", userId);
  //   } catch (error) {
  //     console.log("Error adding user statistics data for user:", userId, error);
  //   }
  
  // }

  const updateUserStatistics = async (userId: string, voteStatistics: Number) => {
    try {
      let userVoteList: any[] = [];
      let userVoteQuerySnapshot = await admin.firestore().collection("votes").where("userId", "==", userId).get();
  
      // Check if there are votes data for the user
      if (!userVoteQuerySnapshot.empty) {
        userVoteList = userVoteQuerySnapshot.docs.map((doc: any) => doc.data());

        // Assuming you have a millisecond timestamp
        // const timestamp = 1641936000000; // Example timestamp

        
  
        const voteTimes = userVoteList.map((doc) => {
          // Create a new Date object using the timestamp
          const date = new Date(doc.voteTime);

          // Extract the date components
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 to month since it's zero-based
          const day = String(date.getDate()).padStart(2, '0');

          // Construct the date string in the desired format (e.g., YYYY-MM-DD)
          const formattedDate = `${year}-${month}-${day}`;
          console.log(formattedDate); // Output: "2022-01-11" (for the provided timestamp)
          return formattedDate;
        });
        console.log("voteTimes>>>>>>>", voteTimes);
  
        const uniqueDates = [...new Set(voteTimes)];
        let numberOfDaysVoted = uniqueDates.length;
  
        let averageVotes = numberOfDaysVoted !== 0 ? userVoteList.length / numberOfDaysVoted : 0;
  
        // Update user statistics only if there are vote data for the user
        await admin
          .firestore()
          .collection("userStatistics")
          .doc(userId)
          .set({ noOfVotesDays: numberOfDaysVoted, averageVotes: averageVotes, totalVotes: voteStatistics }, { merge: true });
  
        console.log("User statistics data updated successfully for user:", userId);
      } else {
        console.log("No vote data found for user:", userId);
      }
    } catch (error) {
      console.log("Error adding user statistics data for user:", userId, error);
    }
  }
  
  

exports.assignReferrer = functions.https.onCall(async (data) => {
  try {
    const { parent, child } = data as { parent: string; child: string };
    const refer = new Refer(parent, child);
    await refer.assignReferral();
  } catch (e) {
    console.log(e);
  }
});



exports.getLeadersByCoin = functions.https.onCall(async (data) => {
  const { symbol } = data as { symbol: string };

  const votes = await admin
    .firestore()
    .collection("votes")
    .withConverter(voteConverter)
    .where("coin", "==", symbol)
    .get();

  const users = uniq(votes.docs.map((v) => v.data().userId)) as string[];

  return users.reduce(
    (arr, currentUser) => {
      const userVotes = votes.docs
        .filter((v) => v.data().userId === currentUser)
        .map((v) => v.data().success);
      const total = userVotes.length;
      const success = userVotes.filter((v) => v).length;
      return [
        ...arr,
        {
          pct: (100 * success) / total,
          user: currentUser,
        },
      ];
    },
    [] as {
      pct: number;
      user: string;
    }[]
  );
});

async function getRewardTransactions(
  id: string,
  pageSize: any,
  pageNumber: any
) {
  const tempTransactionData: any[] = [];

  const transactionsBaseQuery = await admin
    .firestore()
    .collection("reward_transactions");

  const transactions = await transactionsBaseQuery
    .where("user", "==", id)
    .get();

  transactions.forEach((doc) => {
    tempTransactionData.push({ rewardId: doc.id, ...doc.data() });
  });

  const transactionsForCount = await admin
    .firestore()
    .collection("reward_transactions")
    .where("user", "==", id);

  const rewardsTransactionTotalCount = (await transactionsForCount.get()).size;
  console.info("rewardsTransactionTotalCount", rewardsTransactionTotalCount);

  console.info("tempTransactionData", tempTransactionData);

  const rewardTransactionData = tempTransactionData.sort(
    (a: any, b: any) => b.transactionTime._seconds - a.transactionTime._seconds
  );
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const getTransactionDataAfterPagination: any = rewardTransactionData.slice(
    startIndex,
    endIndex
  );

  console.info("rewardTransactionData", rewardTransactionData);

  return {
    totalCount: rewardsTransactionTotalCount,
    rewardsTransaction: getTransactionDataAfterPagination,
  };
}

exports.getRewardTransactions = functions.https.onCall(async (data) => {
  const { uid, pageSize, pageNumber } = data as {
    uid: string;
    pageSize: any;
    pageNumber: any;
  };
  return await getRewardTransactions(uid, pageSize, pageNumber);
});

exports.claimReward = functions.https.onCall(async (data) => {
  const { uid, isVirtual } = data as {
    uid: string;
    isVirtual: boolean;
    paxDistributionToUser: any;
  };
  const reward = await claimReward(uid, isVirtual);
  console.log("reward --->", reward);
  return reward;
});

exports.cardHolderListing = functions.https.onCall(async (data) => {
  const { cardId } = data as { cardId: string };
  const userList = await cardHolderListing(cardId);
  console.log("userList --->", userList);
  return userList;
});

exports.getCPVIForVote = functions.https.onCall(async (data) => {
  // console.log("getCPVIForVote(data) =>", data);
  return await getCPVIForVote(data);
});

exports.CPVIForCoin = functions.https.onCall(async (data) => {
  // console.log("getCPVIForVote(data) =>", data);
  const { coinName } = data;
  return await CPVIForCoin(coinName);
});

exports.getResultAfterVote = functions.https.onCall(async (data) => {
  return await getResultAfterVote(data);
});

exports.getOldAndCurrentPriceAndMakeCalculation = functions.https.onCall(
  async (data) => {
    await getOldAndCurrentPriceAndMakeCalculation(data);
    // After Vote Updated For The User
    const getAfterUpdatedVoteRef = await admin
      .firestore()
      .collection("votes")
      .doc(data?.voteId);
    const getAfterUpdatedVoteInstance = await getAfterUpdatedVoteRef.get();
    console.info("getAfterUpdatedVoteInstance", getAfterUpdatedVoteInstance);
    const getAfterVoteUpdatedData = getAfterUpdatedVoteInstance.data();
    console.info("getAfterVoteUpdatedData", getAfterVoteUpdatedData);

    return {
      voteId: getAfterUpdatedVoteInstance.id,
      ...getAfterVoteUpdatedData,
    };
  }
);

exports.checkAndUpdateRewardTotal = functions.https.onCall(
  async (data) => {
    const { userId } = data;
    return await checkAndUpdateRewardTotal(userId);
  });


const checkValidUsername = async (username: string) => {
  console.log("firebasefun");
  const users = await admin
    .firestore()
    .collection("users")
    .withConverter(userConverter)
    .get();

  const usernames = users.docs.map((u) => u.data().displayName);
  console.log("firebase", usernames);
  return (
    !usernames.includes(username) &&
    username.length >= 8 &&
    username.length <= "unique_username".length
  );
};

exports.checkValidUsername = functions.https.onCall(async (data) => {
  return await checkValidUsername(data.username);
});

type GetVotesProps = {
  start: number;
  end: number;
  userId: string;
  isOpenVote: boolean;
};

const getVotes = async ({ start, end, userId, isOpenVote }: GetVotesProps) => {
  console.log("voteCoinApi called isOpenVote");
  console.log(
    "start, end, userId, isOpenVote : ",
    start,
    end,
    userId,
    isOpenVote
  );

  const [votes, coins, pairs] = await Promise.all([
    admin
      .firestore()
      .collection("votes")
      .withConverter(voteConverter)
      .where("userId", "==", userId)
      .get(),
    getAllCoins(),
    getAllPairs(),
  ]);

  const allVotes = votes.docs
    .map((v) => {
      return { ...v.data(), id: v.id };
    })
    .sort((a, b) => Number(b.voteTime) - Number(a.voteTime))
    .reduce(
      (total, current) => {
        if (current.coin.split("-").length === 1) {
          if (coins.includes(current.coin)) {
            total.coins.push(current);
          }
        } else {
          if (pairs.includes(current.coin)) {
            total.pairs.push(current);
          }
        }

        return total;
      },
      { coins: [], pairs: [] } as {
        coins: VoteResultProps[];
        pairs: VoteResultProps[];
      }
    );
  console.log("allVotes : ", allVotes);

  if (isOpenVote) {
    let filterVotes: any = {
      coins: { votes: [], total: 0 },
      pairs: { votes: [], total: 0 },
    };

    // for coins
    if (allVotes.coins.length) {
      let coinsVotes = allVotes.coins.filter(
        (vote) => !vote.valueExpirationTime
      );
      filterVotes.coins.total = coinsVotes.length;
      console.log(
        "getAllVotesData.coins.total is called : ",
        coinsVotes.length,
        coinsVotes
      );
      filterVotes.coins.votes = coinsVotes.slice(start, end);
      console.log("filterVotes.coins : ", filterVotes.coins);
    }

    // For pairs
    if (allVotes.pairs.length) {
      let pairsVotes = allVotes.pairs.filter(
        (vote) => !vote.valueExpirationTime
      );
      filterVotes.pairs.total = pairsVotes.slice().length;
      console.log(
        "getAllVotesData.pairs.total is called : ",
        pairsVotes.length,
        pairsVotes
      );
      filterVotes.pairs.votes = pairsVotes.slice(start, end);
      console.log("filterVotes.pairs : ", filterVotes.pairs);
    }
    console.log("final filterVotes : ", filterVotes);

    return JSON.stringify(filterVotes);
  } else {
    console.log("getAllVotesData called");
    const getAllVotesData = {
      coins: {
        votes: allVotes.coins.slice(start, end),
        total: allVotes.coins.length,
      },
      pairs: {
        votes: allVotes.pairs.slice(start, end),
        total: allVotes.pairs.length,
      },
    };

    return JSON.stringify(getAllVotesData);
  }
};

exports.getVotes = functions.https.onCall(async (data) => {
  const { start, end, userId, isOpenVote } = data as GetVotesProps;
  console.log("voteApiCalled");
  return await getVotes({ start, end, userId, isOpenVote });
});

exports.getLeaderUsers = functions.https.onCall(async (data, context) => {
  const userId = context.auth?.uid || "";
  return await getLeaderUsers(userId);
});

exports.getLeaderUsersByIds = functions.https.onCall(async (data) => {
  const userIds = data.userIds;
  return await getLeaderUsersByIds(userIds);
});

exports.sendEmail = functions.https.onCall(async () => {
  console.log("email>>>>>>>>");
  sgMail.setApiKey(env.sendgrid_api_key);
  const msg = {
    to: "panchalrutul31@gmail.com",
    from: "akashpatel.inheritx@gmail.com",
    templateId: "d-25bccb1358b5403ea171becb708f334f",
    dynamic_template_data: {
      subject: "Testing Templates",
      name: "Some One",
    },
  };
  await sgMail.send(msg);
});

// exports.paxDistributionOnClaimReward = functions.https.onCall(async (data) => {
//   const { paxDistributionToUser } = data;
//   console.log("paxDistributionToUser : ", paxDistributionToUser);
//   let getResultAfterSentPaxToUser: any;
//   let getResultAfterSentPaxToAdmin: any;
//   if (paxDistributionToUser.isUserUpgraded === true) {
//     // Call to user mintFor Address
//     getResultAfterSentPaxToUser = await sendMintForPaxToUser(paxDistributionToUser)
//     console.info("getResultAfterSentPaxToUser", getResultAfterSentPaxToUser);
//     const addNewPax = await admin.firestore().collection('paxTransaction').add({ ...paxDistributionToUser, getResultAfterSentPaxToUser, timestamp: Date.now() });
//     return { id: addNewPax.id, getResultAfterSentPaxToUser }
//   }
//   if (paxDistributionToUser.isUserUpgraded === false) {
//     // Call to Admin mintFor Address
//     getResultAfterSentPaxToAdmin = await sendMintForPaxToAdmin(paxDistributionToUser);
//     console.info("getResultAfterSentPaxToAdmin", getResultAfterSentPaxToAdmin);
//     const addNewPax = await admin.firestore().collection('paxTransaction').add({ ...paxDistributionToUser, getResultAfterSentPaxToAdmin, timestamp: Date.now() });
//     return { id: addNewPax.id }
//   }
//   return null
// });

exports.updatePAXValueToFoundation = functions.https.onCall(async (data) => {
  const { currentPaxValue } = data;
  const collectionRef = admin.firestore().collection("foundations");
  collectionRef
    .get()
    .then((querySnapshot) => {
      const batch = admin.firestore().batch();
      querySnapshot.forEach((doc) => {
        const docRef = collectionRef.doc(doc.id);
        batch.update(docRef, { currentPaxValue });
      });
      return batch.commit();
    })
    .then(() => {
      console.log("Foundation batch update completed successfully.");
    })
    .catch((error) => {
      console.error("Error while updating batch documents: ", error);
    });
});

// send a notification to add mint-address in wellDaddress
exports.sendNotificationForMintAddress = functions.https.onCall(
  async (data) => {
    const user = await sendNotificationForMintAddress(data.userId);
    return user;
  }
);

exports.addPaxTransactionWithPendingStatus = functions.https.onCall(
  async (data) => {
    try {
      const {
        userId,
        currentPaxValue,
        isUserUpgraded,
        eligibleForMint,
        mintForUserAddress,
      } = data;
      console.info(
        "Data",
        userId,
        currentPaxValue,
        isUserUpgraded,
        eligibleForMint,
        mintForUserAddress
      );
      await addPaxTransactionWithPendingStatus({
        userId,
        currentPaxValue,
        isUserUpgraded,
        eligibleForMint,
        mintForUserAddress,
      });
      return {
        status: true,
        message: "Pending PAX stored successfully",
        result: null,
      };
    } catch (error) {
      return {
        status: false,
        message: "Error while store Pending PAX.",
        result: error,
      };
    }
  }
);

// // Function to get payment details
// async function getPaymentDetailsForUser() {
//   try {
//     const getAllPaymentsQuery = await admin.firestore().collection('payments').get();
//     const paymentDetails: any = [];

//     await Promise.all(getAllPaymentsQuery.docs.map((payment: any) => {
//       let paymentData = payment.data();
//       let extraVotePurchased = paymentData.transactionType === "EXTRAVOTES";
//       // let userId = paymentData.userId;

//       if (extraVotePurchased) {
//         let obj = { userId: paymentData.userId, extraVotePurchased: "yes" }
//         paymentDetails.push(obj)
//       } else {
//         let obj = { userId: paymentData.userId, extraVotePurchased: "no" }
//         paymentDetails.push(obj)
//       }
//     }))
    

//     return paymentDetails;
//   } catch (error) {
//     console.error("Error fetching payment details:", error);
//     return false;
//   }
// }

// // Function to get user details
// async function getUsersDetails() {
//   try {
//     const getAllUserData = (await admin.firestore().collection("users").get()).docs.map((user: any) => {
//       let userData = user.data()
//       return {
//         userId: user.id,
//         name: userData?.userName || "",
//         email: userData?.email || "",
//         totalVotes: userData?.voteStatistics?.total || 0,
//         accountUpgrade: userData?.isUserUpgraded || false
//       }
//     });

//     console.log("TOTAL USER LENGTH : ", getAllUserData.length);

//     const getAuthUserSignUpTime: any = [];
//     const allUsers = await admin.auth().listUsers();
//     for (let userRecord of allUsers.users) {
//       //console.log("User signupDate added:", userRecord.uid);

//       getAuthUserSignUpTime.push({
//         userId: userRecord.uid,
//         signUpTime: userRecord.metadata.creationTime
//       });
//     }

//     //console.log("getAuthUserSignUpTime : ", getAuthUserSignUpTime);

//     const userDetailsWithSignUpDate = await Promise.all(getAllUserData.map((userData: any) => {
//       const signUpData = getAuthUserSignUpTime.find((data: any) => data.userId === userData.userId);
//       if (signUpData) {
//         userData.signUpTime = signUpData.signUpTime;
//       }
//       return userData;
//     }));

//     return {
//       status: true,
//       message: "Users fetched successfully",
//       data: userDetailsWithSignUpDate
//     };

//   } catch (error) {
//     console.error("Error while fetching user data:", error);
//     return {
//       status: false,
//       message: "Error while fetching user data",
//       data: {}
//     };
//   }
// }


// async function getVoteList() {
//   try {
//     let voteDetails = (await admin.firestore().collection("votes")
//       .where('voteTime', '>=', Date.now() - (60 * 24 * 60 * 60 * 1000))
//       .get()).docs.map((vote: any) => {
//         let voteData = vote.data()
//         return {
//           userId: voteData.userId,
//           voteTime: voteData.voteTime,
//         }
//       });

//     console.log("Votes fetched successfully", voteDetails)
//     return voteDetails;

//   } catch (error) {
//     console.error('Error:', error);
//     return null
//   }
// }

// async function getCombinedDetails() {
//   try {
//     // Fetch payment details
//     const paymentDetails = await getPaymentDetailsForUser();

//     console.log("paymentDetails", paymentDetails)

//     // Fetch user details
//     let userDetails = await getUsersDetails();

//     let userData: any = userDetails.data;

//     for (let element of userData) {
//       let userId = element.userId;
//       // Key and value to filter
//       // const keyToFilter = ;
//       // const valueToFilter = userId;

//       // Filtering the array based on the key and value
//       const filteredObj = paymentDetails.find((obj: any) => obj["userId"] === userId);
//       //console.log(filteredObj);

//       if (filteredObj !== undefined) {
//         element.extraVotePurchased = filteredObj.extraVotePurchased;
//       } else {
//         element.extraVotePurchased = "no";
//       }
//     }

//     return userDetails;


//   } catch (error) {
//     console.error("Error fetching combined details:", error);
//     return false;
//   }
// }

// export const getCoinParliamentAllUsersDeatils = async () => {
//   try {
//     // Fetch payment details
//     const voteList: any = await getVoteList();

//     console.log("voteList", voteList)

//     // Fetch user details
//     let userList: any = await getCombinedDetails();

//     //console.log("userList", userList)

//     userList = userList.data;

//     await Promise.all(userList.map((user: any) => {
//       let userVote = voteList.filter((vote: any) => vote.userId === user.userId);
//       console.log("UserVote : ", userVote);

//       const voteTimes = userVote.map((doc: any) => new Date(doc.voteTime));
//       console.log("voteTimes>>>>>>>", voteTimes);

//       const uniqueDates = [...new Set(voteTimes.map((date: Date) => date.toDateString()))];
//       // let numberOfDaysVoted = ;

//       user['noOfVotesDays'] = uniqueDates.length;

//       let averageVotes = uniqueDates.length !== 0 ? userVote.length / uniqueDates.length : 0;

//       user['averageVotes'] = averageVotes;
//     }))

//     return userList

//   } catch (error) {
//     console.error("Error fetching combined details:", error);
//     return false;
//   }

// }

// ******************* START CRON JOBS ****************
// 5 minutes cron job
// exports.pendingPaymentSettlement = functions.pubsub
//   .schedule("0 0 */1 * *")
//   .onRun(async () => {
//     console.log("pendingPaymentSettlement start");
//     const currentTimeStamp = Date.now();
//     await setPaymentSchedulingByCronJob(currentTimeStamp);
//   });

exports.updateLeadersCron = functions.pubsub
  .schedule("0 0 * * *")
  .onRun(async () => {
    try {
      await setLeaders();
    } catch (e) {
      console.log(e);
    }
  });

// exports.getUpdatedDataFromWebsocket = functions.pubsub
//   .schedule("every 10 minutes")
//   .onRun(async () => {
//     await getUpdatedDataFromWebsocket();
//   });

// exports.getUpdatedTrendAndDeleteOlderData = functions.pubsub
//   .schedule("every 15 minutes")
//   .onRun(async () => {
//     await getAllUpdated24HourRecords();
//     await removeTheBefore24HoursData();
//   });

// cron for the changed event field from approved  to confirmed in payments collection(payment which are approved within 24hours)
export const pendingPaymentSettlement = functions.pubsub
  .schedule("*/30 * * * *")
  .onRun(async () => {
    console.log("pendingPaymentSettlement start");

    // Get the current timestamp
    const currentTimeStamp = new Date();
    const twentyFourHoursAgo = new Date(currentTimeStamp.getTime() - (24 * 60 * 60 * 1000));


    try {
      // Query payments collection for payments within the last 24 hours
      const paymentsSnapshot = await admin.firestore().collection('payments')
        .where("timestamp", ">=", twentyFourHoursAgo)
        .get();

      // paymentsSnapshot.forEach(doc => {
      //   console.log("Document ID:", doc.id);
      //   console.log("Document Data:", doc.data());
      // });

      // Filter payments where event is 'Approved'
      const approvedPayments: any = paymentsSnapshot.docs.filter((snapshot: any) => {
        const paymentData = snapshot.data();
        console.log("paymentData >>>> ", paymentData)
        console.log("paymentData.event === 'Approved' >>>>", paymentData.event === 'Approved')
        return paymentData.event === 'Approved' ? { ...paymentData, transactionId: snapshot.id } : null;
      });
      console.log("approvedPayments >>>>", approvedPayments);

      // Update each approved payment's event to 'Confirmed'
      for (const transaction of approvedPayments) {
        console.log("transaction>>>>", transaction)
        // const paymentRef = transaction.ref;
        // console.log("approvedPaymentRef>>>", transaction.ref)
        // call the api to check transaction is confirmed or not
        const transactionStatus: any = await checkTransactionStatus({...transaction?.paymentDetails, network : transaction.network});
        console.log("TransactionStatus : ", transactionStatus)
        if (transactionStatus.data.status) {
          console.log("transactionStatus : ", transactionStatus.message)
          await admin.firestore().collection('payments').doc(transaction.transactionId).set({ event: 'Confirmed' },{merge: true});
        } else {
          console.error("transactionStatus : ", transactionStatus)
        }
      }
      console.log('Payments updated successfully.');
    } catch (error) {
      console.error('Error updating payments:', error);
    }
  });

  // exports.storeCPUsersDetailsIntoDB = functions.pubsub
  // .schedule("*/10 * * * *")
  // .onRun(async () => {
  //   console.log("storeCPUsersDetailsIntoDB Cron starting---------------------")
  //   try {
  //     console.log("Starting")
  //     const userList = await getCoinParliamentAllUsersDeatils();
  //     console.log("function is executing correctly-----")
  //     console.log("userList", userList)

  //     const usersRef = admin.firestore().collection('userStatistics');
  //     console.log("usersRef: created")

  //     await Promise.all(userList.map(async(user: any) =>{
  //       try {
  //         await usersRef.doc(user.userId).set(user);
  //         console.log(`User data stored successfully for user ${user.userId}`);
  //       } catch (error) {
  //         console.error(`Error storing user data for user ${user.userId}:`, error);
  //       }
  //     }))

  //     console.log('User data stored successfully in users collection.');
  //     return true;
  //   } catch (error) {
  //     console.error('Error storing user data in users collection:', error);
  //     return false;
  //   }
  // });

//----------Start Notifications scheduler-------------
exports.noActivityIn24Hours = functions.pubsub
  .schedule("0 0 * * *")
  .onRun(async () => {
    console.log("---Start noActivityIn24Hours -------");
    await checkInActivityOfVotesAndSendNotification();
    console.log("---End noActivityIn24Hours -------");
  });

exports.noActivityIn24HoursLocal = functions.https.onCall(async (data) => {
  console.log("---Start noActivityIn24Hours -------");
  await checkInActivityOfVotesAndSendNotification();
  console.log("---End noActivityIn24Hours -------");
});

exports.getCoinCurrentAndPastDataDifference = functions.pubsub
  .schedule("0 */6 * * *")
  // .schedule("*/5 * * * *")
  .onRun(async () => {
    const timeDifference = 6;
    console.log("---Start getCoinCurrentAndPastDataDifference -------");
    await getCoinCurrentAndPastDataDifference(timeDifference);
    console.log("---End getCoinCurrentAndPastDataDifference -------");
  });

exports.checkTitleUpgrade24Hour = functions.pubsub
  .schedule("0 0 * * *")
  .onRun(async () => {
    console.log("---Start checkTitleUpgrade24Hour -------");
    const date = new Date();
    const nowTime = date.getTime();
    const yesterdayTime = nowTime - 24 * 60 * 60 * 1000;
    // const yesterdayTime = nowTime - 7 * 60 * 1000;
    await checkUserStatusIn24hrs(nowTime, yesterdayTime);
    await getFollowersFollowingsAndVoteCoin(nowTime, yesterdayTime);
    console.log("---End checkTitleUpgrade24Hour -------");
  });

// for Testing purposes
exports.checkTitleUpgradeNotification = functions.https.onCall(async (data) => {
  console.log("------- call set leader function -------");
  await setLeaders();
  console.log("set leader Done");
  const { todayTime, yesterdayTime } = data;
  // const date = new Date();
  // const nowTime = date.getTime();
  // const yesterdayTime = nowTime - (24 * 60 * 60 * 1000)
  await checkUserStatusIn24hrs(todayTime, yesterdayTime);
  await getFollowersFollowingsAndVoteCoin(todayTime, yesterdayTime);
});

//----------End Notifications scheduler-------------

//----------Start CPVI scheduler-------------
// exports.prepareEveryFiveMinuteCPVI = functions.pubsub
//   .schedule("*/3 * * * *")
//   .onRun(async () => {
//     await Promise.all([await fetchAskBidCoin()]);
//   });

// exports.prepareHourlyCPVI = functions.pubsub
//   .schedule("0 * * * *")
//   .onRun(async () => {
//     await prepareCPVI(1, "hourly");
//   });

// exports.prepare4HourlyCPVI = functions.pubsub
//   .schedule("0 */4 * * *")
//   .onRun(async () => {
//     await prepareCPVI(4, "fourHourly");
//   });

// exports.prepare24HourlyCPVI = functions.pubsub
//   .schedule("0 0 * * *")
//   .onRun(async () => {
//     await prepareCPVI(24, "daily");
//   });

// exports.prepareWeeklyCPVI = functions.pubsub
//   .schedule("0 0 * * 0")
//   .onRun(async () => {
//     await prepareCPVI(24 * 7, "weekly");
//   });
//----------END CPVI scheduler-------------


// --------pax distribution-----------
//   ------24 hours--------
exports.paxDistribution = functions.pubsub
  .schedule("0 0 * * *")
  .onRun(async () => {
    try {
      const getPaxTransactionList = (await admin.firestore().collection('paxTransaction').get()).docs.map((pax: any) => { return { ...pax.data(), id: pax.id } });
      const getIsVirtualTransaction = getPaxTransactionList.filter((pax: any) => pax.isVirtual == true);
      console.log("getIsVirtualTransaction : ", getIsVirtualTransaction);
      if (getIsVirtualTransaction.length == 0) {
        return {
          status: true,
          message: "pax transaction is updated successfully",
          result: getIsVirtualTransaction
        }
      }
      for (let index = 0; index < getIsVirtualTransaction.length; index++) {
        let pax = getIsVirtualTransaction[index];
        await admin.firestore().collection('paxTransaction').doc(pax.id).set({
          isVirtual: admin.firestore.FieldValue.delete()
        }, { merge: true });
      }
      return {
        status: true,
        message: "pax transaction is updated successfully",
        result: null
      }
    } catch (error: any) {
      errorLogging("paxDistribution", "ERROR", error)
      return {
        status: false,
        message: "Something went wrong",
        result: null
      }
    }
  });

exports.paxDistributionTesting = functions.https.onCall(async (data: any) => {
  try {
    const getPaxTransactionList = (await admin.firestore().collection('paxTransaction').get()).docs.map((pax: any) => { return { ...pax.data(), id: pax.id } });
    const getIsVirtualTransaction = getPaxTransactionList.filter((pax: any) => pax.isVirtual == true);
    console.log("getIsVirtualTransaction : ", getIsVirtualTransaction);
    if (getIsVirtualTransaction.length == 0) {
      return {
        status: true,
        message: "pax transaction is updated successfully",
        result: getIsVirtualTransaction
      }
    }
    for (let index = 0; index < getIsVirtualTransaction.length; index++) {
      let pax = getIsVirtualTransaction[index];
      await admin.firestore().collection('paxTransaction').doc(pax.id).set({
        isVirtual: admin.firestore.FieldValue.delete()
      }, { merge: true });
    }
    return {
      status: true,
      message: "pax transaction is updated successfully",
      result: null
    }
  } catch (error: any) {
    errorLogging("paxDistribution", "ERROR", error)
    return {
      status: false,
      message: "Something went wrong",
      result: null
    }
  }
});

// exports.getPAXPendingAndCompletePax = functions.pubsub
//   .schedule("*/5 * * * *")
//   .onRun(async () => {
//     const getPendingPax = await getPendingPaxTransaction();
//     const getUserIds = getPendingPax?.result.map((transaction: any) => transaction.userId);
//     console.log("getUserIds", getUserIds);
//     const getUsersWellDAddress = getUserIds ? await checkUsersWellDAddress(getUserIds) : "";
//     // getUsersWellDAddress is give those usersIds who have panding payments and Pax-address
//     // call payment method here
//     console.log("getUsersWellDAddress : ", getUsersWellDAddress);
//     return null
//   });

// ******************* END CRON JOBS ****************

// only testing purposes
exports.getAllUserOnlyTotalAndScore = functions.https.onCall(async (data: any) => {
  try {
    const getAllUser = (await admin.firestore().collection('users').get()).docs.map((user) => user.data());
    const getTotalAndScore: any = getAllUser.map((user) => {
      return {
        id: user?.uid,
        name: user?.displayName,
        score: user?.voteStatistics?.score,
        total: user?.rewardStatistics?.total,
        email: user?.email
      }
    })
    console.log("user only total : ", getTotalAndScore);
    return getTotalAndScore
  } catch (error) {
    return error
  }
})

exports.sendEmailOnTimeForAcknowledge = functions.pubsub
  .schedule("every 60 minutes")
  .onRun(async () => {

    await sendEmailForVoiceMatterInLast24Hours();

    await sendEmailForUserUpgradeInLast48Hours();

    await sendEmailForAddressNotUpdatedInLast72Hours();

    await sendEmailForLifetimePassiveIncomeInLast96Hours();

    await sendEmailForEarnRewardsByPaxTokensInLast168Hours();

    await sendEmailForUnloackRewardsInLast192Hours();

    await sendEmailForSVIUpdateInLast216Hours();

    await sendEmailForProgressWithFriendInLast240Hours();

    await sendEmailForTopInfluencerInLast264Hours();

    console.log("Come to email Acknowledge", new Date())
  });


exports.sendEmailForUserFollowerCount = functions.pubsub
  .schedule('every 168 hours')
  .onRun(async () => {

    await sendEmailForUserFollowersCountInWeek();

    console.log("Come to Email For User Follower Counts", new Date())
  });

exports.isFirstTimeLoginSetTimestamp = functions.https.onCall(async (data) => {
  const { userId } = data;
  try {
    const userEmailAcknowledgementRef = await admin.firestore().collection('userEmailAcknowledgement').where("userId", "==", userId).get();

    const userAckBatch = admin.firestore().batch();
    userEmailAcknowledgementRef.docs.forEach(doc => {
      if (doc.data().isUserLogin === false) {
        userAckBatch.update(doc.ref, {
          isUserLogin: true,
          isUserFirstLoginTime: admin.firestore.Timestamp.now()
        });
      }
    });

    await userAckBatch.commit();

    return {
      status: true,
      message: "User first time login time set Successfully",
      data: { userId },
    };
  } catch (error) {
    return {
      status: false,
      message: "User Not Created ",
      data: null,
    };
  }
});