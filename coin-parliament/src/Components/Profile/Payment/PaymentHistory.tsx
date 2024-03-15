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
const ArrowButton = styled.button`
  background:none;
  border:none;
  margin-left:10px;
  // width :10px;
  // height:10px;
`;
const getRewardTransactions = httpsCallable(functions, "getRewardTransactions");
function PaymentHistory() {

  const { setAlbumOpen, setHistoryTab, historyTab } = useContext(AppContext);
  
  const { userInfo, user } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [totalData, setTotalData] = useState<number>(0);
  const [tableHeader, setTableHerder] = useState<any>([
    "Date","Amount", "Status"
  ]);
  const [IntableHeader, setInTableHerder] = useState<any>([
    "Order ID","Item","Payment method",
  ]);
  const [index, setIndex] = useState(0);
  const [rowData, setRowData] = useState<any>([]);
  const [reciveRowData, setReciveRowData] = useState<any>([]);  
  const [pageIndex, setPageIndex] = useState(1);
  const [showChild, setShowChild] = useState<any>("");
  const [selectTab, setSelectTab] = useState("Payment History");
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

  useEffect(() => {
    if (historyTab) {
      setSelectTab(historyTab)
      setIndex(historyTab)
    }
  }, [historyTab])
  

  const childTable = (item:any) => {
    return (
      <div className='p-3'>
        {/* <div className='d-flex justify-content-around w-100 py-3 px-2'
          style={{
            background: "#7456ff"
          }}
        >
          {
            IntableHeader?.map((item: string, index: number) => {
              return (<div className=''
                key={index}
                style={{
                  width: `30%`,
                  fontSize: `${window.screen.width > 767 ? "12px" : "10px"}`,
                }}
              >
                <strong>{item}</strong>
              </div>)
            })
          }
        </div> */}
        <div className='d-flex justify-content-around w-100 border p-2'>
          <div
            style={{
              width: "32%"
            }}

          >
            {window.screen.width < 767 && <strong className="mt-2" style={{fontSize:"10px"}}>{IntableHeader[0]}</strong>}
            <RewardList
            >

              {window.screen.width > 767 && <strong>{IntableHeader[0] + " -" }</strong>} {item?.paymentDetails?.orderId || (item?.paymentDetails?.transaction_id ? "VTE-" + getCenterText(item?.transactionType) + item?.paymentDetails?.transaction_id?.slice(-4) : item?.paymentDetails?.p2 ? "VTE-" + getCenterText(item?.transactionType) + item?.paymentDetails?.p2?.slice(-4) : "NA")}
            </RewardList>

          </div>
          <div
            style={{
              width: "32%"
            }}

          >
            {window.screen.width < 767 && <strong className="mt-2" style={{fontSize:"10px"}}>{IntableHeader[1]}</strong>}
            <RewardList>
              {window.screen.width > 767 && <strong>{IntableHeader[1] + " -"}</strong>} {item?.transactionType == "EXTRAVOTES" ? item?.numberOfVotes + " " + "Extra Votes" : item?.transactionType || "-"}
            </RewardList>
          </div>
          <div
            style={{
              width: "32%"
            }}

          >
            {window.screen.width < 767 && <strong className="mt-2" style={{fontSize:"10px"}}>{IntableHeader[2]}</strong>}
            <RewardList>
              {window.screen.width > 767 && <strong>{IntableHeader[2] + " -"}</strong>} {item?.token ? item?.token : item?.walletType ? item?.walletType : "-"}
            </RewardList>
          </div>
        </div>
      </div>
  )
}


  return (
    <>
      <Tabs
        defaultActiveKey={selectTab}
        activeKey={selectTab}
        id="Payment"
        onSelect={(k?: number) => {
          setIndex((k || 0))
          console.log(k,"what is this ")
          setSelectTab(selectTab == "Payment History" ? "Receive Payment" : "Payment History")
          setHistoryTab("")
        }}
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
                          width: `33%`,
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
                    <div className='d-flex justify-content-around flex-wrap'
                      key={index}
                      style={{
                        textAlign: "center",

                      }}
                      onClick={() => {
                        setShowChild(showChild == (item?.paymentDetails?.orderId || item?.paymentDetails?.transaction_id) ? "" : (item?.paymentDetails?.orderId || item?.paymentDetails?.transaction_id))
                      }}
                    >
                      <div
                        style={{
                          width: "33%"
                        }}
                        className='d-flex align-items-center'
                      >
                        <div                          
                        >
                        {/* <ArrowButton> */}
                            {showChild === (item?.paymentDetails?.orderId || item?.paymentDetails?.transaction_id)
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
                                  marginLeft:`${window.screen.width < 767 ?"10px":"15px"}`
                              }}
                              ></i>
                            }
                          {/* </ArrowButton> */}
                        </div>
                        <RewardList>                       
                            {item?.transaction_time?._seconds ? moment(new Date(item?.transaction_time?._seconds * 1000)).format("DD/MM/YYYY HH:mm") : '-'}                       
                          </RewardList>                        
                      </div>
                      <div
                        style={{
                          width: "32%"
                        }}
                        
                      >                        
                        <RewardList>                          
                          ${(Number(item?.amount)?.toFixed(4) || 0)}
                          </RewardList>                       
                      </div>
                      <div
                        style={{
                          width: "32%"
                        }}
                        
                      >                        
                          <RewardList>                            
                           {(item?.event).toUpperCase() || "-"}                        
                          </RewardList>                        
                      </div>  
                      
                      {showChild === (item?.paymentDetails?.orderId || item?.paymentDetails?.transaction_id) && <div className='w-100'>
                        {/* @ts-ignore */}
                        {childTable(item)} 
                      </div>}
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