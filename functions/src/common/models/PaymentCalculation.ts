import axios from "axios";
import { firestore } from "firebase-admin";
import { log } from "firebase-functions/logger";
import * as parentConst from "../consts/payment.const.json";
//import { log } from "firebase-functions/logger";

interface PaymentParams {
    "amount": number,
    "network": string,
    "origincurrency": string,
    "token": string
}
interface PaymentBody {
    method: string,
    params: PaymentParams,
    user: string
}

interface SmartContractBody {
    amount: number, address: string, network: string
}
export const paymentFunction = async (transactionBody: PaymentBody): Promise<{
    status: boolean,
    result: any
} | undefined> => {
    try {
        console.info("transactionBody", transactionBody);
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjowLCJvcmdfaWQiOjEzLCJpc3MiOiJXRUxMREFQUCIsInN1YiI6InZvdGV0b2Vhcm4iLCJhdWQiOlsiR1JPVVBTIiwiQVBQTElDQVRJT05TIiwiQVVUSCIsIldFQjMiXSwiZXhwIjoyMDIyNTkwODI1fQ.0JYa8ZLdfdtC78-DJSy91m3KqTPX9PrGMAD0rtma0_M'
            }
        }; // This token is from Yaniv Account Side

        const transaction = await axios.post('https://console.dev.welldapp.io/api/transactions', transactionBody, options);

        console.info('payment transaction : ', transaction.data);

        return { status: true, result: transaction.data }
    } catch (error) {
        console.error("ERROR paymentFunction : ", error);
        return { status: false, result: error }
    }
}
export const callSmartContractPaymentFunction = async (transactionBody: SmartContractBody): Promise<{
    status: boolean,
    result: any
} | undefined> => {
    try {
        console.log("Start smart contract payment function");
        console.log("transactionBody : ", transactionBody);
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjowLCJvcmdfaWQiOjEzLCJpc3MiOiJXRUxMREFQUCIsInN1YiI6Im1hbmFnZS52MmUiLCJhdWQiOlsiR1JPVVBTIiwiQVBQTElDQVRJT05TIiwiQVVUSCIsIldFQjMiXSwiZXhwIjoyMDIyNTkwODI1fQ.ae0mlVsGYN6cURolHv0veNaKtBIBsFokWgbLyvMd_OE'
            }
        };
        let transactionBodyForSmartContract = {
            "abi": parentConst.SMART_CONTRACT_ABI_ARRAY,
            "address": parentConst.SMART_CONTRACT_ADMIN_ADRESS,
            "gas_limit": parentConst.SMART_CONTRACT_GAS_LIMIT,
            "method": parentConst.SMART_CONTRACT_METHOD,
            "network": transactionBody.network,
            "params": [
                {
                    "_to": transactionBody.address,
                    "_amount": transactionBody.amount,
                    "_gas": parentConst.SMART_CONTRACT__GAS
                }
            ]
        }

        const transaction = await axios.post('https://console.dev.welldapp.io/api/callSmartContract', transactionBodyForSmartContract, options);

        console.log("End smart contract payment function");
        return { status: true, result: transaction.data }
    } catch (error) {
        console.error("ERROR callSmartContractPaymentFunction : ", error);
        console.log("End smart contract payment function");
        return { status: false, result: error }
    }
}
export const isParentExistAndGetReferalAmount = async (userData: any): Promise<any> => {
    try {
        const { userId, amount, transactionType, numberOfVotes, token } = userData;
        const parentUserDetails: any = (await firestore().collection('users').doc(userId).get()).data();
        // const parentUserDetails: any = await getUserDetailsOnParentId.docs.map((snapshot: any) => {
        //     let data = snapshot.data();
        //     return { childId: data.uid, parentId: data.parent }
        // });

        if (!parentUserDetails.parent) {
            console.log("Parent Not Found: ", "Parent user data is not exist");
            return null;
        };

        const halfAmount: number = (parseFloat(amount) * 50) / 100;

        const parentPaymentData = {
            parentUserId: parentUserDetails.parent,
            childUserId: parentUserDetails.uid,
            amount: halfAmount,
            type: parentConst.PAYMENT_TYPE_REFERAL,
            transactionType,
            numberOfVotes,
            token
        }

        console.log("parentPaymentData : ", parentPaymentData);


        // set payment schedule accroding parent settings
        await setPaymentSchedulingDate(parentPaymentData)

    } catch (error) {
        return {
            status: false,
            message: "Something went wrong while getting the parent referal"
        }
    }
}
export const setPaymentSchedulingDate = async (parentData: any) => {
    console.info("parentData", parentData)
    const getParentDetails: any = (await firestore().collection('users').doc(parentData.parentUserId).get()).data();
    const getAllParentAddress = getParentDetails.wellDAddress;
    console.info("getAllParentAddress", getAllParentAddress)
    const getMatchedCoinAddress = getAllParentAddress.find((address: any) => address.coin.toUpperCase() === parentData.token.toUpperCase());
    console.info("getMatchedCoinAddress", getMatchedCoinAddress)
    if (getMatchedCoinAddress) {
        const getParentSettings = getParentDetails.referalReceiveType ? getParentDetails.referalReceiveType : {};
        try {
            if (getParentSettings.name === parentConst.PAYMENT_SETTING_NAME_IMMEDIATE) {
                const storeInParentData = {
                    ...parentData,
                    parentPendingPaymentId: null,
                    address: getMatchedCoinAddress.address,
                    receiveType: getParentSettings.name,
                    timestamp: firestore.FieldValue.serverTimestamp()
                }

                console.info("storeInParentData", storeInParentData)
                const getParentPendingPaymentReference = await firestore().collection('parentPayment').add(storeInParentData)

                // const getPaymentAfterTransfer = await paymentFunction(parentTransactionDetails); // Previous Code

                const parentTransactionDetails = {
                    amount: parentData.amount,
                    address: getMatchedCoinAddress.address,
                    network: "ethereum"
                }
                const getPaymentAfterTransfer = await callSmartContractPaymentFunction(parentTransactionDetails);
                const getHash = getPaymentAfterTransfer?.result?.return_value[0].hash;
                console.log("get Hash from response(getPaymentAfterTransfer) ", getHash);

                await firestore().collection('parentPayment').doc(getParentPendingPaymentReference?.id).set({ status: parentConst.PAYMENT_STATUS_SUCCESS, parentPendingPaymentId: null, transactionId: getHash }, { merge: true });
            }
            console.info("getParentSettings", getParentSettings)
            if (getParentSettings.name === parentConst.PAYMENT_SETTING_NAME_LIMIT && (getParentSettings.limitType === parentConst.PAYMENT_LIMIT_TYPE_AMOUNT || getParentSettings.limitType === parentConst.PAYMENT_LIMIT_TYPE_ANYOFTHEM)) {
                const getParentPayment: any = [];
                const getParentPaymentQuery: any = await firestore()
                    .collection('parentPayment')
                    .where('parentUserId', '==', parentData.parentUserId)
                    .where('status', '==', parentConst.PAMENT_STATUS_PENDING)
                    .get();

                getParentPaymentQuery.forEach((doc: any) => {
                    getParentPayment.push({ docId: doc.id, ...doc.data() })
                });

                console.info("getParentPayment", getParentPayment)

                if (getParentPayment.length) {
                    let pendingAmount = 0;
                    for (let i = 0; i < getParentPayment.length; i++) {
                        pendingAmount += getParentPayment[i].amount;
                    }

                    pendingAmount = pendingAmount + parentData.amount; // Added current amount as well

                    if (pendingAmount > parseFloat(getParentSettings.amount)) {
                        // const transactionBody = {
                        //     "method": parentConst.PAYMENT_METHOD,
                        //     "params": {
                        //         "amount": pendingAmount || 0,
                        //         "network": parentConst.PAYMENT_NETWORK,
                        //         "origincurrency": parentConst.PAYMENT_ORIGIN_CURRENCY,
                        //         "token": parentConst.PAYMENT_TOKEN,
                        //     },
                        //     "user": "Test"
                        // };
                        parentData.amount = pendingAmount; // Override All Pending Amount With Current One


                        const parentTransactionDetails = {
                            amount: parentData.amount,
                            address: getMatchedCoinAddress.address,
                            network: "ethereum"
                        }
                        const getPaymentAfterTransfer = await callSmartContractPaymentFunction(parentTransactionDetails);
                        const getHash = getPaymentAfterTransfer?.result?.return_value[0].hash;
                        //const getPaymentAfterTransfer = await paymentFunction(transactionBody);

                        console.info("getPaymentAfterTransfer", getPaymentAfterTransfer?.result?.transaction_id);
                        // Loop on getParentPayment and update status to SUCCESS
                        const getParentPendingPaymentReference = await firestore().collection('parentPayment').add({ ...parentData, status: parentConst.PAYMENT_STATUS_SUCCESS, parentPendingPaymentId: null, transactionId: getHash, address: getMatchedCoinAddress.address, receiveType: getParentSettings, timestamp: firestore.FieldValue.serverTimestamp() })
                        console.info("getParentPendingPaymentReference", getParentPendingPaymentReference?.id);

                        getParentPayment.forEach(async (payment: any) => {
                            await firestore().collection('parentPayment').doc(payment.docId).set({ status: parentConst.PAYMENT_STATUS_SUCCESS, parentPendingPaymentId: getParentPendingPaymentReference?.id, transactionId: getPaymentAfterTransfer?.result?.transaction_id }, { merge: true });
                        })
                    } else {
                        console.info("Come Here In Else")
                        await firestore().collection('parentPayment').add({ ...parentData, status: parentConst.PAMENT_STATUS_PENDING, transactionId: null, parentPendingPaymentId: null, address: getMatchedCoinAddress.address, receiveType: getParentSettings, timestamp: firestore.FieldValue.serverTimestamp() })
                    }
                } else {
                    console.info("Come Here In Else")
                    await firestore().collection('parentPayment').add({ ...parentData, status: parentConst.PAMENT_STATUS_PENDING, transactionId: null, parentPendingPaymentId: null, address: getMatchedCoinAddress.address, receiveType: getParentSettings, timestamp: firestore.FieldValue.serverTimestamp() })
                }
            }
            if (getParentSettings.name === parentConst.PAYMENT_SETTING_NAME_LIMIT && (getParentSettings.limitType === parentConst.PAYMENT_LIMIT_TYPE_DAYS || getParentSettings.limitType === parentConst.PAYMENT_LIMIT_TYPE_ANYOFTHEM)) {
                await firestore().collection('parentPayment').add({ ...parentData, status: parentConst.PAMENT_STATUS_PENDING, transactionId: null, parentPendingPaymentId: null, address: getMatchedCoinAddress.address, receiveType: getParentSettings, timestamp: firestore.FieldValue.serverTimestamp() })
            }
        } catch (error) {
            console.info("Error while make referal payment", error)
        }
    } else {
        await firestore().collection('parentPayment').add({ ...parentData, status: parentConst.PAYMENT_STATUS_NO_COIN_FOUND, transactionId: null, parentPendingPaymentId: null, address: parentConst.PAYMENT_ADDRESS_NO_ADDRESS_FOUND, receiveType: parentConst.PAYMENT_RECIEVE_TYPE_NA, timestamp: firestore.FieldValue.serverTimestamp() })
    }
}

export const setPaymentSchedulingByCronJob = async (currentTime: any) => {
    const parentPaymentDetails: any = [];
    const getPendingParentDetails: any = await firestore()
        .collection('parentPayment')
        .where("status", "==", parentConst.PAMENT_STATUS_PENDING)
        .get();
    const filteredPendingPaymentData: any = getPendingParentDetails.docs.map((snapshot: any) => {
        return { parentPaymentId: snapshot.id, ...snapshot.data() }
    });
    log("filteredPendingPaymentData : ", filteredPendingPaymentData)

    for (let parent = 0; parent < filteredPendingPaymentData.length; parent++) {
        const parentDetails: any = (await firestore().collection('users').doc(filteredPendingPaymentData[parent].parentUserId).get()).data();
        const setting = parentDetails.referalReceiveType;
        log("parent Details :", parentDetails);

        const userPendingPaymentDetails: any = filteredPendingPaymentData[parent]
        const data: any = {
            id: parentDetails.uid,
            email: parentDetails.email,
            settings: parentDetails.referalReceiveType,
            ...userPendingPaymentDetails
        };
        log("data : ", data)
        if (setting.name === parentConst.PAYMENT_SETTING_NAME_LIMIT && (setting.limitType === parentConst.PAYMENT_LIMIT_TYPE_DAYS || setting.limitType === parentConst.PAYMENT_LIMIT_TYPE_ANYOFTHEM)) {
            parentPaymentDetails.push(data);
        };
    };

    // loop for Payment
    for (let parent of parentPaymentDetails) {
        const parentTimeStamp = parent.timestamp._seconds * 1000;
        const differnceBetweenTimes = Math.round(Math.abs(currentTime - parentTimeStamp) / (1000 * 60 * 60 * 24));
        log("parentTimeStamp , differnceBetweenTimes : ", parentTimeStamp, currentTime, differnceBetweenTimes);


        // For 1 Day, 1 Week and 1 Month
        if (differnceBetweenTimes >= 1 && parent.settings.days == parentConst.PAYMENT_SETTING_DAYS_1DAY) {
            log("1 day is calling parent is :", parent.id);
            const transaction: PaymentBody = {
                "method": parentConst.PAYMENT_METHOD,
                "params": {
                    "amount": parent.amount,
                    "network": parentConst.PAYMENT_NETWORK,
                    "origincurrency": parentConst.PAYMENT_ORIGIN_CURRENCY,
                    "token": parentConst.PAYMENT_TOKEN,
                },
                "user": "Test"
            }
            await paymentFunction(transaction)
            await firestore().collection('parentPayment').doc(parent.parentPaymentId).set({ status: parentConst.PAYMENT_STATUS_SUCCESS }, { merge: true });
        } else if (differnceBetweenTimes >= 7 && parent.settings.days == parentConst.PAYMENT_SETTING_DAYS_1WEEK) {
            log("1 week is calling parent is :", parent.id);
            const transaction: PaymentBody = {
                "method": parentConst.PAYMENT_METHOD,
                "params": {
                    "amount": parent.amount,
                    "network": parentConst.PAYMENT_NETWORK,
                    "origincurrency": parentConst.PAYMENT_ORIGIN_CURRENCY,
                    "token": parentConst.PAYMENT_TOKEN,
                },
                "user": "Test"
            }
            await paymentFunction(transaction);
            await firestore().collection('parentPayment').doc(parent.parentPaymentId).set({ status: parentConst.PAYMENT_STATUS_SUCCESS }, { merge: true });
        } else if (differnceBetweenTimes >= 30 && parent.settings.days == parentConst.PAYMENT_SETTING_DAYS_1MONTH) {
            log("1 month is calling parent is :", parent.parentPaymentId);
            const transaction: PaymentBody = {
                "method": parentConst.PAYMENT_METHOD,
                "params": {
                    "amount": parent.amount,
                    "network": parentConst.PAYMENT_NETWORK,
                    "origincurrency": parentConst.PAYMENT_ORIGIN_CURRENCY,
                    "token": parentConst.PAYMENT_TOKEN,
                },
                "user": "Test"
            }
            await paymentFunction(transaction);
            await firestore().collection('parentPayment').doc(parent.parentPaymentId).set({ status: parentConst.PAYMENT_STATUS_SUCCESS }, { merge: true });
        } else {
            console.info(parentConst.MESSAGE_NO_PARENT_PAYMENTS)
        }
    };

}




