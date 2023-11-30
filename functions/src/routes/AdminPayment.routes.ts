import { Router } from "express";
import { auth } from "../common/middleware/authentication";

import {
    getAdminPayment,
    getUserPayment
} from "../common/models/Admin/payments";

const adminPaymentRouter = Router();

adminPaymentRouter.get("/getAdminPayment/:userId",auth, getAdminPayment);
adminPaymentRouter.get("/getUserPayment/:userId",auth, getUserPayment);

export default adminPaymentRouter;
