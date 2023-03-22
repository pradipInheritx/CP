import { Router } from "express";
import {
  createTimeframe,
  getTimeframe,
  getTimeframeById,
  deleteTimeframeById,
} from "../common/models/Admin/voteSettings";
import { auth } from "../common/middleware/authentication";

const voteSettingRouter = Router();

voteSettingRouter.post("/createTimeframe", auth, createTimeframe);
voteSettingRouter.get("/getTimeframe", auth, getTimeframe);
voteSettingRouter.get("/getTimeframeById/:timeFrameId", auth, getTimeframeById);
voteSettingRouter.delete(
  "/deleteTimeframeById/:timeFrameId",
  auth,
  deleteTimeframeById
);

export default voteSettingRouter;
