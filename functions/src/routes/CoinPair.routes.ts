import { Router } from "express";
import { auth } from "../common/middleware/authentication";

import {
  addCoinPair,
  getAllPairs,
  pairListingFunction,
  updateStatusOfCoinPair
} from "../common/models/Admin/CoinPair";

const coinPairRouter = Router();

coinPairRouter.post("/createPairCoin", auth, addCoinPair);
coinPairRouter.patch("/updateCoinPairStatus/:id", auth, updateStatusOfCoinPair);
coinPairRouter.get("/getAllCoinsPairs", auth, getAllPairs);
coinPairRouter.get("/getCoinPair", auth, pairListingFunction);

export default coinPairRouter;