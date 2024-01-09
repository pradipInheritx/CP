import { Router } from "express";
import { auth } from "../common/middleware/authentication";

import {
    makePayment,
    isUserUpgraded,
    getTransactionHistory,
    makePaymentToServer,
    getParentPayment,
    updateUserAfterPayment,
    getInstantReferalAmount,
    callbackFromServer,
    paymentStatusOnTransaction
} from "../common/models/Payments";
import { getPendingPaymentbyUserId } from "../common/models/Admin/payments"

const paymentRouter = Router();

paymentRouter.post("/makePayment", makePayment);
paymentRouter.post("/makePayment/toServer", makePaymentToServer);
paymentRouter.post("/makePayment/callback/fromServer", callbackFromServer);
paymentRouter.post("/update/user/afterVote", updateUserAfterPayment);
paymentRouter.post("/update/paymentStatusOnTransaction/:transactionId", paymentStatusOnTransaction);

paymentRouter.get("/isUserUpgraded/:userId", isUserUpgraded);
paymentRouter.get("/getTransactionHistory/:userId", getTransactionHistory);
paymentRouter.get("/getAdminPayment/:userId", auth, getParentPayment);
paymentRouter.get("/getParentPayment/:userId", getParentPayment);
paymentRouter.get("/getInstantReferalAmount/:userId", getInstantReferalAmount);
paymentRouter.get("/getPendingPaymentbyUserId/:userId", getPendingPaymentbyUserId);

export default paymentRouter;
