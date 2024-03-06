import { Router } from "express";
import { auth } from "../common/middleware/authentication";

import {
    isUserUpgraded,
    getTransactionHistory,
    getParentPayment,
    updateUserAfterPayment,
    getInstantReferalAmount,
    callbackFromServer,
    paymentStatusOnUserFromCreditCard,
    getAllPendingPaxByUser,
    createPaymentOnTempTransactionOnCreditCard
} from "../common/models/Payments";
import { getPendingPaymentbyUserId, initiatePendingParentPayment } from "../common/models/Admin/payments"

const paymentRouter = Router();

paymentRouter.post("/makePayment/callback/fromServer", callbackFromServer);
paymentRouter.post("/update/user/afterPayment", updateUserAfterPayment);
paymentRouter.post("/update/paymentStatusOnTransaction/fromUser/onCreditCard", paymentStatusOnUserFromCreditCard);
paymentRouter.post("/make/createTempPaymentTransaction/onCreditCard", createPaymentOnTempTransactionOnCreditCard);
paymentRouter.get("/isUserUpgraded/:userId", isUserUpgraded);
paymentRouter.get("/getTransactionHistory/:userId", getTransactionHistory);
paymentRouter.get("/getAdminPayment/:userId", auth, getParentPayment);
paymentRouter.get("/getParentPayment/:userId", getParentPayment);
paymentRouter.get("/getInstantReferalAmount/:userId", getInstantReferalAmount);
paymentRouter.get("/getPendingPaymentbyUserId/:userId", getPendingPaymentbyUserId);
paymentRouter.get("/initiatePendingParentPayment/:userId", initiatePendingParentPayment);
paymentRouter.post("/getAllPendingPaxByUserId", getAllPendingPaxByUser);

export default paymentRouter;
