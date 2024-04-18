import React, { useEffect, useState } from 'react'
import { db, firestore } from '../firebase';
import { collection, getDocs, limit, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import Avatars, { AvatarType, defaultAvatar } from "../assets/avatars/Avatars";
import { Image } from 'react-bootstrap';
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
            onSnapshot(q, async (querySnapshot) => {
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
            <div className="VoteBannerInner">
                <div className='d-flex justify-content-center'>
                    <Avatars
                        type={(aboutUser?.avatar || defaultAvatar) as AvatarType}
                        style={{
                            width: "60px",
                            height: "60px",
                            boxShadow: "rgb(250, 228, 129) 1px 0px 5px",
                            backgroundColor: "rgb(250, 228, 129)",
                        }}
                    />
                </div>
                <p> {aboutUser?.userName ? `User Name : ${aboutUser.userName}` : `Display Name : ${aboutUser?.displayName}`}{'  '}</p>

                <div>
                    <p>
                        {`Coin - Pairs : `} {'  '}&nbsp;

                        {data?.coin?.includes("-") && (<Image
                            src={process.env.PUBLIC_URL + `/images/logos/${data?.coin?.includes("-") ? data?.coin?.split("-")[0] : data?.coin.toUpperCase()}.svg`}
                            style={{
                                margin: "0 auto",
                                width: "40px",
                                height: "40px",
                            }}
                        />)}

                        {" "}
                        {data?.coin}
                        {" "}

                        {(<Image
                            src={process.env.PUBLIC_URL + `/images/logos/${data?.coin?.includes("-") ? data?.coin?.split("-")[1] : data?.coin.toUpperCase()}.svg`}
                            style={{
                                margin: "0 auto",
                                width: "40px",
                                height: "40px",
                            }}
                        />)}
                    </p>

                </div>
                <p> {`Vote : ${data?.coin?.includes("-") ? data?.coin?.split("-")?.[data?.direction] : data?.direction == 0 ? "BULL" : "BEAR"}`} {'  '}</p>
                <p> {data?.status?.name ? `Level :  ${data?.status?.name}` : ""}</p>
                <p>{`Time : ${data?.voteTime ? new Date(data?.voteTime).toLocaleString() : ''}`}</p>

            </div>
        </div>

    )
}

export default LatestVoteBanner