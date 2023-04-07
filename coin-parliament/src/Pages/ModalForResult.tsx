import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Container, Modal, Row } from 'react-bootstrap'
import { Logo } from '../Components/Pairs/Card';
import styled from "styled-components";
import Trend from '../Components/Atoms/utils/Trend';
import CoinsContext from '../Contexts/CoinsContext';
import { formatCurrency } from '../common/models/Coin';
import moment from "moment";
import Line from '../Components/icons/line';
import { timeframeInitials } from '../Components/Atoms/Button/Button';
import { Link } from 'react-router-dom';
import { Other } from './SingleCoin';
import AppContext from '../Contexts/AppContext';
import { voteEndFinish } from '../common/utils/SoundClick';


const CoinContainer = styled.div`
  border-top-color: ${(props: { winner: boolean }) =>
    props.winner ? "#6352E8" : "transparent"};
  border-top-style: solid;
  border-top-width: 4px;
`;

const CoinVoteTimer = styled.span`
  // font-size: 14px;
  // line-height: 14px;
  color: #6352e8;
`;

const LineImg = styled.div`
  // height: 60px;
  // width: 19px;
`;

interface Rdiv {
  // submit: boolean,
  backcolor: string
}

const RoundDiv = styled.div<Rdiv>`
width:16px ;
height:16px;
border-radius:50px;
// border:1px solid red;
background:${Props => Props.backcolor};
`;

const PairsVoteVs = styled.span`
  font-size: ${window.screen.width>676? "14px":"10px"};
  color: #6352e8;
`;


const calculate = (vote: any, index?: 0 | 1 | undefined) => {
  if (Array.isArray(vote?.valueExpirationTime) && index !== undefined) {
    return Number(
      Number(
        (((vote?.valueExpirationTime as number[])[index] || 0) /
          ((vote?.valueVotingTime as number[])[index] || 1) -
          1) *
          100
      ).toFixed(2)
    );
  } else {
    return Number(
      Number(
        (((vote?.valueExpirationTime as number) || 0) /
          ((vote?.valueVotingTime as number) || 1) -
          1) *
          100
      ).toFixed(2)
    );
  }
};

const calculateWinner = (vote:any) =>
  Math.max(calculate(vote, 0), calculate(vote, 1));


function ModalForResult({ popUpOpen,vote,type}: {
    popUpOpen?: any,
    vote: any,
    type?: any,
    
}) {
  useEffect(() => {
    if (popUpOpen) {        
      handleShow()  
      voteEndFinish()
    }    
  }, [popUpOpen])
  
    
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  
  const { coins } = useContext(CoinsContext);
  const { showBack,setShowBack} = useContext(AppContext);
  const winner = calculateWinner(vote);
  // console.log(vote,"allVote")
  const voteCoins = vote?.coin?.split("-");
  const pair = voteCoins?.length > 1;
  
    const trend = calculate(vote, pair? 1 : 0);

  const coin = coins[vote?.coin] || {};
  const paircoin = pair ? [coins[voteCoins[0]], coins[voteCoins[1]]] : {};

 const votelength =Object.keys(vote).length
  
  console.log(vote,"valueExpirationTime")
  
  return (
         <div>
      <Modal show={show} onHide={handleClose}       
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      >           
         <div className="d-flex justify-content-end">
            <button type="button" className="btn-close " aria-label="Close" onClick={()=>{
              setShow(false)
              }}></button>
          </div>
                <Modal.Body>
          {type == "coin" && vote?
            <div className=' p-2 w-100 m-auto'
              style={{
                // boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"
              }}
            >
              <div className={`${window.screen.width < 767 ? "flex-column" : ""} d-flex justify-content-center align-items-center`}>
                <div className="w-25 d-flex justify-content-center pb-2">
                  <Logo {...{ symbol: vote?.coin || "", width: 30 }} />
                </div>
                <div className={`${window.screen.width < 767 ? "flex-column" : ""} w-100 d-flex justify-content-between`}>
                  <div className={`${window.screen.width < 767 ? "w-100" : "w-50"}`}>
                    <span>
                      {coin.name} - {coin.symbol}
                    </span>
                    <div style={{color:"#6352E8"}}>
                      {vote?.direction==0 ? "BULL" : "BEAR"} - {timeframeInitials(vote?.timeframe?.name)} &nbsp;
                      <span>
                        {
                          // formatCurrency(
                          // type === "coin"
                          //   ? (vote?.valueVotingTime as unknown as number)
                          //   : (vote?.valueVotingTime as number[])[1]
                          // )
                          vote?.valueVotingTime as unknown as number
                          }
                      </span>
                    </div>
                    <div>
                      <Col className="">
                        {/* // ${vote?.id} -  */}
                        <span className="sm_txt">{`
                        ${moment(
                          new Date(vote.voteTime)
                        ).format("HH:mm DD/MM/YYYY")}`}</span>
                      </Col>
                    </div>
                  </div>
                  {/* <div
                    className='d-flex justify-content-around w-50'
                  > */}
                  <div className={`${window.screen.width < 767 ? "w-100 justify-content-between" : "w-50 justify-content-around"}  d-flex `}>
                    <div>
                      <div>
                        {vote.valueExpirationTime &&
                          // formatCurrency(
                          //   type === "coin"
                          //     ? (vote?.valueVotingTime as unknown as number)
                          //     : (
                          //       vote?.valueExpirationTime as number[]
                          //     )[1]
                          // )
                          vote?.valueVotingTime as unknown as number
                          }
                      </div>
                      <div>
                        {vote.valueExpirationTime && (
                          <Trend num={trend} />
                        )}
                      </div>
                    </div>
                 
                    <div style={{color:"#6352E8"}}>
                      {vote.score && (
                        <Row className="flex-column text-center">
                      
                          <Col>
                            <strong>{vote.score}</strong>
                          </Col>
                          <Col>CMP</Col>
                        </Row>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
            :""
}
            {
            type == "pair" && votelength ?
              <div className=' w-100 '
                // style={{boxShadow:" rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}}
              >
                <div
                  // className={`${window.screen.width < 767 ? "" : ""}`}
                  className={`${window.screen.width < 767 ? "" : ""}  d-flex justify-content-between`}
                
                >              
            <div className=' text-center' style={{width:`${window.screen.width < 767 ?"100%" :"30%"}`}}>                  
              <CoinContainer winner={vote?.direction === 0}>
                <div className=" ">
                    <div className='p-2'>
                       {/* @ts-ignore */}
                    <Logo {...{ symbol:  paircoin[0]?.symbol || "", width: 30 }} />
                  </div>
                  <div className=""  style={{lineHeight:'20px'}}>
                      <div>
                        {/* @ts-ignore */}
                      <strong>{paircoin[0]?.name}</strong>
                      </div>
                      {/* @ts-ignore */}
                    <div>{paircoin[0]?.symbol}</div> 
                   
                    <div>
                      {vote?.valueExpirationTime &&
                        // formatCurrency(                                              
                        //   (vote?.valueExpirationTime as number[])[0]
                        // )
                              vote?.valueExpirationTime[0]
                        }
                    </div>
                    <div>{vote?.valueExpirationTime && <Trend num={trend} />}</div>
                  </div>
                </div>
              </CoinContainer>  
            </div>

                
          <div className=' text-center ' style={{width:`${window.screen.width < 767 ?"100%" :"30%"}`}}>                  
          <Col className="">
                      {/* {window.screen.width < 767 ? "" : */}
                        <div className="">
              <LineImg>
                <Line />
              </LineImg>
                        </div>
                       {/* } */}
            <div className="">
              <div className='d-flex  justify-content-center'>            
                <RoundDiv backcolor={vote.score ===1 ?"#3712B3": vote.score ===0.5 ? "#6352E8":vote.score ===0.25?"#D4D0F3":"#6352E8"}>

                </RoundDiv>
 
              </div>
              <div style={{ minHeight: "100%" }}>
                <PairsVoteVs>
                  {vote?.coin?.split("-")[vote?.direction]} {" "}
                 <p> {timeframeInitials(vote?.timeframe?.name)}</p>
                </PairsVoteVs>
              </div>
              <div style={{ minHeight: "100%" }} className="">
                <CoinVoteTimer>
                  {vote?.valueExpirationTime && vote?.score && (
                    <strong>{vote?.score} CMP</strong>
                  )}                 
                </CoinVoteTimer>
              </div>
            </div>
          </Col>                
        </div>

              <div className=' text-center ' style={{width:`${window.screen.width < 767 ?"100%" :"30%"}`}}>                  
              <CoinContainer winner={vote?.direction === 1}>
                <div className="">
                    <div className='p-2'>
                       {/* @ts-ignore */}
                    <Logo {...{ symbol:paircoin[1]?.symbol|| "", width: 30 }} />
                  </div>
                  <div className="" style={{lineHeight:'20px'}}>
                      <div>
                          {/* @ts-ignore */}
                      <strong>{paircoin[1]?.name}</strong>
                      </div>
                          {/* @ts-ignore */}
                    <div>{paircoin[1]?.symbol}</div> 
                   
                    <div>
                      {vote.valueExpirationTime &&
                        // formatCurrency(
                        // (vote.valueExpirationTime as number[])[1]
                           
                        // )
                              vote.valueExpirationTime[1]
                        }
                    </div>
                    <div>{vote.valueExpirationTime && <Trend num={trend} />}</div>
                  </div>
                </div>
              </CoinContainer>  
              </div>
                </div>

                 <Col className="text-center">
                   {/* ${vote?.id} - */}
                  <span className="sm_txt">{`
                     ${moment(
                      new Date(vote?.voteTime)
                    ).format("HH:mm DD/MM/YYYY")}`}</span>
                  </Col>
                </div>
            :""
            }
            

          <div className='py-2  d-flex  justify-content-center'>
            <Link to="/profile/mine" style={{ textDecoration: 'none' }}
              onClick={() => {
                setShowBack(true);
            }}
            >
                      <Other>{("CHECK PROGRESS")}</Other>
            </Link>
            </div>
                </Modal.Body>
                {/* <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleClose}>
                    Save Changes
                  </Button>
                </Modal.Footer> */}
              </Modal>
          </div>     
  )
}

export default ModalForResult