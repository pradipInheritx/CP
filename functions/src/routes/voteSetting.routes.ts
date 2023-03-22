import { Router } from "express";
import { createTimeframe } from "../common/models/Admin/voteSettings";
import { auth } from "../common/middleware/authentication";

const voteSettingRouter = Router();

voteSettingRouter.post("/createTimeframe", auth, createTimeframe);

export default voteSettingRouter;
