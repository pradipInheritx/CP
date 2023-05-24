import { Router } from "express";

import {
    getFollowersAndFollowingCount,
} from "../common/models/Admin/FollowTable";

const FollowTableRouter = Router();

FollowTableRouter.get("/getFollowersAndFollowingCount", getFollowersAndFollowingCount);

export default FollowTableRouter;

