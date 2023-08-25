import { texts } from 'Components/LoginComponent/texts';
import { httpsCallable } from 'firebase/functions';
import React, { useContext, useEffect, useState } from 'react'
import { functions } from "firebase";
import UserContext from 'Contexts/User';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ButtonGroup } from "react-bootstrap";
import Button from "Components/Atoms/Button/Button";
import moment from 'moment';
import AppContext from 'Contexts/AppContext';

const RewardList = styled.p`
  font-size: 10px;
  color: #707070;
  cursor: pointer;
`;
const getRewardTransactions = httpsCallable(functions, "getRewardTransactions");
const RewardHistory: React.FC<{ rewardTimer: any, userId?: string | null }> = ({ rewardTimer, userId }) => {
    const { setAlbumOpen } = useContext(AppContext);
    const { userInfo, user } = useContext(UserContext);
    const [data, setData] = useState([]);
    const [totalData, setTotalData] = useState<number>(0);

    const [pageIndex, setPageIndex] = useState(1);
    let navigate = useNavigate();

    const rewardList = async (pageNumber: number = 1, pageSize: number = 5) => {
        const result = await getRewardTransactions({ uid: userId ? userId : user?.uid, pageNumber, pageSize });
        // @ts-ignore
        setData(result?.data?.rewardsTransaction);
        // @ts-ignore
        setTotalData(result?.data?.totalCount);
    };
    useEffect(() => {
        rewardList(pageIndex, 5);
    }, [rewardTimer, pageIndex]);
    console.log(totalData, data, 'pkkk');

    return (
        <div
            style={{
                background: "white",
                textAlign: "center",
                color: "#6352E8",
                fontSize: "12px",
                marginTop: "30px",
                marginBottom: "30px",
                paddingBottom: "20px",
                width: `${window.screen.width > 767 ? "730px" : "100%"}`
            }}>
            <div
                style={{
                    marginTop: "20px",
                    marginBottom: "20px",
                    fontSize: "12px",
                }} >
                {texts.REWARDHISTORY}
            </div>
            {data?.map((item, index) => (
                <div key={index}
                    className="my-2"
                    style={{
                        background: "#d9d9d9"
                    }}
                >
                    {" "}
                    <div className='d-flex justify-content-around  pt-2' >
                        <RewardList
                            className=""
                            style={{ width: "30%" }}>
                            <span style={{ color: "#050505", fontSize: window.screen.width < 525 ? '0.9em' : '1.2em', fontWeight: 'normal' }}>
                                {/* @ts-ignore */}
                                {item?.winData?.thirdRewardDiamonds}&nbsp; {texts.parliamentcoin}
                            </span>{" "}

                        </RewardList>
                        <div style={{
                            borderLeft: "1px solid black",
                            maxHeight: '1.3rem'
                        }} />
                        <RewardList className="d-flex justify-content-center ">
                            <span style={{ color: "#050505", fontSize: window.screen.width < 525 ? '0.9em' : '1.2em', fontWeight: 'normal' }}>
                                {/* @ts-ignore */}
                                {item?.winData?.secondRewardExtraVotes} &nbsp; {texts.ExtraVotes}
                            </span>{" "}

                        </RewardList>
                        <div style={{
                            borderLeft: "1px solid black",
                            maxHeight: '1.3rem'
                        }} />
                        <RewardList className=""
                            style={{
                                width: "30%",
                                color: "#050505"
                            }}
                        >
                            <span
                                style={{ color: "#050505", fontSize: window.screen.width < 525 ? '0.9em' : '1.2em', fontWeight: 'normal' }}
                                onClick={() => {

                                    {/* @ts-ignore */ }
                                    // setAlbumOpen(item?.winData?.firstRewardCardCollection);

                                    navigate(`/singalCard/${item?.winData?.firstRewardCardCollection}/${item?.winData?.firstRewardCardId}`);
                                }}
                            >
                                {/* {item?.winData?.firstRewardCard} */}
                                {/* @ts-ignore */}
                                CARD ID &nbsp;{item?.winData?.firstRewardCardSerialNo}
                            </span>
                        </RewardList>
                    </div>
                    <div className='d-flex justify-content-around pb-2 pt-3' style={{ color: "#050505", }}>
                        <span style={{ color: "#050505", fontSize: '0.8em', fontWeight: 'normal' }}>
                            {/* @ts-ignore */}
                            {item?.rewardId}&nbsp;{item?.transactionTime?._seconds ? moment(new Date(item?.transactionTime?._seconds * 1000)).format("DD/MM/YYYY HH:mm") : ''}
                        </span>
                    </div>
                </div>
            ))}
            {!data?.length && (
                <>
                    {" "}
                    <div className='d-flex justify-content-around px-5'>
                        <RewardList>-</RewardList>
                        <RewardList>-</RewardList>
                        <RewardList>-</RewardList>
                    </div>
                    <p className='solid' style={{ margin: "28px" }}></p>
                </>
            )}
            <ButtonGroup>
                <Button
                    disabled={pageIndex === 1}
                    onClick={() => setPageIndex(prev => prev - 1)}
                    style={{ marginRight: '1em' }}
                >
                    {texts.Prev}
                </Button>
                <Button
                    disabled={pageIndex * 5 >= totalData}
                    onClick={() => setPageIndex(prev => prev + 1)}
                >
                    {texts.Next}
                </Button>
            </ButtonGroup>
        </div>
    )
}

export default RewardHistory