import { Router } from "express";
import { auth } from "../common/middleware/authentication";

import { addCoin, updateStatusOfCoin } from "../common/models/Admin/Coin";

const coinRouter = Router();

coinRouter.post("/createCoin", auth, addCoin);
coinRouter.patch("/updateCoinStatus/:coinId", auth, updateStatusOfCoin);

export default coinRouter;
