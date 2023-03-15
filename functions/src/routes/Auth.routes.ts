const express = require("express");
import { auth } from "../common/middleware/authentication";

import {
    admin_create,
    admin_login,
    admin_forgotPassword,
    admin_changePassword,
    admin_resetPassword,
    admin_logout,
  } from "../common/models/Admin";

const authAdminRouter = express.Router();

authAdminRouter.post("/createAdminUser", admin_create);
authAdminRouter.post("/login", admin_login);
authAdminRouter.post("/forgot-password", admin_forgotPassword);
authAdminRouter.post("/change-password", auth, admin_changePassword);
authAdminRouter.post("/reset-password", admin_resetPassword);
authAdminRouter.post("/logout", auth, admin_logout);

export default authAdminRouter;
