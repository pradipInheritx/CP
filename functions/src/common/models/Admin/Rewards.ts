import { firestore } from "firebase-admin";
import { v4 as uuidv4 } from "uuid";
import { getAllNftGallery, uploadImage } from "../Reward";

type AlbumNft = {
  albumId: number;
  albumName: string;
  setQuantity: number;
  setDetails: any[];
};

type SetNft = {
  setId: number;
  setName: string;
  cardsDetails: any[];
};

type NewCardNft = {
  cardId: number;
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
  const serialNumber: string[] = [];
  for (let i = 0; i < quantity; i++) {
    const card =
      String(collectionId) + String(setId) + String(cardType) + String(i);
    serialNumber.push(card);
  }
  return serialNumber;
};

// Add Album in nft_gallery
export const addAlbumNft = async (req: any, res: any) => {
  const { albumId, albumName, setQuantity } = req.body;
  try {
    const checkAlbums = await firestore()
      .collection("nftGallery")
      .where("albumId", "==", albumId)
      .get();

    if (checkAlbums.docs.length) {
      return res.status(409).send({
        status: false,
        message: "Already exist.",
        result: null,
      });
    }
    let albumData: AlbumNft = {
      albumId,
      albumName: albumName,
      setQuantity: setQuantity,
      setDetails: [],
    };

    await firestore().collection("nftGallery").doc().set(albumData);

    console.log("Albums id >>>>>", albumData, albumId);
    const newAlbumRef = await firestore()
      .collection("nftGallery")
      .where("albumId", "==", albumId)
      .get();
    console.log("new Album newAlbumRef >>>", newAlbumRef);

    const newAlbumDoc = newAlbumRef.docs[0];
    const newAlbumData = newAlbumDoc.data();
    console.log("new Album >>>", newAlbumDoc);

    res.status(200).send({
      status: true,
      message: "New album created.",
      result: newAlbumData,
    });
  } catch (error) {
    errorLogging("addAlbumNft", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server.",
      result: error,
    });
  }
};

// add set NFT
export const addSetNft = async (req: any, res: any) => {
  const { albumId } = req.params;
  const { setId, setName } = req.body;
  try {
    const setData: SetNft = {
      setId: setId,
      setName: setName,
      cardsDetails: [],
    };

    const getCollectionRef = await firestore()
      .collection("nftGallery")
      .doc(albumId)
      .get();

    const albumData: any = getCollectionRef.data();
    const checkValue = albumData.setDetails.find((data: any) => {
      return data.setId == setId;
    });
    if (checkValue) {
      return res.status(409).send({
        status: false,
        message: "Already exist.",
        result: null,
      });
    }
    albumData.setDetails.push(setData);

    await firestore().collection("nftGallery").doc(albumId).update(albumData);

    const getSetRef = await firestore()
      .collection("nftGallery")
      .doc(albumId)
      .get();
    const getSetData: any = getSetRef.data();
    const getSet = getSetData.setDetails.find((data: any) => {
      return data.setId == setId;
    });
    res.status(200).send({
      status: true,
      message: "New Set added.",
      result: getSet,
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
export const addRewardCardNft = async (req: any, res: any) => {
  const { albumId } = req.params;
  const {
    cardId,
    cardName,
    cardType,
    quantity,
    noOfCardHolder,
    cardStatus,
    setId,
    cardImage,
  } = req.body;
  try {
    const id = uuidv4();
    const newCardNft: NewCardNft = {
      cardId,
      cardName,
      cardType,
      quantity,
      totalQuantity: quantity,
      noOfCardHolder,
      cardStatus,
      sno: await generateSerialNumber(albumId, setId, cardType, quantity),
      cardImage: cardImage
        ? await uploadImage(cardImage, albumId, setId, id)
        : "",
    };

    const getCollectionRef = await firestore()
      .collection("nftGallery")
      .doc(albumId)
      .get();

    let collectionDetails: any = getCollectionRef.data();
    let setDetails = collectionDetails?.setDetails.find((data: any) => {
      return data.setId == setId;
    });
    setDetails.cardsDetails.push(newCardNft);
    console.log("set Detials after push >>>", setDetails, albumId);

    console.log("COLLECTION ->", collectionDetails);

    await firestore()
      .collection("nftGallery")
      .doc(albumId)
      .set(collectionDetails);

    const getCard = await firestore()
      .collection("nftGallery")
      .doc(albumId)
      .get();

    res.status(200).send({
      status: true,
      message: "new card added.",
      result: getCard.data(),
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

//get all alibum from nftGallery
export const getAllAlbums = async (req:any,res:any)=>{
  try {
  const nftGalleryData = await getAllNftGallery();

  if(!nftGalleryData.length){
    return res.status(404).send({
      status: false,
      message: "Not Found",
      result: null,
    });
  }
  res.status(200).send({
    status: true,
    message: "new card added.",
    result: nftGalleryData,
  });
  
}catch(error){
  errorLogging("addRewardNFT", "ERROR", error);
    res.status(500).send({
      status: false,
      message: "Something went wrong in server",
      result: error,
    });
}
}
// get all cards from nftGallary
export const getAllCardsOfNftGallery = async (req: any, res: any) => {
  try {
    const nftGalleryData = await getAllNftGallery();
    const cards: any = [];
    nftGalleryData.forEach((albumDetails: any) => {
      albumDetails.setDetails.forEach((setDetail: any) => {
        setDetail.cardsDetails.forEach((cardDetail: any) => {
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
