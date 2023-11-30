import { firestore } from "firebase-admin";
import * as parentConst from "../../consts/payment.const.json";

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
  
        console.log("getUserPaymentsQuery : ",getUserPaymentsQuery)
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


export const errorLogging = async (
    funcName: string,
    type: string,
    error: any
  ) => {
    console.info(funcName, type, error);
  };
  