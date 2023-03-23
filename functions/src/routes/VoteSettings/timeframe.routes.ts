import { Router } from "express";
import {
  createTimeframe,
  getTimeframe,
  getTimeframeById,
  deleteTimeframeById,
  updateTimeframe,
} from "../../common/models/Admin/VoteSettings/timeframe";
import { auth } from "../../common/middleware/authentication";

const timeframeRouter = Router();

timeframeRouter.post("/createTimeframe", auth, createTimeframe);
timeframeRouter.get("/getTimeframe", auth, getTimeframe);
timeframeRouter.get("/getTimeframeById/:timeFrameId", auth, getTimeframeById);
timeframeRouter.delete(
  "/deleteTimeframeById/:timeFrameId",
  auth,
  deleteTimeframeById
);
timeframeRouter.put("/updateTimeframe/:timeFrameId", auth, updateTimeframe);

export default timeframeRouter;
