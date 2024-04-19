import moment from 'moment';
import React, { useState } from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import styled from 'styled-components';

const RewardList = styled.p`
  font-size:${window.screen.width > 767 ? "10px" : "9px"};

  color: white;
  cursor: pointer;   
   padding:15px 11px;   
`;

type ChildTableData = {
    preantHeader?:any;
    chaildHeader?:any;
    preantData?:any;
    chaildData?:any;
};

function CompleteChild({ preantHeader, chaildHeader, preantData, chaildData }: ChildTableData) {
    const ChildSubHeader = ['Item',  'Child']
    const [showSubChild, setshowSubChild] = useState("")
    const ChaildExtraData = (childData:any) => {
        return (
            <>
                <div className='d-flex w-100'>
                    <div
                        style={{
                            width: "48%"
                        }}

                    >
                        <strong className="mt-2" style={{ fontSize: "10px" }}>{ChildSubHeader[0]}</strong>
                        <RewardList>
                            {childData?.transactionType == "EXTRAVOTES" ? childData?.numberOfVotes + " " + "Extra Votes" : childData?.transactionType || "-"}
                        </RewardList> 
                    </div>                   

                    {/* <div
                        style={{
                            width: "33%"
                        }}

                    >
                        <strong className="mt-2" style={{ fontSize: "10px" }}>{ChildSubHeader[1]}</strong>
                        <RewardList>
                            {childData?.token}
                        </RewardList>  
                    </div> */}

                    <div
                        style={{
                            width: "48%"
                        }}

                    >
                        <strong className="mt-2" style={{ fontSize: "10px" }}>{ChildSubHeader[1]}</strong>
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
      <>
          <div className='p-3'>              
              <div className='d-flex justify-content-around w-100 p-2'>
                  <div
                      style={{
                          width: "48%"
                      }}

                  >
                      {window.screen.width < 767 && <strong className="mt-2" style={{ fontSize: "10px" }}>{preantHeader[0]}</strong>}
                      <RewardList
                      >

                          {window.screen.width > 767 && <strong>{preantHeader[0] + " -"}</strong>} {preantData?.transactionId || "NA"}
                      </RewardList>

                  </div>
                  <div
                      style={{
                          width: "48%"
                      }}

                  >
                      {window.screen.width < 767 && <strong className="mt-2" style={{ fontSize: "10px" }}>{preantHeader[1]}</strong>}
                      <RewardList>
                          {window.screen.width > 767 && <strong>{preantHeader[1] + " -"}</strong>} {preantData?.status || "NA"}
                      </RewardList>
                  </div>                  
              </div>

              {/* <div className='d-flex justify-content-around w-100 border p-2'>
                  <div
                      style={{
                          width: "32%"
                      }}

                  >
                      {window.screen.width < 767 && <strong className="mt-2" style={{ fontSize: "10px" }}>{IntableHeader[0]}</strong>}
                      <RewardList
                      >

                          {window.screen.width > 767 && <strong>{IntableHeader[0] + " -"}</strong>} {item?.paymentDetails?.orderId || (item?.paymentDetails?.transaction_id ? "VTE-" + getCenterText(item?.transactionType) + item?.paymentDetails?.transaction_id?.slice(-4) : item?.paymentDetails?.p2 ? "VTE-" + getCenterText(item?.transactionType) + item?.paymentDetails?.p2?.slice(-4) : "NA")}
                      </RewardList>

                  </div>
                  <div
                      style={{
                          width: "32%"
                      }}

                  >
                      {window.screen.width < 767 && <strong className="mt-2" style={{ fontSize: "10px" }}>{IntableHeader[1]}</strong>}
                      <RewardList>
                          {window.screen.width > 767 && <strong>{IntableHeader[1] + " -"}</strong>} {item?.transactionType == "EXTRAVOTES" ? item?.numberOfVotes + " " + "Extra Votes" : item?.transactionType || "-"}
                      </RewardList>
                  </div>
                  <div
                      style={{
                          width: "32%"
                      }}

                  >
                      {window.screen.width < 767 && <strong className="mt-2" style={{ fontSize: "10px" }}>{IntableHeader[2]}</strong>}
                      <RewardList>
                          {window.screen.width > 767 && <strong>{IntableHeader[2] + " -"}</strong>} {item?.token ? item?.token : item?.walletType ? item?.walletType : "-"}
                      </RewardList>
                  </div>
              </div> */}
              <div className='border'>
              {chaildData.length >0 && <div className='d-flex justify-content-between w-100  p-2'>
                  {chaildHeader.map((childHeader:any,index:number) => {
                      return <div
                          style={{
                              width: "33%"
                          }}
                          key={index + childHeader}
                      >
                          {<strong className="mt-2" style={{ fontSize: "10px" }}>{childHeader}</strong>}                          
                      </div> 
                  })}
              </div>}
              {chaildData.length > 0 && <div className='d-flex flex-column w-100 '>
                  {chaildData?.map((childData:any,index:number) => {
                      return <div
                          style={{
                            //   width: "48%"
                          }}
                          className='w-100'                          
                          key={index + childData?.docId}
                      >
                          <div className='d-flex justify-content-around flex-wrap'>
                          <RewardList style={{
                            width:"33%"
                              }}
                                  onClick={() => {
                                      setshowSubChild(showSubChild == childData?.docId ? "" : childData?.docId)
                                  }}
                                  className='d-flex justify-content-start'
                              >     
                              
                                  {
                                      showSubChild === (childData?.docId)
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
                                      overlay={<Tooltip id={`tooltip-name-${index + childData?.docId}`}
                                          style={{
                                              marginTop: "-85px"
                                          }}
                                      >{childData?.docId}</Tooltip>}

                                  >     
                                      <span style={{
                                      marginLeft:"10px"
                                  }}>
                                          {window.screen.width > 767 ?

                                              childData?.docId || "NA"
                                              :
                                              childData?.docId.slice(0,7) + "..." || 'NA'
                                              
                                          }                                      
                                      </span>    
                                  </OverlayTrigger>
                          </RewardList>                    
                          <RewardList style={{
                            width:"33%"
                              }}
                                  onClick={() => {
                                      setshowSubChild(showSubChild == childData?.docId ? "" : childData?.docId)
                                  }}
                              >
                              {childData?.timestamp?._seconds ? moment(new Date(childData?.timestamp?._seconds * 1000)).format("DD/MM/YYYY HH:mm") : '-'}
                          </RewardList>                                                                 
                          <RewardList style={{
                            width:"33%"
                              }}
                                  onClick={() => {
                                      setshowSubChild(showSubChild == childData?.docId ? "" : childData?.docId)
                                  }}
                              >
                              {childData?.amount}
                          </RewardList>                    
                              {showSubChild == childData?.docId && <div className='d-flex justify-content-around w-100  p-2'>
                              {ChaildExtraData(childData)}
                              </div>}
                        </div>   
                      </div> 
                  })}
                  </div>}
              </div>
          </div>
      </>
  )
}

export default CompleteChild