import { Router } from "express";
import { auth } from "../common/middleware/authentication";

import {
  addCoin,
  getAllCoins,
  getCoinById,
  updateStatusOfCoin,
  updateVoteBarRangeOfCoin,
  updateCoin,
  getCoinPagination
} from "../common/models/Admin/Coin";

const coinRouter = Router();

coinRouter.post("/createCoin", auth, addCoin);
coinRouter.get("/getAllCoins", auth, getAllCoins);
coinRouter.get("/getCoin/:id", auth, getCoinById);
coinRouter.get("/getCoinPagination", auth, getCoinPagination);
coinRouter.patch("/updateCoinStatus/:id", auth, updateStatusOfCoin);
coinRouter.patch("/updateCoin/voteBarRange/:id", auth, updateVoteBarRangeOfCoin);
coinRouter.patch("/updateCoin/:id", auth, updateCoin);

export default coinRouter;
