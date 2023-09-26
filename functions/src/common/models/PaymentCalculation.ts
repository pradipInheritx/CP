import { firestore } from "firebase-admin";
import { log } from "firebase-functions/logger";
import fetch from "node-fetch";

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
        const transaction = fetch('https://console.dev.welldapp.io/api/transactions', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjowLCJvcmdfaWQiOjEzLCJpc3MiOiJXRUxMREFQUCIsInN1YiI6InZvdGV0b2Vhcm4iLCJhdWQiOlsiR1JPVVBTIiwiQVBQTElDQVRJT05TIiwiQVVUSCIsIldFQjMiXSwiZXhwIjoyMDIyNTkwODI1fQ.0JYa8ZLdfdtC78-DJSy91m3KqTPX9PrGMAD0rtma0_M'
            },
            body: JSON.stringify(transactionBody)
        })
            .then(res => {
                if (res.ok)
                    return res.json()
                else
                    throw Error(`code ${res.status}`)
            })
            .then(async data => {
                log("Payment After Response Data: ", data)
                return { status: true, result: data }
            })
            .catch(err => {
                console.error(err)
                return { status: false, result: err }
            })
        log('payment transaction : ', transaction)
        return { status: true, result: transaction }
    } catch (error) {
        console.error("ERROR paymentFunction : ", error);
        return { status: false, result: error }
    }
}


export const isParentExistAndGetReferalAmount = async (userData: any): Promise<any> => {
    try {
        const { userId, amount } = userData;
        const getUserDetailsOnParentId = await firestore().collection('users').where('uid', "==", userId).get();
        const parentUserDetails: any = await getUserDetailsOnParentId.docs.map((snapshot: any) => {
            let data = snapshot.data();
            return { childId: data.uid, parentId: data.parent }
        });
        console.log("Child details : ", parentUserDetails);

        if (!parentUserDetails[0].parentId) {
            return {
                status: false,
                message: "Parent user data is not exist"
            }
        };

        const halfAmount: number = (parseFloat(amount) * 50) / 100;

        const parentPaymentData = {
            parentUserId: parentUserDetails[0]?.parentId,
            childUserId: parentUserDetails[0]?.childId,
            amount: halfAmount,
            type: "REFERAL"
        }

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
    const getParentSettings = getParentDetails.referalReceiveType;
    console.log('Parent Details : ', getParentDetails)
    log('Parent Details : ', getParentDetails)
    const parentTransactionDetails = {
        "method": "getTransaction",
        "params": {
            "amount": parentData.amount,
            "network": "5",
            "origincurrency": "eth",
            "token": "ETH"
        },
        "user": getParentDetails.email
    }
    if (getParentSettings.name === "MANUAL" || getParentSettings.name === "IMMEDIATE") {
        await firestore().collection('parentPayment').add({ ...parentData, status: "SUCCESS", address: getParentDetails.wellDaddress.address, timestamp: firestore.FieldValue.serverTimestamp() })
        await paymentFunction(parentTransactionDetails);
    }
    if (getParentSettings.name === "LIMIT") {
        //getParentDetails.parentUserId
        // Get all Pending records in DB
        // const getParentPaymentQuery: any = await firestore()
        //     .collection('parentPayment')
        //     .where('parentUserId', '==', parentData.parentUserId)
        //     .where('status', '==', 'PENDING')
        //     .get();
        // 
        // const getParentPayment: any = getParentPaymentQuery.docs.map((snapshot: any) => snapshot.data());
        // let pendingAmount = 0;
        //for (let i = 0; i < getParentPayment.length; i++) {
        // pendingAmount += getParentPayment[i].amount;
        // }
        // pendingAmount = pendingAmount + parentData.amount;
        // if(getParentSettings.amount < pendingAmount ){
        // const transactionBody = {
        //     "method": "getTransaction",
        //         "params": {
        //         "amount": pendingAmount || 0,
        //         "network": "5",
        //         "origincurrency": "eth",
        //         "token": "ETH"
        //     },
        //     "user": getParentDetails.email
        // };
        // await paymentFunction(transactionBody)
        // Loop on getParentPayment and update status to SUCCESS
        // await updateAllPendingStatusToSuccess()
        //} else {
        // const addParentPaymentUser = await firestore().collection('parentPayment').add({ ...parentData, status: "PENDING", address: getParentDetails.wellDaddress.address, timestamp: firestore.FieldValue.serverTimestamp() })
        //}

        // Create cron Job every day 
        // Get all pending status data 
        // Group by parentUserId
        // Get the setting on parentUserId check the setting if every day 
        // Filter the data on the basis of transaction time. Only get the data on transaction time less than 1 day.
    }
}
