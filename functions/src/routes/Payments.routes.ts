import { Router } from "express";


import {
    makePayment,
    getUserWalletBalance,
    isUserUpgraded,
    getTransactionHistory,
    makePaymentToServer,
    getParentPayment
} from "../common/models/Payments";

const PaymentRouter = Router();

PaymentRouter.post("/makePayment", makePayment);
PaymentRouter.post("/makePayment/toServer", makePaymentToServer);


PaymentRouter.get("/balance/:address/:blockchain/:token", getUserWalletBalance);
PaymentRouter.get("/isUserUpgraded/:userId", isUserUpgraded);
PaymentRouter.get("/getTransactionHistory/:userId", getTransactionHistory);
PaymentRouter.get("/getParentPayment/:userId", getParentPayment);



export default PaymentRouter;
