import { Router } from "express";
import { auth } from "../common/middleware/authentication";

import {
  addAlbumNft,
  addSetNft,
  addRewardCardNft,
  getAllCardsOfNftGallery,
  getAllAlbums
} from "../common/models/Admin/Rewards";

const rewardNftAdminRouter = Router();

rewardNftAdminRouter.post("/createAlbum", auth, addAlbumNft);
rewardNftAdminRouter.post("/createSet/:albumId", auth, addSetNft);
rewardNftAdminRouter.post("/createCard/:albumId", auth, addRewardCardNft);
rewardNftAdminRouter.get("/getAllAlbums", auth, getAllAlbums);
rewardNftAdminRouter.get("/getAllCards", auth, getAllCardsOfNftGallery);

export default rewardNftAdminRouter;
