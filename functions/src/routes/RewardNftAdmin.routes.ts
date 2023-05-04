import { Router } from "express";
import { auth } from "../common/middleware/authentication";

import {
  createAlbum,
  createSet,
  createCard,
  getAllAlbums,
  getAllCards,
  getAlbumListing
} from "../common/models/Admin/Rewards";

const rewardNftAdminRouter = Router();

rewardNftAdminRouter.post("/createAlbum", auth, createAlbum);
rewardNftAdminRouter.post("/createSet", auth, createSet);
rewardNftAdminRouter.post("/createCard", auth, createCard);
rewardNftAdminRouter.get("/getAllAlbums", auth, getAllAlbums);
rewardNftAdminRouter.get("/getAllCards", auth, getAllCards);
rewardNftAdminRouter.get("/getAlbumListing", getAlbumListing);


export default rewardNftAdminRouter;
