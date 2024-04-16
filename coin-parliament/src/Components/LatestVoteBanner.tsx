import React, { useEffect, useState } from 'react'
import { db, firestore } from '../firebase';
import { collection, getDocs, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
type banner = {
    coin: string,
    CPMRangePercentage: number,
    voteTime: number,
    valueVotingTime: string,
    score: number,
    valueExpirationTime: number,
    voteType: string,
    expiration: number,
    direction: number,
    success: number,
    userId: string,
    status: {
        name: string,
        minVote: number,
        weight: string,
        share: string,
        index: number,
        givenCPM: string,
        color: string
    },
    voteId: string,
    timeframe: {
        index: number,
        name: string,
        chosen: boolean,
        seconds: number
    }
}
const LatestVoteBanner = () => {
    const [data, setData] = useState<banner>();
    const [aboutUser, setAboutUser] = useState<any>();
    useEffect(() => {
        const getCoinData = async () => {
            const q = query(collection(db, "votes"), orderBy("voteTime", "desc"), limit(1));
            const votesData = onSnapshot(q, async (querySnapshot) => {
                let votes = {};
                querySnapshot.forEach((doc) => {
                    votes = doc.data();
                });
                setData(votes as banner);
                //@ts-ignore
                const userId = votes?.userId;
                if (userId) {
                    const userQuery = query(
                        collection(db, "users"),
                        where('uid', '==', userId)
                    );
                    const userSnapshot = await getDocs(userQuery);
                    userSnapshot.forEach((userDoc) => {
                        const userData = userDoc.data();
                        setAboutUser(userData as banner);
                    });
                }
            });
        };

        getCoinData();

        return () => {
            getCoinData();
        };
    }, []);

    return (
        <div className='VoteBanner'>
            {`DisplayName : ${aboutUser?.displayName} & Coin Name : ${data?.coin}`}
        </div>
    )
}

export default LatestVoteBanner