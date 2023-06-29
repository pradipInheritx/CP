import { Router } from "express";

import {
  getUserTypeSettings,
  updateUserTypeSettings
} from "../common/models/Admin/userTypeSettings";

import { auth } from "../common/middleware/authentication";

const subAdminRouter = Router();

subAdminRouter.get("/getUserTypeSettings", auth, getUserTypeSettings);
subAdminRouter.put("/update/userTypeSettings", auth, updateUserTypeSettings);

export default subAdminRouter;
