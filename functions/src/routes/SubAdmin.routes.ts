import { Router } from "express";

import {
  subAdminList,
  updateStatus,
  deleteSubAdmin,
  noActivityIn24Hours
} from "../common/models/Admin/subAdmin";

const subAdminRouter = Router();

subAdminRouter.get("/subAdminList/:adminId", subAdminList);
subAdminRouter.put("/updateStatus/:subAdminId", updateStatus);
subAdminRouter.delete("/deleteSubAdmin/:subAdminId", deleteSubAdmin);
subAdminRouter.get("/subAdminList/checkForNotification/noActivityIn24Hours", noActivityIn24Hours);

export default subAdminRouter;
