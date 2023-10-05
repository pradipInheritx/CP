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

export const paymentFunction = async (transactionBody: PaymentBody): Promise<{
    status: boolean,
    result: any
} | undefined> => {
    try {
        console.info("transactionBody", transactionBody);
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjowLCJvcmdfaWQiOjIsImlzcyI6IldFTExEQVBQIiwic3ViIjoiYXBwMS5hcHAiLCJhdWQiOlsiR1JPVVBTIiwiQVBQTElDQVRJT05TIiwiQVVUSCIsIldFQjMiXSwiZXhwIjoyMjk4MjE5MzE2fQ.XzOIhftGzwPC5F0T-xbnpWJnY5xSTmpE36648pPQwUQ'
            }
        };

        const transaction = await axios.post('https://console.dev.welldapp.io/api/transactions', transactionBody, options);

        console.info('payment transaction : ', transaction.data);

        return { status: true, result: transaction.data }
    } catch (error) {
        console.error("ERROR paymentFunction : ", error);
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
            // parentUserId: childUserDetails.parent,
            // childUserId: childUserDetails.uid,
            amount: halfAmount,
            type: "REFERAL",
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
    const getParentDetails: any = (await firestore().collection('users').doc(parentData.parentUserId).get()).data();
    const getParentSettings = getParentDetails.referalReceiveType ? getParentDetails.referalReceiveType : {};
    const parentTransactionDetails = {
        "method": "getTransaction",
        "params": {
            "amount": parentData.amount,
            "network": parentConst.PAYMENT_NETWORK,
            "origincurrency": parentConst.PAYMENT_ORIGIN_CURRENCY,
            "token": parentConst.PAYMENT_TOKEN,
        },
        "user": "Test"
    }

    try {
        if (getParentSettings.name === "MANUAL" || getParentSettings.name === "IMMEDIATE") {
            const storeInParentData = { ...parentData, parentPendingPaymentId: null, address: getParentDetails.wellDAddress.address, receiveType: getParentSettings.name, timestamp: firestore.FieldValue.serverTimestamp() }
            const getParentPendingPaymentReference = await firestore().collection('parentPayment').add(storeInParentData)
            const getPaymentAfterTransfer = await paymentFunction(parentTransactionDetails);
            await firestore().collection('parentPayment').doc(getParentPendingPaymentReference?.id).set({ status: "SUCCESS", parentPendingPaymentId: null, transactionId: getPaymentAfterTransfer?.result?.transaction_id }, { merge: true });
        }
        if (getParentSettings.name === "LIMIT") {
            const getParentPayment: any = [];

            const getParentPaymentQuery: any = await firestore()
                .collection('parentPayment')
                .where('parentUserId', '==', parentData.parentUserId)
                .where('status', '==', 'PENDING')
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
                    const transactionBody = {
                        "method": "getTransaction",
                        "params": {
                            "amount": pendingAmount || 0,
                            "network": parentConst.PAYMENT_NETWORK,
                            "origincurrency": parentConst.PAYMENT_ORIGIN_CURRENCY,
                            "token": parentConst.PAYMENT_TOKEN,
                        },
                        "user": "Test"
                    };
                    parentData.amount = pendingAmount; // Override All Pending Amount With Current One

                    const getPaymentAfterTransfer = await paymentFunction(transactionBody);

                    console.info("getPaymentAfterTransfer", getPaymentAfterTransfer?.result?.transaction_id);
                    // Loop on getParentPayment and update status to SUCCESS
                    const getParentPendingPaymentReference = await firestore().collection('parentPayment').add({ ...parentData, status: "SUCCESS", parentPendingPaymentId: null, transactionId: getPaymentAfterTransfer?.result?.transaction_id, address: getParentDetails.wellDAddress.address, receiveType: getParentSettings, timestamp: firestore.FieldValue.serverTimestamp() })
                    console.info("getParentPendingPaymentReference", getParentPendingPaymentReference?.id);

                    getParentPayment.forEach(async (payment: any) => {
                        await firestore().collection('parentPayment').doc(payment.docId).set({ status: "SUCCESS", parentPendingPaymentId: getParentPendingPaymentReference?.id, transactionId: getPaymentAfterTransfer?.result?.transaction_id }, { merge: true });
                    })
                } else {
                    console.info("Come Here In Else")
                    await firestore().collection('parentPayment').add({ ...parentData, status: "PENDING", transactionId: null, parentPendingPaymentId: null, address: getParentDetails.wellDAddress.address, receiveType: getParentSettings, timestamp: firestore.FieldValue.serverTimestamp() })
                }
            } else {
                console.info("Come Here In Else")
                await firestore().collection('parentPayment').add({ ...parentData, status: "PENDING", transactionId: null, parentPendingPaymentId: null, address: getParentDetails.wellDAddress.address, receiveType: getParentSettings, timestamp: firestore.FieldValue.serverTimestamp() })
            }
        }
    } catch (error) {
        console.info("Error while make referal payment", error)
    }
}

export const setPaymentSchedulingByCronJob = async (currentTime: any) => {
    const parentPaymentDetails: any = [];
    const getPendingParentDetails: any = await firestore()
        .collection('parentPayment')
        .where("status", "==", "PENDING")
        .get();
    const filteredPendingPaymentData: any = getPendingParentDetails.docs.map((snapshot: any) => snapshot.data());
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
        if (setting.name == "LIMIT") {
            parentPaymentDetails.push(data);
        };
    };

    // loop for Payment
    for (let parent of parentPaymentDetails) {
        const parentTimeStamp = parent.timestamp._seconds * 1000;
        const differnceBetweenTimes = Math.round(Math.abs(currentTime - parentTimeStamp) / (1000 * 60 * 60 * 24));
        log("parentTimeStamp , differnceBetweenTimes : ", parentTimeStamp, currentTime, differnceBetweenTimes);


        // For 1 Day, 1 Week and 1 Month
        if (differnceBetweenTimes >= 1 && parent.settings.days == "1 DAY") {
            log("1 day is calling parent is :", parent.id);
            const transaction: PaymentBody = {
                "method": "getTransaction",
                "params": {
                    "amount": parent.amount,
                    "network": parentConst.PAYMENT_NETWORK,
                    "origincurrency": parentConst.PAYMENT_ORIGIN_CURRENCY,
                    "token": parentConst.PAYMENT_TOKEN,
                },
                "user": parent.email
            }
            await paymentFunction(transaction)
            await firestore().collection('parentPayment').doc(parent.id).set({ status: "SUCCESS" }, { merge: true });
        } else if (differnceBetweenTimes >= 7 && parent.settings.days == "1 WEEK") {
            log("1 week is calling parent is :", parent.id);
            const transaction: PaymentBody = {
                "method": "getTransaction",
                "params": {
                    "amount": parent.amount,
                    "network": parentConst.PAYMENT_NETWORK,
                    "origincurrency": parentConst.PAYMENT_ORIGIN_CURRENCY,
                    "token": parentConst.PAYMENT_TOKEN,
                },
                "user": parent.email
            }
            await paymentFunction(transaction);
            await firestore().collection('parentPayment').doc(parent.id).set({ status: "SUCCESS" }, { merge: true });
        } else if (differnceBetweenTimes >= 30 && parent.settings.days == "1 MONTH") {
            log("1 month is calling parent is :", parent.id);
            const transaction: PaymentBody = {
                "method": "getTransaction",
                "params": {
                    "amount": parent.amount,
                    "network": parentConst.PAYMENT_NETWORK,
                    "origincurrency": parentConst.PAYMENT_ORIGIN_CURRENCY,
                    "token": parentConst.PAYMENT_TOKEN,
                },
                "user": parent.email
            }
            await paymentFunction(transaction);
            await firestore().collection('parentPayment').doc(parent.id).set({ status: "SUCCESS" }, { merge: true });
        } else {
            console.info(parentConst.MESSAGE_NO_PARENT_PAYMENTS)
        }
    };

}




