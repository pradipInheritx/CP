import { Router } from "express";
import { auth } from "../common/middleware/authentication";
// import multer from 'multer';
import upload from "../common/helpers/fileUploadConfig"

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '../uploads/')
//   },
//   filename: function (req: any, file: any, cb: any) {
//     console.info("File", file);
//     cb(null, file.originalname)
//   }
// });

// const upload = multer({ storage: storage });

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
  uploadFileFunc
} from "../common/models/Admin/Rewards";

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
rewardNftAdminRouter.put("/uploadFile/:cardId", upload.single('file'), uploadFileFunc);

export default rewardNftAdminRouter;
