import { Router } from "express";
//import { auth } from "../common/middleware/authentication";

import {
    createRewardsDistribution,
    getAllRewardsDistribution
} from "../common/models/Admin/RewardsDistribution";

const RewardsDistributionRouter = Router();

RewardsDistributionRouter.post("/createRewardsDistribution", createRewardsDistribution);
RewardsDistributionRouter.get("/getAllRewardsDistribution", getAllRewardsDistribution)
//coinPairRouter.post("/RewardsDistribution", auth, RewardsDistribution);
//coinPairRouter.patch("/updateCoinPairStatus/:id", auth, updateStatusOfCoinPair);
//coinPairRouter.patch("/updateCoinPair/voteRank/rankWeightCMPAndPerCMPInPair/:id", updateRankWeightCMPAndPerCMPOfCoinPair);
// coinPairRouter.get("/getAllCoinsPairs", auth, getAllPairs);
// coinPairRouter.get("/getCoinPair", auth, pairListingFunction);

export default RewardsDistributionRouter;