import { Router } from "express";
import { auth } from "../common/middleware/authentication";

import {
  addCoinPair,
  getAllCardsPairs,
  pairsListingFunction,
  updateStatusOfCoinPair
} from "../common/models/Admin/CoinPair";

const coinPairRouter = Router();

coinPairRouter.post("/createPairCoin", auth, addCoinPair);
coinPairRouter.patch("/updateCoinPairStatus/:pairId", auth, updateStatusOfCoinPair);
coinPairRouter.get("/getAllCoinsPairs", auth, getAllCardsPairs);
coinPairRouter.get("/getCoinPair", auth, pairsListingFunction);

export default coinPairRouter;