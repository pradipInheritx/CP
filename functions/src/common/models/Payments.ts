import axios from 'axios';
import { firestore } from "firebase-admin";

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
    await firestore().collection("payments").add({ ...metaData, ...response, timestamp: firestore.FieldValue.serverTimestamp() })
}