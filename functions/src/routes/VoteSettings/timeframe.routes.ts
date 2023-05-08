import { Router } from "express";
import {
  getTimeframe,
  updateTimeframe,
} from "../../common/models/Admin/VoteSettings/timeframe";
import { auth } from "../../common/middleware/authentication";

const timeframeRouter = Router();

timeframeRouter.get("/getTimeframe", auth, getTimeframe);
timeframeRouter.put("/updateTimeframe/timeFrames", auth, updateTimeframe);

export default timeframeRouter;
