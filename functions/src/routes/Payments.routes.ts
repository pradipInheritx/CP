import { Router } from "express";


import {
    makePayment,
    getUserWalletBalance
} from "../common/models/Payments";

const PaymentRouter = Router();

PaymentRouter.post("/makePayment", makePayment);

PaymentRouter.get("/balance/:address/:blockchain/:token", getUserWalletBalance);


export default PaymentRouter;
