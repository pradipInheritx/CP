import { firestore } from "firebase-admin";
const { v4: uuidv4 } = require("uuid");
import { getAllNftGallery, uploadImage } from "../Reward";

type AlbumNft = {
  collectionId: number;
  collectionName: string;
  setQuantity: number;
  setDetails: object[];
};

type SetNft = {
  setId: number;
  setName: string;
  cardsDetails: object[];
};

type NewCardNft = {
  cardName: string;
  cardType: string;
  quantity: number;
  totalQuantity: number;
  sno: string[];
  cardImage: any;
  noOfCardHolder: number;
  cardStatus: boolean;
};

// generate serial number
export const generateSerialNumber = async (
  collectionId: number,
  setId: number,
  cardType: any,
  quantity: number
) => {
  let serialNumber: string[] = [];
  for (let i = 0; i < quantity; i++) {
    let card =
      String(collectionId) + String(setId) + String(cardType) + String(i);
    serialNumber.push(card);
  }
  return serialNumber;
};

// Add Album in nft_gallery
export const addAlbumNft = async (req: any, res: any) => {
  const { collectionId, albumName, setQuantity } = req.body;
  try {
    let albumData: AlbumNft = {
      collectionId,
      collectionName: albumName,
      setQuantity: setQuantity,
      setDetails: [],
    };

    const newAlbum = await firestore()
      .collection("nftGallery")
      .doc()
      .set(albumData);

    res.status(200).send({
      status: true,
      message: "New album created.",
      result: newAlbum,
    });
  } catch (error) {
    errorLogging("addAlbumNft", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
};

// add set NFT
export const addSetNft = async (req: any, res: any) => {
  const { collectionId, setId, setName } = req.body;
  try {
    let setData: SetNft = {
      setId: setId,
      setName: setName,
      cardsDetails: [],
    };

    const getCollectionRef = await firestore()
      .collection("nft_gallery")
      .doc(collectionId)
      .get();

    const collectionData: any = getCollectionRef.data();
    collectionData.setDetails.push(setData);

    const newSet = await firestore()
      .collection("nftGallery")
      .doc(collectionId)
      .update(collectionData);

    res.status(200).send({
      status: true,
      message: "New Set added.",
      result: newSet,
    });
  } catch (error) {
    errorLogging("addSetNft", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
};

// add new NFT card
export const addRewardNFT = async (req: any, res: any) => {
  const {
    cardName,
    cardType,
    quantity,
    totalQuantity,
    noOfCardHolder,
    cardStatus,
    collectionId,
    setId,
    cardImage,
  } = req.body;
  try {
    const id = uuidv4();
    const newCardNft: NewCardNft = {
      cardName,
      cardType,
      quantity,
      totalQuantity,
      noOfCardHolder,
      cardStatus,
      sno: await generateSerialNumber(collectionId, setId, cardType, quantity),
      cardImage: cardImage
        ? await uploadImage(cardImage, collectionId, setId, id)
        : "",
    };

    const getCollectionRef = await firestore()
      .collection("nft_gallery")
      .doc(collectionId)
      .get();

    let collectionDetails = getCollectionRef.data();
    const setDetails = collectionDetails?.setDetails.find((data: any) => {
      return data.id == setId;
    });

    setDetails.cards.push(newCardNft);

    const newCard = await firestore()
      .collection("nft_gallery")
      .doc(collectionId)
      .set({ setDetails });

    res.status(200).send({
      status: true,
      message: "new card added.",
      result: newCard,
    });
  } catch (error) {
    errorLogging("addRewardNFT", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
};

// get all cards from nft_gallary
export const getAllCardsOfNftGallery = async (req: any, res: any) => {
  try {
    const nftGalleryData = await getAllNftGallery();
    const cards: any = [];
    nftGalleryData.forEach((albumDetails: any) => {
      albumDetails.setDetails.forEach((setDetail: any) => {
        setDetail.cards.forEach((cardDetail: any) => {
          cards.push({
            collectionId: albumDetails.collectionId,
            collectionName: albumDetails.collectionName,
            collectionDocId: albumDetails.id,
            setId: setDetail.id,
            ...cardDetail,
          });
        });
      });
    });
    res.status(200).send({
      status: true,
      message: "get all cards from gallery.",
      result: cards,
    });
  } catch (error) {
    errorLogging("getAllCardsOfNftGallery", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
  }
};

export const errorLogging = async (
  funcName: string,
  type: string,
  error: any
) => {
  console.info(funcName, type, error);
};
