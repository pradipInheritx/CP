import { Router } from "express";
import {
    getVotesAndReturnSettings,
    updateVotesAndReturnSettings
} from "../../common/models/Admin/VoteSettings/VotesAndReturnSettings";
// import { auth } from "../../common/middleware/authentication";

const voteAndSettingsRouter = Router();


voteAndSettingsRouter.get("/getVoteAndretrunSettings", getVotesAndReturnSettings);
voteAndSettingsRouter.put("/updateVoteAndReturnSettings", updateVotesAndReturnSettings);

export default voteAndSettingsRouter;