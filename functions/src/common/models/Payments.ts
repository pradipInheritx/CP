import axios from 'axios';
import { firestore } from "firebase-admin";
import { log } from 'firebase-functions/logger';
// import * as schedule from "node-schedule";


interface Params {
    "amount": number,
    "network": string,
    "origincurrency": string,
    "token": string
}
interface PaymenBody {
    method: string,
    params: Params,
    user: string
}

export const renderPaymentPage = async (req: any, res: any) => {
    try {
        console.info("Come Here");
        res.setHeader('Content-Type', 'text/html');
        const htmlContent = `<!DOCTYPE html>
            <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Vote2Earn demo</title>
            <link rel="stylesheet" href="https://cdn.rawgit.com/Chalarangelo/mini.css/v3.0.1/dist/mini-default.min.css">

        </head>
    <body>
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <h2>Step 1</h2>
                <input type="text" id="account" placeholder="No wallet connected" disabled > 
                <button class="primary" onclick="connectionWallet()">connectionWallet</button>
            </div>
        </div>

        <div class="row">
            <div class="col-sm-12">
                <h2>Step 2</h2>
                <input id="uid" type="text" placeholder="UserID">
                <button class="primary" onclick="send_uid()">send_uid</button>
            </div>
        </div>
        
        <div class="row">
            <div class="col-sm-12">
                <h2>Step 3</h2>
                <input type="number" value="0.0001" id="amount">
                <button class="primary" onclick="getTransaction()">getTransaction</button>
            </div>
        </div>
    </div>

    <script>
        function send_uid(){
            const uid = document.getElementById("uid").value;
            wldp.send_uid(uid);
        }

        function connectionWallet(){
            wldp.connectionWallet('connect','ethereum');
        }

        function getTransaction(){
            const obj = {
                "userId": "deGaSUcF5KYkQARHXLmQuHLjXyF3",
                "userEmail": "mukut@inheritx.com",
                "walletType": "Metamask",
                "amount": 0.0001,
                "network": "5",
                "origincurrency": "eth",
                "token": "ETH",
                "transactionType": "EXTRAVOTES",
                "numberOfVotes": 10,
                "paymentDetails": {}
            }
            fetch('/coin-parliament-staging/us-central1/api/v1/payment/makePayment/toServer',{
                method: 'POST',
                headers: {'content-type':'application/json'},
                body: JSON.stringify(obj)
            })
        }

        document.addEventListener('wldp:acountChange', e => {
           document.getElementById('account').value = e.detail.account
        })

    </script>

    
    <script  src='https://bridgeapp-dev.welldapp.com/widget/wldp-widget.js?application=app1.app&init=true&autoconnect=false&visible=true'></script>
</body>
</html>`;

        // Send the HTML content as the response body
        res.end(htmlContent);
    } catch (error) {
        console.info("error", error)
    }
}

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

async function paymentFunction(transactionBody: PaymenBody): Promise<{
    status: boolean,
    result: any
} | undefined> {
    try {
        const transaction = axios.post('https://console.dev.welldapp.io/api/transactions', transactionBody,
            {
                headers: {
                    'content-type': 'application/json',
                    'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjowLCJvcmdfaWQiOjIsImlzcyI6IldFTExEQVBQIiwic3ViIjoiYXBwMS5hcHAiLCJhdWQiOlsiR1JPVVBTIiwiQVBQTElDQVRJT05TIiwiQVVUSCIsIldFQjMiXSwiZXhwIjoyMjk4MjE5MzE2fQ.XzOIhftGzwPC5F0T-xbnpWJnY5xSTmpE36648pPQwUQ'
                }
            }
        ).then((res: any) => {
            if (res.ok)
                return res.json()
            else
                throw Error(`code ${res.status}`)
        }).then((data: any) => {
            return { status: true, result: data }
        }).catch((err: any) => {
            console.error(err)
            return { status: false, result: err }
        })
        return transaction
    } catch (error) {
        console.error("ERROR paymentFunction : ", error);
        return { status: false, result: error }

    }
}

export const makePaymentToServer = async (req: any, res: any) => {
    try {
        // const headers = {
        //     'Content-Type': 'application/json',
        //     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjowLCJvcmdfaWQiOjEzLCJpc3MiOiJXRUxMREFQUCIsInN1YiI6InZvdGV0b2Vhcm4iLCJhdWQiOlsiR1JPVVBTIiwiQVBQTElDQVRJT05TIiwiQVVUSCIsIldFQjMiXSwiZXhwIjoyMDIyNTkwODI1fQ.0JYa8ZLdfdtC78-DJSy91m3KqTPX9PrGMAD0rtma0_M'
        // } // Bearer token is static from WellDApp

        //const { userId, userEmail, walletType, amount, network, origincurrency, token, transactionType, numberOfVotes } = req.body;
        const { userEmail, amount, network, origincurrency, token } = req.body;
        let requestBody = {
            "method": "getTransaction",
            "params": {
                "amount": amount,
                "network": network,
                "origincurrency": origincurrency,
                "token": token
            },
            "user": userEmail
        }
        const transction = await paymentFunction(requestBody)

        // fetch('https://console.dev.welldapp.io/api/transactions', {
        //     method: 'POST',
        //     headers: {
        //         'content-type': 'application/json',
        //         'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjowLCJvcmdfaWQiOjEzLCJpc3MiOiJXRUxMREFQUCIsInN1YiI6InZvdGV0b2Vhcm4iLCJhdWQiOlsiR1JPVVBTIiwiQVBQTElDQVRJT05TIiwiQVVUSCIsIldFQjMiXSwiZXhwIjoyMDIyNTkwODI1fQ.0JYa8ZLdfdtC78-DJSy91m3KqTPX9PrGMAD0rtma0_M'
        //     },
        //     body: JSON.stringify(requestBody)
        // })
        //     .then(res => {
        //         if (res.ok)
        //             return res.json()
        //         else
        //             throw Error(`code ${res.status}`)
        //     })
        //     .then(async data => {
        //         await storeInDBOfPayment({ userId, userEmail, walletType, amount, network, origincurrency, token, transactionType, numberOfVotes, paymentDetails: {} })
        await isParentExistAndGetReferalAmount(req.body);
        //         res.json(data)
        //     })
        //     .catch(err => {
        //         console.error(err)
        //         res.status(400).send(err)
        //     })

        // axios.post('https://console.dev.welldapp.io/api/transactions', requestBody,
        //     {
        //         headers: {
        //             'content-type': 'application/json',
        //             'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlX2lkIjowLCJvcmdfaWQiOjIsImlzcyI6IldFTExEQVBQIiwic3ViIjoiYXBwMS5hcHAiLCJhdWQiOlsiR1JPVVBTIiwiQVBQTElDQVRJT05TIiwiQVVUSCIsIldFQjMiXSwiZXhwIjoyMjk4MjE5MzE2fQ.XzOIhftGzwPC5F0T-xbnpWJnY5xSTmpE36648pPQwUQ'
        //         }
        //     }
        // ).then((res: any) => {
        //     if (res.ok)
        //         return res.json()
        //     else
        //         throw Error(`code ${res.status}`)
        // }).then((data: any) => {
        //     res.json(data)
        // }).catch((err: any) => {
        //     console.error(err)
        //     res.status(400).send(err)
        // })


        //console.info("getDataAfterWellDApp", getDataAfterWellDApp, getDataAfterWellDApp.data)

        //console.log(userId, userEmail, walletType, amount, network, origincurrency, token, transactionType, numberOfVotes, paymentDetails)


        // res.status(200).json({
        //     status: true,
        //     message: `Payment done successfully of amount ${amount}$ on the server`,
        //     data: { userId, userEmail, walletType, amount, network, origincurrency, token, transactionType, numberOfVotes, paymentDetails: getDataAfterWellDApp.data }
        // })
        res.send(transction)
    } catch (error: any) {
        console.info("Error while make payment to welld app server", error)
    }
}

export const makePayment = async (req: any, res: any) => {
    const { userId, userEmail, walletType, amount, network, origincurrency, token, transactionType, numberOfVotes, paymentDetails } = req.body;
    console.log(userId, userEmail, walletType, amount, network, origincurrency, token, transactionType, numberOfVotes, paymentDetails)
    await storeInDBOfPayment({ userId, userEmail, walletType, amount, network, origincurrency, token, transactionType, numberOfVotes, paymentDetails })

    res.status(200).json({
        status: true,
        message: `Payment done successfully of amount ${amount}$`,
        data: { userId, userEmail, walletType, amount, network, origincurrency, token, transactionType, numberOfVotes, paymentDetails }
    })
}

export const storeInDBOfPayment = async (metaData: any) => {
    if (metaData.transactionType === "UPGRADE" && metaData?.userId) {
        await addIsUpgradedValue(metaData.userId)
    }
    if (metaData.transactionType === "EXTRAVOTES") {
        await addIsExtraVotePurchase(metaData)
    }
    await firestore().collection("payments").add({ ...metaData, timestamp: firestore.FieldValue.serverTimestamp() })
}

const addIsExtraVotePurchase = async (metaData: any) => {
    const userDocumentRef = firestore().collection('users').doc(metaData.userId);
    userDocumentRef.get()
        .then(doc => {
            if (doc.exists) {
                const data: any = doc.data();
                const originalValue: number = parseFloat(data?.rewardStatistics?.extraVote);
                const modifiedValue: number = originalValue + parseFloat(metaData.numberOfVotes);
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
    await firestore().collection('users').doc(userId).set({ isUserUpgraded: true }, { merge: true });
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

export const getParentPayment = async (req: any, res: any) => {
    try {
        const getUserArray: any = [];
        const { userId } = req.params;
        const getParentPaymentQuery = await firestore()
            .collection('parentPayment')
            .where('childUserId', "==", userId)
            .get();
        getParentPaymentQuery.docs.forEach((snapshot: any) => {
            let user = snapshot.data();
            getUserArray.push(user);
        });
        log("getParentPayment : getUserArray => ", getUserArray);
        res.status(200).send({
            status: true,
            message: "Parent payment history fetched successfully",
            data: getUserArray
        });

    } catch (error) {
        errorLogging("getParentPayment", "ERROR", error);
        res.status(500).send({
            status: false,
            message: "Something went wrong in server",
            result: error,
        });
    }
}

export const getTransactionHistory = async (req: any, res: any) => {
    try {
        const { userId } = req.params;
        const { pageNumber, pageSize } = req.query;
        const page_number = parseInt(pageNumber);
        const page_size = parseInt(pageSize);
        const transactionHistory: any = []
        const getTransactionQuery = await firestore().collection('payments').where("userId", "==", userId).get();
        getTransactionQuery.docs.forEach((snapshot: any) => {
            let transaction = snapshot.data()
            console.log("Transaction data ", transaction)
            transactionHistory.push({
                amount: transaction.amount,
                numberOfVotes: transaction.numberOfVotes,
                transaction_time: transaction.timestamp,
                token: transaction.token,
                origincurrency: transaction.origincurrency,
                transactionType: transaction.transactionType,
                transaction_id: transaction.transaction_id,
                userId: transaction.userId,
                walletType: transaction.walletType,
                paymentDetails: transaction.paymentDetails
            });
        });

        const transactionSorting = transactionHistory.sort((a: any, b: any) => b.transaction_time._seconds - a.transaction_time._seconds);

        const startIndex: number = (page_number - 1) * page_size;
        const endIndex: number = startIndex + page_size;
        console.log("s e : ", typeof startIndex, typeof endIndex, startIndex, endIndex);

        console.info(transactionSorting, startIndex, endIndex);
        const transactionPagination = transactionSorting.slice(startIndex, endIndex);
        console.info("transactionPagination : ", transactionPagination);

        res.status(200).send({
            status: true,
            message: "Payment transaction history fetched successfully",
            data: transactionPagination,
            total: transactionHistory.length
        });
    } catch (error) {
        errorLogging("getTransactionHistory", "ERROR", error);
        res.status(500).send({
            status: false,
            message: "Something went wrong in server",
            result: error,
        });
    }
}

const isParentExistAndGetReferalAmount = async (data: any) => {
    try {
        const { userEmail, amount } = data;
        console.log("userId amount ", userEmail, amount)
        const getUserDetails = await firestore().collection('users').where('email', "==", userEmail).get();
        const userDetails: any = getUserDetails.docs.map((snapshot: any) => {
            let data = snapshot.data();
            return { childId: data.uid, parentId: data.parent }
        });
        console.log("getUserDetails : ", userDetails);

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
            address: "",
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
const setPaymentSchedulingDate = async (parentData: any) => {
    const getParentDetails: any = (await firestore().collection('users').doc(parentData.parentUserId).get()).data();
    const getParentSettings = getParentDetails.referalReceiveType;
    const parentTransactionDetails = {
        "method": "",
        "params": {
            "amount": parentData.amount,
            "network": "",
            "origincurrency": "",
            "token": ""
        },
        "user": getParentDetails.email
    }
    if (getParentSettings.name == "IMMEDIATE_MANUAL" || getParentSettings.name == "IMMEDIATE") {
        await paymentFunction(parentTransactionDetails);
    }
    if (getParentSettings.name == "LIMIT") {
        await parentLimitCalculation(parentData, getParentSettings);
    }
}
const parentLimitCalculation = async (parentData: any, getParentSettings: any) => {
    const getParentPaymentQuery: any = await firestore()
        .collection('parentPayment')
        .where('parentUserId', '==', parentData.parentUserId)
        .where('status', '==', 'PENDING')
        .get();
    const getParentPayment: any = getParentPaymentQuery.docs.map((snapshot: any) => snapshot.data())

    for (let data = 0; data < getParentPayment.length)
    // return {amount}
}

export const errorLogging = async (
    funcName: string,
    type: string,
    error: any
) => {
    console.info(funcName, type, error);
};