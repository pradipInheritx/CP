import { Router } from "express";
import { auth } from "../common/middleware/authentication";

import {
  addCoinPair,
  getAllCardsPairs,
  pairsListingFunction,
} from "../common/models/Admin/CoinPair";

const coinPairRouter = Router();

coinPairRouter.post("/createPairCoin", auth, addCoinPair);
coinPairRouter.get("/getAllCoinsPairs", auth, getAllCardsPairs);
coinPairRouter.get("/getCoinPair", auth, pairsListingFunction);

export default coinPairRouter;
