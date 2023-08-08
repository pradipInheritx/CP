import { Router } from "express";


import {
    makePayment,
    getUserWalletBalance,
    isUserUpgraded
} from "../common/models/Payments";

const PaymentRouter = Router();

PaymentRouter.post("/makePayment", makePayment);

PaymentRouter.get("/balance/:address/:blockchain/:token", getUserWalletBalance);
PaymentRouter.get("/isUserUpgraded/:userId", isUserUpgraded);


export default PaymentRouter;
