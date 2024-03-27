import { texts } from 'Components/LoginComponent/texts';
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components';
import { ButtonGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import Button from "Components/Atoms/Button/Button";
import moment from 'moment';
import Table, { tableColumnType } from "Components/table"
import axios from 'axios';
import UserContext from 'Contexts/User';
import CompleteChild from './CompleteChild';
const RewardList = styled.p`
  font-size:${window.screen.width > 767 ? "10px" : "9px"};
  color: white;
  cursor: pointer;   
   padding:15px 8px;    
`;
const tableHeader = ["Date", "Amount", "Payment method"];
const preantHeader = ["Transaction id","Status"];

// const tableHeader: tableColumnType[] = [
//     {
//         title: 'Transaction id',
//         assessorName: 'transactionId'
//     },
//     {
//         title: 'Date',
//         assessorName: 'timestamp',
//         Row: ({ value, data }) => {
//             return (
//                 <OverlayTrigger
//                     trigger={['hover', 'focus']}
//                     placement="bottom"
//                     overlay={<Tooltip id={`tooltip-name-${data?.Id}`}
//                         style={{
//                             // marginTop: "-15px"
//                         }}
//                     >{value?._seconds ? moment(new Date(value?._seconds * 1000)).format("DD/MM/YYYY HH:mm") : '-'}</Tooltip>}

//                 >
//                 <span className='pt-3'>
//                     {window.screen.width > 767 ?
                        
//                         value?._seconds ? moment(new Date(value?._seconds * 1000)).format("DD/MM/YYYY HH:mm") : '-'
//                         :
//                         // value?._seconds ? (moment(new Date(value?._seconds * 1000)).format("DD/MM/YYYY HH:mm")).slice(0,10) + "..." : '-'
//                         value?._seconds ? moment(new Date(value?._seconds * 1000)).format("DD/MM/YYYY HH:mm")  : '-'
//                     }
//                     </span>
//                 </OverlayTrigger>
//             );

//         }
//     },
//     {
//         title: 'Amount',
//         assessorName: 'amount',
//         Row: ({ value, data }) => {
//             return (
//                 <span>
//                     {value}
//                 </span>
//             );

//         }
//     },
//     {
//         title: 'Payment Method ',
//         assessorName: 'token',

//     },
//     {
//         title: 'Status',
//         assessorName: 'status',
//         Row: ({ value, data }) => {
//             return (
//                 <OverlayTrigger
//                     trigger={['hover', 'focus']}
//                     placement="bottom"
//                     overlay={<Tooltip id={`tooltip-name-${data?.Id}`}
//                         style={{
//                             // marginTop: "-15px"
//                         }}
//                     >{value}</Tooltip>}

//                 >
//                 <span>
//                         {/* ${value} */}
//                         {(value.slice(0, 5) + "..." || "NA")}
//                     </span>
//                 </OverlayTrigger>
//             );

//         }
//     },
// ];


const ChildTableHeader = ["Order Id", "Date",  'Amount',]

// const ChildTableHeader: tableColumnType[] = [
//     {
//         title: 'Order Id',
//         assessorName: 'docId'
//     },
//     {
//         title: 'Date',
//         assessorName: 'timestamp',
//         Row: ({ value, data }) => {
//             return (
//                 <OverlayTrigger
//                     trigger={['hover', 'focus']}
//                     placement="bottom"
//                     overlay={<Tooltip id={`tooltip-name-${data?.Id}`}
//                         style={{
//                             // marginTop: "-15px"
//                         }}
//                     >{value?._seconds ? moment(new Date(value?._seconds * 1000)).format("DD/MM/YYYY HH:mm") : '-'}</Tooltip>}

//                 >
//                 <span>
//                     {window.screen.width > 767 ?                        
//                         value?._seconds ? moment(new Date(value?._seconds * 1000)).format("DD/MM/YYYY HH:mm") : '-'
//                         :
//                             // value?._seconds ? (moment(new Date(value?._seconds * 1000)).format("DD/MM/YYYY HH:mm")).slice(0,10) + "..." : '-'            
//                             value?._seconds ? moment(new Date(value?._seconds * 1000)).format("DD/MM/YYYY HH:mm") : '-'
//                     }
//                     </span>
//                 </OverlayTrigger>
            
//             );

//         }
//     },
//     {
//         title: 'Item',
//         assessorName: 'item',
//         Row: ({ value, data }) => {
//             return (
//                 <OverlayTrigger
//                     trigger={['hover', 'focus']}
//                     placement="bottom"
//                     overlay={<Tooltip id={`tooltip-name-${data?.Id}`}
//                         style={{
//                             // marginTop: "-15px"
//                         }}
//                     >{data?.transactionType == "EXTRAVOTES" ? data?.numberOfVotes + " " + "Extra Votes" : data?.transactionType || "-"}</Tooltip>}

//                 >
//                 <span>
//                     {window.screen.width > 767 ?
                        
//                             data?.transactionType == "EXTRAVOTES" ? (data?.numberOfVotes + " " + "Extra Votes").slice(0, 5) + "..." : (data?.transactionType).slice(0, 5) + "..." || "-"
//                         :
//                         // data?.transactionType == "EXTRAVOTES" ? (data?.numberOfVotes + " " + "Extra Votes").slice(0, 6) + "..." : (data?.transactionType).slice(0, 6) + "..." || "-"
//                             data?.transactionType == "EXTRAVOTES" ? (data?.numberOfVotes + " " + "Extra Votes").slice(0, 5) + "..." : data?.transactionType.slice(0, 5) + "..." || "-"

//                     }
//                     </span>
//                 </OverlayTrigger>
//             )
//         }
//     },
//     {
//         title: 'Amount',
//         assessorName: 'amount',
//         Row: ({ value, data }) => {
//             return (
//                 <span>
//                     {value}
//                 </span>
//             );

//         }
//     },
//     {
//         title: 'Payment Method',
//         assessorName: 'token'
//     },
//     {
//         title: 'Child Id',
//         assessorName: 'childUserId'
//     },
// ];


const Complete: React.FC = () => {
    const { userInfo } = useContext(UserContext)
    const [data, setData] = useState<any[]>([]);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalRecord, setTotalRecord] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showChild, setShowChild] = useState("");

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
                    return {
                        ...value,
                        // childPayment: [...value?.childPayment, { ...temp, amount: (temp?.amount - childAmountSum).toFixed(5) }]
                    }
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
            {/* Order ID | Date | Item |  Amount (fiat) | Payment method (The coin if it's cryptocurrency ) */}

            <div className='d-flex justify-content-around w-100 py-3'
                style={{
                    background: "#7456ff"
                }}
            >
                {
                    tableHeader?.map((item: string, index: number) => {
                        return (<div className=''
                            key={index}
                            style={{
                                width: `33%`,
                                // fontSize: `${window.screen.width > 767 ? "12px" : "10px"}`,
                            }}
                        >
                            <strong>{item}</strong>
                        </div>)
                    })
                }
            </div>
            {data?.map((item: any, index: number) => {
                return (
                    <div className='d-flex justify-content-around flex-wrap'
                        key={index}                                                
                    >
                        <div
                            style={{
                                width: "32%"
                            }}
                            className='d-flex align-items-center'
                            onClick={() => {
                                setShowChild(showChild == item?.transactionId ? "" : item?.transactionId)
                            }}
                        >
                            <div
                            >
                                {/* <ArrowButton> */}
                                {
                                    showChild === (item?.transactionId)                                    
                                    ?
                                    <i className="bi bi-chevron-up"
                                        style={{
                                            color: "white",
                                            marginLeft: `${window.screen.width < 767 ? "10px" : "15px"}`
                                        }}
                                    ></i>
                                    :
                                    <i className="bi bi-chevron-down "
                                        style={{
                                            color: "white",
                                            marginLeft: `${window.screen.width < 767 ? "10px" : "15px"}`
                                        }}
                                    ></i>
                                }
                                {/* </ArrowButton> */}
                            </div>
                            <RewardList>
                                {item?.timestamp?._seconds ? moment(new Date(item?.timestamp?._seconds * 1000)).format("DD/MM/YYYY HH:mm") : '-'}
                            </RewardList>
                        </div>
                        <div
                            style={{
                                width: "32%"
                            }}
                            onClick={() => {
                                setShowChild(showChild == item?.transactionId ? "" : item?.transactionId)
                            }}
                        >
                            <RewardList>
                                {(Number(item?.amount)?.toFixed(4) || 0)}
                            </RewardList>
                        </div>
                        <div
                            style={{
                                width: "32%"
                            }}
                            onClick={() => {
                                setShowChild(showChild == item?.transactionId ? "" : item?.transactionId)
                            }}
                        >
                            <RewardList>
                                {(item?.token).toUpperCase() || "-"}
                            </RewardList>
                        </div>

                        {
                            showChild === item?.transactionId &&
                            <div className='w-100'>
                            {/* @ts-ignore */}                            
                                <CompleteChild
                                    preantHeader={preantHeader}                                
                                    chaildHeader={ChildTableHeader}
                                    preantData={item}
                                    chaildData={item?.childPayment}
                                />
                        </div>}
                    </div>
                )
            })}


            {!data?.length && (
                <>
                    {" "}
                    <div className='d-flex justify-content-around w-100 mt-4'>
                        {
                            tableHeader?.map((item: string, index: number) => {
                                return (
                                    <div className=''
                                        key={index}
                                        style={{
                                            width: `${(100 / tableHeader?.length) - 1}`,
                                        }}
                                    >
                                        <RewardList>-</RewardList>
                                    </div>)
                            })
                        }
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
                    disabled={pageIndex * 5 >= totalRecord}
                    onClick={() => setPageIndex(prev => prev + 1)}
                >
                    {texts.Next}
                </Button>
            </ButtonGroup>
        </div>
    )
}

export default Complete;
