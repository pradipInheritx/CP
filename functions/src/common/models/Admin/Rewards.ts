import { firestore } from "firebase-admin";

import { uploadImage } from "../Reward";


type Album = {
    albumName: String;
    setQunatity: number;
}
type Sets = {
    setName: string;
    sequence: number
}
type Card = {
    albumId: string;
    setId: String;
    cardName: string;
    cardType: string;
    quantity: number;
    totalQuantity: number;
    sno: string[];
    cardImage: any;
    noOfCardHolder: number;
    cardStatus: boolean;
}
export const createAlbum = async (req: any, res: any) => {
    try {
        const { albumName, setQunatity }: Album = req.body

        const newAlbum: Album = {
            albumName,
            setQunatity
        }
        const checkAlbums = await firestore()
            .collection("nftGallery")
            .where("albumName", "==", albumName)
            .get();

        if (checkAlbums && checkAlbums.docs && checkAlbums.docs.length) {
            return res.status(409).send({
                status: false,
                message: `This album id already exists: ${albumName}`,
                result: null,
            });
        }

        const addQuery = await firestore().collection("nftGallery").add(newAlbum)

        res.status(200).send({
            status: true,
            message: "New album created.",
            result: { uid: addQuery.id, ...newAlbum },
        });

    } catch (error) {
        errorLogging("addAlbum", "ERROR", error);
        res.status(500).send({
            status: false,
            message: "Something went wrong in server",
            result: error,
        });
    }
};

export const createSet = async (req: any, res: any) => {
    try {
        const { albumId, setName, sequence } = req.body

        const newSet: Sets = {
            setName,
            sequence
        };

        const addSetDetails = await firestore()
            .collection("nftGallery")
            .doc(albumId)
            .collection("setDetails")
            .add(newSet);

        res.status(200).send({
            status: true,
            message: "New album created.",
            result: { uid: addSetDetails.id, ...newSet },
        });
    } catch (error) {
        errorLogging("createSet", "ERROR", error);
        res.status(500).send({
            status: false,
            message: "Something went wrong in server",
            result: error,
        });
    }
}
// generate serial number
export const generateSerialNumber = async (
    albumId: number,
    setId: number,
    cardType: any,
    quantity: number
) => {
    console.log("albumId>>>>>>", albumId);
    const serialNumber: string[] = [];
    for (let i = 0; i < quantity; i++) {
        const card = String(albumId) + String(setId) + String(cardType) + String(i);
        serialNumber.push(card);
    }
    return serialNumber;
};


// Get all sets
const fetchAllSet = async (getAlbumDoc: any) => {
    return new Promise((resolve, reject) => {
        let test: any = [];
        getAlbumDoc.map(async (data: any) => {
            const setAry: any = []

            const getSetQuery = await firestore()
                .collection("nftGallery")
                .doc(data.id)
                .collection("setDetails")
                .get()

            getSetQuery.docs.forEach(async (snapshot) => {
                setAry.push({ ...snapshot.data(), setId: snapshot.id })
            })
            test.push({ ...data.data(), setDetails: setAry })
            resolve(test);
        })

    })
}
export const createCard = async (req: any, res: any) => {
    try {
        const { albumId, setId, cardName, cardStatus, cardType, noOfCardHolder, totalQuantity, cardImage } = req.body;

        //Check Album is exist or not
        const getAllAlbums: any = []
        let getAllSets: any = [];
        const getAlbumQuery = await firestore().collection("nftGallery").get();
        const getAlbumDoc = getAlbumQuery.docs;
        getAlbumDoc.map((album) => {
            getAllAlbums.push({ albumId: album.id, ...album.data() })
        })
        const checkAlbums: any = getAllAlbums.find((album: any) => {
            return album.albumId == albumId
        })
        if (!checkAlbums) {
            return res.status(404).send({
                status: true,
                message: `This album does not exist: ${albumId}`,
                result: null,
            });
        }

        //Check set is exist or not
        const getAllSetsQuery = await firestore().collection("nftGallery").doc(albumId).collection("setDetails").get();
        getAllSetsQuery.docs.map((set: any) => {
            getAllSets.push({ setId: set.id, ...set.data() })
        })
        const checkSets: any = getAllSets.find((set: any) => {
            return set.setId == setId
        })
        if (!checkSets) {
            return res.status(404).send({
                status: true,
                message: `This album does not exist: ${setId}`,
                result: null,
            });
        }
        const newCard: Card = {
            albumId,
            setId,
            cardName,
            cardType,
            quantity: totalQuantity,
            totalQuantity,
            noOfCardHolder,
            cardStatus,
            sno: await generateSerialNumber(
                albumId,
                setId,
                cardType,
                totalQuantity
            ),
            cardImage: cardImage
                ? await uploadImage(cardImage, albumId, setId, "cardId")
                : "",
        }


        const addQuery = await firestore().collection("cardsDetails").add(newCard);

        res.status(200).send({
            status: true,
            message: "New album created.",
            result: { uid: addQuery.id, ...newCard },
        });
    } catch (error) {
        errorLogging("createCard", "ERROR", error);
        res.status(500).send({
            status: false,
            message: "Something went wrong in server",
            result: error,
        });
    }
}

export const getAllAlbums = async (req: any, res: any) => {
    try {

        let getAllSets: any = [];
        const getAlbumQuery = await firestore().collection("nftGallery").get();
        const getAlbumDoc = getAlbumQuery.docs;

        getAllSets = await fetchAllSet(getAlbumDoc)

        const cards: any = [];
        const getAllCards = await firestore().collection("cardsDetails").get();
        getAllCards.docs.forEach((snapshot) => {
            cards.push(snapshot.data())
        })

        getAllSets.forEach((data: any) => {
            data.setDetails.forEach((sets: any) => {
                let matchedCards = cards.filter((data: any) => {
                    return sets.setId == data.setId
                })
                sets.cardsDeatils = matchedCards;
            });

        });
        res.status(200).send({
            status: true,
            message: "get all Albums from gallery.",
            result: test,
        });
    } catch (error) {
        errorLogging("getAllAlbums", "ERROR", error);
        res.status(500).send({
            message: "Something went wrong in server",
            result: error,
        });
    }
}

export const getAllCards = async (req: any, res: any) => {
    try {

        const getCardsData: any = [];
        const getQuery = await firestore().collection("cardsDetails").get();
        getQuery.docs.forEach((cards: any) => {
            getCardsData.push(cards.data())
        });

        res.status(200).send({
            status: true,
            message: "get all cards from gallery.",
            result: getCardsData,
        });
    } catch (error) {
        errorLogging("getAllCards", "ERROR", error);
        res.status(500).send({
            status: false,
            message: "Something went wrong in server",
            result: error,
        });
    }
}


export const getAlbumListing = async (req: any, res: any) => {

    try {
        let { page = 1, limit = 5, orderBy = "albumName", sort = "desc", search = "" } = req.query;
        limit = parseInt(limit);

        let orderByConsolidate = "";// await getOrderByForUserStatistics(orderBy);
        switch (orderBy) {
            case "albumName":
                orderByConsolidate = "albumName";
                break;

            case "cardType":
                orderByConsolidate = "cardType";
                break;

            case "cardName":
                orderByConsolidate = "cardName";
                break;

            case "cardStatus":
                orderByConsolidate = "cardStatus";
                break;

            default:
                orderByConsolidate = "albumName";
                break;
        }

        let getAllAlbumsData: any;
        let collectionName: string = "cardsDetails";
        if (orderByConsolidate == "albumName") collectionName = "nftGallery"
        if (search) {
            getAllAlbumsData = await firestore()
                .collection(collectionName)
                .where(orderByConsolidate, ">=", search)
                .where(orderByConsolidate, "<=", search + "\uf8ff")
                .offset((page - 1) * limit)
                .limit(limit)
                .get();
        } else {
            getAllAlbumsData = await firestore()
                .collection(collectionName)
                .orderBy(orderByConsolidate, sort)
                .offset((page - 1) * limit)
                .limit(limit)
                .get();
        }
        let getNFTResponse: any = "";

        if (collectionName == "nftGallery") {
            getNFTResponse = getAllAlbumsData.docs.map(
                (doc: any) => ({
                    albumId: doc.id,
                    albumName: doc.data()?.albumName ? doc.data()?.albumName : "",
                    setQuantity: doc.data()?.setQuantity ? doc.data()?.setQuantity : "",
                })
            );
        }
        else {
            getNFTResponse = getAllAlbumsData.docs.map(
                (doc: any) => {
                    return {
                        albumId: doc.data()?.albumId ? doc.data()?.albumId : "",
                        setId: doc.data()?.setId ? doc.data()?.setId : "",
                        cardId: doc.id,
                        cardName: doc.data()?.cardName ? doc.data()?.cardName : "",
                        cardType: doc.data()?.cardType ? doc.data()?.cardType : "",
                        quantity: doc.data()?.quantity ? doc.data()?.quantity : "",
                        totalQuantity: doc.data()?.totalQuantity ? doc.data()?.totalQuantity : "",
                        noOfCardHolder: doc.data()?.noOfCardHolder ? doc.data()?.noOfCardHolder : "",
                        cardStatus: doc.data()?.cardStatus ? doc.data()?.cardStatus : "",
                        sno: doc.data()?.sno ? doc.data()?.sno : "",
                        cardImage: doc.data()?.cardImage ? doc.data()?.cardImage : "",
                    }
                }
            );

        }

        const CollectionRef = await firestore().collection(collectionName).get();
        let totalCount = CollectionRef.size;

        res.status(200).send({
            status: true,
            message: "Data fetched successfully",
            result: { data: getNFTResponse, totalCount },
        });
    } catch (error) {
        errorLogging("getAlbumListing", "ERROR", error);
        res.status(500).send({
            status: false,
            message: "Something went wrong in server",
            result: error,
        });
    }
}



export const errorLogging = async (
    funcName: string,
    type: string,
    error: any
) => {
    console.info(funcName, type, error);
};
