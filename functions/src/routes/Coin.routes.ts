import { Router } from "express";
import { auth } from "../common/middleware/authentication";

import {
  addCoin,
  updateStatusOfCoin,
  getAllCoins,
  getCoinById,
  updateVoteBarRangeOfCoin
} from "../common/models/Admin/Coin";

const coinRouter = Router();

coinRouter.post("/createCoin", auth, addCoin);
coinRouter.patch("/updateCoinStatus/:coinId", auth, updateStatusOfCoin);
coinRouter.patch("/updateCoin/voteBarRange/:coinId", auth, updateVoteBarRangeOfCoin);
coinRouter.get("/getAllCoins", auth, getAllCoins);
coinRouter.get("/getCoin/:coinId", auth, getCoinById);


export default coinRouter;
