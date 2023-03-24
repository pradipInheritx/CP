import { Router } from "express";
import { auth } from "../common/middleware/authentication";

import {
  adminCreate,
  login,
  adminForgotPassword,
  adminChangePassword,
  adminResetPassword,
  generateAuthTokens,
  logout,
} from "../common/models/Admin/Admin";

const authRouter = Router();

authRouter.post("/createAdminUser", adminCreate);
authRouter.post("/login", login);
authRouter.post("/forgot-password", adminForgotPassword);
authRouter.post("/change-password", auth, adminChangePassword);
authRouter.post("/reset-password", adminResetPassword);
authRouter.post("/getAuthToken", generateAuthTokens);
authRouter.post("/logout", auth, logout);

export default authRouter;
