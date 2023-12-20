import { firestore } from "firebase-admin";
const foundationConst: any = {}

const getFoundationById = async (foundationId: string, res: any) => {
    try {
        const data = (await firestore().collection('foundations').doc(foundationId).get()).data();
        if (!data) {
            res.status(404).send({
                status: false,
                message: foundationConst.FOUNDATION_NOT_FOUND,
            });
        }
        console.log("getFoundationById : ", data)
        return data;
    } catch (error) {
        errorLogging("paymentStatusOnTransaction", "ERROR", error);
        res.status(500).send({
            status: false,
            message: foundationConst.MESSAGE_SOMETHINGS_WRONG,
            result: error,
        });
    }
}
function getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
}
export const getRandomFoundationForUserLogin = async () => {
    try {
        const foundationList = (await firestore().collection('foundations').get()).docs.map((foundation) => foundation.data());
        console.log("foundationList : ", foundationList)
        if (!foundationList) {
            console.error("getRandomFoundationForUserLogin Error", foundationConst.FOUNDATION_NOT_FOUND);
            return foundationConst.FOUNDATION_NOT_FOUND
        }
        foundationList.sort((foundation_1, foundation_2) => {
            return foundation_1.createdAt - foundation_2.createdAt;
        });
        const getRandomValue = getRandomArbitrary(0, foundationList.length);
        console.log("selected Foundation Name : ", foundationList[getRandomValue])
        return foundationList[getRandomValue];
    } catch (error) {
        errorLogging("getRandomFoundationForUserLogin", "ERROR", error);
        console.error("getRandomFoundationForUserLogin Error", foundationConst.SOMETHING_WRONG);
        return foundationConst.SOMETHING_WRONG
    }
}
export const createFoundation = async (req: any, res: any) => {
    try {
        const {
            name,
        } = req.body;

        const addNewFoundation = await firestore().collection('foundations').add({ name, commission: 0, createdAt: Date.now() });
        await firestore().collection('foundations').doc(addNewFoundation.id).set({ id: addNewFoundation.id });
        const result = await getFoundationById(addNewFoundation.id, res)
        res.status(201).send({
            status: true,
            message: foundationConst.FOUNDATION_CREATE_SUCCESS,
            result
        });
    } catch (error) {
        errorLogging("paymentStatusOnTransaction", "ERROR", error);
        res.status(500).send({
            status: false,
            message: foundationConst.MESSAGE_SOMETHINGS_WRONG,
            result: error,
        });
    }
}
export const getFoundation = async (req: any, res: any) => {
    try {
        const {
            foundationId,
        } = req.body;
        const result = await getFoundationById(foundationId, res)
        res.status(200).send({
            status: true,
            message: foundationConst.GET_FOUNDATION_SUCCESS,
            result
        });
    } catch (error) {
        errorLogging("paymentStatusOnTransaction", "ERROR", error);
        res.status(500).send({
            status: false,
            message: foundationConst.MESSAGE_SOMETHINGS_WRONG,
            result: error,
        });
    }
}
export const getFoundationList = async (req: any, res: any) => {
    try {
        const foundationList = (await firestore().collection('foundations').get()).docs.map((foundation) => foundation.data());
        console.log("foundationList : ", foundationList)
        res.status(200).send({
            status: true,
            message: foundationConst,
            foundationList
        });
    } catch (error) {
        errorLogging("paymentStatusOnTransaction", "ERROR", error);
        res.status(500).send({
            status: false,
            message: foundationConst.GET_FOUNDATION_SUCCESS,
            result: error,
        });
    }
}
export const updateFoundation = async (req: any, res: any) => {
    try {
        const { foundationId } = req.params;
        const {
            name,
        } = req.body;
        await getFoundationById(foundationId, res);
        await firestore().collection('foundations').doc(foundationId).set({ name });
        const result = await getFoundationById(foundationId, res);
        res.status(200).send({
            status: true,
            message: foundationConst.UPDATE_FOUNDATION_SUCCESS,
            result
        });
    } catch (error) {
        errorLogging("paymentStatusOnTransaction", "ERROR", error);
        res.status(500).send({
            status: false,
            message: foundationConst.MESSAGE_SOMETHINGS_WRONG,
            result: error,
        });
    }
}
export const deleteFoundation = async (req: any, res: any) => {
    try {
        const { foundationId } = req.params;
        await getFoundationById(foundationId, res);
        await firestore().collection('foundations').doc(foundationId).delete().then(() => {
            res.status(200).send({
                status: true,
                message: foundationConst.FOUNDATION_DELETED_SUCCESS,
            });
        }).catch((error) => {
            res.status(400).send({
                status: false,
                message: foundationConst.FOUNDATION_DELETED_FAILED,
                result: error,
            });
        });

    } catch (error) {
        errorLogging("paymentStatusOnTransaction", "ERROR", error);
        res.status(500).send({
            status: false,
            message: foundationConst.MESSAGE_SOMETHINGS_WRONG,
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