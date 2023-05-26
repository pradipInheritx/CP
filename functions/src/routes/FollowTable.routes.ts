import { Router } from "express";

import {
    getFollowersAndFollowingCount,
    getFollowersUsers,
    getFollowingUsers
} from "../common/models/Admin/FollowTable";

const FollowTableRouter = Router();

FollowTableRouter.get("/getFollowersAndFollowingCount", getFollowersAndFollowingCount);
FollowTableRouter.get("/getFollowersUsers/:userId", getFollowersUsers);
FollowTableRouter.get("/getFollowingUsers/:userId", getFollowingUsers);

export default FollowTableRouter;
