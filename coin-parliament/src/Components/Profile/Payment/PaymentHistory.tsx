import { texts } from 'Components/LoginComponent/texts';
import { httpsCallable } from 'firebase/functions';
import React, { useContext, useEffect, useState } from 'react'
import UserContext from 'Contexts/User';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ButtonGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import Button from "Components/Atoms/Button/Button";
import moment from 'moment';
import AppContext from 'Contexts/AppContext';
import axios from 'axios';
import { auth, functions } from "../../../firebase";
import Tabs from '../Tabs';
import ReceivePayment from "Components/Profile/Payment/receivePayment"
const RewardList = styled.p`
  font-size:${window.screen.width > 767 ?"10px":"9px"};

  color: white;
  cursor: pointer;   
   padding:15px 11px;   
`;
const getRewardTransactions = httpsCallable(functions, "getRewardTransactions");
function PaymentHistory() {

  const { setAlbumOpen } = useContext(AppContext);
  const { userInfo, user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState<number>(0);
  const [tableHeader, setTableHerder] = useState<any>([
    "Order ID", "Date", "Item", "Amount", "Payment method" , "Status"
  ]);
  const [index, setIndex] = useState(0);
  const [rowData, setRowData] = useState<any>([]);
  const [reciveRowData, setReciveRowData] = useState<any>([]);  
  const [pageIndex, setPageIndex] = useState(1);
  let navigate = useNavigate();

  useEffect(() => {
    getPaymentList()
  }, [pageIndex])

  const getPaymentList = () => {
    const headers = {
      'Content-Type': 'application/json',
      "accept": "application/json",
      // @ts-ignore
      "Authorization": `Bearer ${auth?.currentUser?.accessToken}`,
    }
    axios.get(`/payment/getTransactionHistory/${user?.uid}?pageNumber=${pageIndex}&pageSize=${5}`,
      {
        headers: headers
      }
    )
      .then(async (response) => {
        setRowData(response.data.data)
        setTotalData(response.data.total)
        console.log(response.data.data, "response.data")
      })
      .catch((error) => {

      })
  }

  const getCenterText = (type?: any) => {
    if (type == "EXTRAVOTES") {
      return "EXT-"
    } else if (type == "UPGRADE") {
      return "UPD-"
    } else {
      return ""
    }      
  }

  return (
    <>
      <Tabs
        defaultActiveKey="Payment History"
        id="Payment"
        onSelect={(k?: number) => setIndex((k || 0))}
        tabs={[
          {
            eventKey: "Payment History",
            title: "Payment History",
            pane: (
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
                          width: `19%`,
                          fontSize:`${window.screen.width >767? "12px":"10px"}`,
                        }}
                      >
                        <strong>{item}</strong>
                      </div>)
                    })
                  }
                </div>
                {rowData?.map((item: any, index: number) => {
                  return (
                    <div className='d-flex justify-content-around'
                      key={index}
                      style={{
                        textAlign: "center",

                      }}
                    >
                      <div
                        style={{
                          width: "19%"
                        }}
                        
                      >
                        <OverlayTrigger
                         trigger={['hover', 'focus']}
                          placement="bottom"
                          overlay={<Tooltip
                            style={{
                              marginTop: "-15px"
                            }}  
                            id={`tooltip-name-${index}`}>{item?.paymentDetails?.orderId || (item?.paymentDetails?.transaction_id ? "VTE-" + getCenterText(item?.transactionType) + item?.paymentDetails?.transaction_id.slice(-4) : item?.paymentDetails?.p2 ? "VTE-" + getCenterText(item?.transactionType) + item?.paymentDetails?.p2.slice(-4) : "NA")}</Tooltip>}
                        
                        >                          
                          <RewardList                            
                          >
                          {/* {item?.paymentDetails?.transaction_id ? "VTE-" + getCenterText(item?.transactionType) + item?.paymentDetails?.transaction_id.slice(-4) : item?.paymentDetails?.p2 ? "VTE-" + getCenterText(item?.transactionType) + item?.paymentDetails?.p2.slice(-4) : "NA"} */}
                            {/* {item?.paymentDetails?.transaction_id || "NA"} */}
                            {
                              window.screen.width > 767 ?
                                item?.paymentDetails?.orderId || (item?.paymentDetails?.transaction_id ? "VTE-" + getCenterText(item?.transactionType) + item?.paymentDetails?.transaction_id.slice(-4) : item?.paymentDetails?.p2 ? "VTE-" + getCenterText(item?.transactionType) + item?.paymentDetails?.p2.slice(-4) : "NA")
                                : item?.paymentDetails?.orderId && item?.paymentDetails?.orderId.slice(0,3) + "..."  || (item?.paymentDetails?.transaction_id ? ("VTE-" + getCenterText(item?.transactionType) + item?.paymentDetails?.transaction_id.slice(-4)).slice(0, 3) + "..." : item?.paymentDetails?.p2 ? ("VTE-" + getCenterText(item?.transactionType) + item?.paymentDetails?.p2.slice(-4)).slice(0, 2) + "..." : "NA")
                            }
                          {/* {item?.paymentDetails?.orderId || (item?.paymentDetails?.transaction_id ? "VTE-" + getCenterText(item?.transactionType) + item?.paymentDetails?.transaction_id.slice(-4) : item?.paymentDetails?.p2 ? "VTE-" + getCenterText(item?.transactionType) + item?.paymentDetails?.p2.slice(-4) : "NA")} */}
                        </RewardList>
                        </OverlayTrigger>
                      </div>
                      <div
                        style={{
                          width: "19%"
                        }}
                        
                      >
                        <OverlayTrigger
                         trigger={['hover', 'focus']}
                          placement="bottom"
                          overlay={<Tooltip
                            style={{
                              marginTop: "-15px"
                            }}  
                            id={`tooltip-name-${index}`}
                          > 
                          {item?.transaction_time?._seconds ? moment(new Date(item?.transaction_time?._seconds * 1000)).format("DD/MM/YYYY HH:mm") : '-'}</Tooltip>}
                        
                        >
                        <RewardList>
                          {/* {item?.transaction_time?._seconds} */}
                            {/* {item?.transaction_time?._seconds ? moment(new Date(item?.transaction_time?._seconds * 1000)).format("DD/MM/YYYY HH:mm") : '-'} */}
                            {window.screen.width > 767
                              ?
                              item?.transaction_time?._seconds ? moment(new Date(item?.transaction_time?._seconds * 1000)).format("DD/MM/YYYY HH:mm") : '-'
                              : item?.transaction_time?._seconds ? moment(new Date(item?.transaction_time?._seconds * 1000)).format("DD/MM/YYYY HH:mm").slice(0, 10) + "..." : '-'
                            }
                          </RewardList>
                        </OverlayTrigger>
                      </div>
                      <div
                        style={{
                          width: "19%"
                        }}
                        
                      >
                        <OverlayTrigger
                         trigger={['hover', 'focus']}
                          placement="bottom"
                          overlay={<Tooltip id={`tooltip-name-${index}`} 
                            style={{
                              marginTop: "-15px"
                            }}  
                          >{item?.transactionType == "EXTRAVOTES" ? item?.numberOfVotes + " " + "Extra Votes" : item?.transactionType || "-"}</Tooltip>}
                        
                        >
                          <RewardList>
                            {
                              window.screen.width > 767 ?
                                
                              item?.transactionType == "EXTRAVOTES" ? item?.numberOfVotes + " " + "Extra Votes" : item?.transactionType || "-"
                            :
                                item?.transactionType == "EXTRAVOTES" ? (item?.numberOfVotes + " " + "Extra Votes").slice(0, 4) + "..." : (item?.transactionType).slice(0, 4) + "..." || "-"
                              
                            }
                          
                          </RewardList>
                        </OverlayTrigger>
                      </div>
                      <div
                        style={{
                          width: "19%"
                        }}
                        
                      >
                        <OverlayTrigger
                         trigger={['hover', 'focus']}
                          placement="bottom"
                          overlay={<Tooltip
                            style={{
                              marginTop: "-15px"
                            }}
                            id={`tooltip-name-${index}`}
                          >${item?.amount}</Tooltip>}
                        
                        >
                        <RewardList>
                          
                          ${item?.amount}
                          </RewardList>
                        </OverlayTrigger>
                      </div>
                      <div
                        style={{
                          width: "19%"
                        }}
                        
                      >
                        <OverlayTrigger
                         trigger={['hover', 'focus']}
                         placement="bottom"
                          overlay={<Tooltip id={`tooltip-name-${index}`}
                            style={{
                              marginTop: "-15px"
                            }}
                          >{item?.token ? item?.token : item?.walletType ? item?.walletType : "-"}</Tooltip>}
                        
                        >
                          <RewardList>
                            {window.screen.width > 767 ?
                            
                              item?.token ? (item?.token).slice(0, 5) + (item?.token?.length > 10 ? "..." : "") : item?.walletType ? (item?.walletType).slice(0, 5) + (item?.walletType?.length > 10 ? "..." : "") : "-"
                            :
                              item?.token ? (item?.token).slice(0, 5) + (item?.token?.length > 10 ? "..." : "") : item?.walletType ? (item?.walletType.slice(0, 5) + "...") + (item?.walletType?.length > 10 ? "..." : "") : "-"                                                         
                            }
                          </RewardList>
                        </OverlayTrigger>
                      </div>
                      <div
                        style={{
                          width: "19%"
                        }}
                        
                      >
                        <OverlayTrigger
                         trigger={['hover', 'focus']}
                          placement="bottom"
                          overlay={<Tooltip id={`tooltip-name-${index}`}
                            style={{
                            marginTop:"-15px"
                          }}
                          >{(item?.event).toUpperCase() || "-"}</Tooltip>}
                        
                        >
                          <RewardList>
                            
                            {window.screen.width > 767 ?
                              (item?.event).toUpperCase() || "-"
                              :
                              ((item?.event).toUpperCase()) || "-"
                            }
                          </RewardList>
                        </OverlayTrigger>
                      </div>
                    </div>
                  )
                })}


                {!rowData?.length && (
                  <>
                    {" "}
                    <div className='d-flex justify-content-around w-100 mt-4'>
                      {
                        tableHeader?.map((item: string, index: number) => {
                          return (
                            <div className=''
                              key={index}
                              style={{
                                width: `${(100 / tableHeader.length) - 1}`,
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
                    disabled={pageIndex * 5 >= totalData}
                    onClick={() => setPageIndex(prev => prev + 1)}
                  >
                    {texts.Next}
                  </Button>
                </ButtonGroup>
              </div>
            ),
          },
          {
            eventKey: "Receive Payment",
            title: "Receive Payment",
            pane: index ? <ReceivePayment /> : <></>,
          }
        ]}
      />
    </>
  )
}

export default PaymentHistory