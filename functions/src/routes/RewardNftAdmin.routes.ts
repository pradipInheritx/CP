import { Router } from "express";
// import { auth } from "../common/middleware/authentication";

// import {
//   addAlbumNft,
//   addSetNft,
//   addRewardCardNft,
//   // getAllCardsOfNftGallery,
//   // getAllAlbums,
//   // getRewardNFT
// } from "../common/models/Admin/Rewards";


import {
  createAlbum,
  createSet,
  createCard,
  getAllAlbums,
  getAllCards

} from "../common/models/Admin/RewardNew";

const rewardNftAdminRouter = Router();

// rewardNftAdminRouter.post("/createAlbum", addAlbumNft);
// rewardNftAdminRouter.post("/createSet/:albumId", auth, addSetNft);
// rewardNftAdminRouter.post("/createCard/:albumId", auth, addRewardCardNft);
// rewardNftAdminRouter.get("/getAllAlbums", auth, getAllAlbums);
// rewardNftAdminRouter.get("/getRewardNFT", auth, getRewardNFT);
// rewardNftAdminRouter.get("/getAllCards", auth, getAllCardsOfNftGallery);

rewardNftAdminRouter.post("/createAlbum", createAlbum);
rewardNftAdminRouter.post("/createSet", createSet);
rewardNftAdminRouter.post("/createCard", createCard);
rewardNftAdminRouter.get("/getAllAlbums", getAllAlbums);
rewardNftAdminRouter.get("/getAllCards", getAllCards);

export default rewardNftAdminRouter;
