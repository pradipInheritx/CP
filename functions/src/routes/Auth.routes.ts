const express = require("express");
import { auth } from "../common/middleware/authentication";

import {
  adminCreate,
  login,
  adminForgotPassword,
  adminChangePassword,
  adminResetPassword,
  logout,
} from "../common/models/Admin/Admin";

const authAdminRouter = express.Router();

authAdminRouter.post("/createAdminUser", adminCreate);
authAdminRouter.post("/login", login);
authAdminRouter.post("/forgot-password", adminForgotPassword);
authAdminRouter.post("/change-password", auth, adminChangePassword);
authAdminRouter.post("/reset-password", adminResetPassword);
authAdminRouter.post("/logout", auth, logout);

export default authAdminRouter;
