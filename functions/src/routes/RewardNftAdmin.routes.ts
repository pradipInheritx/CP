import { Router } from "express";
import { auth } from "../common/middleware/authentication";

import {
  addAlbumNft,
  addSetNft,
  addRewardNFT,
  getAllCardsOfNftGallery,
} from "../common/models/Admin/Rewards";

const rewardNftAdminRouter = Router();

rewardNftAdminRouter.post("/createAlbum", auth, addAlbumNft);
rewardNftAdminRouter.post("/createSet", auth, addSetNft);
rewardNftAdminRouter.post("/createCard", auth, addRewardNFT);
rewardNftAdminRouter.post("/addImage", auth, getAllCardsOfNftGallery);

export default rewardNftAdminRouter;
