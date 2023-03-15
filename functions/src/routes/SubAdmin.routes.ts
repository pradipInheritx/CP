const express = require("express");
import {
  subAdminList,
  addSubAdmin,
  updateStatus,
  deleteSubAdmin,
} from "../common/models/Admin/subAdmin";

const subAdminRouter = express.Router();

subAdminRouter.get("/subAdminList", subAdminList);
subAdminRouter.post("/addSubAdmin", addSubAdmin);
subAdminRouter.put("/updateStatus", updateStatus);
subAdminRouter.delete("/deleteSubAdmin", deleteSubAdmin);

export default subAdminRouter;
