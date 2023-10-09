import { texts } from 'Components/LoginComponent/texts';
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components';
import { ButtonGroup } from "react-bootstrap";
import Button from "Components/Atoms/Button/Button";
import moment from 'moment';
import Table, { tableColumnType } from "Components/table"
import axios from 'axios';
import UserContext from 'Contexts/User';
const RewardList = styled.p`
  font-size: 10px;
  color: white; 
   padding:15px;   
`;
// const tableHeader = ["Transaction id", "Date", "Item", "Amount", "Payment method"];

const tableHeader: tableColumnType[] = [
    {
        title: 'Transaction id',
        assessorName: 'transactionId'
    },
    {
        title: 'Date',
        assessorName: 'timestamp',
        Row: ({ value, data }) => {
            return (
                <span>
                    {value?._seconds ? moment(new Date(value?._seconds * 1000)).format("DD/MM/YYYY HH:mm") : '-'}
                </span>
            );

        }
    },
    {
        title: 'Amount',
        assessorName: 'amount',
        Row: ({ value, data }) => {
            return (
                <span>
                    ${value}
                </span>
            );

        }
    },
    {
        title: 'Payment Method ',
        assessorName: 'token',

    },
];
const ChildTableHeader: tableColumnType[] = [
    {
        title: 'Order Id',
        assessorName: 'docId'
    },
    {
        title: 'Date',
        assessorName: 'timestamp',
        Row: ({ value, data }) => {
            return (
                <span>
                    {value?._seconds ? moment(new Date(value?._seconds * 1000)).format("DD/MM/YYYY HH:mm") : '-'}
                </span>
            );

        }
    },
    {
        title: 'Item',
        assessorName: 'item',
        Row: ({ value, data }) => {
            return (
                <span>
                    {data?.transactionType == "EXTRAVOTES" ? data?.numberOfVotes + " " + "Extra Votes" : data?.transactionType || "-"}
                </span>
            )
        }
    },
    {
        title: 'Amount',
        assessorName: 'amount',
        Row: ({ value, data }) => {
            return (
                <span>
                    ${value}
                </span>
            );

        }
    },
    {
        title: 'Payment Method ',
        assessorName: 'token'
    },
    {
        title: 'Child Id',
        assessorName: 'childUserId'
    },
];
const Complete: React.FC = () => {
    const { userInfo } = useContext(UserContext)
    const [data, setData] = useState<any[]>([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalRecord, setTotalRecord] = useState(0);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (userInfo?.uid) {
            setLoading(true);
            axios.get(`/payment/getParentPayment/${userInfo?.uid}?status=SUCCESS&pageNumber=${pageIndex}&pageSize=${pageSize}`).then((response) => {
                setTotalRecord(response.data?.total)
                setData(response?.data?.data.map((value: any) => {
                    let temp = { ...value };
                    delete temp['childPayment'];
                    let childAmountSum = value?.childPayment?.reduce((prev: number, current: any) => {
                        // console.log(prev, prev + current?.amount, 'current?.amount 1');
                        return parseFloat(prev + current?.amount);
                    }, 0);
                    return { ...value, childPayment: [...value?.childPayment, { ...temp, amount: (temp?.amount - childAmountSum).toFixed(5) }] }
                }))
                setLoading(false);
            }).catch((error) => {
                setLoading(false);
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
                        return (<div style={{ width: `19%` }} key={index}>
                            <strong>{item?.title}</strong>
                        </div>)
                    })
                }
            </div>
            {!loading && data.map((value: any, index: number) => {
                return (
                    <Column value={value} key={index} />
                )
            })}
            {loading &&
                <div className='d-flex justify-content-around w-100 mt-4 mb-4'>
                    <span className='loading'>Loading...</span>
                </div>
            }
            {(!data?.length && !loading) && (
                <div className='d-flex justify-content-around w-100 mt-4'>
                    {
                        tableHeader.map((val, index) => {
                            return (
                                <div key={index}
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
                        pageIndex * pageSize >= totalRecord
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

const Column: React.FC<{ value: any }> = ({ value }) => {
    const [showChildren, setShowChildren] = useState<boolean>(false);
    return (
        <>
            <div className='d-flex justify-content-around' style={{ textAlign: "center", }}>
                {
                    tableHeader.map((item: tableColumnType, index: number) => {
                        return (
                            <div style={{ width: "19%" }} key={index}>
                                <RewardList onClick={() => setShowChildren(prev => !prev)} style={{ cursor: (value?.childPayment?.length > 0 ? 'pointer' : 'none') }}>
                                    {item?.Row ?
                                        <item.Row value={value[item?.assessorName] || 'NA'} data={value} />
                                        : (value[item?.assessorName] || "NA")}
                                </RewardList>
                            </div>
                        )
                    })
                }
            </div>
            {(showChildren && value?.childPayment && value?.childPayment?.length > 0) &&
                <div style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                    <Table data={value?.childPayment} headers={ChildTableHeader} />
                    <div style={{ width: '100%', height: '3px', backgroundColor: '#7456ff', margin: '0px' }} />
                </div>}
        </>
    );
}