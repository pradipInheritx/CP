import { Router } from "express";


import {
    makePayment,
    getUserWalletBalance,
    isUserUpgraded,
    getTransactionHistory
} from "../common/models/Payments";

const PaymentRouter = Router();

PaymentRouter.post("/makePayment", makePayment);

PaymentRouter.get("/balance/:address/:blockchain/:token", getUserWalletBalance);
PaymentRouter.get("/isUserUpgraded/:userId", isUserUpgraded);
PaymentRouter.get("/getTransactionHistory/:userId", getTransactionHistory);


export default PaymentRouter;
