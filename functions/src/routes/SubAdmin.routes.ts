import { Router } from "express";

import {
  subAdminList,
  updateStatus,
  deleteSubAdmin,

} from "../common/models/Admin/subAdmin";

const subAdminRouter = Router();

subAdminRouter.get("/subAdminList/:adminId", subAdminList);
subAdminRouter.put("/updateStatus/:subAdminId", updateStatus);
subAdminRouter.delete("/deleteSubAdmin/:subAdminId", deleteSubAdmin);

export default subAdminRouter;
