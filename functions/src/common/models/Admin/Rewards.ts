import { firestore } from "firebase-admin";
const { v4: uuidv4 } = require("uuid");
import { getAllNftGallery, uploadImage } from "../Reward";

type AlbumNft = {
    collectionId: number,
    collectionName: string,
    setQuantity: number
    setDetails: object[]
}

type SetNft = {
    setId: number,
    setName: string,
    cardsDetails: object[]
}

type NewCardNft = {
    name: string,
    type: string,
    quantity: number,
    totalQuantity: number,
    sno: string[],
    cardImage: any,
    noOfCardHolder: number,
    cardStatus: boolean
}

// generate serial number
export const generateSerialNumber = async (collectionId: number, setId: number, cardType: any, quantity: number) => {
    let serialNumber: string[] = []
    for (let i = 0; i < quantity; i++) {
        let card = String(collectionId) + String(setId) + String(cardType) + String(i);
        serialNumber.push(card);
    }
    return serialNumber
}

// Add Album in nft_gallery
export const addAlbumNft = async (collectionId: any, albumName: string, setQuantity: number) => {
    try {

        let collectionData: AlbumNft = {
            collectionId,
            collectionName: albumName,
            setQuantity: setQuantity,
            setDetails: []
        }

        await firestore()
            .collection("nft_gallery")
            .doc()
            .set(collectionData)
            .then((data) => console.log("DATA from addAlbumNft >>>", data))
            .catch((error) => console.log("Error from addAlbumNft >>>", error));

    } catch (error) {
        console.log("addAlbumNft Error >>>>>>", error)
    }
}

// add set NFT 
export const addSetNft = async (collectionId: string, setId: number, setName: string) => {
    try {

        let setData: SetNft = {
            setId: setId,
            setName: setName,
            cardsDetails: []
        }

        const getCollectionRef = await firestore()
            .collection("nft_gallery")
            .doc(collectionId)
            .get();

        const collectionData: any = getCollectionRef.data();
        collectionData.setDetails.push(setData);
        console.log("Collection Data >>>", collectionData, setData);

        await firestore()
            .collection("nft_gallery")
            .doc(collectionId)
            .update(collectionData)
            .then((data) => console.log("DATA from addSetNft >>>", data))
            .catch((error) => console.log("Error from addSetNft >>>", error));

    } catch (error) {
        console.log("addAlbumNft Error >>>>>>", error)
    }
}

// add new NFT card
export const addRewardNFT = async (cardDetail: any) => {
    try {
        const { collectionId, setId } = cardDetail;
        const id = uuidv4();
        const newCardNft: NewCardNft = {
            name: cardDetail.name,
            type: cardDetail.type,
            quantity: cardDetail.quantity,
            totalQuantity: cardDetail.totalQuantity,
            sno: await generateSerialNumber(collectionId, setId, cardDetail.type, cardDetail.quantity),
            cardImage: cardDetail.image ? await uploadImage(cardDetail.image, collectionId, setId, id) : "",
            noOfCardHolder: cardDetail.noOfCardHolder || 0,
            cardStatus: cardDetail.status
        };

        const getCollectionRef = await firestore()
            .collection('nft_gallery')
            .doc(collectionId)
            .get();

        let collectionDetails = getCollectionRef.data();
        console.log("collectionDeatils >>>>>", collectionDetails?.setDetails)
        const setDetails = collectionDetails?.setDetails.find((data: any) => {
            console.log("data.id, setId", data.id, setId)
            return data.id == setId
        })
        // let setDeatils = collectionDetails?.setDeatils;

        console.log("setDeatils >>>>>", setDetails)
        setDetails.cards.push(newCardNft)

        await firestore()
            .collection('nft_gallery')
            .doc(collectionId)
            .set({ setDetails })

        console.log("addRewardNFT DONE >>>>>>>>", newCardNft)
    } catch (error) {
        console.log("addRewardNFT ERROR >>>>>", error)
    }
};


// get all cards from nft_gallary
export const getAllCardsOfNftGallery = async () => {
    console.log("LOST THE WORLD ");
    const nftGalleryData = await getAllNftGallery();
    console.log("NFT GALLERY DATA >>>>", nftGalleryData);
    const cards: any = [];
    nftGalleryData.forEach((albumDetails: any) => {
        console.log("albumDetails =>", albumDetails);
        albumDetails.setDetails.forEach((setDetail: any) => {
            console.log("SetDeatils =>", setDetail);
            setDetail.cards.forEach((cardDetail: any) => {
                console.log("cardDetail =>", cardDetail);

                cards.push({
                    collectionId: albumDetails.collectionId,
                    collectionName: albumDetails.collectionName,
                    collectionDocId: albumDetails.id,
                    setId: setDetail.id,
                    ...cardDetail
                });
            });
        });
    });
    console.log("get all cards list >>>>>>>>>", cards);
    return cards;
}

