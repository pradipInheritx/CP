import { texts } from 'Components/LoginComponent/texts';
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components';
import { ButtonGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import Button from "Components/Atoms/Button/Button";
import moment from 'moment';
import axios from 'axios';
import UserContext from 'Contexts/User';
import Table, { tableColumnType } from "Components/table"

const RewardList = styled.p`
  font-size: 10px;
  color: white;
  cursor: pointer;   
   padding:15px;   
`;

const tableHeader = ['Order Id', "Date", 'Amount',]
const ChildSubHeader = ['Item', 'Payment Method', 'Child']
// const tableHeader: tableColumnType[] = [
//     {
//         title: 'Order Id',
//         assessorName: 'docId'
//     },
//     {
//         title: 'Date',
//         assessorName: 'timestamp',
//         Row: ({ value, data }) => {
//             return (                                    
//                     <OverlayTrigger
//                         trigger={['hover', 'focus']}
//                         placement="bottom"
//                         overlay={<Tooltip id={`tooltip-name-${data?.Id}`}
//                             style={{
//                                 // marginTop: "-15px"
//                             }}
//                         >{value?._seconds ? moment(new Date(value?._seconds * 1000)).format("DD/MM/YYYY HH:mm") : '-'}</Tooltip>}

//                     >
//                         <span>
//                             {window.screen.width > 767 ?

//                         value?._seconds ? moment(new Date(value?._seconds * 1000)).format("DD/MM/YYYY HH:mm") : '-'
//                         :
//                         value?._seconds ? (moment(new Date(value?._seconds * 1000)).format("DD/MM/YYYY HH:mm"))?.slice(0, 10) + "..." : '-'
//                     }
//                         </span>
//                     </OverlayTrigger>                
//             );

//         }
//     },
//     {
//         title: 'Item',
//         assessorName: 'item',
//         Row: ({ value, data }) => {
//             return (                                
//                     <OverlayTrigger
//                         trigger={['hover', 'focus']}
//                         placement="bottom"
//                         overlay={<Tooltip id={`tooltip-name-${data?.Id}`}
//                             style={{
//                                 // marginTop: "-15px"
//                             }}
//                         >{data?.transactionType == "EXTRAVOTES" ? data?.numberOfVotes + " " + "Extra Votes" : data?.transactionType || "-"}</Tooltip>}

//                     >
//                         <span>
//                             {
//                     window.screen.width > 767 ?
//                         data?.transactionType == "EXTRAVOTES" ? data?.numberOfVotes + " " + "Extra Votes" : data?.transactionType || "-"
//                         :
//                         data?.transactionType == "EXTRAVOTES" ? (data?.numberOfVotes + " " + "Extra Votes")?.slice(0, 6) + "..." : (data?.transactionType)?.slice(0, 6) + "..." || "-"
//                     }
//                         </span>
//                     </OverlayTrigger>
                
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
//         title: 'Payment Method ',
//         assessorName: 'token',
//     },
//     {
//         title: 'Child Id',
//         assessorName: 'childUserId'
//     },
// ];


const Pending: React.FC = () => {
    const { userInfo } = useContext(UserContext)
    const [data, setData] = useState([]);
    const [totalRecord, setTotalRecord] = useState(0);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [pageSize] = useState(5);
    const [showChild, setShowChild] = useState("");

    useEffect(() => {
        if (userInfo?.uid) {
            setLoading(true);
            axios.get(`/payment/getParentPayment/${userInfo?.uid}?status=PENDING&pageNumber=${pageIndex}&pageSize=${pageSize}`).then((response) => {
                setData(response?.data?.data);
                setTotalRecord(response.data?.total)
                setLoading(false);
            }).catch((error) => {
                setLoading(false);
            })
        }
    }, [JSON.stringify(userInfo?.uid), pageIndex]);


    const ChaildExtraData = (childData: any) => {
        return (
            <>
                <div className='d-flex w-100'>
                    <div
                        style={{
                            width: "33%"
                        }}

                    >
                        <strong className="mt-2" style={{ fontSize: "10px" }}>{ChildSubHeader[0]}</strong>
                        <RewardList>
                            {childData?.transactionType == "EXTRAVOTES" ? childData?.numberOfVotes + " " + "Extra Votes" : childData?.transactionType || "-"}
                        </RewardList>
                    </div>

                    <div
                        style={{
                            width: "33%"
                        }}

                    >
                        <strong className="mt-2" style={{ fontSize: "10px" }}>{ChildSubHeader[1]}</strong>
                        <RewardList>
                            {childData?.token}
                        </RewardList>
                    </div>

                    <div
                        style={{
                            width: "33%"
                        }}

                    >
                        <strong className="mt-2" style={{ fontSize: "10px" }}>{ChildSubHeader[2]}</strong>
                        <OverlayTrigger
                            trigger={['hover', 'focus']}
                            placement="bottom"
                            overlay={<Tooltip id={`tooltip-name-${childData?.childUserName || childData?.childUserId  + childData?.docId}`}
                                style={{
                                    marginTop: "-85px"
                                }}
                            >{childData?.childUserName ? childData?.childUserName : childData?.childUserId || "NA"}</Tooltip>}

                        >
                            <RewardList>

                                {window.screen.width > 767 ?

                                    childData?.childUserName ? childData?.childUserName : childData?.childUserId || "NA"
                                    :
                                    childData?.childUserName ? childData?.childUserName.slice(0, 7) + "..." : childData?.childUserId.slice(0, 7) + "..." || 'NA'

                                }
                            </RewardList>
                        </OverlayTrigger>
                    </div>
                </div>
            </>
        )
    }

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
            {/* <Table data={data} headers={tableHeader} totalRecord={totalRecord} loading={loading} pageSize={pageSize} pageIndex={pageIndex} setPageIndex={setPageIndex} type="pending"/> */}

            <div className='d-flex justify-content-around w-100 py-3'
                style={{
                    background: "#7456ff",                    
                }}

            >
                {
                    tableHeader?.map((item?:any, index?: number) => {
                        return (<div style={{ width: `20%` }} key={index}>
                            <strong>{item}</strong>
                        </div>)
                    })
                }
            </div>
            {!loading && data?.map((item: any, index: number) => {
                return (
                    <div className='d-flex justify-content-around flex-wrap'
                        key={index}
                    >
                        <RewardList style={{
                            width: "33%"
                        }}
                            onClick={() => {
                                setShowChild(showChild == item?.docId ? "" : item?.docId)
                            }}
                            className='d-flex justify-content-start'
                        >

                            {
                                showChild === (item?.docId)
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
                            <OverlayTrigger
                                trigger={['hover', 'focus']}
                                placement="bottom"
                                overlay={<Tooltip id={`tooltip-name-${index + item?.docId}`}
                                    style={{
                                        marginTop: "-85px"
                                    }}
                                >{item?.docId}</Tooltip>}

                            >
                                <span style={{
                                    marginLeft: "10px"
                                }}>
                                    {window.screen.width > 767 ?

                                        item?.docId || "NA"
                                        :
                                        item?.docId.slice(0, 7) + "..." || 'NA'

                                    }
                                </span>
                            </OverlayTrigger>
                        </RewardList> 
                        <div
                            style={{
                                width: "32%"
                            }}
                            onClick={() => {
                                setShowChild(showChild == item?.docId ? "" : item?.docId)
                            }}
                        >
                            <RewardList>
                                {item?.timestamp?._seconds ? moment(new Date(item?.timestamp?._seconds * 1000)).format("DD/MM/YYYY HH:mm") : '-'}
                            </RewardList>                            
                        </div>
                        <div
                            style={{
                                width: "32%"
                            }}
                            onClick={() => {
                                setShowChild(showChild == item?.docId ? "" : item?.docId)
                            }}
                        >
                            <RewardList>
                                {(Number(item?.amount)?.toFixed(4) || 0)}
                            </RewardList>
                        </div>

                        {/* {
                            showChild === item?.transactionId &&
                            <div className='w-100'>
                                
                                
                            </div>} */}
                        {showChild === item?.docId &&<div className='d-flex justify-content-around w-100  p-2'>
                            {
                                ChaildExtraData(item)
                            }
                        </div>}
                    </div>
                )
            })}
            {loading &&
                <div className='d-flex justify-content-around w-100 mt-4 mb-4'>
                    <span className='loading'>Loading...</span>
                </div>
            }
            {(!loading && !data?.length) && (
                <div className='d-flex justify-content-around w-100 mt-4'>
                    {
                        tableHeader.map((val, index) => {
                            return (
                                <div key={index} className=''
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
            {(!!totalRecord && pageSize && pageIndex) && <>
                <ButtonGroup>
                    <Button
                        disabled={pageIndex === 1}
                        onClick={() => setPageIndex(prev => prev - 1)}
                        style={{ marginRight: '1em' }}
                    >
                        {texts.Prev}
                    </Button>
                    <Button
                        disabled={pageIndex * pageSize >= totalRecord}
                        onClick={() => setPageIndex(prev => prev + 1)}
                    >
                        {texts.Next}
                    </Button>
                </ButtonGroup>
            </>}

        </div>
    )
}

export default Pending;