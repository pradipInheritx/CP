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
    const { userId, userEmail, walletType, amount, network, origincurrency, token } = req.body;
    console.log(userId, userEmail, walletType, amount, network, origincurrency, token)
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
        await storeInDBOfPayment({ userId, userEmail, walletType, amount, network, origincurrency, token }, getResponseAfterTransaction.data)
        res.status(200).json({
            status: true,
            message: `Payment done successfully of amount ${amount}`,
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
    metaData?.userId ? await addIsUpgradedValue(metaData.userId) : "";
    await firestore().collection("payments").add({ ...metaData, ...response, timestamp: firestore.FieldValue.serverTimestamp() })
}

const addIsUpgradedValue = async (userId: string) => {
    await firestore().collection('users').doc(userId).set({ isUpgraded: true }, { merge: true });
}

//get user payment information by userId
export const isUserUpgraded = async (req: any, res: any) => {
    try {
        const { userId } = req.params;

        const getTransactionQuery = await firestore().collection('payments').where('userId', '==', userId).get();
        console.info("getTransactionQuery", getTransactionQuery)
        const getPaymentData = getTransactionQuery.docs.map((payment) => { return payment.data() });
        console.log("get transaction ; ", getPaymentData);

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