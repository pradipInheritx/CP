import { Router } from "express";
import { auth } from "../common/middleware/authentication";
import multer from 'multer';

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
  imageUpload
} from "../common/models/Admin/Rewards";

// Create a new instance of the Multer middleware
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

const rewardNftAdminRouter = Router();

rewardNftAdminRouter.post("/createAlbum", auth, createAlbum);
rewardNftAdminRouter.post("/createCard", createCard);
rewardNftAdminRouter.get("/getAllAlbums", auth, getAllAlbums);
rewardNftAdminRouter.get("/getAllCards", auth, getAllCards);
rewardNftAdminRouter.get("/getCardListing", auth, getCardListing);
rewardNftAdminRouter.put("/updateAlbum/:albumId", auth, updateAlbums);
rewardNftAdminRouter.put("/updateCard/:cardId", auth, updateCard);
rewardNftAdminRouter.delete("/deleteAlbum/:albumId", auth, deleteAlbum);
rewardNftAdminRouter.delete("/deleteSet", auth, deleteSet);
rewardNftAdminRouter.delete("/deleteCard/:cardId", auth, deleteCard);
rewardNftAdminRouter.post("/imageUpload", upload.single('file'), imageUpload);

export default rewardNftAdminRouter;
