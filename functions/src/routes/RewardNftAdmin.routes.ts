import { Router } from "express";
// import { auth } from "../common/middleware/authentication";

import {
  createAlbum,
  createCard,
  getAllAlbums,
  getAllCards,
  getAlbumListing,
  updateAlbums,
  updateCard,
  deleteAlbum,
  deleteSet,
  deleteCard,
} from "../common/models/Admin/Rewards";

const rewardNftAdminRouter = Router();

rewardNftAdminRouter.post("/createAlbum", createAlbum);
rewardNftAdminRouter.post("/createCard", createCard);
rewardNftAdminRouter.get("/getAllAlbums", getAllAlbums);
rewardNftAdminRouter.get("/getAllCards", getAllCards);
rewardNftAdminRouter.get("/getAlbumListing", getAlbumListing);
rewardNftAdminRouter.put("/updateAlbum/:albumId", updateAlbums);
rewardNftAdminRouter.put("/updateCard/:cardId", updateCard);
rewardNftAdminRouter.delete("/deleteAlbum/:albumId", deleteAlbum);
rewardNftAdminRouter.delete("/deleteSet", deleteSet);
rewardNftAdminRouter.delete("/deleteCard/:cardId", deleteCard);


export default rewardNftAdminRouter;
