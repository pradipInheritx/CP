import { Router } from "express";


import {
    makePayment
} from "../common/models/Payments";

const PaymentRouter = Router();

PaymentRouter.post("/makePayment", makePayment);


export default PaymentRouter;
