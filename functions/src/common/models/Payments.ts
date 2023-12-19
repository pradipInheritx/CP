import { firestore } from "firebase-admin";
import { log } from "firebase-functions/logger";
import {
  isParentExistAndGetReferalAmount,
  callSmartContractPaymentFunction,
} from "./PaymentCalculation";
import * as parentConst from "../consts/payment.const.json";
import { userPurchaseNotification } from "./Admin/NotificationForAdmin";
import fetch from "node-fetch";

export const makePaymentToServer = async (req: any, res: any) => {
  try {
    console.info("req.body", typeof req.body, req.body);
    const { userEmail, amount, network, originCurrency, token } = req.body;
    const requestBody = {
      method: parentConst.PAYMENT_METHOD,
      callback_secret: "RPU8UNHhsyEV69yTUA0kBHieIouvxcuV",
      callback_url: "https://us-central1-coin-parliament-staging.cloudfunctions.net/api/v1/payment/makePayment/callback/fromServer",
      params: {
        amount: parseFloat(amount),
        network: network, // parentConst.PAYMENT_NETWORK,
        origincurrency: originCurrency, //parentConst.PAYMENT_ORIGIN_CURRENCY,
        token: token, // parentConst.PAYMENT_TOKEN,
      },
      user: userEmail,
    };
    console.info("RequestBody", requestBody);
    fetch("https://console.dev.welldapp.io/api/transactions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjowLCJvcmdfaWQiOjUsImlzcyI6IldFTExEQVBQIiwic3ViIjoid3d3LmNvaW5wYXJsaWFtZW50LmNvbSIsImF1ZCI6WyJHUk9VUFMiLCJBUFBMSUNBVElPTlMiLCJBVVRIIiwiV0VCMyJdLCJleHAiOjIwMTg2MjkyNjF9.xP0u9ndNG1xNS87utQb8a-RNuxkt3_Z1lzojfzaOMGc` //Coin Parliament Prod Token
        //"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjowLCJvcmdfaWQiOjIsImlzcyI6IldFTExEQVBQIiwic3ViIjoiYXBwMS5hcHAiLCJhdWQiOlsiR1JPVVBTIiwiQVBQTElDQVRJT05TIiwiQVVUSCIsIldFQjMiXSwiZXhwIjoyMjk4MjE5MzE2fQ.XzOIhftGzwPC5F0T-xbnpWJnY5xSTmpE36648pPQwUQ", // Previously Used
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => {
        if (res.ok) {
          console.info(res.ok, "Response After WellDApp", res);
          return res.json();
        } else {
          throw Error(`code ${res.status}`);
        }
      })
      .then(async (data) => {
        log("Payment response data : ", data);
        res.json(data);
      })
      .catch((err) => {
        console.error(err);
        res.status(400).send(err);
      });
  } catch (error: any) {
    console.info("Error while make payment to welld app server", error);
  }
};

export const callbackFromServer = async (req: any, res: any) => {
  try {
    console.info("req.body", typeof req.body, req.body);
    await firestore()
      .collection("callbackHistory").add({ ...req.body, timestamp: firestore.FieldValue.serverTimestamp() })
    res.status(200).send({
      status: true,
      message: "Transaction logged in DB on transaction details",
      data: [],
    });
  } catch (error: any) {
    console.info("Error while call callback URL payment to welld app server", error);
  }
};

export const updateUserAfterPayment = async (req: any, res: any) => {
  console.info("get request body", req.body);
  const {
    userId,
    walletType,
    userEmail,
    amount,
    network,
    origincurrency,
    token,
    transactionType,
    numberOfVotes,
    paymentDetails,
  } = req.body;
  await storeInDBOfPayment({
    userId,
    userEmail,
    walletType,
    amount,
    network,
    origincurrency,
    token,
    transactionType,
    numberOfVotes,
    paymentDetails,

  });
  console.log("start parent payment");
  const getResponseAfterParentPayment = await isParentExistAndGetReferalAmount(
    req.body
  );
  console.info("getResponseAfterParentPayment", getResponseAfterParentPayment);
  res.status(200).send({
    status: true,
    message: parentConst.MESSAGE_REFERAL_PAYMENT_INIT_SUCCESS,
    data: req.body,
  });
};
export const makePayment = async (req: any, res: any) => {
  const {
    userId,
    userEmail,
    walletType,
    amount,
    network,
    origincurrency,
    token,
    transactionType,
    numberOfVotes,
    paymentDetails,
  } = req.body;
  console.log(
    userId,
    userEmail,
    walletType,
    amount,
    network,
    origincurrency,
    token,
    transactionType,
    numberOfVotes,
    paymentDetails
  );
  await storeInDBOfPayment({
    userId,
    userEmail,
    walletType,
    amount,
    network,
    origincurrency,
    token,
    transactionType,
    numberOfVotes,
    paymentDetails,
  });
  // send notification to admin
  await userPurchaseNotification(userId);
  res.status(200).json({
    status: true,
    message: `Payment done successfully of amount ${amount}$`,
    data: {
      userId,
      userEmail,
      walletType,
      amount,
      network,
      origincurrency,
      token,
      transactionType,
      numberOfVotes,
      paymentDetails,
    },
  });
};
export const storeInDBOfPayment = async (metaData: any) => {
  if (
    metaData.transactionType === parentConst.TRANSACTION_TYPE_UPGRADE &&
    metaData?.userId
  ) {
    await addIsUpgradedValue(metaData.userId);
  }
  if (metaData.transactionType === parentConst.TRANSACTION_TYPE_EXTRA_VOTES) {
    await addIsExtraVotePurchase(metaData);
  }
  await firestore()
    .collection("payments")
    .add({ ...metaData, timestamp: firestore.FieldValue.serverTimestamp() });
};
export const addIsExtraVotePurchase = async (metaData: any) => {
  const userDocumentRef = firestore().collection("users").doc(metaData.userId);
  userDocumentRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data: any = doc.data();
        console.info("data", data);
        const originalValue: number =
          data?.rewardStatistics && data?.rewardStatistics?.extraVote
            ? parseFloat(data?.rewardStatistics?.extraVote)
            : 0;
        const modifiedValue: number =
          originalValue + parseFloat(metaData.numberOfVotes);
        console.log(
          "originalValue,modifiedValue : ",
          originalValue,
          modifiedValue
        );
        data.rewardStatistics.extraVote = modifiedValue;
        userDocumentRef.set(data);
      } else {
        errorLogging(
          "isUserExtraVote",
          "ERROR",
          "Something went wrong while add the extra votes"
        );
      }
    })
    .catch((error) => {
      errorLogging("isUserExtraVote", "ERROR", error);
    });
};
export const addIsUpgradedValue = async (userId: string) => {
  const getUserDetails: any = (
    await firestore().collection("users").doc(userId).get()
  ).data();

  const rewardStatistics: any = getUserDetails.rewardStatistics;
  rewardStatistics.extraVote =
    parentConst.UPGRADE_USER_VOTE + rewardStatistics.extraVote;
  rewardStatistics.diamonds =
    parentConst.UPGRADE_USER_COIN + rewardStatistics.diamonds;

  await firestore()
    .collection("users")
    .doc(userId)
    .set({ isUserUpgraded: true, rewardStatistics }, { merge: true });
};
//get user payment information by userId
export const isUserUpgraded = async (req: any, res: any) => {
  try {
    const { userId } = req.params;
    const getTransactionQuery = await firestore()
      .collection("payments")
      .where("userId", "==", userId)
      .get();
    const getPaymentData = getTransactionQuery.docs.map((payment) => {
      return payment.data();
    });

    if (!getPaymentData.length) {
      return res.status(404).send({
        status: false,
        message: "Payment not found",
        data: [],
      });
    }

    res.status(200).send({
      status: true,
      message: parentConst.MESSAGE_GET_PAYMENT,
      data: getPaymentData,
    });
  } catch (error) {
    errorLogging("isUserUpgraded", "ERROR", error);
    res.status(500).send({
      status: false,
      message: parentConst.MESSAGE_SOMETHINGS_WRONG,
      result: error,
    });
  }
};

export const getParentPayment = async (req: any, res: any) => {
  try {
    const getAllPaymentArray: any = [];
    const { userId } = req.params;
    const { status, pageNumber, pageSize } = req.query;
    const getQuery = firestore()
      .collection("parentPayment")
      .where("parentUserId", "==", userId);
    const getParentPaymentQuery: any = !status
      ? await getQuery.get()
      : await getQuery.where("status", "==", status).get();
    getParentPaymentQuery.docs.forEach((snapshot: any) => {
      let payment = snapshot.data();
      let id = snapshot?.id;
      console.log(
        "payment: ",
        payment,
        "Parent Payment",
        payment.parentPendingPaymentId,
        "TypeOf",
        typeof payment.parentPendingPaymentId
      );
      if (payment.parentPendingPaymentId === null) {
        getAllPaymentArray.push({ ...payment, docId: id, childPayment: [] });
      }
    });
    getParentPaymentQuery.docs.forEach((snapshot: any) => {
      let payment = snapshot.data();
      let id = snapshot?.id;
      console.log("payment: ", payment);
      const getParentPaymentIndex = getAllPaymentArray.findIndex(
        (item: any) => item.docId === payment.parentPendingPaymentId
      );
      //console.info("getAllPaymentArray", getAllPaymentArray[getParentPaymentIndex], getAllPaymentArray[getParentPaymentIndex].childPayment)
      console.info("getParentPaymentIndex", getParentPaymentIndex);
      if (
        getAllPaymentArray[getParentPaymentIndex] &&
        getAllPaymentArray[getParentPaymentIndex].childPayment
      ) {
        getAllPaymentArray[getParentPaymentIndex].childPayment.push({
          ...payment,
          docId: id,
        });
      }
    });

    console.log("getAllPaymentArray:::", getAllPaymentArray);

    const paymentsSorting = getAllPaymentArray.sort(
      (a: any, b: any) => b.timestamp - a.timestamp
    );
    console.log("paymentsSorting", paymentsSorting);

    const startIndex: number = (pageNumber - 1) * pageSize;
    const endIndex: number = startIndex + parseInt(pageSize);
    console.info(
      "paymentsSorting",
      paymentsSorting.length,
      "startIndex",
      startIndex,
      "endIndex",
      endIndex
    );
    const paymentPagination = paymentsSorting.slice(startIndex, endIndex);

    log("getParentPayment : paymentPagination => ", paymentPagination);
    res.status(200).send({
      status: true,
      message: parentConst.MESSAGE_GET_PARENT_PAYMENT_HISTORY_SUCCESS,
      data: paymentPagination,
      total: getAllPaymentArray.length,
    });
  } catch (error) {
    errorLogging("getParentPayment", "ERROR", error);
    res.status(500).send({
      status: false,
      message: parentConst.MESSAGE_SOMETHINGS_WRONG,
      result: error,
    });
  }
};

export const getInstantReferalAmount = async (req: any, res: any) => {
  const { userId } = req.params;
  const getParentUser = await firestore().collection("users").doc(userId).get();
  const getParentUserData: any = getParentUser.data();
  const getUserPendingReferalAmount = await firestore()
    .collection("parentPayment")
    .where("parentUserId", "==", userId)
    .where("status", "==", parentConst.PAMENT_STATUS_PENDING)
    .get();
  const getUserPendingReferalAmountData: any =
    getUserPendingReferalAmount.docs.map((payment) => {
      const id = payment.id;
      return { id, ...payment.data() };
    });
  if (getUserPendingReferalAmountData.length) {
    for (
      let pending = 0;
      pending < getUserPendingReferalAmountData.length;
      pending++
    ) {
      const getPaymentAddress = getParentUserData.wellDAddress.find(
        (address: any) =>
          address.coin === getUserPendingReferalAmountData[pending].token
      );
      if (getPaymentAddress) {
        console.info("getPaymentAddress", getPaymentAddress.address);
        // const transactionBody = {
        //     "method": parentConst.PAYMENT_METHOD,
        //     "params": {
        //         "amount": getUserPendingReferalAmountData[pending].amount || 0,
        //         "network": parentConst.PAYMENT_NETWORK,
        //         "origincurrency": parentConst.PAYMENT_ORIGIN_CURRENCY,
        //         "token": parentConst.PAYMENT_TOKEN,
        //     },
        //     "user": "Test"
        // };

        const parentTransactionDetails = {
          amount: parseFloat("0.0001"), //parseFloat(getUserPendingReferalAmountData[pending].amount) || 0,
          address: getPaymentAddress.address,
          network: "ethereum",
        };
        const getPaymentAfterTransfer = await callSmartContractPaymentFunction(
          parentTransactionDetails
        );
        const getHash = getPaymentAfterTransfer?.result?.return_value[0].hash;
        console.log("Get Hash In Call Smart API In Instant", getHash);
        console.info(
          "getUserPendingReferalAmountData[pending]?.id",
          getUserPendingReferalAmountData[pending]?.id
        );
        //const getPaymentAfterTransfer = await paymentFunction(transactionBody);
        await firestore()
          .collection("parentPayment")
          .doc(getUserPendingReferalAmountData[pending]?.id)
          .set(
            {
              status: parentConst.PAYMENT_STATUS_SUCCESS,
              parentPendingPaymentId: null,
              address: getPaymentAddress.address,
              receiveType: getParentUserData.referalReceiveType.name,
              transactionId: getHash,
            },
            { merge: true }
          );
      } else {
        getUserPendingReferalAmountData[pending].status =
          parentConst.PAYMENT_STATUS_NO_COIN_FOUND;
        const storeInParentData = {
          ...getUserPendingReferalAmountData[pending],
          parentPendingPaymentId: null,
          address: parentConst.PAYMENT_ADDRESS_NO_ADDRESS_FOUND,
          receiveType: getParentUserData.referalReceiveType.name,
          timestamp: firestore.FieldValue.serverTimestamp(),
        };
        console.info("storeInParentData", storeInParentData);
        await firestore().collection("parentPayment").add(storeInParentData);
      }
    }
    return res.status(200).send({
      status: false,
      message: parentConst.MESSAGE_PARENT_PENDING_PAYMENT_AMOUNT,
      data: getUserPendingReferalAmountData,
    });
  } else {
    return res.status(404).send({
      status: false,
      message: parentConst.MESSAGE_PARENT_PENDING_PAYMENT_AMOUNT_NOT_FOUND,
      data: [],
    });
  }
};
export const getTransactionHistory = async (req: any, res: any) => {
  try {
    const { userId } = req.params;
    const { pageNumber, pageSize } = req.query;
    const page_number = parseInt(pageNumber);
    const page_size = parseInt(pageSize);
    const transactionHistory: any = [];
    const getTransactionQuery = await firestore()
      .collection("payments")
      .where("userId", "==", userId)
      .get();
    getTransactionQuery.docs.forEach((snapshot: any) => {
      let transaction = snapshot.data();
      console.log("Transaction data ", transaction);
      transactionHistory.push({
        amount: transaction.amount,
        numberOfVotes: transaction.numberOfVotes,
        transaction_time: transaction.timestamp,
        token: transaction.token,
        origincurrency: transaction.origincurrency,
        transactionType: transaction.transactionType,
        transaction_id: transaction.transaction_id,
        userId: transaction.userId,
        walletType: transaction.walletType,
        paymentDetails: transaction.paymentDetails,
      });
    });

    const transactionSorting = transactionHistory.sort(
      (a: any, b: any) =>
        b.transaction_time._seconds - a.transaction_time._seconds
    );

    const startIndex: number = (page_number - 1) * page_size;
    const endIndex: number = startIndex + page_size;
    console.log(
      "s e : ",
      typeof startIndex,
      typeof endIndex,
      startIndex,
      endIndex
    );

    console.info(transactionSorting, startIndex, endIndex);
    const transactionPagination = transactionSorting.slice(
      startIndex,
      endIndex
    );
    console.info("transactionPagination : ", transactionPagination);

    res.status(200).send({
      status: true,
      message: parentConst.MESSAGE_GET_PARENT_PAYMENT_HISTORY_SUCCESS,
      data: transactionPagination,
      total: transactionHistory.length,
    });
  } catch (error) {
    errorLogging("getTransactionHistory", "ERROR", error);
    res.status(500).send({
      status: false,
      message: parentConst.MESSAGE_SOMETHINGS_WRONG,
      result: error,
    });
  }
};


export const paymentStatusOnTransaction = async (req: any, res: any) => {
  try {
    const { transactionId } = req.params;
    const { userEmail,
      walletType,
      amount,
      network,
      origincurrency,
      token,
      transactionType,
      numberOfVotes } = req.body;

    console.log("transactionId : ", transactionId);

    console.log("paymentStatusOnTransaction Body : ", {
      userEmail,
      walletType,
      amount,
      network,
      origincurrency,
      token,
      transactionType,
      numberOfVotes
    });

    const getAllTransactions = (await firestore().collection("callbackHistory").get()).docs.map((transaction) => { return { details: transaction.data(), id: transaction.id } });
    console.log("getAllTransactions : ", getAllTransactions)
    const getTransaction: any = getAllTransactions.filter((transaction: any) => transaction.details.data.transaction_id === transactionId);
    console.log("getTransaction : ", getTransaction);
    // const getTransaction: any = (await firestore().collection("callbackHistory").where("data.transaction_id", "==", transactionId).get()).docs.map((transaction) => { return { details: transaction.data(), id: transaction.id } });
    if (!getTransaction) {
      res.status(404).send({
        status: false,
        message: parentConst.TRANSACTION_NOT_FOUND,
        result: "",
      });
    }

    await firestore().collection("callbackHistory").doc(getTransaction[0].id).set({
      userEmail,
      walletType,
      amount,
      network,
      origincurrency,
      token,
      transactionType,
      numberOfVotes
    }, { merge: true });

    const data = (await firestore().collection("callbackHistory").doc(getTransaction.id).get()).data();
    res.status(200).send({
      status: true,
      message: parentConst.PAYMENT_UPDATE_SUCCESS,
      data

    });
  } catch (error) {
    errorLogging("paymentStatusOnTransaction", "ERROR", error);
    res.status(500).send({
      status: false,
      message: parentConst.MESSAGE_SOMETHINGS_WRONG,
      result: error,
    });
  }
}

export const errorLogging = async (
  funcName: string,
  type: string,
  error: any
) => {
  console.info(funcName, type, error);
};
