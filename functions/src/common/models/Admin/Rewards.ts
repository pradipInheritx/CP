import { firestore } from "firebase-admin";
import * as admin from "firebase-admin";
import { toUpper } from "lodash";
import "../../../index"
interface Sets {
    setName: string;
    sequence: string
}
interface Album {
    albumName: string;
    albumImageUrl: string;
    albumVideoUrl: string;
    setQunatity: number;
}

type Card = {
    albumId: string;
    setId: string;
    albumName: string;
    setName: string;
    cardName: string;
    cardType: string;
    quantity: number;
    totalQuantity: number;
    sno: string[];
    noOfCardHolders: number;
    cardStatus: boolean;
    cardImageUrl: any;
    cardVideoUrl: any;
}


// get albums details
export async function getAlbumDetails(albumId: string) {
    const albumDetails = await firestore().collection("nftGallery").doc(albumId).get()
    return albumDetails.data()
}


// get sets details
export async function getSetsDetails(albumId: string, setId: string) {
    const setsDetails = await firestore().collection("nftGallery").doc(albumId).collection("setDetails").doc(setId).get();
    return setsDetails.data()
}


export async function getCardDetails(cardId: string) {
    const albumDetails = await firestore().collection("cardsDetails").doc(cardId).get()
    return albumDetails.data()
}

// generate serial number string for cards
const generateSerialNumber = async (
    albumName: string,
    setName: string,
    cardType: string,
    quantity: number
) => {

    const serialNumber: string[] = [];
    for (let i = 0; i < quantity; i++) {
        let num = i < 10 ? "0" + i : i;

        const card = toUpper(albumName.slice(0, 2)) + toUpper(setName.slice(0, 2)) + toUpper(cardType.slice(0, 2)) + String(num);
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
                setAry.push({ ...snapshot.data(), albumId: data.id, setId: snapshot.id })
            })
            Sets.push({ ...data.data(), albumId: data.id, setDetails: setAry })
            resolve(Sets);
        })

    })
}

export const createAlbum = async (req: any, res: any) => {
    try {
        const { albumName, setQunatity, setDetails, albumImageUrl, albumVideoUrl } = req.body

        const newAlbum: Album = {
            albumName,
            setQunatity,
            // setDetails,
            albumImageUrl,
            albumVideoUrl
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

        const addedSets: any = [];

        for (const set of newSets) {
            const addSetQuery = await firestore().collection("nftGallery").doc(addAlbumQuery.id).collection("setDetails").add(set)
            addedSets.push({ setId: addSetQuery.id, ...set });
        }

        res.status(200).send({
            status: true,
            message: "New album created",
            result: { albumId: addAlbumQuery.id, ...newAlbum, setDetails: addedSets },
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


export const createCard = async (req: any, res: any) => {
    try {
        const { albumId, setId, cardName, cardStatus, cardType, totalQuantity, cardImageUrl, cardVideoUrl } = req.body;

        //Check Album is exist or not
        const getAlbum = await getAlbumDetails(albumId);
        if (!getAlbum) {
            return res.status(404).send({
                status: true,
                message: `This album does not exist: ${albumId}`,
                result: null,
            });
        }

        //Check set is exist or not
        const getSet: any = await getSetsDetails(albumId, setId);
        if (!getSet) {
            return res.status(404).send({
                status: true,
                message: `This album does not exist: ${setId}`,
                result: null,
            });
        }

        const newCard: Card = {
            albumId,
            setId,
            albumName: getAlbum.albumName,
            setName: getSet.setName,
            cardName,
            cardType,
            quantity: totalQuantity,
            noOfCardHolders: 0,
            totalQuantity,
            cardStatus,
            sno: await generateSerialNumber(
                getAlbum.albumName,
                getSet.setName,
                cardType,
                totalQuantity
            ),
            cardImageUrl,
            cardVideoUrl,
        }

        const addQuery = await firestore().collection("cardsDetails").add(newCard);

        res.status(200).send({
            status: true,
            message: "New album created.",
            result: { cardId: addQuery.id, ...newCard },
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

export const getCardListing = async (req: any, res: any) => {

    try {
        let { page = 1, limit = 5, orderBy = "cardName", sort = "desc", search = "" } = req.query;
        limit = parseInt(limit);

        // const getAlbumIdQuery = await firestore().collection('nftGallery').where("albumName", "==",)

        let orderByConsolidate = "";// await getOrderByForUserStatistics(orderBy);
        switch (orderBy) {
            case "albumId":
                orderByConsolidate = "albumId";
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
                orderByConsolidate = "cardName";
                break;
        }

        let getAllAlbumsData: any;
        if (search) {
            getAllAlbumsData = await firestore()
                .collection("cardsDetails")
                .where(orderByConsolidate, ">=", search)
                .where(orderByConsolidate, "<=", search + "\uf8ff")
                .get();
        } else {
            getAllAlbumsData = await firestore()
                .collection("cardsDetails")
                .orderBy(orderByConsolidate, sort)
                .offset((page - 1) * limit)
                .limit(limit)
                .get();
        }
        let getNFTResponse: any = "";

        getNFTResponse = getAllAlbumsData.docs.map(
            (doc: any) => {
                return {
                    albumId: doc.data()?.albumId ? doc.data()?.albumId : "",
                    setId: doc.data()?.setId ? doc.data()?.setId : "",
                    albumName: doc.data()?.albumName ? doc.data()?.albumName : "",
                    setName: doc.data()?.setName ? doc.data()?.setName : "",
                    cardId: doc.id,
                    cardName: doc.data()?.cardName ? doc.data()?.cardName : "",
                    cardType: doc.data()?.cardType ? doc.data()?.cardType : "",
                    quantity: doc.data()?.quantity ? doc.data()?.quantity : "",
                    totalQuantity: doc.data()?.totalQuantity ? doc.data()?.totalQuantity : "",
                    noOfCardHolders: doc.data()?.noOfCardHolders ? doc.data()?.noOfCardHolders : "",
                    cardStatus: doc.data()?.cardStatus ? doc.data()?.cardStatus : "",
                    sno: doc.data()?.sno ? doc.data()?.sno : "",
                    cardImageUrl: doc.data()?.cardImageUrl ? doc.data()?.cardImageUrl : "",
                    cardVideoUrl: doc.data()?.cardVideoUrl ? doc.data()?.cardVideoUrl : ""

                }
            }
        );


        const getTotalDataQuery = await admin.firestore().collection('cardsDetails').get();
        const getTotal = getTotalDataQuery.docs.length
        console.log("Total data--", getTotal)


        console.log("getNFTResponse----------", getNFTResponse)
        res.status(200).send({
            status: true,
            message: "Cards fetched successfully",
            result: { data: getNFTResponse, total: getTotal },
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
        const { albumName, setQunatity, setDetails, albumImageUrl, albumVideoUrl } = req.body

        const updatedAlbum: Album = {
            albumName,
            setQunatity,
            // setDetails,
            albumImageUrl,
            albumVideoUrl
        }
        // const updatedSets: Sets[] = setDetails

        const checkAlbums = await firestore()
            .collection("nftGallery")
            .doc(albumId)
            .get();
        console.log("check album --", checkAlbums.data())
        if (!checkAlbums.data()) {
            return res.status(404).send({
                status: false,
                message: `This album id is not found: ${albumId}`,
                result: null,
            });
        }

        //update Album query
        await firestore().collection("nftGallery").doc(albumId).set(updatedAlbum, { merge: true });

        const getSetDeatils: any = [];
        let sets: any = "";
        for (sets of setDetails) {
            const newSet = { setName: sets.setName, sequence: sets.sequence }
            if (sets.setId == "" || !sets.setId) {
                const query = await firestore().collection("nftGallery").doc(albumId).collection("setDetails").add(newSet)
                getSetDeatils.push({ setId: query.id, ...newSet })
            } else {
                await firestore().collection("nftGallery").doc(albumId).collection("setDetails").doc(sets.setId).set(newSet, { merge: true });
                getSetDeatils.push(sets)
            }
        }

        res.status(200).send({
            status: true,
            message: "The album has been update successfully",
            result: { albumId, ...updatedAlbum, setDetails: getSetDeatils },
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
        const { albumId, setId, cardName, cardType, quantity, totalQuantity, noOfCardHolders, cardStatus, cardImageUrl, cardVideoUrl } = req.body

        const getCardQuery = await firestore().collection("cardsDetails").doc(cardId).get();
        const getAlbum: any = await getAlbumDetails(albumId);
        const getSetQuery = await firestore().collection('nftGallery').doc(albumId).collection('setDetails').doc(setId).get();
        const getSet: any = getSetQuery.data();
        console.log("get set -----", getSet);

        if (!getCardQuery.data()) {
            return res.status(404).send({
                status: false,
                message: `This card does not exist: ${cardId}`,
                result: null,
            });
        }
        if (!getAlbum) {
            return res.status(404).send({
                status: false,
                message: `This album does not exist: ${albumId}`,
                result: null,
            });
        }
        if (!getSet) {
            return res.status(404).send({
                status: false,
                message: `This set does not exist: ${setId}`,
                result: null,
            });
        }


        const updatedCard: Card = {
            albumId,
            setId,
            albumName: getAlbum?.albumName,
            setName: getSet?.setName,
            cardName,
            cardType,
            quantity,
            totalQuantity,
            noOfCardHolders,
            cardStatus,
            sno: await generateSerialNumber(
                getAlbum.albumName,
                getSet.setName,
                cardType,
                totalQuantity
            ),
            cardImageUrl,
            cardVideoUrl
        }

        //update card query
        await firestore().collection("cardsDetails").doc(cardId).set(updatedCard, { merge: true });

        res.status(200).send({
            status: true,
            message: `${cardId} card has been update successfully`,
            result: { cardId, ...updatedCard },
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

        const checkAlbum = await getAlbumDetails(albumId);
        if (checkAlbum) return res.status(404).send({
            status: false,
            message: `This album does not exist: ${albumId}`,
            result: null,
        });
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

        const checkAlbum = await getAlbumDetails(albumId);
        if (checkAlbum) return res.status(404).send({
            status: false,
            message: `This album does not exist: ${albumId}`,
            result: null,
        });
        const checkSets = await getSetsDetails(albumId, setId);
        if (checkSets) return res.status(404).send({
            status: false,
            message: `This set does not exist: ${setId}`,
            result: null,
        });



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

        const checkCard = await getCardDetails(cardId);
        if (checkCard) return res.status(404).send({
            status: false,
            message: `This card does not exist: ${cardId}`,
            result: null,
        });

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

export const updateFileLink = async (forModule: string, fileType: string, id: string, url: string): Promise<any> => {
    console.log("Updating file")
    if (forModule.toUpperCase() == "CARD") {
        let getCard: any = await getCardDetails(id);

        const getCardDetailsQuery = firestore().collection("cardsDetails").doc(id)
        if (fileType == 'video') {
            getCard.cardVideoUrl = url
            await getCardDetailsQuery.set(getCard)
            return (await getCardDetailsQuery.get()).data();
        } else {
            getCard.cardImageUrl = url
            await getCardDetailsQuery.set(getCard);
            return (await getCardDetailsQuery.get()).data();
        }
    } else {
        let getCard: any = await getAlbumDetails(id);
        const getAlbumDetailsQuery = firestore().collection("nftGallery").doc(id)
        if (fileType == 'video') {
            getCard.albumVideoUrl = url
            await getAlbumDetailsQuery.set(getCard)
            return (await getAlbumDetailsQuery.get()).data();
        } else {
            getCard.albumImageUrl = url
            await getAlbumDetailsQuery.set(getCard);
            return (await getAlbumDetailsQuery.get()).data();
        }
    }
}

export const errorLogging = async (
    funcName: string,
    type: string,
    error: any
) => {
    console.info(funcName, type, error);
};
