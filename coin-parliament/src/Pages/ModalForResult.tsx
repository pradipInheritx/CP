import React, { SetStateAction, useContext, useEffect, useState } from 'react'
import { Button, Col, Container, Modal, Row } from 'react-bootstrap'
import { Logo } from '../Components/Pairs/Card';
import styled from "styled-components";
import Trend from '../Components/Atoms/utils/Trend';
import CoinsContext from '../Contexts/CoinsContext';
import { formatCurrency } from '../common/models/Coin';
import moment from "moment";
import Line from '../Components/icons/line';
import { Buttons, timeframeInitials } from '../Components/Atoms/Button/Button';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Other } from './SingleCoin';
import AppContext from '../Contexts/AppContext';
import { Prev } from 'react-bootstrap/esm/PageItem';
import { listData } from '../Components/Pairs/utils';
import UserContext from '../Contexts/User';
import { VoteButton } from '../common/utils/SoundClick';
import {CoinText} from "../../src/Components/Pairs/CardShow"
// const silent = require("../assets/sounds/silent.mp3").default;
const CoinContainer = styled.div`
  border-top-color: ${(props: { winner: boolean }) =>
    props.winner ? "#6352E8" : "transparent"};
  border-top-style: solid;
  border-top-width: 4px;
`;

const CoinVoteTimer = styled.span`
  // font-size: 14px;
  color: #6352e8;
  `;
  // line-height: 14px;

const LineImg = styled.div`
  // height: 60px;
  // width: 19px;
`;

interface Rdiv {
  // submit: boolean,
  backcolor: string
}


const PairsVoteVs = styled.span`
  font-size: ${window.screen.width > 676 ? "14px" : "10px"};
  color: #6352e8;
`;

interface ChildComponentProps {
  showPopUp?: any;
  setShowPopUp?: any;
  voteDirection?: number;
  coins?: number;
  voteLastPrice?:any
  startprice?:any
  activeTime?:any
}

const ModalForResult: React.FC<ChildComponentProps> = ({ showPopUp, setShowPopUp, coins, voteLastPrice,voteDirection,startprice,activeTime }) => {
// function ModalForResult(showPopUp?: any, setShowPopUp?:any) {
  // const { user } = useContext(UserContext);
  // const { setLogin, } = useContext(AppContext);
  // const navigate = useNavigate();
//   const setVoteDetails = useContext(VoteDispatchContext);
//   const setLessTimeVoteDetails = useContext(lessTimeVoteDispatchContext);
  // console.log(voteLastPrice,"786")
  // console.log(voteDirection,"1234")
useEffect(() => {
    if (showPopUp) {
      handleShow();    
    }
  VoteButton(true)
}, [showPopUp])

  const [show, setShow] = useState(false);
  // const setVoteDetails = useContext(VoteDispatchContext);
  const handleShow = () => setShow(true);
  const handleClose = () => {
    // console.log("i am clickable")
  setShowPopUp(false)
    setShow(false);
  };
  let params = useParams();
  const {id} = params;
// @ts-ignore
  const cardData = { ...listData[0] }
  return (
    <div>      
      <Modal show={show} onHide={handleClose}
        backdrop="static"
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        style={{ zIndex: 1060 }}
        animation={false}
      >
        <div className='d-flex justify-content-between'>
          {/* <div></div> */}
          <div className='text-center mb-2' style={{
            color: "#6352e8",
            fontWeight: "300",
            marginLeft: `${window.screen.width < 767 ? "10%" : ""}`
          }}>
            {/* {type == "pair" && vote ? <p> {timeframeInitials(vote?.timeframe?.name)} VOTE</p> : ""} */}
          </div>
          {/* <div className="d-flex justify-content-end" > */}
            <button className="btn-close " aria-label="Close" 
              style={{
              cursor:"pointer"
              }}
            onClick={() => {
              handleClose()            
            }}
            ></button>
          {/* </div> */}
        </div>
        <Modal.Body>          
          
              <div className=' w-100 '
              // style={{boxShadow:" rgba(100, 100, 111, 0.2) 0px 7px 29px 0px"}}
              >
                <div
                  // className={`${window.screen.width < 767 ? "" : ""}`}
                  className={`${window.screen.width < 767 ? "" : ""}  d-flex justify-content-between`}

                >
                  {/* <div className=' text-center' style={{ width: `${window.screen.width < 767 ? "100%" : "30%"}` }}>
                <CoinContainer
                  winner={true}>
                      <div className=" ">
                        <div className='p-2'>
                          <img src={cardData.img1} alt="" width="50px" />
                        </div>
                        <div className="" style={{ lineHeight: '20px' }}>
                      <div                        
                      >             
                            <strong>{cardData.name1}</strong>
                      </div>  
                      <div>
                          </div>
                        </div>
                      </div>
                    </CoinContainer>
                  </div> */}


                  {/* <div className=' text-center ' style={{ width: `${window.screen.width < 767 ? "100%" : "30%"}` }}>
                    <Col className="">
                      <div className="">
                        <LineImg>
                          <Line />
                        </LineImg>
                      </div>                      
                      <div className="">
                        <div className='d-flex  justify-content-center'>                      
                        </div>
                        <div style={{ minHeight: "100%" }}>
                          <PairsVoteVs>                            

                          </PairsVoteVs>
                        </div>

                      </div>
                    </Col>
                  </div> */}

                  {/* <div className=' text-center ' style={{ width: `${window.screen.width < 767 ? "100%" : "30%"}` }}>
                <CoinContainer
                  winner={false}                    
                >
                      <div className="">
                        <div className='p-2'>                          
                            <img src={cardData.img2} alt="" width="50px" />
                        </div>
                        <div className="" style={{ lineHeight: '20px' }}>
                          <div>
                            <strong>{cardData.name2}</strong>
                          </div>
                          <div>
                          </div>
                        </div>
                      </div>
                    </CoinContainer>
                  </div> */}
            </div>    
            <div style={{ minHeight: "100%" }} className=" text-center">
              {console.log("difference :: ",startprice,voteLastPrice,voteDirection)
                    }
                  <div className=''
                    style={{ fontSize: "12px" }}
                  >
                    <img src={cardData.img1} alt=""  width={"80px"} style={{height:"50px"}} />
                    <p style={{marginBottom:"0rem",fontWeight:"Bold",fontSize:"20px"}}>{"Bitcoin"}</p>
                    <p style={{marginBottom:"0rem",fontSize:"15px"}}>{"BTC"}</p>
                    <p style={{marginBottom:"0rem",fontWeight:"Bold",fontSize:"20px"}}>{Math.floor(activeTime / 1000) + "Sec"}</p>
                    <p style={{fontSize:"20px"}}>{voteDirection === 1 ? "Bull " : "Bear "}{'$'+startprice}</p>
                    <p  style={{marginBottom:"0rem",fontSize:"20px"}}>{"Vote Result"}</p>
                    <p style={{fontSize:"20px"}}>{voteDirection === 1 ? "Bull " : "Bear "}{'$'+voteLastPrice}</p>
                    {/* <p>Vote impact : HIGH </p> */}
                  </div>
                </div>

            {/* <Col className="text-center">                  
                  <span className="sm_txt">
                    {"123213498ASKDJ"} {' '}
                    {window.screen.width < 768 && <br />}
                    {`
                    - ${moment(
                      new Date()
                    ).format("DD/MM/YYYY")}`}{' '} {`
                     ${moment(
                      new Date()
                    ).format("HH:mm")}`}</span>
                </Col> */}

            
          </div>  
        <div className='d-flex justify-content-center mt-2'>
            <Buttons.Primary
              onClick={() => {
                // setLogin(true)
            }}
            >
            Join The Parliament
          </Buttons.Primary>
          </div>
        </Modal.Body>      
      </Modal>
    </div>

    // <div>
    // <Modal
    //     show={show}
    //     onHide={handleClose}
    //     backdrop="static"
    //     keyboard={false}
    //   >
    //     <Modal.Header closeButton>
    //       <Modal.Title>Modal title</Modal.Title>
    //     </Modal.Header>
    //     <Modal.Body>
    //       I will not close if you click outside me. Don not even try to press
    //       escape key.
    //     </Modal.Body>
    //     <Modal.Footer>
    //       <Button variant="secondary" onClick={handleClose}>
    //         Close
    //       </Button>
    //       <Button variant="primary">Understood</Button>
    //     </Modal.Footer>
    //   </Modal>
    // </div>
  )
}

export default React.memo(ModalForResult);