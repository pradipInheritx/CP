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
                log("Payment response data : ", data)
                return data
            })
            .catch(err => {
                console.error(err)
                return err
            })
        log('payment transaction : ', transaction)
        return transaction
    } catch (error) {
        console.error("ERROR paymentFunction : ", error);
        return { status: false, result: error }

    }
}


export const isParentExistAndGetReferalAmount = async (data: any): Promise<any> => {
    try {
        const { userEmail, amount } = data;
        console.log("userId amount ", userEmail, amount)
        const getUserDetails = await firestore().collection('users').where('email', "==", userEmail).get();
        const userDetails: any = getUserDetails.docs.map((snapshot: any) => {
            let data = snapshot.data();
            return { childId: data.uid, parentId: data.parent }
        });
        console.log("Child details : ", userDetails);

        if (!userDetails[0].parentId) {
            return {
                status: false,
                message: "Parent not available"
            }
        };

        const halfAmount: number = (parseFloat(amount) * 50) / 100;

        const parentPaymentData = {
            parentUserId: userDetails[0]?.parentId,
            childUserId: userDetails[0]?.childId,
            amount: halfAmount,
            type: "REFERAL",
            status: "PENDING"
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
    if (getParentSettings.name == "IMMEDIATE_MANUAL" || getParentSettings.name == "IMMEDIATE") {
        await paymentFunction(parentTransactionDetails);
    }
    if (getParentSettings.name == "LIMIT") {
        //add parent payment user
        const addParentPaymentUser = await firestore().collection('parentPayment').add({ ...parentData, address: getParentDetails.wellDaddress.address, timestamp: firestore.FieldValue.serverTimestamp() })
        // add transaction id in above user documnet
        await firestore().collection('parentPayment').doc(addParentPaymentUser.id).set({ transactionId: addParentPaymentUser }, { merge: true });
        console.log("transaction id : ", addParentPaymentUser.id);
        log("transaction id : ", addParentPaymentUser.id);
        const getAmount = await parentLimitCalculation(parentData, getParentSettings);
        const transactionBody = {
            "method": "getTransaction",
            "params": {
                "amount": getAmount?.amount || 0,
                "network": "5",
                "origincurrency": "eth",
                "token": "ETH"
            },
            "user": getParentDetails.email
        };
        await paymentFunction(transactionBody)
    }
}

export const parentLimitCalculation = async (parentData: any, getParentSettings: any) => {
    const getParentPaymentQuery: any = await firestore()
        .collection('parentPayment')
        .where('parentUserId', '==', parentData.parentUserId)
        .where('status', '==', 'PENDING')
        .get();
    const getParentPayment: any = getParentPaymentQuery.docs.map((snapshot: any) => snapshot.data());
    const getParentPaymentSorted: any = getParentPayment.sort((a: any, b: any) => a.timestamp._seconds - b.timestamp._seconds);
    console.log("getParentPaymentSorted : ", getParentPaymentSorted);
    log("getParentPaymentSorted : ", getParentPaymentSorted);
    let payment_amount: number = 0;
    const getAmount = {
        result: false,
        amount: 0,
    };
    const transactionId: any = [];
    // count amount by amount of user's settings
    for (let i = 0; i < getParentPaymentSorted.length; i++) {
        payment_amount = payment_amount + parseFloat(getParentPaymentSorted[i]);
        transactionId.push(getParentPaymentSorted[i].id);
        if (payment_amount >= getParentSettings.amount) {
            getAmount.result = true;
            getAmount.amount = payment_amount
            return
        };
        if (getParentPayment.length == getParentPayment[i]) {
            transactionId.length = 0 // remove all elements from transactionId
            return
        };
    };
    console.log("after amount calculation : ", getAmount);
    log("after amount calculation : ", getAmount);
    // count amount by days of user's settings
    if (getAmount.result === false) {
        for (let i = 0; i < getParentPaymentSorted.length; i++) {
            payment_amount = payment_amount + parseFloat(getParentPaymentSorted[i])
            if (i === getParentSettings.days) {
                getAmount.result = true;
                getAmount.amount = payment_amount
                return
            }
        }
    };
    console.log("after day calculation : ", getAmount);
    log("after day calculation : ", getAmount);
    if (transactionId.length) {
        console.log("changes status start");
        transactionId.forEach((transaction: any) => firestore().collection('parentPayment').doc(transactionId).set({ status: "SUCCESS" }, { merge: true }))
        console.log("changes status end");
    }
    console.log("final calculation : ", getAmount);
    log("final calculation : ", getAmount);
    return getAmount
}
