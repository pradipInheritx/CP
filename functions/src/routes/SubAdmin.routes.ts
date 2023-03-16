const express = require("express");
import {
  subAdminList,
  updateStatus,
  deleteSubAdmin,
} from "../common/models/Admin/subAdmin";

const subAdminRouter = express.Router();

subAdminRouter.get("/subAdminList/:adminId", subAdminList);
subAdminRouter.put("/updateStatus/:subAdminId", updateStatus);
subAdminRouter.delete("/deleteSubAdmin/:subAdminId", deleteSubAdmin);

export default subAdminRouter;
