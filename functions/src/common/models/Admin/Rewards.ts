import { firestore } from "firebase-admin";
// import * as admin from "firebase-admin";
// import { uploadImage } from "../Reward";
import { toUpper } from "lodash";
// import Busboy from "busboy";
const Busboy = require('busboy');
// import os from "os";
// import path from "path";
// import * as fs from 'fs';

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
    setId: string;
    cardName: string;
    cardType: string;
    quantity: number;
    totalQuantity: number;
    sno: string[];
    noOfCardHolder: number;
    cardStatus: boolean;
    cardImageUrl: any;
    cardVideoUrl: any;
}


// get albums details
async function getAlbumDetails(albumId: string) {
    const albumDetails = await firestore().collection("nftGallery").doc(albumId).get()
    return albumDetails.data()
}


// get sets details
async function getSetsDetails(albumId: string, setId: string) {
    const setsDetails = await firestore().collection("nftGallery").doc(albumId).collection("setDetails").doc(setId).get();
    console.log("Sets Details =============", setsDetails.data())
    return setsDetails.data()
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

        console.log("checkAlbums.albumName -----", getAlbum)
        console.log("checkSets.setName -----", getSet)
        const newCard: Card = {
            albumId,
            setId,
            cardName,
            cardType,
            quantity: totalQuantity,
            noOfCardHolder: 0,
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
                .offset((page - 1) * limit)
                .limit(limit)
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
                    cardId: doc.id,
                    cardName: doc.data()?.cardName ? doc.data()?.cardName : "",
                    cardType: doc.data()?.cardType ? doc.data()?.cardType : "",
                    quantity: doc.data()?.quantity ? doc.data()?.quantity : "",
                    totalQuantity: doc.data()?.totalQuantity ? doc.data()?.totalQuantity : "",
                    noOfCardHolder: doc.data()?.noOfCardHolder ? doc.data()?.noOfCardHolder : "",
                    cardStatus: doc.data()?.cardStatus ? doc.data()?.cardStatus : "",
                    sno: doc.data()?.sno ? doc.data()?.sno : "",
                    cardImageUrl: doc.data()?.cardImageUrl ? doc.data()?.cardImageUrl : "",
                    cardVideoUrl: doc.data()?.cardVideoUrl ? doc.data()?.cardVideoUrl : ""

                }
            }
        );

        const CollectionRef: any = await firestore().collection("cardsDetails").get();
        let totalCount = CollectionRef.size;

        res.status(200).send({
            status: true,
            message: "Cards fetched successfully",
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
        const { albumId, setId, cardName, cardType, quantity, totalQuantity, noOfCardHolder, cardStatus, cardImageUrl, cardVideoUrl } = req.body

        const getCardQuery = await firestore().collection("cardsDetails").doc(cardId).get();

        if (!getCardQuery.data()) {
            return res.status(404).send({
                status: false,
                message: `This card does not exist: ${cardId}`,
                result: null,
            });
        }
        const getAlbum: any = await getAlbumDetails(albumId);
        const getSet = getAlbum.setDetails.find((set: any) => set.id == setId)

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
                getAlbum.albumName,
                getSet.setName,
                cardType,
                totalQuantity
            ),
            cardImageUrl,
            // cardImageUrl: cardImage
            //     ? await uploadImage(cardImage, albumId, setId, "cardId")
            //     : "",
            cardVideoUrl
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

// export const uploadImageFunction = async (req: any, res: any) => {

//     // const { cardId } = req.params;
//     const busboy = Busboy({ headers: req.headers });
//     const tmpdir = os.tmpdir();

//     // This object will accumulate all the fields, keyed by their name
//     const fields: any = {};

//     // This object will accumulate all the uploaded files, keyed by their name.
//     const uploads: any = {};

//     // This code will process each non-file field in the form.
//     busboy.on('field', (fieldname: any, val: any) => {
//         /**
//          *  TODO(developer): Process submitted field values here
//          */
//         console.log(`Processed field ${fieldname}: ${val}.`);
//         fields[fieldname] = val;
//     });

//     const fileWrites: any = [];

//     // This code will process each file uploaded.
//     busboy.on('file', (fieldname: any, file: any, { filename }: any) => {
//         // Note: os.tmpdir() points to an in-memory file system on GCF
//         // Thus, any files in it must fit in the instance's memory.
//         console.log(`Processed file ${filename}`);
//         const filepath = path.join(tmpdir, filename);
//         uploads[fieldname] = filepath;

//         const writeStream = fs.createWriteStream(filepath);
//         file.pipe(writeStream);

//         // File was processed by Busboy; wait for it to be written.
//         // Note: GCF may not persist saved files across invocations.
//         // Persistent files must be kept in other locations
//         // (such as Cloud Storage buckets).
//         const promise = new Promise((resolve, reject) => {
//             file.on('end', () => {
//                 writeStream.end();
//             });
//             writeStream.on('close', resolve);
//             writeStream.on('error', reject);
//         });
//         fileWrites.push(promise);
//     });

//     // Triggered once all uploaded files are processed by Busboy.
//     // We still need to wait for the disk writes (saves) to complete.
//     busboy.on('finish', async () => {
//         await Promise.all(fileWrites);

//         /**
//          * TODO(developer): Process saved files here
//          */
//         for (const file in uploads) {
//             fs.unlinkSync(uploads[file]);
//         }
//         res.send();
//     });

//     busboy.end(req.rawBody);
// }








// get Image url and add into firestore
// const getImageUrl = async (
//     cardId: string
// ) => {
//     const ref = await admin.storage().bucket("default-bucket");
//     const [, , meta] = await ref.getFiles({
//         maxResults: 1,
//     });
//     const url = meta.items
//         .filter((f: any) => f.contentType !== "text/plain")
//         .shift().mediaLink;
//     console.log("Image Url ", url);

//     const collectionData: any = await firestore()
//         .collection("cardsDetails")
//         .doc(cardId)
//         .get();
//     console.log("collectionData--- ", collectionData.data());
//     const cardData = collectionData.data();
//     cardData.imageUpload = url;

//     await firestore()
//         .collection("cardsDetails")
//         .doc(cardId)
//         .set(cardData);
//     console.log("image url -------", url)
//     // return url;
//     // const ntfGallery = await firestore()
//     //   .collection("nft_gallery")
//     //   .doc('SWnA6wLlv9bPVRIlHKHY')

//     // // Atomically add a new region to the "regions" array field.
//     // ntfGallery.update({
//     //   regions: firestore.FieldValue.arrayUnion("greater_virginia")
//     // });
// };


export const uploadImageFunction = async (req: any, res: any) => {
    const busboy = new Busboy({ headers: req.headers });
    const formData: any = {};

    busboy.on('field', (fieldname: any, value: any) => {
        // Store the form field data in the formData object
        formData[fieldname] = value;
    });

    busboy.on('finish', () => {
        // Parsing finished, formData now contains the form data as a JSON object
        console.log('Form data:', formData);
        res.status(200).json(formData);
    });


    // const ref = await admin.storage().bucket("default-bucket");
    // console.log("File name --- ");

    // const metaData = {
    //     contentType: "Image/jpg",
    // };
    // ref
    //     .upload(cardImage, metaData)
    //     .then(() => getImageUrl(collectionId, setId, cardId))
    //     .catch((error: any) => {
    //         console.log("EROROR image", error);
    //     });
}
export const errorLogging = async (
    funcName: string,
    type: string,
    error: any
) => {
    console.info(funcName, type, error);
};
