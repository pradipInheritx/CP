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

const PaymentRouter = Router();

PaymentRouter.post("/makePayment", makePayment);
PaymentRouter.post("/makePayment/toServer", makePaymentToServer);
PaymentRouter.post("/makePayment/callback/fromServer", callbackFromServer);
PaymentRouter.post("/update/user/afterVote", updateUserAfterPayment);
PaymentRouter.post("/update/paymentStatusOnTransaction/:transactionId", paymentStatusOnTransaction);

PaymentRouter.get("/isUserUpgraded/:userId", isUserUpgraded);
PaymentRouter.get("/getTransactionHistory/:userId", getTransactionHistory);
PaymentRouter.get("/getAdminPayment/:userId", auth, getParentPayment);
PaymentRouter.get("/getParentPayment/:userId", getParentPayment);
PaymentRouter.get("/getInstantReferalAmount/:userId", getInstantReferalAmount);

export default PaymentRouter;
