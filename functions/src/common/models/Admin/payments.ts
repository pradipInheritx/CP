import { firestore } from "firebase-admin";

import * as parentConst from "../../consts/payment.const.json";
import { Timestamp } from 'firebase-admin/firestore';
import { errorLogging } from "../../helpers/commonFunction.helper";

export const getAdminPayment = async (req: any, res: any) => {
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

    console.log("getParentPayment : paymentPagination => ", paymentPagination);
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

export const getUserPayment = async (req: any, res: any) => {
  try {
    const { userId } = req.params;
    const { pageNumber, pageSize } = req.query;
    const getUserPaymentsQuery: any = await firestore()
      .collection("payments")
      .where("userId", "==", userId)
      .get();

    console.log("getUserPaymentsQuery : ", getUserPaymentsQuery)
    const getUserPayments = getUserPaymentsQuery.docs.map((payment: any) =>
      payment.data()
    );

    console.log("getUserPayments : ", getUserPayments);

    const paymentsSorting = getUserPayments.sort(
      (a: any, b: any) => b.timestamp - a.timestamp
    );
    console.log("paymentsSorting", paymentsSorting);

    const startIndex: number = (pageNumber - 1) * pageSize;
    const endIndex: number = startIndex + parseInt(pageSize);
    console.log(
      "paymentsSorting",
      paymentsSorting.length,
      "startIndex",
      startIndex,
      "endIndex",
      endIndex
    );
    const paymentPagination = paymentsSorting.slice(startIndex, endIndex);

    console.log("getUserPayment : paymentPagination => ", paymentPagination);
    res.status(200).send({
      status: true,
      message: parentConst.MESSAGE_GET_USER_PAYMENT_HISTORY_SUCCESS,
      data: paymentPagination,
      total: getUserPayments.length,
    });
  } catch (error) {
    errorLogging("getUserPayment", "ERROR", error);
    res.status(500).send({
      status: false,
      message: parentConst.MESSAGE_SOMETHINGS_WRONG,
      result: error,
    });
  }
};

export const getPendingPaymentbyUserId = async (req: any, res: any) => {
  try {
    const { userId } = req.params;
    const coinObject: any = {};
    const getAllCoins: any = (await firestore().collection('settings').doc('coins').get()).data();
    getAllCoins.coins.map((item: any) => {
      coinObject[item.symbol] = 0;
    });

    const getAllPaymentsByUserId: any = (await firestore().collection('parentPayment').where("parentUserId", "==", userId).get()).docs.map((payment: any) => payment.data());
    const getAllPendingPayment = getAllPaymentsByUserId.filter((payment: any) => payment.status == parentConst.PAYMENT_STATUS_PENDING);
    getAllPendingPayment.forEach((payment: any) => {
      if (payment.originCurrency && payment.amount) {
        coinObject[payment.originCurrency] += parseFloat(payment.amount);
      }
    })

    console.log("coinObject : ", coinObject)
    res.status(200).send({
      status: true,
      data: coinObject,
    });
  } catch (error) {
    errorLogging("getPendingPaymentbyUserId", "ERROR", error);
    res.status(500).send({
      status: false,
      message: parentConst.MESSAGE_SOMETHINGS_WRONG,
      result: error,
    });
  }
}

export const collectPendingParentPayment = async (req: any, res: any) => {
  try {
    const { userId, totalAmount, transactionType } = req.body;
    const resultData: any = [];
    const getWellDAppFromUser: any = (await firestore().collection('users').doc(userId).get()).data();
    console.info("getWellDAppFromUser", getWellDAppFromUser.wellDAddress)

    let considerCoinNeedToPay: any = ["ETH, BNB, MATIC"];

    for (let coin = 0; coin < considerCoinNeedToPay.length; coin++) {
      const userIds: any = [];
      let isAddressNotExists: any = false;
      let notExistsCoinValue: any = "";
      const allCoinNeedToPay: any = []
      const makeAllInitiatedTransaction: any = [];

      const getAllPaymentsByUserId: any = (await firestore().collection('parentPayment').where("parentUserId", "==", userId).get()).docs.map((payment: any) => payment.data());
      const getAllPendingPayment = getAllPaymentsByUserId.filter((payment: any) => payment.status == parentConst.PAYMENT_STATUS_PENDING && payment.originCurrency.toUpperCase() === considerCoinNeedToPay[coin].toUpperCase());

      console.info("getAllPendingPayment---->", getAllPendingPayment);

      if (getAllPendingPayment.length) {
        getAllPendingPayment.forEach((payment: any) => {
          if (considerCoinNeedToPay[coin] === payment.originCurrency) {
            userIds.push(payment.parentUserId)
            allCoinNeedToPay.push(payment.originCurrency)
          }
        })

        for (let coin = 0; coin < allCoinNeedToPay.length; coin++) {
          let isWellDAppAddressExit = getWellDAppFromUser.wellDAddress.find((address: any) => address.coin === allCoinNeedToPay[coin])
          if (!isWellDAppAddressExit) {
            isAddressNotExists = true;
            notExistsCoinValue = allCoinNeedToPay[coin];
            console.log("Loop Break & Return Response")
            break;
          } else {
            console.log("WellDApp Address", isWellDAppAddressExit, "Coin", allCoinNeedToPay[coin])
          }
        }

        if (isAddressNotExists) {
          resultData.push({
            status: false,
            message: `Please make sure to update the coin address - ${notExistsCoinValue} for collect the referral`,
            data: [],
          })
          console.info("isAddressNotExists--->", isAddressNotExists);
        } else {
          const currentTimestamp = Date.now();
          const currentEpochTimestamp = Math.floor(currentTimestamp / 1000);
          const getParentClaimedWholePayment = await firestore().collection('parentPayment').add({
            parentUserId: userId,
            childUserId: null,
            amount: totalAmount,
            status: parentConst.PAYMENT_STATUS_SUCCESS,
            numberOfVotes: null,
            parentPendingPaymentId: null,
            receiveType: parentConst.PAYMENT_RECEIVE_TYPE_MANUAL,
            originCurrency: considerCoinNeedToPay[coin],
            token: considerCoinNeedToPay[coin],
            transactionId: `REF-${userId.slice(0, 4)}-${currentEpochTimestamp}`,
            transactionhash: "",
            transactionType: transactionType,
            type: null,
            address: considerCoinNeedToPay[coin],
            timestamp: Timestamp.now(),
            walletType: null,
            paymentDetails: null
          });

          const collectionRef = await firestore().collection('parentPayment');
          const snapshot = await collectionRef.where("parentUserId", 'in', userIds).get();

          // Iterate over each document where the array contains the value
          snapshot.forEach(async doc => {
            const docRef = collectionRef.doc(doc.id);
            let getPaymentDetails = doc.data();
            if (getPaymentDetails.status === parentConst.PAYMENT_STATUS_PENDING) {

              console.info("getPaymentDetails...", getPaymentDetails.address, "Origin Currency", getPaymentDetails.originCurrency)
              const isUserUpdatedAddress = getWellDAppFromUser.wellDAddress.find((address: any) => address.coin === getPaymentDetails.originCurrency);
              console.info("isUserUpdatedAddress...", isUserUpdatedAddress)
              let getAddressFromUser = "";
              if (getPaymentDetails.address === "NO_ADDRESS") {
                console.info("getPaymentDetails.address", getPaymentDetails.address)
                getAddressFromUser = isUserUpdatedAddress.address;
              }
              if (getAddressFromUser) {
                getPaymentDetails.address = getAddressFromUser;
                console.info("getPaymentDetails.address-->", getPaymentDetails.address)
                makeAllInitiatedTransaction.push({
                  event: parentConst.PARENT_REFFERAL_PAYMENT_EVENT_STATUS_CLAIMED,
                  ...getPaymentDetails,
                  timestamp: Timestamp.now(),
                });
                console.info("makeAllInitiatedTransaction--->IF", makeAllInitiatedTransaction)
                await docRef.update({ status: parentConst.PARENT_REFFERAL_PAYMENT_EVENT_STATUS_CLAIMED, address: getAddressFromUser, parentPendingPaymentId: getParentClaimedWholePayment.id });
                console.log(`Document ${doc.id} Updated Successfully.`);
              } else {
                makeAllInitiatedTransaction.push({
                  event: parentConst.PARENT_REFFERAL_PAYMENT_EVENT_STATUS_CLAIMED,
                  ...getPaymentDetails,
                  timestamp: Timestamp.now(),
                });
                console.info("makeAllInitiatedTransaction--->ELSE", makeAllInitiatedTransaction)

                await docRef.update({ status: parentConst.PARENT_REFFERAL_PAYMENT_EVENT_STATUS_CLAIMED, parentPendingPaymentId: getParentClaimedWholePayment.id });
                console.log(`Document ${doc.id} Updated Successfully.`);
              }
            } else {
              console.log("This record is for Success Payment", doc.id); //No need to do for success payment. Only Update the Pending Payment
            }
          });
          resultData.push({
            status: true,
            message: `${parentConst.MESSAGE_PARENT_PAYMENT_CLAIMED_SUCCESSFULLY} For ${considerCoinNeedToPay[coin].toUpperCase()}`,
            data: makeAllInitiatedTransaction,
          })
        }
      } else {
        resultData.push({
          status: false,
          message: `No Parent Payment Found For ${considerCoinNeedToPay[coin].toUpperCase()} This Coin.`,
          data: [],
        })
      }
    }
    res.status(200).send({
      status: true,
      message: parentConst.MESSAGE_PARENT_PAYMENT_CLAIMED_SUCCESSFULLY,
      result: resultData,
    });
  } catch (error) {
    errorLogging("getPendingPaymentbyUserId", "ERROR", error);
    res.status(500).send({
      status: false,
      message: parentConst.MESSAGE_SOMETHINGS_WRONG,
      result: error,
    });
  }
}

export const updateParentReferralPayment = async (req: any, res: any) => {
  try {
    const { paymentId } = req.params;
    console.info("parentUserId...", paymentId)
    const updateParentPaymentRef = await firestore().collection("payments").doc(paymentId);

    await updateParentPaymentRef.update({ status: "SUCCESS" });

    // const getPaymentUpdatedData = (await firestore().collection("payments").doc(paymentId).get()).data();

    // console.info("updateParentPaymentData", updateParentPaymentRef)

    res.status(200).send({
      status: true,
      message: "Parent Referral Payment Updated Successfully",
      result: updateParentPaymentRef,
    });
  } catch (error) {
    console.error("Error While Updating Parent Referral Payment:", error);
    res.status(500).send({
      status: false,
      message: "Error While Updating Parent Referral Payment",
      result: error,
    });
  }

}
