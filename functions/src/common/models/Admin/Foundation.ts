import { firestore } from "firebase-admin";

// import { sendPaxToFoundation } from "../Reward"
import { errorLogging } from "../../helpers/commonFunction.helper";

const foundationConst: any = {}

const getFoundationById = async (foundationId: string, res: any) => {
    try {
        console.log("foundationId : ", foundationId)
        const data = (await firestore().collection('foundations').doc(foundationId).get()).data();
        console.log("getFoundationById : ", data)
        if (!data) {
            return res.status(404).send({
                status: false,
                message: foundationConst.FOUNDATION_NOT_FOUND,
            });
        }
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
// function getRandomArbitrary(min: number, max: number) {
//     return Math.random() * (max - min) + min;
// }
// export const getRandomFoundationForUserLogin = async () => {
//     try {
//         const foundationList = (await firestore().collection('foundations').get()).docs.map((foundation) => foundation.data());
//         console.log("foundationList : ", foundationList)
//         if (!foundationList) {
//             console.error("getRandomFoundationForUserLogin Error", foundationConst.FOUNDATION_NOT_FOUND);
//             return foundationConst.FOUNDATION_NOT_FOUND
//         }
//         foundationList.sort((foundation_1, foundation_2) => {
//             return foundation_1.timestamp - foundation_2.timestamp;
//         });
//         const getRandomValue = getRandomArbitrary(0, (foundationList.length-1));
//         console.log("selected Foundation Name : ", foundationList[getRandomValue])
//         return foundationList[getRandomValue].id;
//     } catch (error) {
//         errorLogging("getRandomFoundationForUserLogin", "ERROR", error);
//         console.error("getRandomFoundationForUserLogin Error", foundationConst.SOMETHING_WRONG);
//         return foundationConst.SOMETHING_WRONG
//     }
// }
export const createFoundation = async (req: any, res: any) => {
    try {
        const {
            name,
            address,
            commissionPercentage =10
        } = req.body;

        const foundationObject = {
            name,
            commission: 0,
            timestamp: Date.now(),
            address,
            maxCMP: 100,
            commissionPercentage
        }

        const addNewFoundation = await firestore().collection('foundations').add(foundationObject);
        console.log("addNewFoundation.id : ", addNewFoundation.id)
        await firestore().collection('foundations').doc(addNewFoundation.id).set({ id: addNewFoundation.id }, { merge: true });
        const result = (await firestore().collection('foundations').doc(addNewFoundation.id).get()).data();
        console.log("result: ", result)
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
        } = req.params;
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
            address,
            commissionPercentage
        } = req.body;
        const updatedData: any = {};
        if (name) {
            updatedData['name'] = name;
        };
        if (address) {
            updatedData['address'] = address;
        }
        if(commissionPercentage){
            updatedData['commissionPercentage'] = commissionPercentage;
        }
        console.log("Updated data : ", updatedData);
        await getFoundationById(foundationId, res);
        await firestore().collection('foundations').doc(foundationId).set(updatedData, { merge: true });
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

export async function sendCPMToFoundationOfUser(userId: string, cpm: number) {
    try {
        const user = (await firestore().collection('users').doc(userId).get()).data();
        console.log("user.foundationData.id : ", user?.foundationData?.id)
        const foundation = (await firestore().collection('foundations').doc(user?.foundationData?.id).get()).data();
        const foundationCommission = foundation?.commissionPercentage || 10
        const foundationCPM = (cpm *foundationCommission ) / 100;
        const commission = Number(foundation?.commission) + foundationCPM;
        console.info("commission", commission)
        // if ((commission / 100) >= 1) {
        //     // foundation Payment method here sendPaxToFoundation
        //     const getResultAfterPaxTransferToFoundation = await sendPaxToFoundation(user?.foundationData?.id)
        //     console.info("getResultAfterPaxTransferToFoundation", getResultAfterPaxTransferToFoundation)
        // } else {
        //     const getResultAfterPaxTransferToFoundation = await sendPaxToFoundation(user?.foundationData?.id)
        //     console.info("getResultAfterPaxTransferToFoundation", getResultAfterPaxTransferToFoundation)
        // }
        console.log("CMP : foundationCPM : ", cpm, foundationCPM);
        await firestore().collection('foundations').doc(user?.foundationData?.id).set({ commission: commission }, { merge: true });
        return {
            status: true,
            message: "Added PAX To Foundation"
        }
    } catch (error) {
        console.log("sendCPMToFoundation : ", error);
        errorLogging('sendCPMToFoundation', 'Error', error);
        return {
            status: false,
            message: "Added PAX To Foundation"
        }
    }
}

export const sendCPMToUserFoundation = async (req: any, res: any) => {
    try {
        const { userId, CMPComission } = req.body;
        console.info("userId", userId)
        console.info("CMPComission", CMPComission)

        const getUserCPMCommission = await sendCPMToFoundationOfUser(userId, CMPComission);
        res.status(200).send({
            status: true,
            message: `Send`,
            result: getUserCPMCommission,
        });
        console.info("getUserCPMCommission", getUserCPMCommission)
    } catch (error) {
        errorLogging("Error in user CMP comission", "ERROR", error);
        res.status(500).send({
            status: false,
            message: foundationConst.MESSAGE_SOMETHINGS_WRONG,
            result: error,
        });
    }
}
