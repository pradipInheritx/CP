import axios from 'axios';
import { firestore } from "firebase-admin";

export const getUserWalletBalance = async (req: any, res: any) => {
    const { address, blockchain, token } = req.params;
    console.log(address, blockchain, token)
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjowLCJvcmdfaWQiOjEzLCJpc3MiOiJXRUxMREFQUCIsInN1YiI6InZvdGV0b2Vhcm4iLCJhdWQiOlsiR1JPVVBTIiwiQVBQTElDQVRJT05TIiwiQVVUSCIsIldFQjMiXSwiZXhwIjoyMDIyNTkwODI1fQ.0JYa8ZLdfdtC78-DJSy91m3KqTPX9PrGMAD0rtma0_M'
    } // Bearer token is static from WellDApp

    const getUserWalletBalance = await axios.get(`https://console.dev.welldapp.io/api/web3/balance?address=${address}&blockchain=${blockchain}&token=${token}`, { headers: headers })

    if (getUserWalletBalance) {
        res.status(200).json({
            status: true,
            message: `User wallet amount fetch successfully`,
            data: { balance: getUserWalletBalance.data }
        })
    } else {
        res.status(400).json({
            status: false,
            message: "Something went wrong while fetch the balance",
            data: {}
        })
    }
}

export const makePayment = async (req: any, res: any) => {
    const { userId, userEmail, walletType, amount, network, origincurrency, token, transactionType, numberOfVotes, paymentDetails } = req.body;
    console.log(userId, userEmail, walletType, amount, network, origincurrency, token, transactionType, numberOfVotes, paymentDetails)
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjowLCJvcmdfaWQiOjEzLCJpc3MiOiJXRUxMREFQUCIsInN1YiI6InZvdGV0b2Vhcm4iLCJhdWQiOlsiR1JPVVBTIiwiQVBQTElDQVRJT05TIiwiQVVUSCIsIldFQjMiXSwiZXhwIjoyMDIyNTkwODI1fQ.0JYa8ZLdfdtC78-DJSy91m3KqTPX9PrGMAD0rtma0_M'
    } // Bearer token is static from WellDApp

    const getResponseAfterTransaction = await axios.post("https://console.dev.welldapp.io/api/transactions", {
        "callback_secret": "",
        "callback_url": "",
        "method": "getTransaction",
        "params": {
            "amount": amount,
            "network": network,
            "origincurrency": origincurrency,
            "token": token
        },
        "user": userEmail
    }, { headers: headers })


    if (getResponseAfterTransaction && getResponseAfterTransaction.status === 201) {
        await storeInDBOfPayment({ userId, userEmail, walletType, amount, network, origincurrency, token, transactionType, numberOfVotes, paymentDetails }, getResponseAfterTransaction.data)

        res.status(200).json({
            status: true,
            message: `Payment done successfully of amount ${amount}$`,
            data: getResponseAfterTransaction.data
        })
    } else {
        res.status(400).json({
            status: false,
            message: "Something went wrong while making the payment",
            data: {}
        })
    }
}

export const storeInDBOfPayment = async (metaData: any, response: any) => {
    if (metaData.transactionType === "UPGRADE" && metaData?.userId) {
        await addIsUpgradedValue(metaData.userId)
    }
    if (metaData.transactionType === "EXTRAVOTES") {
        await addIsExtraVotePurchase(metaData)
    }
    await firestore().collection("payments").add({ ...metaData, ...response, timestamp: firestore.FieldValue.serverTimestamp() })
}

const addIsExtraVotePurchase = async (metaData: any) => {
    const userDocumentRef = firestore().collection('users').doc(metaData.userId);
    userDocumentRef.get()
        .then(doc => {
            if (doc.exists) {
                const data: any = doc.data();
                const originalValue = data.rewardStatistics.extraVote;
                const modifiedValue = originalValue + metaData.numberOfVotes;
                data.rewardStatistics.extraVote = modifiedValue;
                userDocumentRef.set(data);
            } else {
                errorLogging("isUserExtraVote", "ERROR", "Something went wrong while add the extra votes");
            }
        })
        .catch(error => {
            errorLogging("isUserExtraVote", "ERROR", error);
        });
}

const addIsUpgradedValue = async (userId: string) => {
    await firestore().collection('users').doc(userId).set({ rewardStatistics: true }, { merge: true });
}

//get user payment information by userId
export const isUserUpgraded = async (req: any, res: any) => {
    try {
        const { userId } = req.params;
        const getTransactionQuery = await firestore().collection('payments').where('userId', '==', userId).get();
        const getPaymentData = getTransactionQuery.docs.map((payment) => { return payment.data() });

        if (!getPaymentData.length) {
            return res.status(404).send({
                status: false,
                message: "Payment not found",
                data: []
            });
        }

        res.status(200).send({
            status: true,
            message: "Payment transaction fetched successfully",
            data: getPaymentData
        });

    } catch (error) {
        errorLogging("isUserUpgraded", "ERROR", error);
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