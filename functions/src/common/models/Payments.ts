import { firestore } from "firebase-admin";
import fetch from "node-fetch";
import { log } from "firebase-functions/logger";
import {
  isParentExistAndGetReferalAmount,
  callSmartContractPaymentFunction,
} from "./PaymentCalculation";
import * as parentConst from "../consts/payment.const.json";
import { userPurchaseNotification } from "./Admin/NotificationForAdmin";
import { getAllPendingPaxByUserId } from "./PAX";




export const makePaymentToServer = async (req: any, res: any) => {
  try {
    console.info("req.body", typeof req.body, req.body);
    const { userEmail, amount, network, originCurrency, token } = req.body;

    // const requestBody = {
    //   "method": "getTransaction",
    //   "params": {
    //     "amount": parseFloat("0.0001"),
    //     "network": "11155111",
    //     "origincurrency": "eth",
    //     "token": "ETH",
    //   },
    //   "user": "Test"
    // }
    const requestBody = {
      method: parentConst.PAYMENT_METHOD,
      callback_secret: "RPU8UNHhsyEV69yTUA0kBHieIouvxcuV",
      callback_url: "https://us-central1-coinparliament-51ae1.cloudfunctions.net/api/v1/payment/makePayment/callback/fromServer",
      params: {
        amount: parseFloat(amount),
        network: network, // parentConst.PAYMENT_NETWORK,
        origincurrency: originCurrency, //parentConst.PAYMENT_ORIGIN_CURRENCY,
        token: token, // parentConst.PAYMENT_TOKEN,
      },
      user: userEmail,
    };
    console.info("RequestBody", requestBody);
    fetch("https://console.welldapp.io/api/transactions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjowLCJvcmdfaWQiOjUsImlzcyI6IldFTExEQVBQIiwic3ViIjoid3d3LmNvaW5wYXJsaWFtZW50LmNvbSIsImF1ZCI6WyJHUk9VUFMiLCJBUFBMSUNBVElPTlMiLCJBVVRIIiwiV0VCMyJdLCJleHAiOjIwNTAyNTE2NjF9.ngLBJwEsoPVOLj_zA6ZG15mGR-cZ9pPUm6RL-VvTXKw` //Coin Parliament Prod Token
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
    if (req.body.order_buyer) {
      if (req.body.order_status !== "Open") {
        await firestore()
          .collection("callbackHistory").add({ data: req.body, event: req.body.order_status, callbackFrom: "CREDITCARD", timestamp: firestore.FieldValue.serverTimestamp() });


        const getTempPaymentTransaction = await firestore().collection("tempPaymentTransaction")
          .where("timestamp", "==", req.body.p2)
          .get();

        const getTempCrediCardData = getTempPaymentTransaction.docs.map((tempPaymentTransaction: any) => {
          return tempPaymentTransaction.data();
        });

        console.info("getTempCrediCardData", getTempCrediCardData[0])
        let requestBody: any;
        if (getTempCrediCardData.length && getTempCrediCardData[0]) {
          let userId = req.body && req.body.p1 ? req.body.p1 : "";
          requestBody = { userId, userEmail: req.body.order_buyer, walletType: "CREDITCARD", amount: req.body.order_famount, orderFee: req.body.order_fee, network: "", origincurrency: "", token: "", transactionType: getTempCrediCardData[0].transactionType, numberOfVotes: getTempCrediCardData[0].numberOfVotes, initiated: "BE" };
        } else {
          requestBody = { userId: "", userEmail: "", walletType: "", amount: "", network: "", origincurrency: "", token: "", transactionType: getTempCrediCardData[0].transactionType, numberOfVotes: getTempCrediCardData[0].numberOfVotes, initiated: "BE" };
        }

        const getResponseFromCreditCard = await paymentStatusOnUserFromCreditCardFunction(requestBody);
        console.info("getResponseFromCreditCard", getResponseFromCreditCard);

        res.status(200).send({
          status: true,
          message: "Transaction logged in DB and transaction made successfully",
          data: [],
        });

      }
      await firestore()
        .collection("callbackHistory").add({ data: req.body, event: req.body.order_status, callbackFrom: "CREDITCARD", timestamp: firestore.FieldValue.serverTimestamp() });
      res.status(200).send({
        status: true,
        message: "Transaction logged in DB on transaction details",
        data: [],
      });
    } else {
      await firestore()
        .collection("callbackHistory").add({ ...req.body, callbackFrom: "WELLDAPP", timestamp: firestore.FieldValue.serverTimestamp() });
      res.status(200).send({
        status: true,
        message: "Transaction logged in DB on transaction details",
        data: [],
      });
    }
    // Assuming there's only one user with the given email (unique constraint)
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
  console.info("STORE in DB", metaData)
  if (
    metaData.transactionType === parentConst.TRANSACTION_TYPE_UPGRADE &&
    metaData?.userId
  ) {
    console.info("For Account Upgrade", metaData.userId);
    await addIsUpgradedValue(metaData.userId);
  }
  if (metaData.transactionType === parentConst.TRANSACTION_TYPE_EXTRA_VOTES) {
    console.info("For Vote Purchase", metaData);
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

  console.info("For Is Upgraded", rewardStatistics)

  await firestore()
    .collection("users")
    .doc(userId)
    .set({ isUserUpgraded: true, rewardStatistics }, { merge: true });

  const rewardData = {
    winData: {
      firstRewardCardType: "",
      firstRewardCardId: "",
      firstRewardCard: "",
      firstRewardCardCollection: "",
      firstRewardCardSerialNo: "",
      firstRewardCardImageUrl: "",
      firstRewardCardVideoUrl: "",
      secondRewardExtraVotes: parentConst.UPGRADE_USER_VOTE,
      thirdRewardDiamonds: parentConst.UPGRADE_USER_COIN,
    },
    transactionTime: firestore.FieldValue.serverTimestamp(),
    user: userId,
    winningTime: rewardStatistics.claimed,
    isUserUpgraded: true
  }
  console.log("rewardData : ", rewardData);
  const addReward = await firestore().collection('reward_transactions').add(rewardData);
  if (!addReward.id) {
    console.log("rewardData is not added")
  }
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
    .where("status", "==", parentConst.PAYMENT_STATUS_PENDING)
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
        event: transaction && transaction.event ? transaction.event : "failed"
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

export const paymentStatusOnUserFromCreditCard = async (req: any, res: any) => {
  try {
    const getResponseFromCreditCardUpdate: any = await paymentStatusOnUserFromCreditCardFunction(req.body)
    res.status(getResponseFromCreditCardUpdate.statusCode).send(getResponseFromCreditCardUpdate);
  } catch (error: any) {
    res.status(500).send({
      status: true,
      message: "Error",
      error
    });
  }
}

export const paymentStatusOnUserFromCreditCardFunction = async (requestBody: any) => {
  try {
    const { userId, userEmail, walletType, amount, network, origincurrency, token, transactionType, numberOfVotes, initiated } = requestBody;
    const getAllTransactions = (await firestore().collection("callbackHistory").get()).docs.map((transaction) => { return { callbackDetails: transaction.data(), id: transaction.id } });
    const getTransactionFromCreditCard: any = getAllTransactions.filter((transaction: any) => transaction.callbackDetails.data.p1 === userId);
    console.log("getTransactionFromCreditCard : ", getTransactionFromCreditCard);
    if (!getTransactionFromCreditCard) {
      return {
        statusCode: 404,
        status: false,
        message: parentConst.CREDITCARD_TRANSACTION_NOT_FOUND,
        result: "",
      }
    }

    if (getTransactionFromCreditCard[0].callbackDetails.event == parentConst.CREDITCARD_PAYMENT_EVENT_APPROVED || getTransactionFromCreditCard[0].callbackDetails.event == parentConst.CREDITCARD_PAYMENT_EVENT_COMPLETED) {
      if (transactionType === parentConst.TRANSACTION_TYPE_EXTRA_VOTES) {
        await addIsExtraVotePurchase({
          userId,
          userEmail,
          walletType,
          amount,
          network,
          origincurrency,
          token,
          transactionType,
          numberOfVotes,
          initiated
        });
      }
      if (transactionType === parentConst.TRANSACTION_TYPE_UPGRADE) {
        await addIsUpgradedValue(userId)
      }
    }
    await firestore().collection("callbackHistory").doc(getTransactionFromCreditCard[0].id).set({
      paymentDetails
        : getTransactionFromCreditCard[0].callbackDetails.data,
      event: getTransactionFromCreditCard[0].callbackDetails.event,
      userId,
      userEmail,
      walletType,
      amount,
      network,
      origincurrency,
      token,
      transactionType,
      numberOfVotes,
      initiated
    }, { merge: true });

    const getUpdatedData: any = (await firestore().collection("callbackHistory").doc(getTransactionFromCreditCard[0].id).get()).data();

    //TODO Get the data and store in payment collection 
    const addNewPayment = await firestore().collection('payments').add(getUpdatedData);

    if (addNewPayment.id) {
      firestore().collection("callbackHistory").doc(getTransactionFromCreditCard[0].id).delete().then(() => {
        console.log(`${getTransactionFromCreditCard[0].id} Document successfully deleted from callbackHistory!`)
      }).catch((error) => {
        console.log(`${getTransactionFromCreditCard[0].id} Document is not deleted from callbackHistory! \n Error: ${error}`);
      });
    };

    return {
      statusCode: 200,
      status: true,
      message: parentConst.PAYMENT_UPDATE_SUCCESS,
      getUpdatedData
    }
  } catch (error: any) {
    return {
      statusCode: 500,
      status: true,
      message: "Error",
      error
    }
  }
}

export const paymentStatusOnTransactionFromWellDApp = async (req: any, res: any) => {
  try {
    const { transactionId } = req.params;
    const { userId, userEmail, walletType, amount, network, origincurrency, token, transactionType, numberOfVotes, initiated } = req.body;
    const getAllTransactions = (await firestore().collection("callbackHistory").get()).docs.map((transaction) => { return { callbackDetails: transaction.data(), id: transaction.id } });
    const getTransaction: any = getAllTransactions.filter((transaction: any) => transaction.callbackDetails.data.transaction_id === transactionId);

    console.log("getTransaction : ", getTransaction);

    if (!getTransaction) {
      res.status(404).send({
        status: false,
        message: parentConst.WELLDAPP_TRANSACTION_NOT_FOUND,
        result: "",
      });
    }

    console.info("getTransaction In API", getTransaction)

    if (getTransaction[0].callbackDetails.event == parentConst.WELLDAPP_PAYMENT_EVENT_APPROVED || getTransaction[0].callbackDetails.event == parentConst.WELLDAPP_PAYMENT_EVENT_CONFIRMED) {
      if (transactionType === parentConst.TRANSACTION_TYPE_EXTRA_VOTES) {
        await addIsExtraVotePurchase({
          userId,
          userEmail,
          walletType,
          amount,
          network,
          origincurrency,
          token,
          transactionType,
          numberOfVotes,
          initiated
        });
      }
      if (transactionType === parentConst.TRANSACTION_TYPE_UPGRADE) {
        await addIsUpgradedValue(userId)
      }
    }
    await firestore().collection("callbackHistory").doc(getTransaction[0].id).set({
      paymentDetails
        : getTransaction[0].callbackDetails.data,
      event: getTransaction[0].callbackDetails.event,
      userId,
      userEmail,
      walletType,
      amount,
      network,
      origincurrency,
      token,
      transactionType,
      numberOfVotes,
      initiated
    }, { merge: true });

    const getUpdatedData: any = (await firestore().collection("callbackHistory").doc(getTransaction[0].id).get()).data();

    //TODO Get the data and store in payment collection 
    const addNewPayment = await firestore().collection('payments').add(getUpdatedData);

    if (addNewPayment.id) {
      firestore().collection("callbackHistory").doc(getTransaction[0].id).delete().then(() => {
        console.log(`${getTransaction[0].id} Document successfully deleted from callbackHistory!`)
      }).catch((error) => {
        console.log(`${getTransaction[0].id} Document is not deleted from callbackHistory! \n Error: ${error}`);
      });
    };

    res.status(200).send({
      status: true,
      message: parentConst.PAYMENT_UPDATE_SUCCESS,
      getUpdatedData
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

export const createPaymentOnTempTransactionOnCreditCard = async (req: any, res: any) => {
  try {
    await firestore()
      .collection("tempPaymentTransaction").add({ ...req.body, serverTimestamp: firestore.FieldValue.serverTimestamp() });

    res.status(200).send({
      status: true,
      message: "Temp payment transaction created successfully",
      result: "",
    });
  } catch (error) {
    res.status(500).send({
      status: false,
      message: "Something went wrong",
      result: error,
    });
  }
}


export const getAllPendingPaxByUser = async (req: any, res: any) => {
  try {
    const { userId } = req.body;
    const getPendingPaxValue = await getAllPendingPaxByUserId(userId);
    console.info("getPendingPaxValue", getPendingPaxValue)
    return res.status(200).send({
      status: true,
      message: parentConst.MESSAGE_PENDING_PAX_VALUE,
      data: getPendingPaxValue,
    });
  } catch (error) {
    errorLogging("getAllPendingPaxByUser", "ERROR", error);
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
