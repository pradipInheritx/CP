import { Router } from "express";
import { auth } from "../common/middleware/authentication";

import {
  addCoinPair,
  getAllPairs,
  getPairById,
  updateStatusOfCoinPair,
} from "../common/models/Admin/CoinPair";

const coinPairRouter = Router();

coinPairRouter.post("/createPairCoin", auth, addCoinPair);
coinPairRouter.get("/getAllCoinsPairs", auth, getAllPairs);
coinPairRouter.get("/getCoinPair/:id", auth, getPairById);
coinPairRouter.patch("/updateCoinPairStatus/:id", auth, updateStatusOfCoinPair);

export default coinPairRouter;