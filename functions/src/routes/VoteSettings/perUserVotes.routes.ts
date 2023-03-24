import { Router } from "express";
import {
  createPerUserVote,
  getPerUserVote,
  getPerUserVoteById,
  updatePerUserVoteById,
  deletePerUserVoteById,
} from "../../common/models/Admin/VoteSettings/perUserVote";
import { auth } from "../../common/middleware/authentication";

const perUserVoteRouter = Router();

perUserVoteRouter.post("/createPerUserVote", auth, createPerUserVote);
perUserVoteRouter.get("/getPerUserVote", auth, getPerUserVote);
perUserVoteRouter.get(
  "/getPerUserVoteById/:perUserVoteId",
  auth,
  getPerUserVoteById
);
perUserVoteRouter.put(
  "/updatePerUserVoteById/:perUserVoteId",
  auth,
  updatePerUserVoteById
);
perUserVoteRouter.delete(
  "/deletePerUserVoteById/:perUserVoteId",
  auth,
  deletePerUserVoteById
);

export default perUserVoteRouter;
