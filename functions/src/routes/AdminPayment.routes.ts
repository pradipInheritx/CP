import { Router } from "express";
import { auth } from "../common/middleware/authentication";

import {
    getAdminPayment,
    getUserPayment,
    getPendingPaymentbyUserId
} from "../common/models/Admin/payments";

const adminPaymentRouter = Router();

adminPaymentRouter.get("/getAdminPayment/:userId",auth, getAdminPayment);
adminPaymentRouter.get("/getUserPayment/:userId",auth, getUserPayment);
adminPaymentRouter.get("/getPendingPaymentbyUserId/:userId",auth, getPendingPaymentbyUserId);

export default adminPaymentRouter;
