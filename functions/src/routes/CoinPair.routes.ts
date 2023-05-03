import { Router } from "express";
// import { auth } from "../common/middleware/authentication";

import {
  addCoinPair,
  getAllPairs,
  getPairById,
  updateStatusOfCoinPair,
} from "../common/models/Admin/CoinPair";

const coinPairRouter = Router();

coinPairRouter.post("/createPairCoin", addCoinPair);
coinPairRouter.get("/getAllCoinsPairs", getAllPairs);
coinPairRouter.get("/getCoinPair/:id", getPairById);
coinPairRouter.patch("/updateCoinPairStatus/:id", updateStatusOfCoinPair);

export default coinPairRouter;