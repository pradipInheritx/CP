import { firestore } from "firebase-admin";
import { sendNotificationForFollwersFollowings } from "./SendCustomNotification";

export async function getFollowersFollowingsAndVoteCoin(nowTime: number, yesterdayTime: number) {

    const getAllVotesIn24HoursQuery: any = await firestore()
        .collection('votes')
        .where("voteTime", ">", 1686036774)
        .where("voteTime", "<", 1685950279541)
        .orderBy('voteTime', 'desc')
        .get();


    //get all users and coins in between 24 hours
    const getUserAndCoins = getAllVotesIn24HoursQuery.docs.map((vote: any) => {
        const voteData: any = vote.data();
        return {
            userId: voteData.userId,
            coinName: voteData.coin
        }
    });

    const getUserAndCoinsIn24Hours: any = [];

    getUserAndCoins.map((item: any) => {
        let existingItem = getUserAndCoinsIn24Hours.find((i: any) => i.userId === item.userId);
        // console.log("getUserData---------", getUserData)
        if (existingItem) {
            if (!existingItem.coins.includes(item.coinName)) {
                existingItem.coins.push(item.coinName);
            }
        } else {

            getUserAndCoinsIn24Hours.push({ userId: item.userId, coins: [item.coinName] });
        }
    });
    console.log("getUserAndCoinsIn24Hours---------", getUserAndCoinsIn24Hours)
    for (let user of getUserAndCoinsIn24Hours) await sendNotificationForFollwersFollowings(user.userId, user.coins)

}