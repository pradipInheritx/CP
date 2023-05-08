import { firestore } from "firebase-admin";
import { uploadImage } from "../Reward";

interface Sets {
    setName: string;
    sequence: string
}
interface Album {
    albumName: string;
    imageUrl: string;
    videoUrl: string;
    setQunatity: number;
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
        const { albumName, setQunatity, setDetails, imageUrl, videoUrl } = req.body

        const newAlbum: Album = {
            albumName,
            setQunatity,
            // setDetails,
            imageUrl,
            videoUrl
        }
        const newSets: Sets[] = setDetails

        const checkAlbums = await firestore()
            .collection("nftGallery")
            .where("albumName", "==", albumName)
            .get();

        if (checkAlbums && checkAlbums.docs && checkAlbums.docs.length) {
            return res.status(409).send({
                status: false,
                message: `This album name already exists: ${albumName}`,
                result: null,
            });
        }

        if (setDetails.length != setQunatity) {
            return res.status(400).send({
                status: true,
                message: "Please,match set's quantity according to album's sets quantity",
                result: null,
            });
        }
        const addAlbumQuery = await firestore().collection("nftGallery").add(newAlbum)

        newSets.forEach(async (set: Sets) => {
            await firestore().collection("nftGallery").doc(addAlbumQuery.id).collection("setDetails").add(set)
        })
        res.status(200).send({
            status: true,
            message: "New album created",
            result: { albumId: addAlbumQuery.id, ...newAlbum, setDetails: newSets },
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
        let Sets: any = [];
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
            Sets.push({ ...data.data(), setDetails: setAry })
            resolve(test);
        })

    })
}
// generate serial number

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
            result: getAllSets,
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

export const updateAlbums = async (req: any, res: any) => {
    try {
        const { albumId } = req.params
        const { albumName, setQunatity, setDetails, imageUrl, videoUrl } = req.body

        const updatedAlbum: Album = {
            albumName,
            setQunatity,
            // setDetails,
            imageUrl,
            videoUrl
        }
        const updatedSets: Sets[] = setDetails


        console.log("UpdateAlbums -------------", updatedAlbum)
        console.log("UpdateAlbums -------------", setDetails)

        const checkAlbums = await firestore()
            .collection("nftGallery")
            .doc(albumId)
            .get();

        if (!checkAlbums.data()) {
            return res.status(404).send({
                status: false,
                message: `This album name is not found: ${albumName}`,
                result: null,
            });
        }

        //update Album query
        await firestore().collection("nftGallery").doc(albumId).set(updatedAlbum, { merge: true });

        setDetails.forEach(async (sets: any) => {
            const newSet = { setName: sets.setName, sequence: sets.sequence }
            if (sets.setId == "" || !sets.setId) {
                await firestore().collection("nftGallery").doc(albumId).collection("setDetails").add(newSet)
            }
            await firestore().collection("nftGallery").doc(albumId).collection("setDetails").doc(sets.setId).set(newSet, { merge: true });
        })

        res.status(200).send({
            status: true,
            message: "The album has been update successfully",
            result: { ...updatedAlbum, setDetails: updatedSets },
        });
    } catch (error) {
        errorLogging("updateAlbums", "ERROR", error);
        res.status(500).send({
            status: false,
            message: "Something went wrong in updateAlbums",
            result: error,
        });
    }
}

export const updateCard = async (req: any, res: any) => {
    try {

        const { cardId } = req.params
        const { albumId, setId, cardName, cardType, quantity, totalQuantity, noOfCardHolder, cardStatus, cardImage } = req.body

        const getCardQuery = await firestore().collection("cardsDetails").doc(cardId).get();

        if (!getCardQuery.data()) {
            return res.status(404).send({
                status: false,
                message: `This card does not exist: ${cardId}`,
                result: null,
            });
        }

        const updatedCard: Card = {
            albumId,
            setId,
            cardName,
            cardType,
            quantity,
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

        //update card query
        await firestore().collection("cardsDetails").doc(cardId).update(updatedCard)

        res.status(200).send({
            status: true,
            message: `${cardId} card has been update successfully`,
            result: updatedCard,
        });
    } catch (error) {
        errorLogging("updateCard", "ERROR", error);
        res.status(500).send({
            status: false,
            message: "Something went wrong in updateCard",
            result: error,
        });

    }
}

export const deleteAlbum = async (req: any, res: any) => {
    try {
        const { albumId } = req.params
        const setsArray: any = []
        const getAllSetsQuery = await firestore().collection("nftGallery").doc(albumId).collection("setDetails").get();
        getAllSetsQuery.docs.map((sets: any) => {
            setsArray.push({ ...sets.data(), setId: sets.id });
        })

        setsArray.forEach(async (sets: any) => {
            await firestore().collection("nftGallery").doc(albumId).collection("setDetails").doc(sets.setId).delete();
        })
        await firestore().collection("nftGallery").doc(albumId).delete();

        res.status(200).send({
            status: true,
            message: `${albumId} is delete successfully`,
            result: true,
        });

    } catch (error) {
        errorLogging("deleteAlbum", "ERROR", error);
        res.status(500).send({
            status: false,
            message: "Something went wrong in deleteAlbum",
            result: error,
        });
    }
}

export const deleteSet = async (req: any, res: any) => {
    try {
        const { albumId, setId } = req.body

        await firestore().collection("nftGallery").doc(albumId).collection("setDetails").doc(setId).delete();

        res.status(200).send({
            status: true,
            message: `This set id ${setId}  is delete successfully`,
            result: true,
        });

    } catch (error) {
        errorLogging("deleteAlbum", "ERROR", error);
        res.status(500).send({
            status: false,
            message: "Something went wrong in deleteAlbum",
            result: error,
        });
    }
}

export const deleteCard = async (req: any, res: any) => {
    try {
        const { cardId } = req.params

        await firestore().collection("cardsDetails").doc(cardId).delete();

        res.status(200).send({
            status: true,
            message: `${cardId} card has been deleted successfully`,
            result: true,
        });

    } catch (error) {
        errorLogging("deleteAlbum", "ERROR", error);
        res.status(500).send({
            status: false,
            message: "Something went wrong in deleteAlbum",
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
