import axios from "axios";
import { firestore } from "firebase-admin";
import { log } from "firebase-functions/logger";
import * as parentConst from "../consts/payment.const.json";
import Web3 from "web3";

import { addIsUpgradedValue, addIsExtraVotePurchase } from "./Payments"


// import { log } from "firebase-functions/logger";

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
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjowLCJvcmdfaWQiOjEzLCJpc3MiOiJXRUxMREFQUCIsInN1YiI6InZvdGV0b2Vhcm4iLCJhdWQiOlsiR1JPVVBTIiwiQVBQTElDQVRJT05TIiwiQVVUSCIsIldFQjMiXSwiZXhwIjoyMDIyNTkwODI1fQ.0JYa8ZLdfdtC78-DJSy91m3KqTPX9PrGMAD0rtma0_M",
            },
        }; // This token is from Yaniv Account Side

        const transaction = await axios.post("https://console.dev.welldapp.io/api/transactions", transactionBody, options);

        console.info("payment transaction : ", transaction.data);

        return { status: true, result: transaction.data };
    } catch (error) {
        console.error("ERROR paymentFunction : ", error);
        return { status: false, result: error };
    }
};
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
                //'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjowLCJvcmdfaWQiOjEzLCJpc3MiOiJXRUxMREFQUCIsInN1YiI6Im1hbmFnZS52MmUiLCJhdWQiOlsiR1JPVVBTIiwiQVBQTElDQVRJT05TIiwiQVVUSCIsIldFQjMiXSwiZXhwIjoyMDIyNTkwODI1fQ.ae0mlVsGYN6cURolHv0veNaKtBIBsFokWgbLyvMd_OE' // Previously Used
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjowLCJvcmdfaWQiOjUsImlzcyI6IldFTExEQVBQIiwic3ViIjoibWFuYWdldm90ZXRvZWFybi5uZXQiLCJhdWQiOlsiR1JPVVBTIiwiQVBQTElDQVRJT05TIiwiQVVUSCIsIldFQjMiXSwiZXhwIjoyMDUwMjUxNjYxfQ.ajkjFwR4V1sL-_fYcnIA_nfFW2nV3Rr1zAcA6qPN-Lo' //For Smart Contract Prod VoteToEarn
            }
        };

        let currentGasPriceEther = await isGasPriceCalculationOnCoin(transactionBody.network);

        console.log("Current Gas Price (wei):", typeof currentGasPriceEther, parseFloat(currentGasPriceEther));

        transactionBody.amount = transactionBody.amount - parseFloat(currentGasPriceEther);
        console.info("transactionBody.amount", transactionBody.amount);

        const transactionBodyForSmartContract: any = {
            "abi": parentConst.SMART_CONTRACT_ABI_ARRAY,
            "address": parentConst.SMART_CONTRACT_ADMIN_ADRESS,
            "gas_limit": parentConst.SMART_CONTRACT_GAS_LIMIT,
            "method": parentConst.SMART_CONTRACT_METHOD,
            "network": transactionBody.network,
            "params": [
                {
                    "_to": transactionBody.address,
                    "_amount": transactionBody.amount,
                    "_gas": parseFloat(currentGasPriceEther), // parentConst.SMART_CONTRACT__GAS
                },

            ],
        };
        console.info("transactionBodyForSmartContract", transactionBodyForSmartContract);

        const transaction = await axios.post("https://console.dev.welldapp.io/api/callSmartContract", transactionBodyForSmartContract, options);

        console.log("End smart contract payment function", transaction);

        return { status: true, result: transaction.data };
    } catch (error) {
        console.error("ERROR callSmartContractPaymentFunction : ", error);
        console.log("End smart contract payment function");
        return { status: false, result: error };
    }
};

export const isGasPriceCalculationOnCoin = async (coin: any): Promise<any> => {
    console.info("coin", coin);

    let gasPriceNodeURL = "";
    if (coin === "ethereum") {
        gasPriceNodeURL =
            parentConst.SMART_CONTRACT_ETHEREUM_NODE_URL;
    }

    if (coin === "binance") {
        gasPriceNodeURL =
            parentConst.SMART_CONTRACT_BNB_NODE_URL;
    }

    if (coin === "polygon") {
        gasPriceNodeURL =
            parentConst.SMART_CONTRACT_MATIC_POLYGON_NODE_URL;
    }

    console.info("gasPriceNodeURL", gasPriceNodeURL);

    const web3 = new Web3(gasPriceNodeURL);

    const currentGasPrice = await web3.eth.getGasPrice();

    // Convert the gas price to Ether and format it manually
    const currentGasPriceWei: any = await web3.utils.fromWei(currentGasPrice, "gwei");
    console.log("currentGasPriceWei", typeof currentGasPriceWei, "Value", currentGasPriceWei);

    const getLimitAndCal: any = parentConst.SMART_CONTRACT_GAS_LIMIT * parseInt(currentGasPriceWei);

    const getCurrentGasPriceInEther = await web3.utils.fromWei(
        String(getLimitAndCal),
        "ether"
    );

    console.log("getCurrentGasPriceInEther", getCurrentGasPriceInEther);

    return parseFloat(getCurrentGasPriceInEther).toFixed(6);
};

export const isParentExistAndGetReferalAmount = async (userData: any): Promise<any> => {
    try {
        const { userId, amount, transactionType, numberOfVotes, token } = userData;
        const parentUserDetails: any = (await firestore().collection("users").doc(userId).get()).data();
        // const parentUserDetails: any = await getUserDetailsOnParentId.docs.map((snapshot: any) => {
        //     let data = snapshot.data();
        //     return { childId: data.uid, parentId: data.parent }
        // });
        console.info("parentUserDetails", parentUserDetails);
        if (!parentUserDetails.parent) {
            console.log("Parent Not Found: ", "Parent user data is not exist");
            return null;
        }

        const halfAmount: number = (parseFloat(amount) * 50) / 100;

        const parentPaymentData = {
            parentUserId: parentUserDetails.parent,
            childUserId: parentUserDetails.uid,
            amount: halfAmount,
            type: parentConst.PAYMENT_TYPE_REFERAL,
            transactionType,
            numberOfVotes,
            token,
        };

        console.log("parentPaymentData : ", parentPaymentData);


        // set payment schedule accroding parent settings
        await setPaymentSchedulingDate({ ...parentPaymentData, ...userData });
    } catch (error) {
        return {
            status: false,
            message: "Something went wrong while getting the parent referal",
        };
    }
};

export const setPaymentSchedulingDate = async (parentData: any) => {
    console.info("parentData", parentData);
    const getParentDetails: any = (await firestore().collection("users").doc(parentData.parentUserId).get()).data();
    const getAllParentAddress = getParentDetails.wellDAddress;
    console.info("getAllParentAddress", getAllParentAddress);
    const getMatchedCoinAddress = getAllParentAddress.find((address: any) => address.coin.toUpperCase() === parentData.token.toUpperCase());
    console.info("getMatchedCoinAddress", getMatchedCoinAddress);
    if (getMatchedCoinAddress) {
        const getParentSettings = getParentDetails.referalReceiveType ? getParentDetails.referalReceiveType : {};
        try {
            if (getParentSettings.name === parentConst.PAYMENT_SETTING_NAME_IMMEDIATE) {
                const storeInParentData = {
                    ...parentData,
                    parentPendingPaymentId: null,
                    address: getMatchedCoinAddress.address,
                    receiveType: getParentSettings.name,
                    timestamp: firestore.FieldValue.serverTimestamp(),
                };

                console.info("storeInParentData", storeInParentData);
                const getParentPendingPaymentReference = await firestore().collection("parentPayment").add(storeInParentData);

                // const getPaymentAfterTransfer = await paymentFunction(parentTransactionDetails); // Previous Code
                const parentTransactionDetails = {
                    amount: parentData.amount,
                    address: getMatchedCoinAddress.address,
                    network: await getNetworkAsPerCoin(parentData.origincurrency) ? await getNetworkAsPerCoin(parentData.origincurrency) : "ethereum",
                };
                const getPaymentAfterTransfer = await callSmartContractPaymentFunction(parentTransactionDetails);
                const getHash = getPaymentAfterTransfer?.result?.return_value[0].hash;
                console.log("get Hash from response(getPaymentAfterTransfer) ", getHash);

                await firestore().collection("parentPayment").doc(getParentPendingPaymentReference?.id).set({ status: parentConst.PAYMENT_STATUS_SUCCESS, parentPendingPaymentId: null, transactionId: getHash }, { merge: true });
            }
            console.info("getParentSettings", getParentSettings);
            if (getParentSettings.name === parentConst.PAYMENT_SETTING_NAME_LIMIT && (getParentSettings.limitType === parentConst.PAYMENT_LIMIT_TYPE_AMOUNT || getParentSettings.limitType === parentConst.PAYMENT_LIMIT_TYPE_ANYOFTHEM)) {
                const getParentPayment: any = [];
                const getParentPaymentQuery: any = await firestore()
                    .collection("parentPayment")
                    .where("parentUserId", "==", parentData.parentUserId)
                    .where("status", "==", parentConst.PAMENT_STATUS_PENDING)
                    .get();

                getParentPaymentQuery.forEach((doc: any) => {
                    getParentPayment.push({ docId: doc.id, ...doc.data() });
                });

                console.info("getParentPayment", getParentPayment);

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
                            network: await getNetworkAsPerCoin(parentData.origincurrency) ? await getNetworkAsPerCoin(parentData.origincurrency) : "ethereum",
                        };

                        const getPaymentAfterTransfer = await callSmartContractPaymentFunction(parentTransactionDetails);

                        console.info("getPaymentAfterTransfer After Smart Contract", getPaymentAfterTransfer);
                        const getHash = getPaymentAfterTransfer?.result?.return_value[0].hash;
                        // const getPaymentAfterTransfer = await paymentFunction(transactionBody);
                        // Loop on getParentPayment and update status to SUCCESS
                        const getParentPendingPaymentReference = await firestore().collection("parentPayment").add({ ...parentData, status: parentConst.PAYMENT_STATUS_SUCCESS, parentPendingPaymentId: null, transactionId: getHash, address: getMatchedCoinAddress.address, receiveType: getParentSettings, timestamp: firestore.FieldValue.serverTimestamp() });
                        console.info("getParentPendingPaymentReference", getParentPendingPaymentReference?.id);

                        getParentPayment.forEach(async (payment: any) => {
                            await firestore().collection("parentPayment").doc(payment.docId).set({ status: parentConst.PAYMENT_STATUS_SUCCESS, parentPendingPaymentId: getParentPendingPaymentReference?.id, transactionId: getHash }, { merge: true });
                        });
                    } else {
                        console.info("Come Here In Else 1");
                        await firestore().collection("parentPayment").add({ ...parentData, status: parentConst.PAMENT_STATUS_PENDING, transactionId: null, parentPendingPaymentId: null, address: getMatchedCoinAddress.address, receiveType: getParentSettings, timestamp: firestore.FieldValue.serverTimestamp() });
                    }
                } else {
                    console.info("Come Here In Else ");
                    await firestore().collection("parentPayment").add({ ...parentData, status: parentConst.PAMENT_STATUS_PENDING, transactionId: null, parentPendingPaymentId: null, address: getMatchedCoinAddress.address, receiveType: getParentSettings, timestamp: firestore.FieldValue.serverTimestamp() });
                }
            }
            if (getParentSettings.name === parentConst.PAYMENT_SETTING_NAME_LIMIT && (getParentSettings.limitType === parentConst.PAYMENT_LIMIT_TYPE_DAYS || getParentSettings.limitType === parentConst.PAYMENT_LIMIT_TYPE_ANYOFTHEM)) {
                await firestore().collection("parentPayment").add({ ...parentData, status: parentConst.PAMENT_STATUS_PENDING, transactionId: null, parentPendingPaymentId: null, address: getMatchedCoinAddress.address, receiveType: getParentSettings, timestamp: firestore.FieldValue.serverTimestamp() });
            }
        } catch (error) {
            console.info("Error while make referal payment", error);
        }
    } else {
        await firestore().collection("parentPayment").add({ ...parentData, status: parentConst.PAYMENT_STATUS_NO_COIN_FOUND, transactionId: null, parentPendingPaymentId: null, address: parentConst.PAYMENT_ADDRESS_NO_ADDRESS_FOUND, receiveType: parentConst.PAYMENT_RECIEVE_TYPE_NA, timestamp: firestore.FieldValue.serverTimestamp() });
    }
};

export const getNetworkAsPerCoin = async (coin: any) => {
    if (coin.toLowerCase() === "eth") {
        return "ethereum";
    }
    if (coin.toLowerCase() === "bnb") {
        return "binance";
    }
    if (coin.toLowerCase() === "matic") {
        return "polygon";
    }
    return "";
};

export const setPaymentSchedulingByCronJob = async (currentTime: any) => {
    const parentPaymentDetails: any = [];
    const getPendingParentDetails: any = await firestore()
        .collection("parentPayment")
        .where("status", "==", parentConst.PAMENT_STATUS_PENDING)
        .get();
    const filteredPendingPaymentData: any = getPendingParentDetails.docs.map((snapshot: any) => {
        return { parentPaymentId: snapshot.id, ...snapshot.data() };
    });
    log("filteredPendingPaymentData : ", filteredPendingPaymentData);

    for (let parent = 0; parent < filteredPendingPaymentData.length; parent++) {
        const parentDetails: any = (await firestore().collection("users").doc(filteredPendingPaymentData[parent].parentUserId).get()).data();
        const setting = parentDetails.referalReceiveType;

        log("parent Details :", parentDetails);

        const userPendingPaymentDetails: any = filteredPendingPaymentData[parent];
        const data: any = {
            id: parentDetails.uid,
            email: parentDetails.email,
            settings: parentDetails.referalReceiveType,
            ...userPendingPaymentDetails,
        };
        log("data : ", data);
        if (setting.name === parentConst.PAYMENT_SETTING_NAME_LIMIT && (setting.limitType === parentConst.PAYMENT_LIMIT_TYPE_DAYS || setting.limitType === parentConst.PAYMENT_LIMIT_TYPE_ANYOFTHEM)) {
            parentPaymentDetails.push(data);
        }
    }

    // loop for Payment
    for (const parent of parentPaymentDetails) {
        const getAllParentAddress = parent.wellDAddress;
        console.info("getAllParentAddress", getAllParentAddress);
        const getMatchedCoinAddress = getAllParentAddress.find((address: any) => address.coin.toUpperCase() === parent.token.toUpperCase()); // check parentDetails.token.toUpperCase()
        console.info("getMatchedCoinAddress", getMatchedCoinAddress);
        const parentTimeStamp = parent.timestamp._seconds * 1000;
        const differnceBetweenTimes = Math.round(Math.abs(currentTime - parentTimeStamp) / (1000 * 60 * 60 * 24));
        log("parentTimeStamp , differnceBetweenTimes : ", parentTimeStamp, currentTime, differnceBetweenTimes);


        // For 1 Day, 1 Week and 1 Month
        if (differnceBetweenTimes >= 1 && parent.settings.days == parentConst.PAYMENT_SETTING_DAYS_1DAY) {
            log("1 day is calling parent is :", parent.id);
            // const transaction: PaymentBody = {
            //     "method": parentConst.PAYMENT_METHOD,
            //     "params": {
            //         "amount": parent.amount,
            //         "network": parentConst.PAYMENT_NETWORK,
            //         "origincurrency": parentConst.PAYMENT_ORIGIN_CURRENCY,
            //         "token": parentConst.PAYMENT_TOKEN,
            //     },
            //     "user": "Test"
            // }
            // await paymentFunction(transaction)

            const parentTransactionDetails: SmartContractBody = {
                amount: parent.amount,
                address: getMatchedCoinAddress.address,
                network: await getNetworkAsPerCoin(parent.origincurrency) ? await getNetworkAsPerCoin(parent.origincurrency) : "ethereum",
            };
            const getPaymentAfterTransfer = await callSmartContractPaymentFunction(parentTransactionDetails);
            console.log("getPaymentAfterTransfer", getPaymentAfterTransfer);
            await firestore().collection("parentPayment").doc(parent.parentPaymentId).set({ status: parentConst.PAYMENT_STATUS_SUCCESS }, { merge: true });
        } else if (differnceBetweenTimes >= 7 && parent.settings.days == parentConst.PAYMENT_SETTING_DAYS_1WEEK) {
            log("1 week is calling parent is :", parent.id);
            const parentTransactionDetails: SmartContractBody = {
                amount: parent.amount,
                address: getMatchedCoinAddress.address,
                network: await getNetworkAsPerCoin(parent.origincurrency) ? await getNetworkAsPerCoin(parent.origincurrency) : "ethereum",
            };
            const getPaymentAfterTransfer = await callSmartContractPaymentFunction(parentTransactionDetails);
            console.log("getPaymentAfterTransfer", getPaymentAfterTransfer);
            await firestore().collection("parentPayment").doc(parent.parentPaymentId).set({ status: parentConst.PAYMENT_STATUS_SUCCESS }, { merge: true });
        } else if (differnceBetweenTimes >= 30 && parent.settings.days == parentConst.PAYMENT_SETTING_DAYS_1MONTH) {
            log("1 month is calling parent is :", parent.parentPaymentId);
            const parentTransactionDetails: SmartContractBody = {
                amount: parent.amount,
                address: getMatchedCoinAddress.address,
                network: await getNetworkAsPerCoin(parent.origincurrency) ? await getNetworkAsPerCoin(parent.origincurrency) : "ethereum",
            };
            const getPaymentAfterTransfer = await callSmartContractPaymentFunction(parentTransactionDetails);
            console.log("getPaymentAfterTransfer", getPaymentAfterTransfer);
            await firestore().collection("parentPayment").doc(parent.parentPaymentId).set({ status: parentConst.PAYMENT_STATUS_SUCCESS }, { merge: true });
        } else {
            console.info(parentConst.MESSAGE_NO_PARENT_PAYMENTS);
        }
    }
};

export const settlePendingTransactionFunction = async () => {
    try {
        const currentTime: any = new Date();
        const tenMinutesAgo = new Date(currentTime - 10 * 60 * 1000);

        const getPendingPaymentHistory: any = await firestore()
            .collection("callbackHistory")
            .where("timestamp", ">=", tenMinutesAgo)
            .get();

        const getAllPendingPaymentCallbackHistory: any = getPendingPaymentHistory.docs.map((snapshot: any) => {
            return { ...snapshot.data(), id: snapshot.id };
        });

        for (let allPendingCallback = 0; allPendingCallback < getAllPendingPaymentCallbackHistory.length; allPendingCallback++) {
            if (getAllPendingPaymentCallbackHistory[allPendingCallback].event == parentConst.PAYMENT_EVENT_APPROVED || getAllPendingPaymentCallbackHistory[allPendingCallback].event == parentConst.PAYMENT_EVENT_CONFIRMED) {

                const getAllTransactions = (await firestore().collection("callbackHistory").get()).docs.map((transaction) => { return { callbackDetails: transaction.data(), id: transaction.id } });
                const getPendingPaymentHistory: any = getAllTransactions.filter((transaction: any) => transaction.callbackDetails.data.transaction_id === getAllPendingPaymentCallbackHistory[allPendingCallback].data.transaction_id);
                console.info("getPendingPaymentHistory", getPendingPaymentHistory);

                if (!getPendingPaymentHistory.empty) {
                    // Assuming you want the first document if there are multiple
                    const getInitiatedRecordAfterSuccess = getPendingPaymentHistory[0];
                    console.info("getInitiatedRecordAfterSuccess", getInitiatedRecordAfterSuccess)

                    if (getInitiatedRecordAfterSuccess.transactionType === parentConst.TRANSACTION_TYPE_EXTRA_VOTES) {
                        await addIsExtraVotePurchase(getInitiatedRecordAfterSuccess);
                    }
                    if (getInitiatedRecordAfterSuccess.transactionType === parentConst.TRANSACTION_TYPE_UPGRADE) {
                        await addIsUpgradedValue(getInitiatedRecordAfterSuccess.userId)
                    }
                    let getData = {
                        paymentDetails: getInitiatedRecordAfterSuccess.callbackDetails.data,
                        event: getInitiatedRecordAfterSuccess.callbackDetails.event,
                        timestamp: getInitiatedRecordAfterSuccess.callbackDetails.timestamp,
                        amount: getInitiatedRecordAfterSuccess.callbackDetails.amount,
                        network: getInitiatedRecordAfterSuccess.callbackDetails.network,
                        numberOfVotes: getInitiatedRecordAfterSuccess.callbackDetails.numberOfVotes,
                        origincurrency: getInitiatedRecordAfterSuccess.callbackDetails.origincurrency,
                        token: getInitiatedRecordAfterSuccess.callbackDetails.token,
                        transactionType: getInitiatedRecordAfterSuccess.callbackDetails.transactionType,
                        userEmail: getInitiatedRecordAfterSuccess.callbackDetails.userEmail,
                        userId: getInitiatedRecordAfterSuccess.callbackDetails.userId,
                        walletType: getInitiatedRecordAfterSuccess.callbackDetails.walletType
                    }

                    console.info("Before Insert", getData)
                    await firestore().collection("payments").add(getData);
                } else {
                    console.info("No documents found for the given query.");
                }
            } else {
                let getData = {
                    paymentDetails: getAllPendingPaymentCallbackHistory[allPendingCallback].data,
                    event: getAllPendingPaymentCallbackHistory[allPendingCallback].event,
                    timestamp: getAllPendingPaymentCallbackHistory[allPendingCallback].timestamp,
                    amount: getAllPendingPaymentCallbackHistory[allPendingCallback].amount,
                    network: getAllPendingPaymentCallbackHistory[allPendingCallback].network,
                    numberOfVotes: getAllPendingPaymentCallbackHistory[allPendingCallback].numberOfVotes,
                    origincurrency: getAllPendingPaymentCallbackHistory[allPendingCallback].origincurrency,
                    token: getAllPendingPaymentCallbackHistory[allPendingCallback].token,
                    transactionType: getAllPendingPaymentCallbackHistory[allPendingCallback].transactionType,
                    userEmail: getAllPendingPaymentCallbackHistory[allPendingCallback].userEmail,
                    userId: getAllPendingPaymentCallbackHistory[allPendingCallback].userId,
                    walletType: getAllPendingPaymentCallbackHistory[allPendingCallback].walletType
                }
                await firestore().collection("payments").add(getData);
            }
        }
    } catch (error) {
        console.info("Getting Error While Fetch The Pending Event Transaction", error);
    }
};


