const express = require("express");
import {
  subAdminList,
  updateStatus,
  deleteSubAdmin,
} from "../common/models/Admin/subAdmin";

const subAdminRouter = express.Router();

subAdminRouter.get("/subAdminList", subAdminList);
subAdminRouter.put("/updateStatus", updateStatus);
subAdminRouter.delete("/deleteSubAdmin", deleteSubAdmin);

export default subAdminRouter;
