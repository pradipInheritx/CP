import { Router } from "express";
// import { auth } from "../common/middleware/authentication";

import {
  addCoin,
  getAllCoins,
  getCoinById,
  updateStatusOfCoin,
  updateVoteBarRangeOfCoin,
  updateCoin
} from "../common/models/Admin/Coin";

const coinRouter = Router();

coinRouter.post("/createCoin", addCoin);
coinRouter.get("/getAllCoins", getAllCoins);
coinRouter.get("/getCoin/:id", getCoinById);
coinRouter.patch("/updateCoinStatus/:id", updateStatusOfCoin);
coinRouter.patch("/updateCoin/voteBarRange/:id", updateVoteBarRangeOfCoin);
coinRouter.patch("/updateCoin/:id", updateCoin);

export default coinRouter;
