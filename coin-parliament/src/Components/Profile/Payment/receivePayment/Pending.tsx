import { texts } from 'Components/LoginComponent/texts';
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components';
import { ButtonGroup } from "react-bootstrap";
import Button from "Components/Atoms/Button/Button";
import moment from 'moment';
import axios from 'axios';
import UserContext from 'Contexts/User';

const RewardList = styled.p`
  font-size: 10px;
  color: white;
  cursor: pointer;   
   padding:15px;   
`;
// const tableHeader = ["Transaction id", "Date", "Item", "Amount", "Payment method"];
type tableColumnType = {
    title: string;
    assessorName: string;
    row?: React.ReactNode;
}
const tableHeader: tableColumnType[] = [
    {
        title: 'Order Id',
        assessorName: 'orderId'
    },
    {
        title: 'Date',
        assessorName: 'date'
    },
    {
        title: 'Item',
        assessorName: 'item'
    },
    {
        title: 'Amount',
        assessorName: 'amount'
    },
    {
        title: 'Payment Method ',
        assessorName: 'paymentMethod'
    },
    {
        title: 'Child Id',
        assessorName: 'childId'
    },
];
const Complete: React.FC = () => {
    const { userInfo } = useContext(UserContext)
    const [data, setData] = useState([]);
    const [pageIndex, setPageIndex] = useState(1);
    useEffect(() => {
        if (userInfo?.uid) {
            axios.get(`/payment/getParentPayment/${userInfo?.uid}?status=PENDING&pageNumber=${pageIndex}&pageSize=5`).then((response) => {
                console.log(response, 'pkkk');
                setData(response?.data?.data)

            }).catch((error) => {

            })
        }
    }, [JSON.stringify(userInfo?.uid), pageIndex]);
    return (

        <div
            style={{
                background: "#1e0243",
                textAlign: "center",
                color: "white",
                fontSize: "12px",
                marginTop: "30px",
                marginBottom: "30px",
                paddingBottom: "20px",
                width: `${window.screen.width > 767 ? "730px" : "100%"}`,
                margin: "auto",
            }}>

            <div className='d-flex justify-content-around w-100 py-3'
                style={{
                    background: "#7456ff"
                }}
            >
                {
                    tableHeader.map((item: tableColumnType, index: number) => {
                        return (<div style={{ width: `19%` }}>
                            <strong>{item?.title}</strong>
                        </div>)
                    })
                }
            </div>
            {data.map((item: any, index: number) => {
                return (
                    <div className='d-flex justify-content-around' style={{ textAlign: "center", }}>
                        {
                            tableHeader.map((item: tableColumnType, index: number) => {
                                return (
                                    data.map((value, key) => {
                                        return (
                                            <div style={{ width: "19%" }}>
                                                <RewardList>
                                                    {value[item?.assessorName] || "NA"}
                                                </RewardList>
                                            </div>
                                        )
                                    })
                                )
                            })
                        }
                    </div>
                )
            })}
            {!data?.length && (
                <div className='d-flex justify-content-around w-100 mt-4'>
                    {
                        tableHeader.map(() => {
                            return (
                                <div className=''
                                    style={{
                                        width: `${(100 / tableHeader.length) - 1}`,
                                    }}
                                >
                                    <RewardList>-</RewardList>
                                </div>)
                        })
                    }
                </div>
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
                    disabled={
                        true
                        // pageIndex * 5 >= totalData
                    }
                    onClick={() => setPageIndex(prev => prev + 1)}
                >
                    {texts.Next}
                </Button>
            </ButtonGroup>
        </div>
    )
}

export default Complete;