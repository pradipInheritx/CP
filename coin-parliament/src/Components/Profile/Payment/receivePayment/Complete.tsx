import { texts } from 'Components/LoginComponent/texts';
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components';
import { ButtonGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import Button from "Components/Atoms/Button/Button";
import moment from 'moment';
import Table, { tableColumnType } from "Components/table"
import axios from 'axios';
import UserContext from 'Contexts/User';
const RewardList = styled.p`
  font-size:${window.screen.width > 767 ? "10px" : "9px"};
  color: white;
  cursor: pointer;   
   padding:15px 11px;    
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
                <OverlayTrigger
                    trigger={['hover', 'focus']}
                    placement="bottom"
                    overlay={<Tooltip id={`tooltip-name-${data?.Id}`}
                        style={{
                            // marginTop: "-15px"
                        }}
                    >{value?._seconds ? moment(new Date(value?._seconds * 1000)).format("DD/MM/YYYY HH:mm") : '-'}</Tooltip>}

                >
                <span className='pt-3'>
                    {window.screen.width > 767 ?
                        
                        value?._seconds ? moment(new Date(value?._seconds * 1000)).format("DD/MM/YYYY HH:mm") : '-'
                        :
                        // value?._seconds ? (moment(new Date(value?._seconds * 1000)).format("DD/MM/YYYY HH:mm")).slice(0,10) + "..." : '-'
                        value?._seconds ? moment(new Date(value?._seconds * 1000)).format("DD/MM/YYYY HH:mm")  : '-'
                    }
                    </span>
                </OverlayTrigger>
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
    {
        title: 'Status',
        assessorName: 'status',
        Row: ({ value, data }) => {
            return (
                <OverlayTrigger
                    trigger={['hover', 'focus']}
                    placement="bottom"
                    overlay={<Tooltip id={`tooltip-name-${data?.Id}`}
                        style={{
                            // marginTop: "-15px"
                        }}
                    >${value}</Tooltip>}

                >
                <span>
                        {/* ${value} */}
                        {(value.slice(0, 5) + "..." || "NA")}
                    </span>
                </OverlayTrigger>
            );

        }
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
                <OverlayTrigger
                    trigger={['hover', 'focus']}
                    placement="bottom"
                    overlay={<Tooltip id={`tooltip-name-${data?.Id}`}
                        style={{
                            // marginTop: "-15px"
                        }}
                    >{value?._seconds ? moment(new Date(value?._seconds * 1000)).format("DD/MM/YYYY HH:mm") : '-'}</Tooltip>}

                >
                <span>
                    {window.screen.width > 767 ?                        
                        value?._seconds ? moment(new Date(value?._seconds * 1000)).format("DD/MM/YYYY HH:mm") : '-'
                        :
                            // value?._seconds ? (moment(new Date(value?._seconds * 1000)).format("DD/MM/YYYY HH:mm")).slice(0,10) + "..." : '-'            
                            value?._seconds ? moment(new Date(value?._seconds * 1000)).format("DD/MM/YYYY HH:mm") : '-'
                    }
                    </span>
                </OverlayTrigger>
            
            );

        }
    },
    {
        title: 'Item',
        assessorName: 'item',
        Row: ({ value, data }) => {
            return (
                <OverlayTrigger
                    trigger={['hover', 'focus']}
                    placement="bottom"
                    overlay={<Tooltip id={`tooltip-name-${data?.Id}`}
                        style={{
                            // marginTop: "-15px"
                        }}
                    >{data?.transactionType == "EXTRAVOTES" ? data?.numberOfVotes + " " + "Extra Votes" : data?.transactionType || "-"}</Tooltip>}

                >
                <span>
                    {window.screen.width > 767 ?
                        
                            data?.transactionType == "EXTRAVOTES" ? (data?.numberOfVotes + " " + "Extra Votes").slice(0, 5) + "..." : (data?.transactionType).slice(0, 5) + "..." || "-"
                        :
                        // data?.transactionType == "EXTRAVOTES" ? (data?.numberOfVotes + " " + "Extra Votes").slice(0, 6) + "..." : (data?.transactionType).slice(0, 6) + "..." || "-"
                            data?.transactionType == "EXTRAVOTES" ? (data?.numberOfVotes + " " + "Extra Votes").slice(0, 5) + "..." : data?.transactionType.slice(0, 5) + "..." || "-"

                    }
                    </span>
                </OverlayTrigger>
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

            <div className='d-flex justify-content-around w-100 py-3'
                style={{
                    background: "#7456ff"
                }}
            >
                {
                    tableHeader.map((item: tableColumnType, index: number) => {


                        return (<div style={{ width: `${index == 0 ?"23%":"19%"}`}} key={index}>
                            <strong >{item?.title}</strong>

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
                                        width: `${(100 / tableHeader?.length) - 1}`,
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
                            <div style={{ width: "19%" }} key={index} className={`${index == 0 && 'd-flex align-items-center'}`}>
                                {index==0 && <div>
                                    {showChildren && value?.childPayment && value?.childPayment?.length > 0
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
                                </div>}
                                {item?.Row ?
                                    <RewardList onClick={() => setShowChildren(prev => !prev)} style={{ cursor: (value?.childPayment?.length > 0 ? 'pointer' : 'none') }}>
                                        <item.Row value={value[item?.assessorName] || 'NA'} data={value} />
                                    </RewardList>
                                    : <OverlayTrigger
                                        trigger={['hover', 'focus']}
                                        placement="bottom"
                                        overlay={<Tooltip id={`tooltip-name-${index}`}
                                            style={{
                                                marginTop: "-15px"
                                            }}
                                        >{value[item?.assessorName] || "NA"}</Tooltip>}

                                    >
                                        <RewardList onClick={() => setShowChildren(prev => !prev)} style={{ cursor: (value?.childPayment?.length > 0 ? 'pointer' : 'none') }}>

                                            {window.screen.width > 767 ?
                                                ((value[item?.assessorName])?.slice(0, 6) + (value[item?.assessorName]?.length > 10 ? "..." : "") || "NA")
                                                :
                                                ((value[item?.assessorName])?.slice(0, 6) + (value[item?.assessorName]?.length > 10 ? "..." : "") || "NA")

                                            }

                                        </RewardList>
                                    </OverlayTrigger>}
                            </div>
                        )
                    })
                }
            </div> 
            {(showChildren && value?.childPayment && value?.childPayment?.length > 0) &&                                            
                
                <div style={{
                    paddingLeft: '15px', paddingRight: '15px',
                    
                }}>                    
                    <div
                        style={{
                            border: "1px solid"
                    }}
                    >
                    <Table data={value?.childPayment} headers={ChildTableHeader} />
                    </div>
                    {/* <div style={{ width: '100%', height: '3px', backgroundColor: '#7456ff', margin: '0px' }} /> */}
                </div>}
        </>
    );
}