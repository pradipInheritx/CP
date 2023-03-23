import { Router } from "express";
import { createPerUserVote } from "../../common/models/Admin/VoteSettings/perUserVote";
import { auth } from "../../common/middleware/authentication";

const perUserVoteRouter = Router();

perUserVoteRouter.post("/createPerUserVote", auth, createPerUserVote);

export default perUserVoteRouter;
