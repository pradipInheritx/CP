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
        <>
            <div className='px-2'>
                <div className='voteDetails'>
                    <div className='voteDetailRow'>
                        <div className='voteCol voteAvtar'>
                            <Avatars type={(aboutUser?.avatar || defaultAvatar) as AvatarType} />
                        </div>
                        <div className='voteCol voteDtl'>
                            <div className='voteHead'>
                                <h2 className='userName'>{aboutUser?.userName ? `${aboutUser.userName}` : `${aboutUser?.displayName}`}</h2>
                                <div className='coinCompare'>



                                    <div className='coinSub'>
                                        <h3 className='coinName'>{data?.coin?.split("-")[0]}</h3>
                                        <div className='coinLogo'>
                                            {(<Image
                                                src={process.env.PUBLIC_URL + `/images/logos/${data?.coin?.includes("-") ? data?.coin?.split("-")[0] : data?.coin.toUpperCase()}.svg`}
                                                style={{
                                                    margin: "0 auto"
                                                }}
                                            />)}
                                        </div>
                                    </div>

                                    {data?.coin?.includes("-") && <><div className='sp-line'></div>

                                        <div className='coinSub'>
                                            <div className='coinLogo'>
                                                {(<Image
                                                    src={process.env.PUBLIC_URL + `/images/logos/${data?.coin?.includes("-") ? data?.coin?.split("-")[1] : data?.coin.toUpperCase()}.svg`}
                                                    style={{
                                                        margin: "0 auto",
                                                    }}
                                                />)}
                                            </div>
                                            <h3 className='coinName'>{data?.coin?.split("-")[1]}</h3>
                                        </div></>}

                                </div>
                            </div>


                            <div className='coinDetailsPara'>
                                <h4>{data?.status?.name ? <><span>Level :</span> {data?.status?.name}</> : ""}</h4>
                                <h4>{<><span>Vote :</span> {data?.coin?.includes("-") ? data?.coin?.split("-")?.[data?.direction] : data?.direction == 0 ? "BULL" : "BEAR"}</>}</h4>
                                <h4>{<><span>Time :</span> {data?.voteTime ? new Date(data?.voteTime).toLocaleString() : ''}</>}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LatestVoteBanner