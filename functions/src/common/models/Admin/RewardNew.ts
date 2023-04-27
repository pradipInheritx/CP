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
            .collection("nft_gallery")
            .where("albumName", "==", albumName)
            .get();

        if (checkAlbums && checkAlbums.docs && checkAlbums.docs.length) {
            return res.status(409).send({
                status: false,
                message: `This album id already exists: ${albumName}`,
                result: null,
            });
        }

        const addQuery = await firestore().collection("nft_gallery").add(newAlbum)

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
            .collection("nft_gallery")
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
export const createCard = async (req: any, res: any) => {
    try {
        const { albumId, setId, cardName, cardStatus, cardType, noOfCardHolder, totalQuantity, cardImage } = req.body;

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

const fetchAllSet = async (getAlbumDoc: any) => {
    return new Promise((resolve, reject) => {
        let test: any = [];
        getAlbumDoc.map(async (data: any) => {
            const setAry: any = []
            const cardAry: any = []


            const getSetQuery = await firestore()
                .collection("nft_gallery")
                .doc(data.id)
                .collection("setDetails")
                .get()


            getSetQuery.docs.forEach(async (snapshot) => {
                
                const getCardsQuery = await firestore()
                .collection("cardsDetails")
                .where("setId", "==", snapshot.id)
                .get();
                getCardsQuery.forEach((card) => {
                    // console.log("snapshot>>>>>>>>>>", card.data())
                    cardAry.push(card.data())
                })
                setAry.push({...snapshot.data(),cardDetails:cardAry})
            })
            test.push({ ...data.data(), setDetails: setAry})
            // console.log("getCardsData ........", getCardsData)
            resolve(test);
        })

    })
}


// const fetchAllData = async (getAlbumDoc: any) => {
//     return new Promise((resolve, reject) => {
//         let test: any = [];
//         getAlbumDoc.map(async (data: any) => {
//             const setAry: any = []
//             const cardAry: any = []


//             const getSetQuery = await firestore()
//                 .collection("nft_gallery")
//                 .doc(data.id)
//                 .collection("setDetails")
//                 .get()
//             getSetQuery.docs.forEach((snapshot) => {
//                 setAry.push(snapshot.data())
//             })



//             const getCardsQuery = await firestore()
//                 .collection("cardsDetails")
//                 .where("albumId", "==", data.id)
//                 .get();
//             // const getCardsDoc: any = getCardsQuery.docs;

//             getCardsQuery.forEach((card) => {
//                 // console.log("snapshot>>>>>>>>>>", card.data())
//                 cardAry.push(card.data())

//             })
//             test.push({ ...data.data(), setDetails: setAry, cardDetails: cardAry })
//             // console.log("getCardsData ........", getCardsData)
//             resolve(test);
//         })
//     }
//     )
//     // return test
// }

export const getAllAlbums = async (req: any, res: any) => {
    try {

        let test: any = [];
        const getAlbumQuery = await firestore().collection("nft_gallery").get();
        const getAlbumDoc = getAlbumQuery.docs;



        test = await fetchAllSet(getAlbumDoc)
        console.log("TEST >>>>>>>>>", test)


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
export const errorLogging = async (
    funcName: string,
    type: string,
    error: any
) => {
    console.info(funcName, type, error);
};
