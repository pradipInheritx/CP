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

const tableHeader: tableColumnType[] = [
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
                        value?._seconds ? (moment(new Date(value?._seconds * 1000)).format("DD/MM/YYYY HH:mm"))?.slice(0, 10) + "..." : '-'
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
                            {
                    window.screen.width > 767 ?
                        data?.transactionType == "EXTRAVOTES" ? data?.numberOfVotes + " " + "Extra Votes" : data?.transactionType || "-"
                        :
                        data?.transactionType == "EXTRAVOTES" ? (data?.numberOfVotes + " " + "Extra Votes")?.slice(0, 6) + "..." : (data?.transactionType)?.slice(0, 6) + "..." || "-"
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
                    {value}
                </span>
            );

        }
    },
    {
        title: 'Payment Method ',
        assessorName: 'token',
    },
    {
        title: 'Child Id',
        assessorName: 'childUserId'
    },
];
const Complete: React.FC = () => {
    const { userInfo } = useContext(UserContext)
    const [data, setData] = useState([]);
    const [totalRecord, setTotalRecord] = useState(0);
    const [pageIndex, setPageIndex] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [pageSize] = useState(5);

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
            <Table data={data} headers={tableHeader} totalRecord={totalRecord} loading={loading} pageSize={pageSize} pageIndex={pageIndex} setPageIndex={setPageIndex} type="pending"/>
        </div>
    )
}

export default Complete;