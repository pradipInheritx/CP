import { Router } from "express";
import { auth } from "../common/middleware/authentication";

import {
  createAlbum,
  createCard,
  getAllAlbums,
  getAllCards,
  getCardListing,
  updateAlbums,
  updateCard,
  deleteAlbum,
  deleteSet,
  deleteCard,
} from "../common/models/Admin/Rewards";

const rewardNftAdminRouter = Router();

rewardNftAdminRouter.post("/createAlbum", auth, createAlbum);
rewardNftAdminRouter.post("/createCard", auth, createCard);
rewardNftAdminRouter.get("/getAllAlbums", auth, getAllAlbums);
rewardNftAdminRouter.get("/getAllCards", auth, getAllCards);
rewardNftAdminRouter.get("/getCardListing", auth, getCardListing);
rewardNftAdminRouter.put("/updateAlbum/:albumId", auth, updateAlbums);
rewardNftAdminRouter.put("/updateCard/:cardId", auth, updateCard);
rewardNftAdminRouter.delete("/deleteAlbum/:albumId", auth, deleteAlbum);
rewardNftAdminRouter.delete("/deleteSet", auth, deleteSet);
rewardNftAdminRouter.delete("/deleteCard/:cardId", auth, deleteCard);


export default rewardNftAdminRouter;
