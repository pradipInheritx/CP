import { Router } from "express";
// import { auth } from "../common/middleware/authentication";

import {
    createAlbum,
    createSet,
    createCard,
    getAllAlbums,
    getAllCards

} from "../common/models/Admin/RewardNew";

const rewardNftAdminRouter = Router();

rewardNftAdminRouter.post("/createAlbum", createAlbum);
rewardNftAdminRouter.post("/createSet", createSet);
rewardNftAdminRouter.post("/createCard", createCard);
rewardNftAdminRouter.get("/getAllAlbums", getAllAlbums);
rewardNftAdminRouter.get("/getAllCards", getAllCards);

export default rewardNftAdminRouter;
