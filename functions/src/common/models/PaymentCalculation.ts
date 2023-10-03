import axios from "axios";
import { firestore } from "firebase-admin";
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
            "network": "11155111",
            "origincurrency": "eth",
            "token": "ETH"
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
                            "network": "11155111",
                            "origincurrency": "eth",
                            "token": "ETH"
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
    const userDetails: any = [];
    const getPendingParentDetails: any = await firestore()
        .collection('parentPayment')
        .where("status", "==", "PENDING")
        .get();
    const filteredPendingPaymentData: any = getPendingParentDetails.docs.map((snapshot: any) => snapshot.data());

    for (let i = 0; i < filteredPendingPaymentData.length; i++) {
        const user: any = (await firestore().collection('users').doc(filteredPendingPaymentData[i].parentUserId).get()).data()
        const setting = user.referalReceiveType
        const userPendingPaymentDetails: any = filteredPendingPaymentData[i]
        const data: any = {
            id: user.uid,
            email: user.email,
            settings: user.referalReceiveType,
            ...userPendingPaymentDetails
        }
        if (setting.name == "LIMIT") {
            userDetails.push(data)
        }
    }

    // loop for Payment
    for (let user of userDetails) {
        const parentTimeStamp = user.timestamp._seconds
        const differnceBetweenTimes = Math.round((parentTimeStamp - currentTime) / (1000 * 60 * 60 * 24))

        // for 1 day
        if (differnceBetweenTimes >= 1 && user.settings.day == "1 day") {
            const transaction: PaymentBody = {
                "method": "getTransaction",
                "params": {
                    "amount": user.amount,
                    "network": "11155111",
                    "origincurrency": "eth",
                    "token": "ETH"
                },
                "user": user.email
            }
            await paymentFunction(transaction)
            await firestore().collection('parentPayment').doc(user.id).set({ status: "SUCCESS" }, { merge: true });
        }
        // for 1 week
        else if (differnceBetweenTimes >= 7 && user.settings.day == "1 week") {
            const transaction: PaymentBody = {
                "method": "getTransaction",
                "params": {
                    "amount": user.amount,
                    "network": "11155111",
                    "origincurrency": "eth",
                    "token": "ETH"
                },
                "user": user.email
            }
            await paymentFunction(transaction);
            await firestore().collection('parentPayment').doc(user.id).set({ status: "SUCCESS" }, { merge: true });
        }
        // for 1 month
        else if (differnceBetweenTimes >= 30 && user.settings.day == "1 month") {
            const transaction: PaymentBody = {
                "method": "getTransaction",
                "params": {
                    "amount": user.amount,
                    "network": "11155111",
                    "origincurrency": "eth",
                    "token": "ETH"
                },
                "user": user.email
            }
            await paymentFunction(transaction);
            await firestore().collection('parentPayment').doc(user.id).set({ status: "SUCCESS" }, { merge: true });
        }
        else { throw "Somthing wrong in setPaymentSchedulingByCronJob" }
    };

}




