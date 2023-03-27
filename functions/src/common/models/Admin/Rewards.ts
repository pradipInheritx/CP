import {firestore} from "firebase-admin";
import {v4 as uuidv4} from "uuid";
import {getAllNftGallery, uploadImage} from "../Reward";

type AlbumNft = {
  collectionId: number;
  collectionName: string;
  setQuantity: number;
  setDetails: any[];
};

type SetNft = {
  setId: number;
  setName: string;
  cardsDetails: any[];
};

type NewCardNft = {
  name: string;
  type: string;
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
  const serialNumber: string[] = [];
  for (let i = 0; i < quantity; i++) {
    const card =
      String(collectionId) + String(setId) + String(cardType) + String(i);
    serialNumber.push(card);
  }
  return serialNumber;
};

// Add Album in nft_gallery
export const addAlbumNft = async (
    collectionId: any,
    albumName: string,
    setQuantity: number
) => {
  try {
    const collectionData: AlbumNft = {
      collectionId,
      collectionName: albumName,
      setQuantity: setQuantity,
      setDetails: [],
    };

    await firestore()
        .collection("nft_gallery")
        .doc()
        .set(collectionData)
        .then((data) => console.log("DATA from addAlbumNft >>>", data))
        .catch((error) => console.log("Error from addAlbumNft >>>", error));
  } catch (error) {
    errorLogging("addAlbumNft", "ERROR", error);
  }
};

// add set NFT
export const addSetNft = async (
    collectionId: string,
    setId: number,
    setName: string
) => {
  try {
    const setData: SetNft = {
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

    await firestore()
        .collection("nft_gallery")
        .doc(collectionId)
        .update(collectionData)
        .then((data) => console.log("DATA from addSetNft >>>", data))
        .catch((error) => console.log("Error from addSetNft >>>", error));
  } catch (error) {
    errorLogging("addSetNft", "ERROR", error);
  }
};

// add new NFT card
export const addRewardNFT = async (cardDetail: any) => {
  try {
    const {collectionId, setId} = cardDetail;
    const id = uuidv4();
    const newCardNft: NewCardNft = {
      name: cardDetail.name,
      type: cardDetail.type,
      quantity: cardDetail.quantity,
      totalQuantity: cardDetail.totalQuantity,
      sno: await generateSerialNumber(
          collectionId,
          setId,
          cardDetail.type,
          cardDetail.quantity
      ),
      cardImage: cardDetail.image ?
        await uploadImage(cardDetail.image, collectionId, setId, id) :
        "",
      noOfCardHolder: cardDetail.noOfCardHolder || 0,
      cardStatus: cardDetail.status,
    };

    const getCollectionRef = await firestore()
        .collection("nft_gallery")
        .doc(collectionId)
        .get();

    const collectionDetails = getCollectionRef.data();
    const setDetails = collectionDetails?.setDetails.find((data: any) => {
      return data.id == setId;
    });

    setDetails.cards.push(newCardNft);

    await firestore()
        .collection("nft_gallery")
        .doc(collectionId)
        .set({setDetails});

    console.log("addRewardNFT DONE >>>>>>>>", newCardNft);
  } catch (error) {
    errorLogging("addRewardNFT", "ERROR", error);
  }
};

// get all cards from nft_gallary
export const getAllCardsOfNftGallery = async () => {
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
  return cards;
};

export const errorLogging = async (
    funcName: string,
    type: string,
    error: any
) => {
  console.info(funcName, type, error);
};
